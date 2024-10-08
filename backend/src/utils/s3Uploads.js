import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/s3client.js';
import fs from 'fs'
import path from 'path'
import { s3url } from './s3url.js';


const uploadFileToS3 = async (localFilePath) => {
    try {

        const fileStream = fs.createReadStream(localFilePath.path);

        const fileName = path.basename(localFilePath.path);

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: path.basename(localFilePath.path),
            Body: fileStream,
            ContentType: localFilePath.mimetype
        }

        const data = await s3Client.send(new PutObjectCommand(params))

        if (!data) {
            fs.unlinkSync(localFilePath.path)
            console.log('Error uploading file to S3')
        }

        fs.unlinkSync(localFilePath.path)

        return s3url(fileName)

    } catch (error) {

        console.log(error);
        fs.unlinkSync(localFilePath.path)
        return null

    }
}

export { uploadFileToS3 }