CREATE DATABASE IF NOT EXISTS lfc_cyberspace
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE lfc_cyberspace;

CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS service_tiers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  tier_key VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  level INT NOT NULL,
  fee DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS treasury_wallets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  wallet_key VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  asset VARCHAR(255) NOT NULL,
  network VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recovery_cases (
  id CHAR(36) PRIMARY KEY,
  reference VARCHAR(20) NOT NULL UNIQUE,
  form_id VARCHAR(50) DEFAULT 'LFC-SCR-250-001',
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(100),
  contact VARCHAR(255),
  country VARCHAR(100) NOT NULL,
  state_region VARCHAR(100),
  city VARCHAR(100),
  scam_type VARCHAR(255) NOT NULL,
  scam_platform VARCHAR(255) NOT NULL,
  contact_method VARCHAR(100) NOT NULL,
  locked_location VARCHAR(255) NOT NULL,
  asset VARCHAR(100) NOT NULL,
  network VARCHAR(100) NOT NULL,
  locked_amount VARCHAR(100) NOT NULL,
  total_lost_usd VARCHAR(100) NOT NULL,
  incident_date DATE NOT NULL,
  wallet_address TEXT NOT NULL,
  scammer_address TEXT,
  transaction_proof TEXT NOT NULL,
  exchange_involved VARCHAR(255),
  police_report VARCHAR(255) NOT NULL,
  scam_details TEXT,
  tier_key VARCHAR(50) NOT NULL,
  tier_name VARCHAR(255) NOT NULL,
  tier_level INT NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL,
  payment_wallet_key VARCHAR(50) NOT NULL,
  payment_wallet_name VARCHAR(255) NOT NULL,
  payment_wallet_address TEXT NOT NULL,
  paying_from VARCHAR(255),
  payment_asset VARCHAR(100),
  fee_speed VARCHAR(100),
  payment_status ENUM('pending','submitted','paid','verified') DEFAULT 'pending',
  payment_tx_hash VARCHAR(255),
  payment_submitted_at TIMESTAMP NULL,
  paid_at TIMESTAMP NULL,
  verified_at TIMESTAMP NULL,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_payment_status (payment_status),
  INDEX idx_reference (reference),
  INDEX idx_email (email)
);

CREATE TABLE IF NOT EXISTS portal_settings (
  setting_key VARCHAR(50) PRIMARY KEY,
  setting_value TEXT,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
