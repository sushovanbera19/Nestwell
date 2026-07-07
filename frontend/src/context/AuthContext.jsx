import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../lib/api'

const AuthContext = createContext(null)

// Roles supported by the app. This is a frontend-only simulation of
// role-based access — there is no backend, so "login" simply stores
// the chosen identity in localStorage.
export const ROLES = {
  SUPER_ADMIN: 'superadmin',
  ADMIN: 'admin',
  TENANT: 'tenant',
}

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Admin',
  [ROLES.TENANT]: 'Tenant',
}

const demoUsers = {
  [ROLES.SUPER_ADMIN]: { name: 'Owais Ahmed', email: 'owais@nestwell.app', pg: 'All Properties' },
  [ROLES.ADMIN]: { name: 'Admin User', email: 'admin@nestwell.app', pg: 'Riverside PG' },
  [ROLES.TENANT]: { name: 'Ananya Rao', email: 'ananya.rao@mail.com', pg: 'Riverside PG', room: '101' },
}

function getInitialAuth() {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem('nestwell-auth')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth)
  const [checkingSession, setCheckingSession] = useState(Boolean(auth?.token))

  useEffect(() => {
    if (auth) {
      window.localStorage.setItem('nestwell-auth', JSON.stringify(auth))
    } else {
      window.localStorage.removeItem('nestwell-auth')
    }
  }, [auth])

  useEffect(() => {
    let ignore = false

    async function restoreSession() {
      if (!auth?.token) {
        setCheckingSession(false)
        return
      }

      try {
        const { user } = await authApi.me()
        if (!ignore) setAuth((prev) => ({ token: prev.token, ...user }))
      } catch {
        if (!ignore) setAuth(null)
      } finally {
        if (!ignore) setCheckingSession(false)
      }
    }

    restoreSession()

    return () => {
      ignore = true
    }
  }, [])

  const login = async ({ role, email, password }) => {
    const { token, user } = await authApi.login({ role, email, password })
    setAuth({ token, ...user })
    return user
  }

  const setAuthDirect = ({ token, user }) => {
    setAuth({ token, ...user })
  }

  const logout = () => setAuth(null)

  // Profile image upload setting — stores a data URL on the current
  // session's auth object. Persistence is already handled by the
  // effect above, since it saves the whole `auth` object whenever it changes.
  const updateAvatar = async (avatarDataUrl) => {
    const { user } = await authApi.avatar(avatarDataUrl)
    setAuth((prev) => (prev ? { ...prev, ...user } : prev))
  }

  return (
    <AuthContext.Provider value={{ auth, role: auth?.role || null, login, setAuthDirect, logout, updateAvatar, checkingSession }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
