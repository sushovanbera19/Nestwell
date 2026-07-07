import mongoose from 'mongoose'
import User from '../models/User.js'

async function seedSuperAdmin() {
  const existing = await User.findOne({ role: 'superadmin' })
  if (existing) {
    console.log('Super admin already exists — skipping seed')
    return
  }
  await User.create({
    name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
    email: (process.env.SUPER_ADMIN_EMAIL || 'superadmin@nestwell.app').toLowerCase(),
    password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
    role: 'superadmin',
    phone: '',
    pg: 'All Properties',
  })
  console.log('Default super admin seeded')
}

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
    await seedSuperAdmin()
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  }
}
