import { Router } from 'express'
import { register, login, getMe, updateAvatar } from '../controllers/auth.controller.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/me', protect, getMe)
router.patch('/avatar', protect, updateAvatar)

export default router
