import mongoose, { Schema } from "mongoose"

const userSchema = new Schema({

    name: {
        type: String,
        required: true,
        lowercase: true,
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