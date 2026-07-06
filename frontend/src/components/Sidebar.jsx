import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Wallet,
  MessageSquareWarning,
  Home,
  X,
  ShieldCheck,
  UserCircle2,
} from 'lucide-react'
import { useAuth, ROLES, ROLE_LABELS } from '../context/AuthContext'

const adminLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/rooms', label: 'Rooms', icon: DoorOpen },
  { to: '/tenants', label: 'Tenants', icon: Users },
  { to: '/rent', label: 'Rent', icon: Wallet },
  { to: '/complaints', label: 'Complaints', icon: MessageSquareWarning },
]

const superAdminLinks = [...adminLinks, { to: '/admins', label: 'Manage Admins', icon: ShieldCheck }]

const tenantLinks = [
  { to: '/', label: 'My Room', icon: LayoutDashboard, end: true },
  { to: '/my-complaints', label: 'Complaints', icon: MessageSquareWarning },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
]

export default function Sidebar({ open, onClose }) {
  const { role } = useAuth()

  const links = role === ROLES.SUPER_ADMIN ? superAdminLinks : role === ROLES.TENANT ? tenantLinks : adminLinks

  return (
    <>
      {/* mobile scrim */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.25 }}
        className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-ink px-4 py-6 lg:translate-x-0"
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal">
              <Home className="h-4 w-4 text-ink" strokeWidth={2.5} />
            </div>
            <span className="font-display text-lg font-medium text-paper">Nestwell</span>
          </div>
          <button onClick={onClose} className="text-paper/60 lg:hidden" aria-label="Close menu">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex items-center gap-3 rounded-lg px-3 py-2.5 font-sans text-sm transition-colors ${isActive
                  ? 'bg-ink-soft text-paper'
                  : 'text-paper/60 hover:bg-ink-soft/60 hover:text-paper'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 h-full w-0.5 rounded-full bg-teal"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="rounded-xl bg-ink-soft p-4">
          <p className="font-sans text-xs font-medium text-paper">Riverside PG</p>
          <p className="mt-1 font-mono text-[11px] text-paper/50">
            {role ? ROLE_LABELS[role] : '12 rooms · 3 floors'}
          </p>
        </div>
      </motion.aside>
    </>
  )
}
