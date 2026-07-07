import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { OAuth2Client } from 'google-auth-library'
import User, { ROLES } from '../models/User.js'
import { sendPasswordResetEmail } from '../utils/email.js'

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

export async function forgotPassword(req, res) {
  try {
    const { email, role } = req.body
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' })
    }

    const query = role ? { email: email.toLowerCase(), role } : { email: email.toLowerCase() }
    const user = await User.findOne(query)
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email.' })
    }

    const resetToken = user.getResetToken()
    await user.save()

    const frontendUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}?email=${user.email}`

    try {
      await sendPasswordResetEmail(user.email, user.name, resetUrl)
      res.json({ message: 'Password reset link sent to your email.' })
    } catch (err) {
      user.resetPasswordToken = ''
      user.resetPasswordExpire = null
      await user.save()
      res.status(500).json({ message: 'Could not send email. Try again later.' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message })
  }
}

export async function resetPassword(req, res) {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required.' })
    }
    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters.' })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password')

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token.' })
    }

    user.password = password
    user.resetPasswordToken = ''
    user.resetPasswordExpire = null
    await user.save()

    const jwtToken = signToken(user)
    res.json({ message: 'Password reset successful.', token: jwtToken, user: toSafeUser(user) })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong.', error: err.message })
  }
}

export async function googleLogin(req, res) {
  try {
    const { credential, role } = req.body
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required.' })
    }

    const allowedRole = role || 'tenant'
    if (allowedRole === 'superadmin') {
      return res.status(403).json({ message: 'Super admin cannot use Google login.' })
    }

    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!clientId) {
      return res.status(500).json({ message: 'Google login not configured.' })
    }

    const client = new OAuth2Client(clientId)
    const ticket = await client.verifyIdToken({ idToken: credential, audience: clientId })
    const payload = ticket.getPayload()
    const { email, name, picture } = payload

    let user = await User.findOne({ email: email.toLowerCase(), role: allowedRole })
    if (!user) {
      const googlePassword = crypto.randomBytes(16).toString('hex')
      user = await User.create({ name, email, password: googlePassword, role: allowedRole, avatar: picture || '' })
    }

    const token = signToken(user)
    res.json({ token, user: toSafeUser(user) })
  } catch (err) {
    res.status(500).json({ message: 'Google login failed.', error: err.message })
  }
}

export async function facebookLogin(req, res) {
  try {
    const { accessToken, role } = req.body
    if (!accessToken) {
      return res.status(400).json({ message: 'Facebook access token is required.' })
    }

    const allowedRole = role || 'tenant'
    if (allowedRole === 'superadmin') {
      return res.status(403).json({ message: 'Super admin cannot use Facebook login.' })
    }

    const fbResp = await fetch(`https://graph.facebook.com/v19.0/me?fields=id,name,email,picture&access_token=${accessToken}`)
    const fbData = await fbResp.json()

    if (!fbData.email) {
      return res.status(400).json({ message: 'Could not retrieve email from Facebook.' })
    }

    let user = await User.findOne({ email: fbData.email.toLowerCase(), role: allowedRole })
    if (!user) {
      const fbPassword = crypto.randomBytes(16).toString('hex')
      const avatar = fbData.picture?.data?.url || ''
      user = await User.create({ name: fbData.name, email: fbData.email, password: fbPassword, role: allowedRole, avatar })
    }

    const token = signToken(user)
    res.json({ token, user: toSafeUser(user) })
  } catch (err) {
    res.status(500).json({ message: 'Facebook login failed.', error: err.message })
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
