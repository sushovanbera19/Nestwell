import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Camera, Loader2 } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { initials, avatarTint, fileToDataUrl } from '../../lib/utils'

export default function Profile() {
  const { auth, updateAvatar } = useAuth()
  const [name, setName] = useState(auth?.name || '')
  const [email, setEmail] = useState(auth?.email || '')
  const [phone, setPhone] = useState('+91 98450 11223')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [saved, setSaved] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2200)
  }

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    setUploadError('')
    setUploading(true)
    try {
      const dataUrl = await fileToDataUrl(file)
      await updateAvatar(dataUrl)
    } catch (err) {
      setUploadError(err.message || 'Could not upload that image.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-white p-5 shadow-card dark:border-paper/10 dark:bg-ink-soft"
      >
        <div className="group relative">
          <span
            className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full font-sans text-lg font-semibold text-paper"
            style={{ backgroundColor: auth?.avatar ? 'transparent' : avatarTint(name || 'Tenant') }}
          >
            {auth?.avatar ? (
              <img src={auth.avatar} alt={name || 'Profile'} className="h-full w-full object-cover" />
            ) : (
              initials(name || 'Tenant')
            )}
          </span>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            title="Change photo"
            className="absolute inset-0 flex items-center justify-center rounded-full bg-ink/50 text-paper opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-wait"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
        </div>
        <div>
          <h2 className="font-display text-lg font-medium text-ink dark:text-paper">{name || 'Your profile'}</h2>
          <p className="font-sans text-xs text-ink/50 dark:text-paper/50">
            Room {auth?.room || '101'} · {auth?.pg || 'Riverside PG'}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-1.5 font-sans text-xs font-medium text-teal-deep hover:underline disabled:opacity-60 dark:text-teal"
          >
            {uploading ? 'Uploading…' : 'Change photo'}
          </button>
          {uploadError && <p className="mt-1 font-sans text-[11px] text-rose">{uploadError}</p>}
        </div>
      </motion.div>

      <motion.form
        onSubmit={handleSave}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl border border-ink/10 bg-white p-6 shadow-card dark:border-paper/10 dark:bg-ink-soft"
      >
        <h3 className="mb-5 font-display text-base font-medium text-ink dark:text-paper">
          Update your details
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-ink/60 dark:text-paper/60">Full name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="w-full rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-ink/60 dark:text-paper/60">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="w-full rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-ink/60 dark:text-paper/60">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="text"
              className="w-full rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-ink/60 dark:text-paper/60">Emergency contact</label>
            <input
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              type="text"
              placeholder="+91 90000 00000"
              className="w-full rounded-lg border border-ink/10 bg-white px-4 py-2.5 font-sans text-sm text-ink focus:border-teal focus:outline-none dark:border-paper/10 dark:bg-ink dark:text-paper"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          {saved && (
            <motion.span
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1.5 font-sans text-xs font-medium text-teal-deep"
            >
              <Check className="h-3.5 w-3.5" /> Saved
            </motion.span>
          )}
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="rounded-lg bg-teal px-5 py-2.5 text-sm font-medium text-ink hover:bg-teal-deep"
          >
            Save changes
          </motion.button>
        </div>
      </motion.form>
    </div>
  )
}
