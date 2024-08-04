import { Router } from 'express'
import { healthCheck, uploadFile } from '../controllers/fileUpload.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

const router = Router()

router.route('/').get(healthCheck).post(upload.single('file'), uploadFile)

export default router 