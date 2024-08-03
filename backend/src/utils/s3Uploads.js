import { PutObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../config/s3Client.js';
import fs from 'fs'


const uploadFileToS3 = async (localFilePath) => {
    try {

        console.log(`localfilepath inside util ${localFilePath}`);

        const fileStream = fs.createReadStream(localFilePath);

        console.log(`fileStream inside util ${JSON.stringify(fileStream,null, "\t")}`);


        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: localFilePath,
            Body: localFilePath,
        }

        const data = await s3Client.send(new PutObjectCommand(params))

        if(!data) {
            fs.unlinkSync(localFilePath)
            console.log('Error uploading file to S3')
        }

        console.log(`upload util ${data}`);
        return data

    } catch (error) {

        console.log(error);
        fs.unlinkSync(localFilePath)
        return null

    }
}

export { uploadFileToS3 }