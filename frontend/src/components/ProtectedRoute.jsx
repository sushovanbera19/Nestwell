import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Wraps a route element and only renders it if the logged-in user's role
// is included in `allow`. Unauthenticated users are sent to /login,
// authenticated-but-unauthorized users are sent to their own home page.
export default function ProtectedRoute({ allow, children }) {
  const { role, checkingSession } = useAuth()

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper font-sans text-sm text-ink/50 dark:bg-ink dark:text-paper/50">
        Loading session...
      </div>
    )
  }

  if (!role) {
    return <Navigate to="/login" replace />
  }

  if (allow && !allow.includes(role)) {
    return <Navigate to="/" replace />
  }

  return children
}
