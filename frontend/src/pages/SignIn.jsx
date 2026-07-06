import { useState } from 'react'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { useAuth, ROLE_LABELS } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

export default function SignIn() {
  const { role: activeRole, login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const role = location.state?.role

  const [form, setForm] = useState({ email: location.state?.email || '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (activeRole) {
    return <Navigate to="/" replace />
  }
  if (!role) {
    return <Navigate to="/login" replace />
  }

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setSubmitting(true)
      await login({ role, email: form.email, password: form.password })
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
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

        <Link
          to="/login"
          className="mt-6 inline-flex items-center gap-1.5 font-sans text-xs font-medium text-ink/50 transition-colors hover:text-teal-deep dark:text-paper/50 dark:hover:text-teal"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to role selection
        </Link>

        <h1 className="mt-3 font-display text-2xl font-medium text-ink dark:text-paper">
          Sign in as {ROLE_LABELS[role]}
        </h1>
        <p className="mt-1 font-sans text-sm text-ink/50 dark:text-paper/50">
          Enter the credentials you just registered with to open the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block font-sans text-xs font-medium text-ink/60 dark:text-paper/60">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-ink/10 bg-paper px-3.5 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-teal dark:border-paper/10 dark:bg-ink dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-xs font-medium text-ink/60 dark:text-paper/60">
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ink/10 bg-paper px-3.5 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-teal dark:border-paper/10 dark:bg-ink dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-soft px-3.5 py-2.5 font-sans text-xs font-medium text-rose">
              {error}
            </p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 w-full rounded-lg bg-ink px-4 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-teal-deep dark:bg-teal dark:text-ink dark:hover:bg-teal-deep"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>

        <p className="mt-5 text-center font-sans text-xs text-ink/50 dark:text-paper/50">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            state={{ role }}
            className="font-medium text-teal-deep transition-colors hover:text-teal dark:text-teal dark:hover:text-teal-mist"
          >
            Register first
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
