import { useEffect, useMemo, useState } from 'react'
import RentSkeleton from '../components/RentSkeleton'
import { motion } from 'framer-motion'
import { AlertTriangle, Clock3, Trash2, Wallet, Plus } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import SearchInput from '../components/SearchInput'
import { formatCurrency } from '../lib/utils'
import { rentApi, tenantsApi } from '../lib/api'

const filters = ['All', 'Paid', 'Pending', 'Overdue']

const blankRent = { tenant: '', month: '', amount: '', dueDate: '', status: 'Pending' }

function currentMonth() {
  const d = new Date()
  return d.toLocaleString('en-US', { month: 'long', year: 'numeric' })
}

function defaultDueDate() {
  const d = new Date()
  d.setDate(10)
  if (d < new Date()) d.setMonth(d.getMonth() + 1)
  return d.toISOString().slice(0, 10)
}

function tenantName(record) {
  return record.tenant?.name || 'Unknown tenant'
}

function tenantRoom(record) {
  return record.tenant?.room || '-'
}

export default function Rent() {
  const [records, setRecords] = useState([])
  const [tenants, setTenants] = useState([])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(blankRent)

  useEffect(() => {
    async function loadRent() {
      try {
        setLoading(true)
        const [r, t] = await Promise.all([rentApi.list(), tenantsApi.list()])
        setRecords(r)
        setTenants(t)
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

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const resetForm = () => {
    setForm(blankRent)
    setShowForm(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        tenant: form.tenant,
        month: form.month || currentMonth(),
        amount: Number(form.amount),
        dueDate: form.dueDate || defaultDueDate(),
        status: form.status,
        paidOn: form.status === 'Paid' ? new Date().toISOString() : null,
      }
      const record = await rentApi.create(payload)
      setRecords((prev) => [record, ...prev])
      resetForm()
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
        <div className="flex flex-wrap items-center gap-2">
          {filters.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`rounded-full border px-3.5 py-1.5 font-sans text-xs transition-colors ${filter === f ? 'border-ink bg-ink text-paper dark:border-teal dark:bg-teal dark:text-ink' : 'border-ink/15 text-ink/60 hover:border-ink/30 hover:text-ink dark:border-paper/15 dark:text-paper/60 dark:hover:border-paper/30 dark:hover:text-paper'}`}>
              {f}
            </button>
          ))}
          <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => (showForm ? resetForm() : setShowForm(true))} className="ml-2 rounded-lg bg-ink px-4 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-teal-deep dark:bg-teal dark:text-ink dark:hover:bg-teal-deep">
            + Add record
          </motion.button>
        </div>
      </div>

      {showForm && (
        <motion.form onSubmit={handleCreate} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-ink-soft">
          <h2 className="mb-5 font-display text-lg font-medium text-ink dark:text-paper">Create Rent Record</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <select required value={form.tenant} onChange={update('tenant')} className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper">
              <option value="">Select tenant...</option>
              {tenants.map((t) => <option key={t._id} value={t._id}>{t.name} — Room {t.room || '-'}</option>)}
            </select>
            <input value={form.month} onChange={update('month')} placeholder={`e.g. ${currentMonth()}`} className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input required value={form.amount} onChange={update('amount')} type="number" min="1" placeholder="Amount" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input value={form.dueDate} onChange={update('dueDate')} type="date" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink hover:bg-paper dark:border-paper/10 dark:text-paper dark:hover:bg-ink">Cancel</button>
            <button type="submit" className="rounded-lg bg-teal px-5 py-2 text-sm font-medium text-ink hover:bg-teal-deep">Create record</button>
          </div>
        </motion.form>
      )}

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
