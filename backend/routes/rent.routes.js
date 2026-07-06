import { Router } from 'express'
import { getRentRecords, getTenantRent, createRent, updateRent, deleteRent } from '../controllers/rent.controller.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', authorize('superadmin', 'admin'), getRentRecords)
router.get('/me', authorize('tenant'), getTenantRent)
router.post('/', authorize('superadmin', 'admin'), createRent)
router.put('/:id', authorize('superadmin', 'admin'), updateRent)
router.delete('/:id', authorize('superadmin', 'admin'), deleteRent)

export default router
