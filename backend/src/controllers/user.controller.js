import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import fs from "fs"



export const registerUser = asyncHandler( async (req,res) => {

    const { name, email, password } = req.body

    const profileImageLocalPath = req.file?.path

    if(!name?.trim() || !email?.trim() || !password?.trim()) {
        fs.unlinkSync(profileImageLocalPath)
        throw new ApiError(400, "Please provide all fields")
    }

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        fs.unlinkSync(profileImageLocalPath)
        throw new ApiError(409, "User with email already exists")
    }

    if(!profileImageLocalPath) {
        fs.unlinkSync(profileImageLocalPath)
        throw new ApiError(400, "Profile image is required")
    }
   
    const profileImage = await uploadOnCloudinary(profileImageLocalPath)

    if (!profileImage) {
        throw new ApiError(500, "Profile picture upload failed")
    }
    
    const user = await User.create({
        name,
        email,
        password,
        profileImage: {
            publicId: profileImage.public_id,
            url: profileImage.secure_url
        }
    })

    const createdUser = await User.findById( user._id ).select(
        "-password -refreshToken"
    )

    if(!createdUser) {
        throw new ApiError(500, "Failed to create user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export const loginUser = asyncHandler(async(req,res) => {
    const { email, password } = req.body

    if(!(email || password)) {
        throw new ApiError(400, "Please provide all fields")
    }

    const user = await User.findOne({email})

    if(!user) {
        throw new ApiError(404, "User doesn't exist")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password")
    }    

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