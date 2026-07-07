import mongoose from 'mongoose'
import User from '../models/User.js'

async function seedSuperAdmin() {
  const email = (process.env.SUPER_ADMIN_EMAIL || 'sushovanbera979@gmail.com').toLowerCase()
  const password = process.env.SUPER_ADMIN_PASSWORD || '1234'
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin'

  await User.deleteMany({ role: 'superadmin', email: { $ne: email } })

  const existing = await User.findOne({ role: 'superadmin', email })
  if (existing) {
    existing.password = password
    existing.name = name
    await existing.save()
    console.log(`Super admin updated (${email})`)
    return
  }

  await User.create({ name, email, password, role: 'superadmin', phone: '', pg: 'All Properties' })
  console.log(`Super admin seeded (${email})`)
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
