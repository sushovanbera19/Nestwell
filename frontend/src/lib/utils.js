export function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`
}

export function initials(name) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

// deterministic pastel-teal-ish avatar tint from a string, kept within the brand palette
const avatarTints = ['#76ABAE', '#5C8F92', '#9BC2C4', '#3F5960', '#A8CBCD']
export function avatarTint(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  return avatarTints[Math.abs(hash) % avatarTints.length]
}

// Reads an uploaded image file and resolves with a base64 data URL,
// used by the profile photo upload setting (no backend, so the image
// is kept in-memory/localStorage as a data URL).
const MAX_AVATAR_BYTES = 3 * 1024 * 1024 // 3MB

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected.'))
      return
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'))
      return
    }
    if (file.size > MAX_AVATAR_BYTES) {
      reject(new Error('Image is too large — please pick one under 3MB.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read that image.'))
    reader.readAsDataURL(file)
  })
}
