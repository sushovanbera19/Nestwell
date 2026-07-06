import mongoose from 'mongoose'

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    room: { type: String, required: true },
    joined: { type: Date, default: Date.now },
    rentStatus: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    pg: { type: String, default: 'Riverside PG' },
    // optional link to the tenant's own login account, if they registered
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
)

export default mongoose.model('Tenant', tenantSchema)
