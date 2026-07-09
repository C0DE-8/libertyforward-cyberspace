import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import db from '../db.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const DEFAULT_TIERS = [
  ['tier-1', 'Citizen Intake Review', 1, 49, 'Initial scam case review, public transaction assessment, and official reference issuance.'],
  ['tier-2', 'Standard Scam Recovery', 2, 149, 'Full on-chain trace report, scammer wallet mapping, and exchange documentation package.'],
  ['tier-3', 'Priority Case Escalation', 3, 349, 'Expedited review, dedicated case officer, and law enforcement evidence pack.'],
  ['tier-4', 'Executive Multi-Agency', 4, 899, 'Highest priority — cross-border coordination, multi-chain tracing, and agency escalation.'],
  ['tier-5', 'High-Value Loss Recovery', 5, 2499, 'For losses exceeding $50,000 — full forensic package and sworn affidavit support.'],
  ['tier-6', 'Critical Emergency Response', 6, 4999, '24-hour response for active or recent losses with direct officer contact.'],
]

const DEFAULT_WALLETS = [
  ['btc', 'Bitcoin Treasury Wallet', 'BTC', 'Bitcoin Mainnet', 'bc1qLFC_TREASURY_BTC_WALLET_ADDRESS'],
  ['eth', 'Ethereum Treasury Wallet', 'ETH / USDT / USDC', 'Ethereum ERC-20', '0xLFC_TREASURY_ETH_WALLET_ADDRESS'],
  ['bnb', 'BNB Smart Chain Treasury', 'BNB / USDT / USDC', 'BEP-20', '0xLFC_TREASURY_BNB_WALLET_ADDRESS'],
  ['sol', 'Solana Treasury Wallet', 'SOL / USDC', 'Solana', 'LFC_TREASURY_SOL_WALLET_ADDRESS'],
  ['tron', 'Tron USDT Treasury', 'USDT', 'TRC-20', 'LFC_TREASURY_TRON_USDT_ADDRESS'],
  ['xrp', 'XRP Treasury Wallet', 'XRP', 'XRP Ledger', 'rLFC_TREASURY_XRP_WALLET_ADDRESS'],
  ['doge', 'Dogecoin Treasury Wallet', 'DOGE', 'Dogecoin', 'DLFC_TREASURY_DOGE_WALLET_ADDRESS'],
  ['ltc', 'Litecoin Treasury Wallet', 'LTC', 'Litecoin', 'ltc1qLFC_TREASURY_LTC_WALLET_ADDRESS'],
]

async function setup() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')
  const statements = schema
    .split(';')
    .map((s) => s.trim())
    .filter((statement) => {
      return (
        statement &&
        !/^CREATE\s+DATABASE\b/i.test(statement) &&
        !/^USE\b/i.test(statement)
      )
    })

  for (const statement of statements) {
    await db.execute(statement)
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@libertyforward.gov'
  const adminPassword = process.env.ADMIN_PASSWORD || 'liberty2024'
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  await db.execute(
    `INSERT INTO admin_users (email, password_hash)
     VALUES (?, ?)
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
    [adminEmail, passwordHash],
  )

  for (const tier of DEFAULT_TIERS) {
    await db.execute(
      `INSERT INTO service_tiers (tier_key, name, level, fee, description)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), level = VALUES(level), fee = VALUES(fee), description = VALUES(description)`,
      tier,
    )
  }

  for (const wallet of DEFAULT_WALLETS) {
    await db.execute(
      `INSERT INTO treasury_wallets (wallet_key, name, asset, network, address)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE name = VALUES(name), asset = VALUES(asset), network = VALUES(network), address = VALUES(address)`,
      wallet,
    )
  }

  await db.execute(
    `INSERT INTO portal_settings (setting_key, setting_value)
     VALUES ('telegram_officer_url', '')
     ON DUPLICATE KEY UPDATE setting_key = setting_key`,
  )

  console.log('Gateway database setup complete.')
}

setup().catch((error) => {
  console.error('Gateway database setup failed:', error.message)
  process.exit(1)
})
