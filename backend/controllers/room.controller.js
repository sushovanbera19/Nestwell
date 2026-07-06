import Room from '../models/Room.js'

export async function getRooms(req, res) {
  const rooms = await Room.find().sort({ floor: 1, number: 1 })
  res.json(rooms)
}

export async function createRoom(req, res) {
  try {
    const room = await Room.create(req.body)
    res.status(201).json(room)
  } catch (err) {
    res.status(400).json({ message: 'Could not create room.', error: err.message })
  }
}

export async function updateRoom(req, res) {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!room) return res.status(404).json({ message: 'Room not found.' })
    res.json(room)
  } catch (err) {
    res.status(400).json({ message: 'Could not update room.', error: err.message })
  }
}

export async function deleteRoom(req, res) {
  const room = await Room.findByIdAndDelete(req.params.id)
  if (!room) return res.status(404).json({ message: 'Room not found.' })
  res.json({ message: 'Room deleted.' })
}
