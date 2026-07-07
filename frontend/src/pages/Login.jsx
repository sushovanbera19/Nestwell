import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ShieldCheck, UserCog, User2 } from 'lucide-react'
import { useAuth, ROLES } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

const roleOptions = [
  {
    role: ROLES.SUPER_ADMIN,
    icon: ShieldCheck,
    title: 'Super Admin',
    description: 'Create admins. Manage all PGs, rooms, tenants, rents & complaints. View everything.',
  },
  {
    role: ROLES.ADMIN,
    icon: UserCog,
    title: 'Admin',
    description: 'Manage only your assigned PG — add/edit rooms & tenants, manage rent and complaints.',
  },
  {
    role: ROLES.TENANT,
    icon: User2,
    title: 'User / Tenant',
    description: 'View your room details and rent status, raise complaints, update your profile.',
  },
]

export default function Login() {
  const { role } = useAuth()
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  if (role) {
    return <Navigate to="/" replace />
  }

  const handleContinue = () => {
    if (!selected) return
    if (selected === ROLES.SUPER_ADMIN || selected === ROLES.ADMIN) {
      navigate('/signin', { state: { role: selected } })
    } else {
      navigate('/register', { state: { role: selected } })
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-paper px-4 py-10 transition-colors dark:bg-ink">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-xl rounded-2xl border border-ink/10 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-ink-soft sm:p-8"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal">
            <Home className="h-4.5 w-4.5 text-ink" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-medium text-ink dark:text-paper">Nestwell</span>
        </div>

        <h1 className="mt-6 font-display text-2xl font-medium text-ink dark:text-paper">
          Sign in to continue
        </h1>
        <p className="mt-1 font-sans text-sm text-ink/50 dark:text-paper/50">
          Super admin &amp; admin accounts are created by your system administrator. Sign in below, or register as a tenant.
        </p>

        <div className="mt-6 space-y-3">
          {roleOptions.map(({ role: r, icon: Icon, title, description }, i) => {
            const isSelected = selected === r
            return (
              <motion.button
                key={r}
                type="button"
                onClick={() => setSelected(r)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i }}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.99 }}
                className={`flex w-full items-start gap-3.5 rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? 'border-teal bg-teal-mist/60 dark:bg-teal/10'
                    : 'border-ink/10 hover:border-ink/25 dark:border-paper/10 dark:hover:border-paper/25'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    isSelected ? 'bg-teal text-ink' : 'bg-paper text-ink/60 dark:bg-ink dark:text-paper/60'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" strokeWidth={2} />
                </span>
                <span>
                  <span className="block font-display text-base font-medium text-ink dark:text-paper">
                    {title}
                  </span>
                  <span className="mt-0.5 block font-sans text-xs text-ink/50 dark:text-paper/50">
                    {description}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          disabled={!selected}
          onClick={handleContinue}
          className="mt-6 w-full rounded-lg bg-ink px-4 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal dark:text-ink dark:hover:bg-teal-deep"
        >
          Continue
        </motion.button>

        <p className="mt-4 text-center font-sans text-xs text-ink/50 dark:text-paper/50">
          <Link to="/forgot-password" className="font-medium text-teal-deep transition-colors hover:text-teal dark:text-teal dark:hover:text-teal-mist">
            Forgot password?
          </Link>
        </p>
      </div>
  )
}
