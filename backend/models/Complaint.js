import mongoose from 'mongoose'

const complaintSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    description: { type: String, default: '' },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
    pg: { type: String, default: 'Riverside PG' },
  },
  { timestamps: true }
)

export default mongoose.model('Complaint', complaintSchema)
