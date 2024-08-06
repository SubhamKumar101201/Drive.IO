import mongoose, { Schema } from "mongoose";

const fileSchema = new Schema({

    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    folderId: {
        type: Schema.Types.ObjectId,
        ref: "Folder"
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    filePath: {
        type: {
            url: String,
            fileName: String,
            fileSize: String,
            fileType: String
        },
        required: true
    },
    starred: {
        type: Boolean,
        default: false
    }

}, {

    timestamps: true

});

export const File = mongoose.model("File", fileSchema)


/*
documents {
  id integer pk
  ownerId integer fk users
  folderId integer fk folders
  name string
  filePath string
  size string
  starred boolean
  createdAt date
  updatedAt date
}
*/