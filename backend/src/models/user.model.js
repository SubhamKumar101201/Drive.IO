import mongoose, { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: {
            publicId: String,
            url: String
        },
    },
    refreshToken: {
        type: String
    }

}, 
{ 
    timestamps: true
})

// password hashing
userSchema.pre("save", async function(next) {
    // check if the password is modified or not

    // if not change
    if(!this.isModified("password")) return next()

    // if change
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// method for check is password correct
userSchema.methods.isPasswordCorrect = async function (password) {
    // return true or false accordingly
    return await bcrypt.compare(password, this.password)
}

// method for generate access token
userSchema.methods.generateAccessToken = async function () {
    // return access token
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            firstName: this.firstName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

// method for generate refresh token
userSchema.methods.generateAccessToken = async function () {
    // return refresh token
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)


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