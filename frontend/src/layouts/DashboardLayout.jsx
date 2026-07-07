import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import { useAuth, ROLES } from '../context/AuthContext'

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your property, today' },
  '/rooms': { title: 'Rooms', subtitle: 'Manage room inventory and occupancy' },
  '/tenants': { title: 'Tenants', subtitle: 'Everyone currently checked in' },
  '/rent': { title: 'Rent', subtitle: 'Track collections and dues' },
  '/complaints': { title: 'Complaints', subtitle: 'Maintenance and tenant requests' },
  '/admins': { title: 'Manage Admins', subtitle: 'Create admins and assign them to a PG' },
  '/my-complaints': { title: 'Complaints', subtitle: 'Raise issues and track their status' },
  '/profile': { title: 'Profile', subtitle: 'Update your personal details' },
}

const tenantHomeMeta = { title: 'My Room', subtitle: 'Your room, rent and stay details' }

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const { role } = useAuth()
  const meta =
    location.pathname === '/' && role === ROLES.TENANT
      ? tenantHomeMeta
      : pageMeta[location.pathname] || { title: 'Nestwell' }

  return (
    <div className="min-h-screen bg-paper transition-colors dark:bg-ink lg:flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <Topbar title={meta.title} subtitle={meta.subtitle} onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 px-6 py-6">
          <motion.div
            key={location.pathname + location.search}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  )
}
