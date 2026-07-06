import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Building2, Edit2, Mail, ShieldCheck, Trash2 } from 'lucide-react'
import { initials, avatarTint } from '../lib/utils'
import { adminsApi } from '../lib/api'
import Skeleton from '../components/Skeleton'

const blankAdmin = { name: '', email: '', phone: '', password: '', pg: '' }

function AdminSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="mt-4 space-y-2 border-t border-dashed border-ink/10 pt-3 dark:border-paper/10">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(blankAdmin)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    async function loadAdmins() {
      try {
        setLoading(true)
        setAdmins(await adminsApi.list())
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadAdmins()
  }, [])

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))

  const resetForm = () => {
    setForm(blankAdmin)
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (admin) => {
    setForm({ name: admin.name || '', email: admin.email || '', phone: admin.phone || '', password: '', pg: admin.pg || '' })
    setEditingId(admin._id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || (!editingId && !form.password)) return
    setError('')
    try {
      if (editingId) {
        const payload = { ...form }
        if (!payload.password) delete payload.password
        const admin = await adminsApi.update(editingId, payload)
        setAdmins((prev) => prev.map((item) => (item._id === editingId ? admin : item)))
      } else {
        const admin = await adminsApi.create(form)
        setAdmins((prev) => [admin, ...prev])
      }
      resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleRemove = async (id) => {
    setError('')
    try {
      await adminsApi.remove(id)
      setAdmins((prev) => prev.filter((a) => a._id !== id))
      if (editingId === id) resetForm()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <AdminSkeleton />

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-base font-medium text-ink dark:text-paper">Admins</h2>
          <p className="font-sans text-xs text-ink/50 dark:text-paper/50">Create and manage admins, each scoped to one assigned PG.</p>
        </div>
        <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.97 }} onClick={() => (showForm ? resetForm() : setShowForm(true))} className="rounded-lg bg-ink px-4 py-2 font-sans text-sm font-medium text-paper transition-colors hover:bg-teal-deep dark:bg-teal dark:text-ink dark:hover:bg-teal-deep">
          + Create admin
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form onSubmit={handleSave} initial={{ opacity: 0, y: -16, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -16, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden rounded-2xl border border-ink/10 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-ink-soft">
            <h3 className="mb-5 font-display text-lg font-medium text-ink dark:text-paper">{editingId ? 'Update admin' : 'Create new admin'}</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <input required value={form.name} onChange={update('name')} type="text" placeholder="Full name" className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
              <input required value={form.email} onChange={update('email')} type="email" placeholder="Email" className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
              <input value={form.phone} onChange={update('phone')} type="tel" placeholder="Phone" className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
              <input required={!editingId} value={form.password} onChange={update('password')} type="password" placeholder={editingId ? 'New password optional' : 'Password'} className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
              <input value={form.pg} onChange={update('pg')} type="text" placeholder="Assigned PG" className="rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper" />
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={resetForm} className="rounded-lg border border-ink/10 px-4 py-2 text-sm text-ink hover:bg-paper dark:border-paper/10 dark:text-paper dark:hover:bg-ink">Cancel</button>
              <button type="submit" className="rounded-lg bg-teal px-5 py-2 text-sm font-medium text-ink hover:bg-teal-deep">{editingId ? 'Update admin' : 'Create admin'}</button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {admins.map((a, i) => (
          <motion.div key={a._id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.03 * i }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-sans text-xs font-semibold text-paper" style={{ backgroundColor: avatarTint(a.name) }}>{initials(a.name)}</span>
                <div>
                  <p className="font-sans text-sm font-medium text-ink dark:text-paper">{a.name}</p>
                  <p className="font-mono text-[11px] text-ink/40 dark:text-paper/40">{a._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(a)} aria-label="Edit admin" className="text-ink/30 hover:text-teal-deep dark:text-paper/30"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleRemove(a._id)} aria-label="Remove admin" className="text-ink/30 hover:text-rose dark:text-paper/30"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-dashed border-ink/10 pt-3 dark:border-paper/10">
              <p className="flex items-center gap-1.5 font-sans text-xs text-ink/60 dark:text-paper/60"><Mail className="h-3.5 w-3.5" /> {a.email}</p>
              <p className="flex items-center gap-1.5 font-sans text-xs text-ink/60 dark:text-paper/60"><Building2 className="h-3.5 w-3.5" /> {a.pg || 'Riverside PG'}</p>
              <p className="flex items-center gap-1.5 font-sans text-xs text-ink/60 dark:text-paper/60"><ShieldCheck className="h-3.5 w-3.5" /><span className="text-teal-deep">Active</span></p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {admins.length === 0 && <p className="py-10 text-center font-sans text-sm text-ink/50 dark:text-paper/50">No admins yet. Create one to get started.</p>}
    </div>
  )
}
