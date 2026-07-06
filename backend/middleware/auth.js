import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// Verifies the "Authorization: Bearer <token>" header and attaches
// the logged-in user to req.user.
export async function protect(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated. Please log in.' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' })
    }
    req.user = user
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

// Usage: authorize('superadmin', 'admin')
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'You are not allowed to do that.' })
    }
    next()
  }
}
