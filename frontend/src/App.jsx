import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './layouts/DashboardLayout'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth, ROLES } from './context/AuthContext'

import Login from './pages/Login'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Rooms from './pages/Rooms'
import Tenants from './pages/Tenants'
import Rent from './pages/Rent'
import Complaints from './pages/Complaints'
import ManageAdmins from './pages/ManageAdmins'
import TenantDashboard from './pages/tenant/TenantDashboard'
import TenantComplaints from './pages/tenant/TenantComplaints'
import Profile from './pages/tenant/Profile'

// The home route ("/") renders a different page depending on the
// logged-in role: Super Admin / Admin see the property Dashboard,
// while a Tenant/User sees their own room overview.
function Home() {
  const { role } = useAuth()
  return role === ROLES.TENANT ? <TenantDashboard /> : <Dashboard />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Home />} />

        {/* Super Admin + Admin only */}
        <Route
          path="/rooms"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <Rooms />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenants"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <Tenants />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rent"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <Rent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/complaints"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN, ROLES.ADMIN]}>
              <Complaints />
            </ProtectedRoute>
          }
        />

        {/* Super Admin only */}
        <Route
          path="/admins"
          element={
            <ProtectedRoute allow={[ROLES.SUPER_ADMIN]}>
              <ManageAdmins />
            </ProtectedRoute>
          }
        />

        {/* Tenant / User only */}
        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute allow={[ROLES.TENANT]}>
              <TenantComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allow={[ROLES.TENANT]}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
