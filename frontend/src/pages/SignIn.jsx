import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useLocation, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'
import { useAuth, ROLES, ROLE_LABELS } from '../context/AuthContext'
import ThemeToggle from '../components/ThemeToggle'
import { authApi } from '../lib/api'

export default function SignIn() {
  const { role: activeRole, login, setAuthDirect } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const role = location.state?.role
  const googleBtnRef = useRef(null)

  const [form, setForm] = useState({ email: location.state?.email || '', password: '' })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isSuperAdmin = role === ROLES.SUPER_ADMIN

  useEffect(() => {
    if (isSuperAdmin) return
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (clientId && window.google?.accounts?.id) {
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleGoogleCredential })
      if (googleBtnRef.current) {
        window.google.accounts.id.renderButton(googleBtnRef.current, { type: 'standard', shape: 'pill', text: 'continue_with', width: 280 })
      }
    }
    if (!window.FB) {
      const fbRoot = document.getElementById('fb-root') || document.body
      const script = document.createElement('script')
      script.src = 'https://connect.facebook.net/en_US/sdk.js'
      script.async = true
      script.defer = true
      script.crossOrigin = 'anonymous'
      script.onload = () => {
        window.FB.init({ appId: import.meta.env.VITE_FACEBOOK_APP_ID || '', version: 'v19.0', xfbml: true })
      }
      fbRoot.appendChild(script)
    } else {
      window.FB.init({ appId: import.meta.env.VITE_FACEBOOK_APP_ID || '', version: 'v19.0', xfbml: true })
    }
  }, [role])

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

  const handleGoogleCredential = async (response) => {
    try {
      setSubmitting(true)
      const data = await authApi.googleLogin({ credential: response.credential, role })
      setAuthDirect(data)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFacebookLogin = () => {
    window.FB.login(async (fbResponse) => {
      if (!fbResponse.authResponse) return
      try {
        setSubmitting(true)
        const data = await authApi.facebookLogin({ accessToken: fbResponse.authResponse.accessToken, role })
        setAuthDirect(data)
        navigate('/', { replace: true })
      } catch (err) {
        setError(err.message)
      } finally {
        setSubmitting(false)
      }
    }, { scope: 'email,public_profile' })
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
          Enter your credentials to access the dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block font-sans text-xs font-medium text-ink/60 dark:text-paper/60">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={update('email')}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-ink/10 bg-paper px-3.5 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-teal dark:border-paper/10 dark:bg-ink dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>
          <div>
            <label className="mb-1.5 block font-sans text-xs font-medium text-ink/60 dark:text-paper/60">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
              className="w-full rounded-lg border border-ink/10 bg-paper px-3.5 py-2.5 font-sans text-sm text-ink outline-none transition-colors placeholder:text-ink/30 focus:border-teal dark:border-paper/10 dark:bg-ink dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="font-sans text-xs font-medium text-teal-deep transition-colors hover:text-teal dark:text-teal dark:hover:text-teal-mist"
            >
              Forgot password?
            </Link>
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
            {submitting ? 'Signing in...' : 'Sign in'}
          </motion.button>
        </form>

        {!isSuperAdmin && (
          <div className="mt-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-ink/10 dark:border-paper/10" />
              </div>
              <div className="relative flex justify-center text-xs font-sans">
                <span className="bg-white px-3 text-ink/40 dark:bg-ink-soft dark:text-paper/40">or continue with</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <div ref={googleBtnRef} id="google-signin-btn" className="flex justify-center" />
              <button
                type="button"
                onClick={handleFacebookLogin}
                disabled={submitting}
                className="flex items-center justify-center gap-2.5 rounded-lg border border-ink/10 bg-white px-6 py-2.5 font-sans text-sm font-medium text-ink transition-colors hover:bg-paper dark:border-paper/10 dark:bg-ink-soft dark:text-paper dark:hover:bg-ink"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </div>
        )}

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
