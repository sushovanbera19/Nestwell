import Rent from '../models/Rent.js'
import Tenant from '../models/Tenant.js'

export async function getRentRecords(req, res) {
  const rent = await Rent.find().populate('tenant', 'name room').sort({ dueDate: -1 })
  res.json(rent)
}

export async function getTenantRent(req, res) {
  const tenant = await Tenant.findOne({ email: req.user.email })
  if (!tenant) return res.json([])
  const rent = await Rent.find({ tenant: tenant._id }).sort({ dueDate: -1 })
  res.json(rent)
}

export async function createRent(req, res) {
  try {
    const rent = await Rent.create(req.body)
    res.status(201).json(rent)
  } catch (err) {
    res.status(400).json({ message: 'Could not create rent record.', error: err.message })
  }
}

export async function updateRent(req, res) {
  try {
    const rent = await Rent.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!rent) return res.status(404).json({ message: 'Rent record not found.' })
    res.json(rent)
  } catch (err) {
    res.status(400).json({ message: 'Could not update rent record.', error: err.message })
  }
}

export async function deleteRent(req, res) {
  const rent = await Rent.findByIdAndDelete(req.params.id)
  if (!rent) return res.status(404).json({ message: 'Rent record not found.' })
  res.json({ message: 'Rent record deleted.' })
}
