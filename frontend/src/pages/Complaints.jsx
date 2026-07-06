import { useEffect, useMemo, useState } from 'react'
import ComplaintSkeleton from '../components/ComplaintSkeleton'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Trash2 } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import { complaintStatuses } from '../data/complaints'
import { complaintsApi } from '../lib/api'

const priorityDot = {
  High: 'bg-rose',
  Medium: 'bg-amber',
  Low: 'bg-teal',
}

function tenantName(complaint) {
  return complaint.tenant?.name || 'Unknown tenant'
}

function tenantRoom(complaint) {
  return complaint.tenant?.room || '-'
}

export default function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [tab, setTab] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadComplaints() {
      try {
        setLoading(true)
        setComplaints(await complaintsApi.list())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadComplaints()
  }, [])

  const filtered = useMemo(() => {
    if (tab === 'All') return complaints
    return complaints.filter((c) => c.status === tab)
  }, [complaints, tab])

  const advanceStatus = async (complaint) => {
    const status = complaint.status === 'Open' ? 'In Progress' : 'Resolved'
    try {
      const updated = await complaintsApi.update(complaint._id, { status })
      setComplaints((prev) => prev.map((item) => (item._id === complaint._id ? { ...item, ...updated } : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  const updateComplaint = async (complaint, payload) => {
    setError('')
    try {
      const updated = await complaintsApi.update(complaint._id, payload)
      setComplaints((prev) => prev.map((item) => (item._id === complaint._id ? { ...item, ...updated } : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteComplaint = async (id) => {
    if (!window.confirm('Delete this complaint?')) return
    setError('')
    try {
      await complaintsApi.remove(id)
      setComplaints((prev) => prev.filter((complaint) => complaint._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <ComplaintSkeleton />

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">{error}</p>}

      <div className="flex flex-wrap gap-2">
        {['All', ...complaintStatuses].map((s) => (
          <button key={s} onClick={() => setTab(s)} className={`rounded-full border px-4 py-2 font-sans text-sm transition-colors ${tab === s ? 'border-ink bg-ink text-paper dark:border-teal dark:bg-teal dark:text-ink' : 'border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink dark:border-paper/15 dark:text-paper/60 dark:hover:border-paper/30 dark:hover:text-paper'}`}>
            {s}
            {s !== 'All' && <span className="ml-1.5 font-mono text-xs text-ink/40 dark:text-paper/40">{complaints.filter((c) => c.status === s).length}</span>}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filtered.map((c) => (
          <motion.div key={c._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${priorityDot[c.priority]}`} />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">{c._id.slice(-6).toUpperCase()} | {c.category || 'General'}</p>
                  <h3 className="mt-0.5 font-display text-base font-medium text-ink dark:text-paper">{c.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={c.status} />
                <button onClick={() => deleteComplaint(c._id)} aria-label="Delete complaint" className="rounded-lg p-1.5 text-ink/40 hover:bg-rose-soft hover:text-rose dark:text-paper/40"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-dashed border-ink/10 pt-3 font-sans text-xs text-ink/50 dark:border-paper/10 dark:text-paper/50">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Room {tenantRoom(c)} | {tenantName(c)}</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {new Date(c.createdAt).toISOString().slice(0, 10)}</span>
              <select value={c.priority} onChange={(e) => updateComplaint(c, { priority: e.target.value })} aria-label="Update complaint priority" className="rounded-lg border border-ink/10 bg-white px-2 py-1 font-sans text-xs text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper">
                {Object.keys(priorityDot).map((priority) => <option key={priority} value={priority}>{priority}</option>)}
              </select>
              <select value={c.status} onChange={(e) => updateComplaint(c, { status: e.target.value })} aria-label="Update complaint status" className="rounded-lg border border-ink/10 bg-white px-2 py-1 font-sans text-xs text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper">
                {complaintStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
              {c.status !== 'Resolved' && <button onClick={() => advanceStatus(c)} className="ml-auto font-sans text-xs font-medium text-teal-deep hover:underline">{c.status === 'Open' ? 'Start progress' : 'Mark resolved'}</button>}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filtered.length === 0 && <p className="py-10 text-center font-sans text-sm text-ink/50 dark:text-paper/50">No complaints in this category.</p>}
    </div>
  )
}
