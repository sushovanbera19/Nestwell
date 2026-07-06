import { Router } from 'express'
import { getTenantMe, getTenants, createTenant, updateTenant, deleteTenant } from '../controllers/tenant.controller.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/me', authorize('tenant'), getTenantMe)

router.use(authorize('superadmin', 'admin'))

router.get('/', getTenants)
router.post('/', createTenant)
router.put('/:id', updateTenant)
router.delete('/:id', deleteTenant)

export default router
