import { motion } from 'framer-motion'
import { Edit2, Trash2, DoorOpen, UserPlus } from 'lucide-react'
import { formatCurrency } from '../lib/utils'
import StatusBadge from './StatusBadge'

const statusBar = {
  Occupied: 'bg-ink-soft',
  Vacant: 'bg-teal',
  Maintenance: 'bg-amber',
}

export default function RoomTag({ room, tenants, onEdit, onDelete, onAllocate, onVacate }) {
  const roomTenants = tenants?.filter((t) => t.room === room.number) || []

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card dark:border-paper/10 dark:bg-ink-soft"
    >
      <div className={`relative flex h-2 items-center justify-between px-3 ${statusBar[room.status]}`}>
        <span className="tag-hole h-1 w-1 rounded-full bg-paper/70" />
        <span className="tag-hole h-1 w-1 rounded-full bg-paper/70" />
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">Floor {room.floor}</p>
            <p className="mt-1 font-display text-3xl font-medium text-ink dark:text-paper">{room.number}</p>
          </div>
          <StatusBadge status={room.status} />
        </div>

        <div className="mt-4 flex items-center gap-1.5">
          {Array.from({ length: room.capacity }).map((_, i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i < room.occupied ? 'bg-teal-deep' : 'bg-ink/10 dark:bg-paper/10'}`}
            />
          ))}
          <span className="ml-1.5 font-mono text-[11px] text-ink/40 dark:text-paper/40">
            {room.occupied}/{room.capacity} beds
          </span>
        </div>

        {roomTenants.length > 0 && (
          <div className="mt-3 space-y-1">
            {roomTenants.map((t) => (
              <div key={t._id} className="flex items-center justify-between rounded-lg bg-paper px-3 py-1.5 dark:bg-ink">
                <span className="font-sans text-xs text-ink dark:text-paper">{t.name}</span>
                {onVacate && (
                  <button
                    onClick={() => onVacate(room, t)}
                    aria-label="Vacate tenant"
                    className="rounded p-0.5 text-ink/30 hover:text-rose"
                    title="Vacate"
                  >
                    <DoorOpen className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink/10 pt-3 dark:border-paper/10">
          <span className="font-sans text-xs text-ink/50 dark:text-paper/50">{room.type}</span>
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-medium text-ink dark:text-paper">{formatCurrency(room.rent)}/mo</span>
            {room.occupied < room.capacity && onAllocate && (
              <button onClick={() => onAllocate(room)} aria-label="Allocate tenant" className="rounded-lg p-1.5 text-teal-deep hover:bg-teal-mist dark:text-teal dark:hover:bg-teal/10" title="Allocate tenant">
                <UserPlus className="h-4 w-4" />
              </button>
            )}
            {onEdit && <button onClick={() => onEdit(room)} aria-label="Edit room" className="rounded-lg p-1.5 text-ink/40 hover:bg-paper hover:text-teal-deep dark:text-paper/40 dark:hover:bg-ink"><Edit2 className="h-4 w-4" /></button>}
            {onDelete && <button onClick={() => onDelete(room._id)} aria-label="Delete room" className="rounded-lg p-1.5 text-ink/40 hover:bg-rose-soft hover:text-rose dark:text-paper/40"><Trash2 className="h-4 w-4" /></button>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
