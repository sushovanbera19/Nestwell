import { Router } from 'express'
import Room from '../models/Room.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

// All room routes require login; only super admin & admin can manage rooms.
router.use(protect, authorize('superadmin', 'admin'))

// GET /api/rooms
router.get('/', async (req, res) => {
  const rooms = await Room.find().sort({ floor: 1, number: 1 })
  res.json(rooms)
})

// POST /api/rooms
router.post('/', async (req, res) => {
  try {
    const room = await Room.create(req.body)
    res.status(201).json(room)
  } catch (err) {
    res.status(400).json({ message: 'Could not create room.', error: err.message })
  }
})

// PUT /api/rooms/:id
router.put('/:id', async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!room) return res.status(404).json({ message: 'Room not found.' })
    res.json(room)
  } catch (err) {
    res.status(400).json({ message: 'Could not update room.', error: err.message })
  }
})

// DELETE /api/rooms/:id
router.delete('/:id', async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id)
  if (!room) return res.status(404).json({ message: 'Room not found.' })
  res.json({ message: 'Room deleted.' })
})

export default router
