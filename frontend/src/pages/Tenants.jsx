import { useEffect, useMemo, useState } from 'react'
import TenantSkeleton from '../components/TenantSkeleton'
import { motion } from 'framer-motion'
import { Edit2, Mail, Phone, Trash2 } from 'lucide-react'
import SearchInput from '../components/SearchInput'
import StatusBadge from '../components/StatusBadge'
import { initials, avatarTint } from '../lib/utils'
import { tenantsApi } from '../lib/api'

const blankTenant = { name: '', email: '', phone: '', room: '', rentStatus: 'Pending' }

function formatDate(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : ''
}

export default function Tenants() {
  const [tenants, setTenants] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(blankTenant)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    async function loadTenants() {
      try {
        setLoading(true)
        setTenants(await tenantsApi.list())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTenants()
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return tenants.filter((t) => t.name.toLowerCase().includes(q) || t.room.includes(q) || t.email.toLowerCase().includes(q))
  }, [tenants, query])

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const resetForm = () => {
    setForm(blankTenant)
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (tenant) => {
    setForm({
      name: tenant.name || '',
      email: tenant.email || '',
      phone: tenant.phone || '',
      room: tenant.room || '',
      rentStatus: tenant.rentStatus || 'Pending',
    })
    setEditingId(tenant._id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        const tenant = await tenantsApi.update(editingId, form)
        setTenants((prev) => prev.map((item) => (item._id === editingId ? tenant : item)))
      } else {
        const tenant = await tenantsApi.create(form)
        setTenants((prev) => [tenant, ...prev])
      }
      resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tenant?')) return
    setError('')
    try {
      await tenantsApi.remove(id)
      setTenants((prev) => prev.filter((tenant) => tenant._id !== id))
      if (editingId === id) resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <TenantSkeleton />

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full max-w-xs">
          <SearchInput value={query} onChange={setQuery} placeholder="Search tenants, room, email" />
        </div>
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => (showForm ? resetForm() : setShowForm(true))} className="rounded-lg bg-ink px-4 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-teal-deep dark:bg-teal dark:text-ink dark:hover:bg-teal-deep">
          + Add tenant
        </motion.button>
      </div>

      {showForm && (
        <motion.form onSubmit={handleSave} initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-ink-soft">
          <h2 className="mb-5 font-display text-lg font-medium text-ink dark:text-paper">{editingId ? 'Update tenant' : 'Add New Tenant'}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <input required value={form.name} onChange={update('name')} placeholder="Full name" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input required value={form.email} onChange={update('email')} type="email" placeholder="Email" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input value={form.phone} onChange={update('phone')} placeholder="Phone" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <input required value={form.room} onChange={update('room')} placeholder="Room" className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            <select value={form.rentStatus} onChange={update('rentStatus')} className="rounded-lg border border-ink/10 px-4 py-2.5 font-sans text-sm focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper">
              <option>Pending</option>
              <option>Paid</option>
              <option>Overdue</option>
            </select>
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button type="button" onClick={resetForm} className="rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink hover:bg-paper dark:border-paper/10 dark:text-paper dark:hover:bg-ink">Cancel</button>
            <button type="submit" className="rounded-lg bg-teal px-5 py-2 text-sm font-medium text-ink hover:bg-teal-deep">{editingId ? 'Update tenant' : 'Save tenant'}</button>
          </div>
        </motion.form>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-card dark:border-paper/10 dark:bg-ink-soft">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-ink/10 font-sans text-xs uppercase tracking-wide text-ink/40 dark:border-paper/10 dark:text-paper/40">
                <th className="px-5 py-3 font-medium">Tenant</th>
                <th className="px-5 py-3 font-medium">Room</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Joined</th>
                <th className="px-5 py-3 font-medium">Rent status</th>
                <th className="px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t._id} className="border-b border-ink/5 last:border-0 hover:bg-paper/60 dark:border-paper/5 dark:hover:bg-ink/60">
                  <td className="flex items-center gap-3 px-5 py-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-sans text-xs font-semibold text-paper" style={{ backgroundColor: avatarTint(t.name) }}>{initials(t.name)}</span>
                    <span className="font-sans text-sm text-ink dark:text-paper">{t.name}</span>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-ink/60 dark:text-paper/60">{t.room}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 font-sans text-xs text-ink/60 dark:text-paper/60"><Phone className="h-3 w-3" /> {t.phone || 'Not set'}</span>
                      <span className="flex items-center gap-1.5 font-sans text-xs text-ink/40 dark:text-paper/40"><Mail className="h-3 w-3" /> {t.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-ink/60 dark:text-paper/60">{formatDate(t.joined)}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={t.rentStatus} /></td>
                  <td className="px-5 py-3.5">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(t)} aria-label="Edit tenant" className="rounded-lg p-2 text-ink/40 hover:bg-paper hover:text-teal-deep dark:text-paper/40 dark:hover:bg-ink"><Edit2 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(t._id)} aria-label="Delete tenant" className="rounded-lg p-2 text-ink/40 hover:bg-rose-soft hover:text-rose dark:text-paper/40"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <p className="py-10 text-center font-sans text-sm text-ink/50 dark:text-paper/50">No tenants match your search.</p>}
      </motion.div>
    </div>
  )
}
