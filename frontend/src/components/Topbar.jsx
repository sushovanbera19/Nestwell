import { useRef, useState } from 'react'
import { Menu, Search, Bell, LogOut, Camera, Loader2 } from 'lucide-react'
import { initials, fileToDataUrl } from '../lib/utils'
import { useAuth, ROLE_LABELS } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'

export default function Topbar({ title, subtitle, onMenuClick }) {
  const { auth, role, logout, updateAvatar } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = '' // allow re-selecting the same file later
    if (!file) return

    setUploadError('')
    setUploading(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      updateAvatar(dataUrl)
    } catch (err) {
      setUploadError(err.message || 'Could not upload that image.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-ink/10 bg-paper/90 px-6 py-4 backdrop-blur transition-colors dark:border-paper/10 dark:bg-ink/90">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-ink dark:text-paper lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="font-display text-xl font-medium text-ink dark:text-paper">{title}</h1>
          {subtitle && <p className="font-sans text-xs text-ink/50 dark:text-paper/50">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white px-3.5 py-2 dark:border-paper/10 dark:bg-ink-soft sm:flex">
          <Search className="h-4 w-4 text-ink/40 dark:text-paper/40" />
          <input
            type="text"
            placeholder="Search rooms, tenants..."
            className="w-40 bg-transparent font-sans text-sm text-ink placeholder:text-ink/40 focus:outline-none dark:text-paper dark:placeholder:text-paper/40 lg:w-56"
          />
        </div>

        <ThemeToggle />

        <button className="relative text-ink/60 hover:text-ink dark:text-paper/60 dark:hover:text-paper" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((m) => !m)}
            className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-teal font-sans text-xs font-semibold text-ink"
            title={auth?.name || 'Account'}
          >
            {auth?.avatar ? (
              <img src={auth.avatar} alt={auth?.name || 'Account'} className="h-full w-full object-cover" />
            ) : (
              initials(auth?.name || 'Admin User')
            )}
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 top-11 z-40 w-56 overflow-hidden rounded-xl border border-ink/10 bg-white py-1.5 shadow-card dark:border-paper/10 dark:bg-ink-soft"
              onMouseLeave={() => setMenuOpen(false)}
            >
              <div className="flex items-center gap-3 border-b border-ink/5 px-3.5 py-2.5 dark:border-paper/5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal font-sans text-xs font-semibold text-ink">
                  {auth?.avatar ? (
                    <img src={auth.avatar} alt={auth?.name || 'Account'} className="h-full w-full object-cover" />
                  ) : (
                    initials(auth?.name || 'Admin User')
                  )}
                </span>
                <div className="min-w-0">
                  <p className="truncate font-sans text-sm font-medium text-ink dark:text-paper">{auth?.name || 'Admin User'}</p>
                  <p className="font-mono text-[11px] text-ink/40 dark:text-paper/40">
                    {role ? ROLE_LABELS[role] : ''}
                  </p>
                </div>
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 font-sans text-sm text-ink/80 hover:bg-paper disabled:cursor-wait disabled:opacity-60 dark:text-paper/80 dark:hover:bg-ink"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                {uploading ? 'Uploading…' : 'Update photo'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
              {uploadError && (
                <p className="px-3.5 pb-1.5 font-sans text-[11px] text-rose">{uploadError}</p>
              )}

              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3.5 py-2.5 font-sans text-sm text-rose hover:bg-rose-soft/50"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
