import { apiRequest, setToken, clearToken, getToken } from '../lib/api'

export async function register({ name, email, password }) {
  const { token, user } = await apiRequest('/auth/register', {
    method: 'POST',
    body: { name, email, password },
    auth: false,
  })
  setToken(token)
  return user
}

export async function login({ email, password }) {
  const { token, user } = await apiRequest('/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  })
  setToken(token)
  return user
}

export function logout() {
  clearToken()
}

export async function me() {
  if (!getToken()) return null
  try {
    const { user } = await apiRequest('/auth/me')
    return user
  } catch {
    clearToken()
    return null
  }
}

export async function changePassword(currentPassword, newPassword) {
  await apiRequest('/auth/change-password', {
    method: 'POST',
    body: { currentPassword, newPassword },
  })
}
