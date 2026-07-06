import mongoose from 'mongoose'

const rentSchema = new mongoose.Schema(
  {
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    month: { type: String, required: true }, // e.g. "July 2026"
    amount: { type: Number, required: true },
    status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
    dueDate: { type: Date, required: true },
    paidOn: { type: Date, default: null },
    pg: { type: String, default: 'Riverside PG' },
  },
  { timestamps: true }
)

export default mongoose.model('Rent', rentSchema)
