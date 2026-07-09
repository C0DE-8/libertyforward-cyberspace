import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import bcrypt from 'bcryptjs'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

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
    .filter(Boolean)

  const bootstrap = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  })

  for (const statement of statements) {
    await bootstrap.query(statement)
  }

  await bootstrap.end()

  const db = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'lfc_cyberspace',
  })

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

  await db.end()
  console.log('Database setup complete.')
}

setup().catch((error) => {
  if (error.code === 'ER_ACCESS_DENIED_ERROR') {
    console.error('\nDatabase setup failed: MySQL login rejected.')
    console.error('Update DB_USER and DB_PASSWORD in backend/.env')
    console.error('If using Docker: npm run db:up  (then wait ~10s and retry)\n')
  } else if (error.code === 'ECONNREFUSED') {
    console.error('\nDatabase setup failed: Cannot connect to MySQL.')
    console.error('Start MySQL first:  npm run db:up')
    console.error('Or install MySQL and update backend/.env\n')
  } else {
    console.error('Database setup failed:', error.message)
  }
  process.exit(1)
})
