import { Router } from 'express'
import { getAdmins, createAdmin, updateAdmin, deleteAdmin } from '../controllers/admin.controller.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect, authorize('superadmin'))

router.get('/', getAdmins)
router.post('/', createAdmin)
router.put('/:id', updateAdmin)
router.delete('/:id', deleteAdmin)

export default router
