import mongoose, { Schema } from "mongoose"


const permissionSchema = new Schema({

    userId: { 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    folderId: {
        type: Schema.Types.ObjectId,
        ref: "Folder",
        required: true,
        default: null
    },
    documentId: {
        type: Schema.Types.ObjectId,
        ref: "File",
        required: true,
        default: null
    },
    permissionType: {
        type: String,
        enum: ["view", "edit", "delete"],
        required: true
    }  
     
},
{
    timestamps: true
})

export const Permission = mongoose.model("Permission", permissionSchema)

// id string pk
//   userId string fk
//   ownerId string fk
//   folderId string fk
//   documentId string fk
//   canView boolean
//   canDownload boolean