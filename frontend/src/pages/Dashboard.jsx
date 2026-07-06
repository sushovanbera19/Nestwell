import { useEffect, useState } from 'react'
import DashboardSkeleton from '../components/DashboardSkeleton'
import { motion } from 'framer-motion'
import { DoorOpen, Users, Wallet, MessageSquareWarning } from 'lucide-react'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { formatCurrency } from '../lib/utils'
import { complaintsApi, rentApi, roomsApi, tenantsApi } from '../lib/api'

const statusDot = {
  Occupied: 'bg-ink-soft',
  Vacant: 'bg-teal',
  Maintenance: 'bg-amber',
}

function tenantName(record) {
  return record.tenant?.name || 'Unknown tenant'
}

function tenantRoom(record) {
  return record.tenant?.room || '-'
}

export default function Dashboard() {
  const [data, setData] = useState({ rooms: [], tenants: [], rent: [], complaints: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true)
        const [rooms, tenants, rent, complaints] = await Promise.all([
          roomsApi.list(),
          tenantsApi.list(),
          rentApi.list(),
          complaintsApi.list(),
        ])
        setData({ rooms, tenants, rent, complaints })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadDashboard()
  }, [])

  if (loading) return <DashboardSkeleton />

  const occupied = data.rooms.filter((r) => r.status === 'Occupied').length
  const vacant = data.rooms.filter((r) => r.status === 'Vacant').length
  const collected = data.rent.filter((r) => r.status === 'Paid').reduce((s, r) => s + r.amount, 0)
  const openComplaints = data.complaints.filter((c) => c.status !== 'Resolved').length
  const recentComplaints = [...data.complaints].slice(0, 4)
  const recentPayments = data.rent.filter((r) => r.status === 'Paid').slice(0, 4)

  return (
    <div className="space-y-8">
      {error && <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DoorOpen} label={`${vacant} rooms vacant`} value={occupied} suffix={` / ${data.rooms.length}`} accent="teal" delay={0} />
        <StatCard icon={Users} label="Active tenants" value={data.tenants.length} accent="teal" delay={0.05} />
        <StatCard icon={Wallet} label="Collected this month" value={collected} prefix="Rs. " accent="teal" delay={0.1} />
        <StatCard icon={MessageSquareWarning} label="Open complaints" value={openComplaints} accent="rose" delay={0.15} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-medium text-ink dark:text-paper">Occupancy map</h2>
            <div className="flex items-center gap-3 font-sans text-xs text-ink/50 dark:text-paper/50">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-ink-soft" /> Occupied</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-teal" /> Vacant</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber" /> Maintenance</span>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-4 gap-3 sm:grid-cols-6">
            {data.rooms.map((room, i) => (
              <motion.div key={room._id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.02 * i }} title={`Room ${room.number} - ${room.status}`} className="flex flex-col items-center gap-1.5 rounded-xl border border-ink/10 py-3 dark:border-paper/10">
                <span className={`h-2 w-2 rounded-full ${statusDot[room.status]}`} />
                <span className="font-mono text-xs text-ink/70 dark:text-paper/70">{room.number}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
          <h2 className="font-display text-base font-medium text-ink dark:text-paper">Recent complaints</h2>
          <div className="mt-4 space-y-4">
            {recentComplaints.map((c) => (
              <div key={c._id} className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-sans text-sm text-ink dark:text-paper">{c.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-ink/40 dark:text-paper/40">Room {tenantRoom(c)} | {tenantName(c).split(' ')[0]}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
        <h2 className="font-display text-base font-medium text-ink dark:text-paper">Recent payments</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="font-sans text-xs uppercase tracking-wide text-ink/40 dark:text-paper/40">
                <th className="pb-3 font-medium">Tenant</th>
                <th className="pb-3 font-medium">Room</th>
                <th className="pb-3 font-medium">Month</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Paid on</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-ink/80 dark:text-paper/80">
              {recentPayments.map((r) => (
                <tr key={r._id} className="border-t border-ink/5 dark:border-paper/5">
                  <td className="py-3">{tenantName(r)}</td>
                  <td className="py-3 font-mono text-xs text-ink/50 dark:text-paper/50">{tenantRoom(r)}</td>
                  <td className="py-3 font-mono text-xs text-ink/50 dark:text-paper/50">{r.month}</td>
                  <td className="py-3 font-mono font-medium text-ink dark:text-paper">{formatCurrency(r.amount)}</td>
                  <td className="py-3 font-mono text-xs text-ink/50 dark:text-paper/50">{r.paidOn ? new Date(r.paidOn).toISOString().slice(0, 10) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
