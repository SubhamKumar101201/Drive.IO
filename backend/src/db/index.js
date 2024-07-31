import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

export const connectDB = async () => {
    try {
        
        // connection instance of mongodb collection
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected !! DB Host: ${connectionInstance.connection.host}`);

    } catch (error) {

        console.log(`MongoDB connection error: ${error}`)
        process.exit(1);

    }
}