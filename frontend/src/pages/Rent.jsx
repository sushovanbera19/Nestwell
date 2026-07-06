import { useEffect, useMemo, useState } from 'react'
import RentSkeleton from '../components/RentSkeleton'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock3, Trash2, Wallet } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import SearchInput from '../components/SearchInput'
import { formatCurrency } from '../lib/utils'
import { rentApi } from '../lib/api'

const filters = ['All', 'Paid', 'Pending', 'Overdue']

function tenantName(record) {
  return record.tenant?.name || 'Unknown tenant'
}

function tenantRoom(record) {
  return record.tenant?.room || '-'
}

export default function Rent() {
  const [records, setRecords] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadRent() {
      try {
        setLoading(true)
        setRecords(await rentApi.list())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadRent()
  }, [])

  const collected = records.filter((r) => r.status === 'Paid').reduce((s, r) => s + r.amount, 0)
  const due = records.filter((r) => r.status === 'Pending').reduce((s, r) => s + r.amount, 0)
  const overdue = records.filter((r) => r.status === 'Overdue').reduce((s, r) => s + r.amount, 0)

  const filtered = useMemo(() => {
    return records.filter((r) => {
      const q = query.toLowerCase()
      const matchesFilter = filter === 'All' || r.status === filter
      const matchesQuery = tenantName(r).toLowerCase().includes(q) || tenantRoom(r).includes(q)
      return matchesFilter && matchesQuery
    })
  }, [records, query, filter])

  const markPaid = async (id) => {
    try {
      const updated = await rentApi.update(id, { status: 'Paid', paidOn: new Date().toISOString() })
      setRecords((prev) => prev.map((record) => (record._id === id ? { ...record, ...updated } : record)))
    } catch (err) {
      setError(err.message)
    }
  }

  const updateStatus = async (record, status) => {
    setError('')
    try {
      const updated = await rentApi.update(record._id, { status, paidOn: status === 'Paid' ? new Date().toISOString() : null })
      setRecords((prev) => prev.map((item) => (item._id === record._id ? { ...item, ...updated } : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this rent record?')) return
    setError('')
    try {
      await rentApi.remove(id)
      setRecords((prev) => prev.filter((record) => record._id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <RentSkeleton />

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Wallet} label="Collected this month" value={collected} prefix="Rs. " accent="teal" delay={0} />
        <StatCard icon={Clock3} label="Pending" value={due} prefix="Rs. " accent="amber" delay={0.05} />
        <StatCard icon={AlertTriangle} label="Overdue" value={overdue} prefix="Rs. " accent="rose" delay={0.1} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-xs">
          <SearchInput value={query} onChange={setQuery} placeholder="Search tenant or room" />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-3.5 py-1.5 font-sans text-xs transition-colors ${filter === f ? 'border-ink bg-ink text-paper dark:border-teal dark:bg-teal dark:text-ink' : 'border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink dark:border-paper/15 dark:text-paper/60 dark:hover:border-paper/30 dark:hover:text-paper'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card dark:border-paper/10 dark:bg-ink-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-ink/10 font-sans text-xs uppercase tracking-wide text-ink/40 dark:border-paper/10 dark:text-paper/40">
                <th className="px-5 py-3 font-medium">Receipt</th>
                <th className="px-5 py-3 font-medium">Tenant</th>
                <th className="px-5 py-3 font-medium">Room</th>
                <th className="px-5 py-3 font-medium">Month</th>
                <th className="px-5 py-3 font-medium">Amount</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-b border-ink/5 last:border-0 hover:bg-paper/60 dark:border-paper/5 dark:hover:bg-ink/60">
                  <td className="px-5 py-3.5 font-mono text-xs text-ink/40 dark:text-paper/40">{r._id.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-3.5 font-sans text-sm text-ink dark:text-paper">{tenantName(r)}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-ink/60 dark:text-paper/60">{tenantRoom(r)}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-ink/60 dark:text-paper/60">{r.month}</td>
                  <td className="px-5 py-3.5 font-mono text-sm font-medium text-ink dark:text-paper">{formatCurrency(r.amount)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={r.status} />
                      <select value={r.status} onChange={(e) => updateStatus(r, e.target.value)} aria-label="Update rent status" className="rounded-lg border border-ink/10 bg-white px-2 py-1 font-sans text-xs text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper">
                        {filters.filter((value) => value !== 'All').map((value) => <option key={value} value={value}>{value}</option>)}
                      </select>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex justify-end gap-3">
                      {r.status !== 'Paid' && <button onClick={() => markPaid(r._id)} className="font-sans text-xs font-medium text-teal-deep hover:underline">Mark paid</button>}
                      <button onClick={() => deleteRecord(r._id)} aria-label="Delete rent record" className="text-ink/40 hover:text-rose dark:text-paper/40"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="py-10 text-center font-sans text-sm text-ink/50 dark:text-paper/50">No records match this filter.</p>}
      </motion.div>
    </div>
  )
}
