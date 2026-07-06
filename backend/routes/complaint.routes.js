import { Router } from 'express'
import Complaint from '../models/Complaint.js'
import Tenant from '../models/Tenant.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

// GET /api/complaints  (super admin / admin) — every complaint
router.get('/', authorize('superadmin', 'admin'), async (req, res) => {
  const complaints = await Complaint.find().populate('tenant', 'name room').sort({ createdAt: -1 })
  res.json(complaints)
})

// GET /api/complaints/me  (tenant) — only the logged-in tenant's complaints
router.get('/me', authorize('tenant'), async (req, res) => {
  const tenant = await Tenant.findOne({ email: req.user.email })
  if (!tenant) return res.json([])
  const complaints = await Complaint.find({ tenant: tenant._id }).sort({ createdAt: -1 })
  res.json(complaints)
})

// POST /api/complaints/me  (tenant) — raise a new complaint for yourself
router.post('/me', authorize('tenant'), async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ email: req.user.email })
    if (!tenant) {
      return res.status(404).json({ message: 'No tenant record linked to this account yet.' })
    }
    const complaint = await Complaint.create({ ...req.body, tenant: tenant._id, pg: tenant.pg })
    res.status(201).json(complaint)
  } catch (err) {
    res.status(400).json({ message: 'Could not raise complaint.', error: err.message })
  }
})

// PUT /api/complaints/:id  (super admin / admin) — update status/priority
router.put('/:id', authorize('superadmin', 'admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!complaint) return res.status(404).json({ message: 'Complaint not found.' })
    res.json(complaint)
  } catch (err) {
    res.status(400).json({ message: 'Could not update complaint.', error: err.message })
  }
})

// DELETE /api/complaints/:id  (super admin / admin)
router.delete('/:id', authorize('superadmin', 'admin'), async (req, res) => {
  const complaint = await Complaint.findByIdAndDelete(req.params.id)
  if (!complaint) return res.status(404).json({ message: 'Complaint not found.' })
  res.json({ message: 'Complaint deleted.' })
})

export default router
