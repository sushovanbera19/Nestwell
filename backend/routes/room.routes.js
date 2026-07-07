import { Router } from 'express'
import { getRooms, createRoom, updateRoom, deleteRoom, allocateTenant, vacateTenant, getRoomTenants } from '../controllers/room.controller.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect, authorize('superadmin', 'admin'))

router.get('/', getRooms)
router.post('/', createRoom)
router.put('/:id', updateRoom)
router.delete('/:id', deleteRoom)
router.post('/allocate', allocateTenant)
router.post('/vacate', vacateTenant)
router.get('/:id/tenants', getRoomTenants)

export default router
