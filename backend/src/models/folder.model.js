import mongoose, { Schema } from "mongoose";

const folderSchema = new Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
        default: null
    },
    subFolderId: [
        {
            type: Schema.Types.ObjectId,
            ref: "Folder",
        }
    ],
    starred: {
        type: Boolean,
        default: false
    }

},
{
    timestamps: true
})

export const Folder = mongoose.model("Folder", folderSchema)




/*
folders {
    id integer pk
    ownerId integer fk users
    parentId integer fk folders
    subFolderId integer[] folders
    name string
    starred boolean
    createdAt date
    updatedAt date
  }
  */