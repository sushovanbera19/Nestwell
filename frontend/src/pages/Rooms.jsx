import { useEffect, useMemo, useState } from 'react'
import RoomPageSkeleton from '../components/RoomPageSkeleton'
import { motion } from 'framer-motion'
import RoomTag from '../components/RoomTag'
import SearchInput from '../components/SearchInput'
import { floors as fallbackFloors, roomStatuses } from '../data/rooms'
import { roomsApi } from '../lib/api'

const blankRoom = { number: '', type: 'Single', floor: 1, status: 'Vacant', capacity: 1, occupied: 0, rent: '' }

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [floor, setFloor] = useState('All')
  const [status, setStatus] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(blankRoom)
  const [editingId, setEditingId] = useState(null)

  async function loadRooms() {
    try {
      setLoading(true)
      setRooms(await roomsApi.list())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRooms()
  }, [])

  const floors = useMemo(() => {
    const values = [...new Set(rooms.map((room) => room.floor))].sort((a, b) => a - b)
    return values.length ? values : fallbackFloors
  }, [rooms])

  const filtered = useMemo(() => {
    return rooms.filter((r) => {
      const q = query.toLowerCase()
      const matchesQuery = r.number.includes(query) || r.type.toLowerCase().includes(q)
      const matchesFloor = floor === 'All' || r.floor === floor
      const matchesStatus = status === 'All' || r.status === status
      return matchesQuery && matchesFloor && matchesStatus
    })
  }, [rooms, query, floor, status])

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const resetForm = () => {
    setForm(blankRoom)
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (room) => {
    setForm({
      number: room.number || '',
      type: room.type || 'Single',
      floor: room.floor || 1,
      status: room.status || 'Vacant',
      capacity: room.capacity || 1,
      occupied: room.occupied || 0,
      rent: room.rent || '',
    })
    setEditingId(room._id)
    setShowForm(true)
  }

  const saveRoom = async (e) => {
    e.preventDefault()
    setError('')
    const payload = {
      ...form,
      floor: Number(form.floor),
      capacity: Number(form.capacity),
      occupied: Number(form.occupied || 0),
      rent: Number(form.rent),
    }
    try {
      if (editingId) {
        const room = await roomsApi.update(editingId, payload)
        setRooms((prev) => prev.map((item) => (item._id === editingId ? room : item)))
      } else {
        const room = await roomsApi.create(payload)
        setRooms((prev) => [...prev, room])
      }
      resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteRoom = async (id) => {
    if (!window.confirm('Delete this room?')) return
    setError('')
    try {
      await roomsApi.remove(id)
      setRooms((prev) => prev.filter((room) => room._id !== id))
      if (editingId === id) resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <RoomPageSkeleton />

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-xs">
          <SearchInput value={query} onChange={setQuery} placeholder="Search by room no. or type" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select value={floor} onChange={(e) => setFloor(e.target.value === 'All' ? 'All' : Number(e.target.value))} className="rounded-lg border border-ink/10 bg-white px-3 py-2 font-sans text-sm text-ink focus:outline-none dark:border-paper/10 dark:bg-ink-soft dark:text-paper">
            <option value="All">All floors</option>
            {floors.map((f) => <option key={f} value={f}>Floor {f}</option>)}
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-lg border border-ink/10 bg-white px-3 py-2 font-sans text-sm text-ink focus:outline-none dark:border-paper/10 dark:bg-ink-soft dark:text-paper">
            <option value="All">All statuses</option>
            {roomStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} className="rounded-lg bg-ink px-4 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-teal-deep dark:bg-teal dark:text-ink dark:hover:bg-teal-deep" onClick={() => (showForm ? resetForm() : setShowForm(true))}>
            + Add room
          </motion.button>
        </div>
      </div>

      {showForm && (
        <motion.form onSubmit={saveRoom} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-ink-soft">
          <h2 className="mb-6 font-display text-lg font-medium text-ink dark:text-paper">{editingId ? 'Update Room' : 'Add New Room'}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input required value={form.number} onChange={update('number')} type="text" placeholder="Room number" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input required value={form.type} onChange={update('type')} type="text" placeholder="Room type" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input required value={form.floor} onChange={update('floor')} type="number" min="1" placeholder="Floor" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <select value={form.status} onChange={update('status')} className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper">
              {roomStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input required value={form.capacity} onChange={update('capacity')} type="number" min="1" placeholder="Capacity" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input required value={form.occupied} onChange={update('occupied')} type="number" min="0" max={form.capacity || 1} placeholder="Occupied beds" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input required value={form.rent} onChange={update('rent')} type="number" min="0" placeholder="Monthly rent" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink hover:bg-paper dark:border-paper/10 dark:text-paper dark:hover:bg-ink">Cancel</button>
            <button type="submit" className="rounded-lg bg-teal px-5 py-2 text-sm font-medium text-ink hover:bg-teal-deep">{editingId ? 'Update Room' : 'Save Room'}</button>
          </div>
        </motion.form>
      )}

      <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((room) => <RoomTag key={room._id} room={room} onEdit={startEdit} onDelete={deleteRoom} />)}
      </motion.div>

      {filtered.length === 0 && <p className="py-10 text-center font-sans text-sm text-ink/50 dark:text-paper/50">No rooms match these filters.</p>}
    </div>
  )
}
