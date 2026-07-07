import mongoose from 'mongoose'
import User from '../models/User.js'

async function seedSuperAdmin() {
  const email = (process.env.SUPER_ADMIN_EMAIL || 'superadmin@nestwell.app').toLowerCase()
  const password = process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123'
  const name = process.env.SUPER_ADMIN_NAME || 'Super Admin'

  const existing = await User.findOne({ role: 'superadmin' })
  if (existing) {
    if (existing.email === email) {
      const needsUpdate = password !== process.env.SUPER_ADMIN_PASSWORD
      if (needsUpdate) {
        existing.password = password
        existing.name = name
        await existing.save()
        console.log('Super admin credentials updated from env')
      } else {
        console.log('Super admin already exists — skipping seed')
      }
    } else {
      console.log(`Super admin exists (${existing.email}) — leaving as-is`)
    }
    return
  }

  await User.create({ name, email, password, role: 'superadmin', phone: '', pg: 'All Properties' })
  console.log(`Default super admin seeded (${email})`)
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
