import mongoose from 'mongoose'

const roomSchema = new mongoose.Schema(
  {
    number: { type: String, required: true },
    floor: { type: Number, required: true },
    type: { type: String, default: 'Shared' }, // e.g. Single, Double, Shared
    capacity: { type: Number, required: true },
    occupied: { type: Number, default: 0 },
    rent: { type: Number, required: true },
    status: { type: String, enum: ['Occupied', 'Vacant', 'Maintenance'], default: 'Vacant' },
    pg: { type: String, default: 'Riverside PG' },
  },
  { timestamps: true }
)

export default mongoose.model('Room', roomSchema)
