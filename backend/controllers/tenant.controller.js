import Tenant from '../models/Tenant.js'
import Rent from '../models/Rent.js'
import User from '../models/User.js'

function currentMonth() {
  const d = new Date()
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

function nextDueDate() {
  const d = new Date()
  d.setDate(10)
  if (d < new Date()) d.setMonth(d.getMonth() + 1)
  return d
}

export async function getUnlinkedUsers(req, res) {
  try {
    const linked = (await Tenant.find({ user: { $ne: null } }).distinct('user')).filter(Boolean)
    const users = await User.find({ role: 'tenant', _id: { $nin: linked } }).select('name email phone room')
    res.json(users)
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch users.', error: err.message })
  }
}

export async function getTenantMe(req, res) {
  const tenant = await Tenant.findOne({ email: req.user.email })
  if (!tenant) return res.status(404).json({ message: 'No tenant record linked to this account yet.' })
  res.json(tenant)
}

export async function getTenants(req, res) {
  const tenants = await Tenant.find().sort({ createdAt: -1 })
  res.json(tenants)
}

export async function createTenant(req, res) {
  try {
    const payload = { ...req.body }
    if (payload.user) {
      const user = await User.findById(payload.user)
      if (user) {
        payload.name = payload.name || user.name
        payload.email = payload.email || user.email
        payload.phone = payload.phone || user.phone
        payload.room = payload.room || user.room
      }
    }
    const tenant = await Tenant.create(payload)
    res.status(201).json(tenant)
  } catch (err) {
    res.status(400).json({ message: 'Could not create tenant.', error: err.message })
  }
}

export async function updateTenant(req, res) {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!tenant) return res.status(404).json({ message: 'Tenant not found.' })

    if (req.body.rentStatus) {
      const existing = await Rent.findOne({ tenant: tenant._id, month: currentMonth() })
      if (existing) {
        existing.status = req.body.rentStatus
        if (req.body.rentStatus === 'Paid') existing.paidOn = new Date()
        await existing.save()
      } else if (tenant.room) {
        await Rent.create({
          tenant: tenant._id,
          month: currentMonth(),
          amount: 0,
          status: req.body.rentStatus,
          dueDate: nextDueDate(),
          paidOn: req.body.rentStatus === 'Paid' ? new Date() : null,
        })
      }
    }

    res.json(tenant)
  } catch (err) {
    res.status(400).json({ message: 'Could not update tenant.', error: err.message })
  }
}

export async function deleteTenant(req, res) {
  const tenant = await Tenant.findByIdAndDelete(req.params.id)
  if (!tenant) return res.status(404).json({ message: 'Tenant not found.' })
  await Rent.deleteMany({ tenant: tenant._id })
  res.json({ message: 'Tenant deleted.' })
}
