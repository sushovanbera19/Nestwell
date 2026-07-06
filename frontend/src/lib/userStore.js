// Frontend-only demo "database" for the register -> sign-in gate that now
// sits in front of each role's dashboard. This does NOT touch AuthContext
// or its existing login()/logout() logic — it only decides whether someone
// is allowed to reach the point of calling login(role).
const STORAGE_KEY = 'nestwell-registered-users'

function readAll() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeAll(users) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function findUser(role, email) {
  const normalized = email.trim().toLowerCase()
  return readAll().find((u) => u.role === role && u.email === normalized) || null
}

export function registerUser({ role, name, email, phone, password }) {
  const normalized = email.trim().toLowerCase()
  const users = readAll()

  if (users.some((u) => u.role === role && u.email === normalized)) {
    return { ok: false, error: 'An account with this email already exists for this role.' }
  }

  const user = { role, name: name.trim(), email: normalized, phone: phone.trim(), password }
  users.push(user)
  writeAll(users)
  return { ok: true, user }
}

export function verifyUser({ role, email, password }) {
  const user = findUser(role, email)
  if (!user) {
    return { ok: false, error: 'No account found for this role and email. Please register first.' }
  }
  if (user.password !== password) {
    return { ok: false, error: 'Incorrect password. Please try again.' }
  }
  return { ok: true, user }
}
