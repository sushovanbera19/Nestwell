import { Router } from 'express'
import Tenant from '../models/Tenant.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

// GET /api/tenants/me
router.get('/me', authorize('tenant'), async (req, res) => {
  const tenant = await Tenant.findOne({ email: req.user.email })
  if (!tenant) return res.status(404).json({ message: 'No tenant record linked to this account yet.' })
  res.json(tenant)
})

router.use(authorize('superadmin', 'admin'))

// GET /api/tenants
router.get('/', async (req, res) => {
  const tenants = await Tenant.find().sort({ createdAt: -1 })
  res.json(tenants)
})

// POST /api/tenants
router.post('/', async (req, res) => {
  try {
    const tenant = await Tenant.create(req.body)
    res.status(201).json(tenant)
  } catch (err) {
    res.status(400).json({ message: 'Could not create tenant.', error: err.message })
  }
})

// PUT /api/tenants/:id
router.put('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!tenant) return res.status(404).json({ message: 'Tenant not found.' })
    res.json(tenant)
  } catch (err) {
    res.status(400).json({ message: 'Could not update tenant.', error: err.message })
  }
})

// DELETE /api/tenants/:id
router.delete('/:id', async (req, res) => {
  const tenant = await Tenant.findByIdAndDelete(req.params.id)
  if (!tenant) return res.status(404).json({ message: 'Tenant not found.' })
  res.json({ message: 'Tenant deleted.' })
})

export default router
