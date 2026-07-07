import Room from '../models/Room.js'
import Tenant from '../models/Tenant.js'

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

export async function allocateTenant(req, res) {
  try {
    const { roomId, tenantId } = req.body
    if (!roomId || !tenantId) return res.status(400).json({ message: 'roomId and tenantId are required.' })

    const room = await Room.findById(roomId)
    if (!room) return res.status(404).json({ message: 'Room not found.' })
    if (room.occupied >= room.capacity) return res.status(400).json({ message: 'Room is at full capacity.' })

    const tenant = await Tenant.findById(tenantId)
    if (!tenant) return res.status(404).json({ message: 'Tenant not found.' })
    if (tenant.room) {
      const oldRoom = await Room.findOne({ number: tenant.room })
      if (oldRoom) {
        oldRoom.occupied = Math.max(0, oldRoom.occupied - 1)
        if (oldRoom.occupied <= 0) oldRoom.status = 'Vacant'
        await oldRoom.save()
      }
    }

    tenant.room = room.number
    await tenant.save()

    room.occupied += 1
    if (room.occupied > 0) room.status = 'Occupied'
    await room.save()

    res.json({ message: `${tenant.name} allocated to Room ${room.number}.`, room, tenant })
  } catch (err) {
    res.status(500).json({ message: 'Could not allocate tenant.', error: err.message })
  }
}

export async function vacateTenant(req, res) {
  try {
    const { roomId, tenantId } = req.body
    if (!roomId || !tenantId) return res.status(400).json({ message: 'roomId and tenantId are required.' })

    const room = await Room.findById(roomId)
    if (!room) return res.status(404).json({ message: 'Room not found.' })

    const tenant = await Tenant.findById(tenantId)
    if (!tenant) return res.status(404).json({ message: 'Tenant not found.' })

    tenant.room = ''
    await tenant.save()

    room.occupied = Math.max(0, room.occupied - 1)
    if (room.occupied <= 0) room.status = 'Vacant'
    await room.save()

    res.json({ message: `${tenant.name} vacated Room ${room.number}.`, room, tenant })
  } catch (err) {
    res.status(500).json({ message: 'Could not vacate tenant.', error: err.message })
  }
}

export async function getRoomTenants(req, res) {
  try {
    const room = await Room.findById(req.params.id)
    if (!room) return res.status(404).json({ message: 'Room not found.' })
    const tenants = await Tenant.find({ room: room.number }).sort({ name: 1 })
    res.json(tenants)
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch room tenants.', error: err.message })
  }
}
