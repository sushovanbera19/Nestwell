import User from '../models/User.js'

export async function getAdmins(req, res) {
  const admins = await User.find({ role: 'admin' }).sort({ createdAt: -1 })
  res.json(admins)
}

export async function createAdmin(req, res) {
  try {
    const { name, email, phone, password, pg } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }
    const existing = await User.findOne({ email: email.toLowerCase(), role: 'admin' })
    if (existing) {
      return res.status(409).json({ message: 'An admin with this email already exists.' })
    }
    const admin = await User.create({ name, email, phone, password, pg, role: 'admin' })
    res.status(201).json(admin)
  } catch (err) {
    res.status(400).json({ message: 'Could not create admin.', error: err.message })
  }
}

export async function updateAdmin(req, res) {
  try {
    const { name, email, phone, password, pg } = req.body
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase(), role: 'admin', _id: { $ne: req.params.id } })
    if (existing) {
      return res.status(409).json({ message: 'An admin with this email already exists.' })
    }

    const admin = await User.findOne({ _id: req.params.id, role: 'admin' })
    if (!admin) return res.status(404).json({ message: 'Admin not found.' })

    admin.name = name
    admin.email = email
    admin.phone = phone || ''
    admin.pg = pg || 'Riverside PG'
    if (password) admin.password = password

    await admin.save()
    res.json(admin)
  } catch (err) {
    res.status(400).json({ message: 'Could not update admin.', error: err.message })
  }
}

export async function deleteAdmin(req, res) {
  const admin = await User.findOneAndDelete({ _id: req.params.id, role: 'admin' })
  if (!admin) return res.status(404).json({ message: 'Admin not found.' })
  res.json({ message: 'Admin removed.' })
}
