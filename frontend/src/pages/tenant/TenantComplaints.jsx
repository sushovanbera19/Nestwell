import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CalendarDays, MapPin } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { complaintsApi } from '../../lib/api'

const priorityDot = {
  High: 'bg-rose',
  Medium: 'bg-amber',
  Low: 'bg-teal',
}

export default function TenantComplaints() {
  const [complaints, setComplaints] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadComplaints() {
      try {
        setComplaints(await complaintsApi.mine())
      } catch (err) {
        setError(err.message)
      }
    }
    loadComplaints()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    setError('')
    try {
      const complaint = await complaintsApi.createMine({ title, category: category || 'General', priority })
      setComplaints((prev) => [complaint, ...prev])
      setTitle('')
      setCategory('')
      setPriority('Medium')
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-base font-medium text-ink dark:text-paper">Your complaints</h2>
          <p className="font-sans text-xs text-ink/50 dark:text-paper/50">Raise a new issue or track ones you've already reported.</p>
        </div>
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => setShowForm((s) => !s)} className="rounded-lg bg-ink px-4 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-teal-deep dark:bg-teal dark:text-ink dark:hover:bg-teal-deep">
          + Raise complaint
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: -16, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -16, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-ink-soft">
            <h3 className="mb-5 font-display text-lg font-medium text-ink dark:text-paper">Raise a new complaint</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm text-ink/60 dark:text-paper/60">What's the issue?</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Leaking tap in bathroom" className="w-full rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-ink/60 dark:text-paper/60">Category</label>
                <input value={category} onChange={(e) => setCategory(e.target.value)} type="text" placeholder="Plumbing" className="w-full rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-ink/60 dark:text-paper/60">Priority</label>
                <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper">
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink hover:bg-paper dark:border-paper/10 dark:text-paper dark:hover:bg-ink">Cancel</button>
              <button type="submit" className="rounded-lg bg-teal px-5 py-2 text-sm font-medium text-ink hover:bg-teal-deep">Submit complaint</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div layout className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {complaints.map((c) => (
          <motion.div key={c._id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${priorityDot[c.priority]}`} />
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">{c._id.slice(-6).toUpperCase()} | {c.category || 'General'}</p>
                  <h3 className="mt-0.5 font-display text-base font-medium text-ink dark:text-paper">{c.title}</h3>
                </div>
              </div>
              <StatusBadge status={c.status} />
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-dashed border-ink/10 pt-3 font-sans text-xs text-ink/50 dark:border-paper/10 dark:text-paper/50">
              <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Your room</span>
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" /> {new Date(c.createdAt).toISOString().slice(0, 10)}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {complaints.length === 0 && <p className="py-10 text-center font-sans text-sm text-ink/50 dark:text-paper/50">You haven't raised any complaints yet.</p>}
    </div>
  )
}
