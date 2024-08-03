import { Router } from 'express'
import { healthCheck } from '../controllers/fileUpload.controller'
import { upload } from '../middlewares/multer.middleware'

const router = Router()

router.route('/').get(healthCheck).post(upload.single('file'), uploadFile)

export default router 