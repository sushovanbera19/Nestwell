import { Router } from 'express'
import Rent from '../models/Rent.js'
import Tenant from '../models/Tenant.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

// GET /api/rent  (super admin / admin) — all rent records
router.get('/', authorize('superadmin', 'admin'), async (req, res) => {
  const rent = await Rent.find().populate('tenant', 'name room').sort({ dueDate: -1 })
  res.json(rent)
})

// GET /api/rent/me  (tenant) — rent records for the logged-in tenant
router.get('/me', authorize('tenant'), async (req, res) => {
  const tenant = await Tenant.findOne({ email: req.user.email })
  if (!tenant) return res.json([])
  const rent = await Rent.find({ tenant: tenant._id }).sort({ dueDate: -1 })
  res.json(rent)
})

// POST /api/rent  (super admin / admin)
router.post('/', authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const rent = await Rent.create(req.body)
    res.status(201).json(rent)
  } catch (err) {
    res.status(400).json({ message: 'Could not create rent record.', error: err.message })
  }
})

// PUT /api/rent/:id  (super admin / admin) — e.g. mark as Paid
router.put('/:id', authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const rent = await Rent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!rent) return res.status(404).json({ message: 'Rent record not found.' })
    res.json(rent)
  } catch (err) {
    res.status(400).json({ message: 'Could not update rent record.', error: err.message })
  }
})

// DELETE /api/rent/:id  (super admin / admin)
router.delete('/:id', authorize('superadmin', 'admin'), async (req, res) => {
  const rent = await Rent.findByIdAndDelete(req.params.id)
  if (!rent) return res.status(404).json({ message: 'Rent record not found.' })
  res.json({ message: 'Rent record deleted.' })
})

export default router
