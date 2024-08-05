import { uploadFileToS3 }  from '../utils/s3uploads.js'



const healthCheck = async (req, res) => {
    res.status(200).send({ message: 'Server is running' })
}

const uploadFile = async (req, res) => {
    try {

        const fileLocalPath = req.file

        if(!fileLocalPath?.path) {
            return res.status(400).json({ message: 'No file uploaded' })
        }

        const s3FilePath = await uploadFileToS3(fileLocalPath)

        if(!s3FilePath) {
            return res.status(500).json({ message: 'Failed to upload file to S3'})
        }

        return res.status(200).json({ message: 'File upload to s3 successfully' , s3Path: s3FilePath })
        
    } catch (error) {
        
        console.error(error);

    }
} 

export { healthCheck, uploadFile }