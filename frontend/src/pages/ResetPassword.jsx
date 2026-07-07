import { useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Lock, CheckCircle } from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'
import { authApi } from '../lib/api'
import { useAuth } from '../context/AuthContext'

export default function ResetPassword() {
  const { token } = useParams()
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') || ''
  const navigate = useNavigate()
  const { login } = useAuth()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password || password.length < 4) {
      setError('Password must be at least 4 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    try {
      setSubmitting(true)
      const { token: jwt, user } = await authApi.resetPassword(token, { password })
      await login({ role: user.role, email: user.email, password })
      setDone(true)
      setTimeout(() => navigate('/', { replace: true }), 1500)
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
        className="w-full max-w-md rounded-2xl border border-ink/10 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-ink-soft sm:p-8"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal">
            <Home className="h-4.5 w-4.5 text-ink" strokeWidth={2.5} />
          </div>
          <span className="font-display text-xl font-medium text-ink dark:text-paper">Nestwell</span>
        </div>

        {done ? (
          <div className="mt-8 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-teal-deep" strokeWidth={1.5} />
            <h1 className="mt-4 font-display text-xl font-medium text-ink dark:text-paper">Password reset!</h1>
            <p className="mt-2 font-sans text-sm text-ink/50 dark:text-paper/50">Redirecting to dashboard...</p>
          </div>
        ) : (
          <>
            <h1 className="mt-6 font-display text-2xl font-medium text-ink dark:text-paper">Reset password</h1>
            <p className="mt-1 font-sans text-sm text-ink/50 dark:text-paper/50">
              {email ? `Set a new password for ${email}` : 'Enter your new password.'}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1.5 block font-sans text-xs font-medium text-ink/60 dark:text-paper/60">New password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30 dark:text-paper/30" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-ink/10 bg-paper pl-10 pr-3.5 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-teal dark:border-paper/10 dark:bg-ink dark:text-paper dark:placeholder:text-paper/30"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block font-sans text-xs font-medium text-ink/60 dark:text-paper/60">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/30 dark:text-paper/30" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-ink/10 bg-paper pl-10 pr-3.5 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-teal dark:border-paper/10 dark:bg-ink dark:text-paper dark:placeholder:text-paper/30"
                  />
                </div>
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
                className="mt-2 w-full rounded-lg bg-ink px-4 py-3 font-sans text-sm font-medium text-paper transition-colors hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40 dark:bg-teal dark:text-ink dark:hover:bg-teal-deep"
              >
                {submitting ? 'Resetting...' : 'Reset password'}
              </motion.button>
            </form>

            <p className="mt-5 text-center font-sans text-xs text-ink/50 dark:text-paper/50">
              <Link to="/login" className="font-medium text-teal-deep transition-colors hover:text-teal dark:text-teal dark:hover:text-teal-mist">
                Back to login
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  )
}
