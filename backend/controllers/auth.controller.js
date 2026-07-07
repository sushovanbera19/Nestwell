import jwt from 'jsonwebtoken'
import User, { ROLES } from '../models/User.js'

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

function toSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    pg: user.pg,
    room: user.room,
    avatar: user.avatar,
  }
}

export async function register(req, res) {
  try {
    const { name, email, phone, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Name, email, password and role are required.' })
    }
    if (!ROLES.includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' })
    }
    if (role === 'superadmin' || role === 'admin') {
      return res.status(403).json({
        message: `${role === 'superadmin' ? 'Super admin' : 'Admin'} accounts cannot be self-registered. Contact your system administrator.`,
      })
    }

    const existing = await User.findOne({ email: email.toLowerCase(), role })
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists for this role.' })
    }

    const user = await User.create({ name, email, phone, password, role })
    const token = signToken(user)
    res.status(201).json({ token, user: toSafeUser(user) })
  } catch (err) {
    res.status(500).json({ message: 'Registration failed.', error: err.message })
  }
}

export async function login(req, res) {
  try {
    const { email, password, role } = req.body

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Email, password and role are required.' })
    }

    const user = await User.findOne({ email: email.toLowerCase(), role }).select('+password')
    if (!user) {
      return res.status(404).json({ message: 'No account found for this role and email. Please register first.' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password. Please try again.' })
    }

    const token = signToken(user)
    res.json({ token, user: toSafeUser(user) })
  } catch (err) {
    res.status(500).json({ message: 'Login failed.', error: err.message })
  }
}

export async function getMe(req, res) {
  res.json({ user: toSafeUser(req.user) })
}

export async function updateAvatar(req, res) {
  try {
    const { avatar } = req.body
    if (!avatar) {
      return res.status(400).json({ message: 'avatar is required.' })
    }
    req.user.avatar = avatar
    await req.user.save()
    res.json({ user: toSafeUser(req.user) })
  } catch (err) {
    res.status(500).json({ message: 'Could not update photo.', error: err.message })
  }
}
