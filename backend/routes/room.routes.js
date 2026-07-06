import { Router } from 'express'
import { getRooms, createRoom, updateRoom, deleteRoom } from '../controllers/room.controller.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect, authorize('superadmin', 'admin'))

router.get('/', getRooms)
router.post('/', createRoom)
router.put('/:id', updateRoom)
router.delete('/:id', deleteRoom)

export default router
