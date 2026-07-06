import { Router } from 'express'
import { getComplaints, getTenantComplaints, createComplaint, updateComplaint, deleteComplaint } from '../controllers/complaint.controller.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', authorize('superadmin', 'admin'), getComplaints)
router.get('/me', authorize('tenant'), getTenantComplaints)
router.post('/me', authorize('tenant'), createComplaint)
router.put('/:id', authorize('superadmin', 'admin'), updateComplaint)
router.delete('/:id', authorize('superadmin', 'admin'), deleteComplaint)

export default router
