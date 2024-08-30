import { Router } from 'express'
import { upload } from '../middlewares/multer.middleware.js'
import { registerUser } from '../controllers/user.controller.js'

const router = Router()

// register route

router.route('/register').post(upload.single('profileImage'), registerUser)

export default router 