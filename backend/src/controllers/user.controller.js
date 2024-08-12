import { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import fs from "fs"


// for secure cookies
const options = {
    httpOnly: true,
    secure: true
}

// create access and refresh token
const generateAccessAndRefreshToken = async (userId) => {
    try {

        const user = await User.findById(userId)

        if (!user) {
            throw new ApiError(404, "User not found while generate access and refresh token")
        }

        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        console.error("Error while generate access and refresh token: ", error)
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

// register controller

export const registerUser = asyncHandler(async (req, res) => {

    const { firstName, lastName, email, password } = req.body

    const profileImageLocalPath = req.file?.path

    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password?.trim()) {
        fs.unlinkSync(profileImageLocalPath)
        throw new ApiError(400, "Please provide all fields")
    }

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        fs.unlinkSync(profileImageLocalPath)
        throw new ApiError(409, "User with email already exists")
    }

    if (!profileImageLocalPath) {
        fs.unlinkSync(profileImageLocalPath)
        throw new ApiError(400, "Profile image is required")
    }

    const profileImage = await uploadOnCloudinary(profileImageLocalPath)

    if (!profileImage) {
        throw new ApiError(500, "Profile picture upload failed")
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        profileImage: {
            publicId: profileImage.public_id,
            url: profileImage.secure_url
        }
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Failed to create user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

// login controller

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!(email || password)) {
        throw new ApiError(400, "Please provide all fields")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User doesn't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(200, {
                user: loggedInUser, accessToken, refreshToken
            }, "User logged in successfully")
        )

})

// logout controller

export const logoutUser = asyncHandler(async (req, res) => {
    const userId = req.user._id

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user id")
    }

    await User.findByIdAndUpdate(
        userId,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged out successfully"))

})

/*
 users {
  id integer pk
  name string
  email string
  password string
  profileImage string
  refreshToken string
  createdAt date
  updatedAt date
}
*/