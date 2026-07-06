import Tenant from '../models/Tenant.js'

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
    const tenant = await Tenant.create(req.body)
    res.status(201).json(tenant)
  } catch (err) {
    res.status(400).json({ message: 'Could not create tenant.', error: err.message })
  }
}

export async function updateTenant(req, res) {
  try {
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!tenant) return res.status(404).json({ message: 'Tenant not found.' })
    res.json(tenant)
  } catch (err) {
    res.status(400).json({ message: 'Could not update tenant.', error: err.message })
  }
}

export async function deleteTenant(req, res) {
  const tenant = await Tenant.findByIdAndDelete(req.params.id)
  if (!tenant) return res.status(404).json({ message: 'Tenant not found.' })
  res.json({ message: 'Tenant deleted.' })
}
