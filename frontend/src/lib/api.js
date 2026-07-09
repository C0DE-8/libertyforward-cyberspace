export const apiBaseUrl = import.meta.env.VITE_API_URL || ''

export function getAdminToken() {
  return window.localStorage.getItem('lfc-admin-token') || ''
}

export function setAdminToken(token) {
  if (token) {
    window.localStorage.setItem('lfc-admin-token', token)
  } else {
    window.localStorage.removeItem('lfc-admin-token')
  }
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers,
  })

  const payload = await response.json()

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed')
  }

  return payload
}

export async function getSettings() {
  const payload = await apiRequest('/api/settings')
  return {
    wallets: payload.wallets,
    tiers: payload.tiers,
    portal: payload.portal || { telegramUrl: '' },
  }
}

export async function getPortalTelegramUrl() {
  const settings = await getSettings()
  return settings.portal?.telegramUrl || ''
}

export async function createCase(data) {
  return apiRequest('/api/cases', { method: 'POST', body: JSON.stringify(data) })
}

export async function getCaseByReference(reference) {
  return apiRequest(`/api/cases/${encodeURIComponent(reference)}`)
}

export async function submitPayment(reference, data) {
  return apiRequest(`/api/cases/${encodeURIComponent(reference)}/payment`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function adminLogin(email, password) {
  return apiRequest('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getAdminCases() {
  return apiRequest('/api/admin/cases', {
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  })
}

export async function updatePaymentStatus(id, paymentStatus, options = {}) {
  return apiRequest(`/api/admin/cases/${id}/payment-status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify({ paymentStatus, clearPayment: Boolean(options.clearPayment) }),
  })
}

export async function updatePaymentDetails(id, data) {
  return apiRequest(`/api/admin/cases/${id}/payment-details`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify(data),
  })
}

export async function deleteCase(id) {
  return apiRequest(`/api/admin/cases/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
  })
}

export async function updateWallet(key, data) {
  return apiRequest(`/api/admin/wallets/${key}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify(data),
  })
}

export async function updatePortalSettings(data) {
  return apiRequest('/api/admin/portal-settings', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify(data),
  })
}

export async function updateTier(key, data) {
  return apiRequest(`/api/admin/tiers/${key}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${getAdminToken()}` },
    body: JSON.stringify(data),
  })
}
