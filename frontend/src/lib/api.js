const API_BASE_URL = 'https://nestwell.onrender.com/api'
const AUTH_STORAGE_KEY = 'nestwell-auth'

function getToken() {
  try {
    const stored = window.localStorage.getItem(AUTH_STORAGE_KEY)
    return stored ? JSON.parse(stored)?.token : null
  } catch {
    return null
  }
}

export async function api(path, options = {}) {
  const token = getToken()
  const headers = {
    ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...options.headers,
  }

  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })
  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.message || 'Request failed.')
  }

  return data
}

export const authApi = {
  register: (payload) => api('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => api('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => api('/auth/me'),
  avatar: (avatar) => api('/auth/avatar', { method: 'PATCH', body: JSON.stringify({ avatar }) }),
  forgotPassword: (payload) => api('/auth/forgot-password', { method: 'POST', body: JSON.stringify(payload) }),
  resetPassword: (token, payload) => api(`/auth/reset-password/${token}`, { method: 'POST', body: JSON.stringify(payload) }),
  googleLogin: (payload) => api('/auth/google', { method: 'POST', body: JSON.stringify(payload) }),
  facebookLogin: (payload) => api('/auth/facebook', { method: 'POST', body: JSON.stringify(payload) }),
}

export const roomsApi = {
  list: () => api('/rooms'),
  create: (payload) => api('/rooms', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/rooms/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => api(`/rooms/${id}`, { method: 'DELETE' }),
}

export const tenantsApi = {
  list: () => api('/tenants'),
  mine: () => api('/tenants/me'),
  create: (payload) => api('/tenants', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/tenants/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => api(`/tenants/${id}`, { method: 'DELETE' }),
}

export const rentApi = {
  list: () => api('/rent'),
  mine: () => api('/rent/me'),
  create: (payload) => api('/rent', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/rent/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => api(`/rent/${id}`, { method: 'DELETE' }),
}

export const complaintsApi = {
  list: () => api('/complaints'),
  mine: () => api('/complaints/me'),
  createMine: (payload) => api('/complaints/me', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/complaints/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => api(`/complaints/${id}`, { method: 'DELETE' }),
}

export const adminsApi = {
  list: () => api('/admins'),
  create: (payload) => api('/admins', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => api(`/admins/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => api(`/admins/${id}`, { method: 'DELETE' }),
}
