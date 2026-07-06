import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { DoorOpen, Wallet, CalendarClock, Users } from 'lucide-react'
import StatusBadge from '../../components/StatusBadge'
import { formatCurrency } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'
import { rentApi, tenantsApi } from '../../lib/api'

export default function TenantDashboard() {
  const { auth } = useAuth()
  const [tenant, setTenant] = useState(null)
  const [rentRecords, setRentRecords] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTenantDashboard() {
      try {
        const [tenantRecord, rent] = await Promise.all([tenantsApi.mine(), rentApi.mine()])
        setTenant(tenantRecord)
        setRentRecords(rent)
      } catch (err) {
        setError(err.message)
      }
    }
    loadTenantDashboard()
  }, [])

  const latestRent = useMemo(() => rentRecords[0], [rentRecords])

  return (
    <div className="space-y-6">
      {error && <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">{error}</p>}

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">Welcome back</p>
            <h2 className="mt-1 font-display text-xl font-medium text-ink dark:text-paper">{auth?.name || 'Tenant'}</h2>
          </div>
          {latestRent && <StatusBadge status={latestRent.status} />}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: DoorOpen, label: 'Room number', value: tenant?.room || auth?.room || '-' },
          { icon: Users, label: 'PG', value: tenant?.pg || auth?.pg || '-' },
          { icon: Wallet, label: 'Latest rent', value: latestRent ? formatCurrency(latestRent.amount) : '-' },
          { icon: CalendarClock, label: 'Rent due date', value: latestRent?.dueDate ? new Date(latestRent.dueDate).toISOString().slice(0, 10) : '-' },
        ].map(({ icon: Icon, label, value }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 * i }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-mist text-teal-deep dark:bg-teal/10"><Icon className="h-4.5 w-4.5" strokeWidth={2} /></span>
            <div className="mt-4 font-display text-xl font-medium text-ink dark:text-paper">{value}</div>
            <div className="mt-1 font-sans text-xs text-ink/50 dark:text-paper/50">{label}</div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft">
        <h2 className="font-display text-base font-medium text-ink dark:text-paper">Rent history</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="font-sans text-xs uppercase tracking-wide text-ink/40 dark:text-paper/40">
                <th className="pb-3 font-medium">Month</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Paid on</th>
              </tr>
            </thead>
            <tbody className="font-sans text-sm text-ink/80 dark:text-paper/80">
              {rentRecords.map((r) => (
                <tr key={r._id} className="border-t border-ink/5 dark:border-paper/5">
                  <td className="py-3 font-mono text-xs text-ink/50 dark:text-paper/50">{r.month}</td>
                  <td className="py-3 font-mono font-medium text-ink dark:text-paper">{formatCurrency(r.amount)}</td>
                  <td className="py-3"><StatusBadge status={r.status} /></td>
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
