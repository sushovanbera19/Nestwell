import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

export const ROLES = ['superadmin', 'admin', 'tenant']

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 4, select: false },
    phone: { type: String, default: '' },
    role: { type: String, enum: ROLES, required: true },
    pg: { type: String, default: 'Riverside PG' }, // property the user belongs to / manages
    room: { type: String, default: '' }, // only meaningful for tenants
    avatar: { type: String, default: '' }, // data URL or image URL
  },
  { timestamps: true }
)

// One email can only register once per role (a person could in theory
// be both an admin and a tenant with the same email, but not the same role twice).
userSchema.index({ email: 1, role: 1 }, { unique: true })

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

export default mongoose.model('User', userSchema)
