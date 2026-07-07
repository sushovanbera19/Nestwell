import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './config/db.js'

import authRoutes from './routes/auth.routes.js'
import roomRoutes from './routes/room.routes.js'
import tenantRoutes from './routes/tenant.routes.js'
import rentRoutes from './routes/rent.routes.js'
import complaintRoutes from './routes/complaint.routes.js'
import adminRoutes from './routes/admin.routes.js'

const app = express()

const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://nestwell.onrender.com',
  'https://nestwell-zeta.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
].filter(Boolean)

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) return cb(null, true)
    cb(null, true)
  },
}))
// higher limit than default so base64 profile-photo uploads fit
app.use(express.json({ limit: '5mb' }))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use(express.static('public'))

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next()
  res.sendFile('index.html', { root: 'public' })
})

app.use('/api/auth', authRoutes)
app.use('/api/rooms', roomRoutes)
app.use('/api/tenants', tenantRoutes)
app.use('/api/rent', rentRoutes)
app.use('/api/complaints', complaintRoutes)
app.use('/api/admins', adminRoutes)

// 404 fallback
app.use((req, res) => res.status(404).json({ message: 'Route not found.' }))

// simple centralized error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Something went wrong.', error: err.message })
})

const PORT = process.env.PORT || 5000

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Nestwell API running on http://localhost:${PORT}`))
})
