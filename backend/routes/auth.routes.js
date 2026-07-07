import { Router } from 'express'
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  googleLogin,
  facebookLogin,
  getMe,
  updateAvatar,
} from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)
router.post('/google', googleLogin)
router.post('/facebook', facebookLogin)
router.get('/me', protect, getMe)
router.patch('/avatar', protect, updateAvatar)

export default router
