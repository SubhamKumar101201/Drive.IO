import { s3 } from '../config/awsConfig.js'
import fs from "fs"



const uploadFileToS3 = async (localFilePath) => {
    try {

        // Read the file from the local filesystem
        fs.readFile(localFilePath, (error, fileContent) => {
            if (error) {
                fs.unlinkSync(localFilePath)
                return new Error(`Error reading file: ${error.message}`)
            }

            // Set up S3 upload parameters
            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: localFilePath,
                Body: fileContent,
            }

            s3.upload(params, (error, data) => {
                if (error) {
                    fs.unlinkSync(localFilePath)
                    return new Error(`Error uploading file to S3: ${error.message}`)
                }

                if (data) {
                    console.log("file  is uploaded on s3 ", data.Location);
                    fs.unlinkSync(localFilePath)
                    return data.Location
                }
            })
        })

    } catch (error) {

        console.log(error);
        fs.unlinkSync(localFilePath)
        return null

    }
}

export { uploadFileToS3 }