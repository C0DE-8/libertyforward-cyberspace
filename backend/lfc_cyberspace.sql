-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jul 09, 2026 at 08:27 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lfc_cyberspace`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_users`
--

CREATE TABLE `admin_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_users`
--

INSERT INTO `admin_users` (`id`, `email`, `password_hash`, `created_at`) VALUES
(1, 'admin@libertyforward.gov', '$2b$10$e1351DCbHXegQe/6G2nIteTUJ1pwfInTAqrJ7.4TXE.uo6msXrFEe', '2026-07-09 14:09:57');

-- --------------------------------------------------------

--
-- Table structure for table `portal_settings`
--

CREATE TABLE `portal_settings` (
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `portal_settings`
--

INSERT INTO `portal_settings` (`setting_key`, `setting_value`, `updated_at`) VALUES
('telegram_officer_url', 'https://t.me/libertyforwardgrant', '2026-07-09 17:50:32');

-- --------------------------------------------------------

--
-- Table structure for table `recovery_cases`
--

CREATE TABLE `recovery_cases` (
  `id` char(36) NOT NULL,
  `reference` varchar(20) NOT NULL,
  `form_id` varchar(50) DEFAULT 'LFC-SCR-250-001',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `contact` varchar(255) DEFAULT NULL,
  `country` varchar(100) NOT NULL,
  `state_region` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `scam_type` varchar(255) NOT NULL,
  `scam_platform` varchar(255) NOT NULL,
  `contact_method` varchar(100) NOT NULL,
  `locked_location` varchar(255) NOT NULL,
  `asset` varchar(100) NOT NULL,
  `network` varchar(100) NOT NULL,
  `locked_amount` varchar(100) NOT NULL,
  `total_lost_usd` varchar(100) NOT NULL,
  `incident_date` date NOT NULL,
  `wallet_address` text NOT NULL,
  `scammer_address` text DEFAULT NULL,
  `transaction_proof` text NOT NULL,
  `exchange_involved` varchar(255) DEFAULT NULL,
  `police_report` varchar(255) NOT NULL,
  `scam_details` text DEFAULT NULL,
  `tier_key` varchar(50) NOT NULL,
  `tier_name` varchar(255) NOT NULL,
  `tier_level` int(11) NOT NULL,
  `fee_amount` decimal(10,2) NOT NULL,
  `payment_wallet_key` varchar(50) NOT NULL,
  `payment_wallet_name` varchar(255) NOT NULL,
  `payment_wallet_address` text NOT NULL,
  `paying_from` varchar(255) DEFAULT NULL,
  `payment_asset` varchar(100) DEFAULT NULL,
  `fee_speed` varchar(100) DEFAULT NULL,
  `payment_status` enum('pending','submitted','paid','verified') DEFAULT 'pending',
  `payment_tx_hash` varchar(255) DEFAULT NULL,
  `payment_submitted_at` timestamp NULL DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `status` varchar(50) DEFAULT 'new',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recovery_cases`
--

INSERT INTO `recovery_cases` (`id`, `reference`, `form_id`, `name`, `email`, `phone`, `contact`, `country`, `state_region`, `city`, `scam_type`, `scam_platform`, `contact_method`, `locked_location`, `asset`, `network`, `locked_amount`, `total_lost_usd`, `incident_date`, `wallet_address`, `scammer_address`, `transaction_proof`, `exchange_involved`, `police_report`, `scam_details`, `tier_key`, `tier_name`, `tier_level`, `fee_amount`, `payment_wallet_key`, `payment_wallet_name`, `payment_wallet_address`, `paying_from`, `payment_asset`, `fee_speed`, `payment_status`, `payment_tx_hash`, `payment_submitted_at`, `paid_at`, `verified_at`, `status`, `created_at`, `updated_at`) VALUES
('d4710b87-0110-4abe-a2d3-7c828601d89c', 'LFC-477508', 'LFC-SCR-250-001', 'Stanley Alvin', 'stanleyalvin2ky@gmail.com', '+2343025345083', '3025345083', 'United States', 'California', 'San Francisco', 'Romance scam / Pig butchering (Sha Zhu Pan)', 'MetaMask', 'Telegram', 'Scammer-controlled wallet address', 'USDT', 'Ethereum', '500', '700', '2026-07-17', '1EZPEbwWYT3vWvbRrPecQ2BPFExeFCLcHK', 'IYXGUYGS,uyguydsvgycgdycduygsauygd', 'yiS>adgyulcgYULDSGyucgvuysgcduygvsyugvsyudcgsbx', 'u,cftcxdrztxty,fyukguy,fvutcyftfyt', 'Yes — report filed with reference number', 'bshdbhbHUbyyduBUSYKb,jhkyesgadkuygueygsdg\n', 'tier-6', 'Critical Emergency Response', 6, 4999.00, 'bnb', 'BNB Smart Chain Treasury', '0xLFC_TREASURY_BNB_WALLET_ADDRESS', 'dsvgcdsvyvgcyhdsvcyhvdcyhdc', 'BTC', 'Standard network fee', 'paid', 'ydktdtfyugdygdysggiudsgyigyidgy', '2026-07-09 16:45:31', '2026-07-09 15:50:24', NULL, 'new', '2026-07-09 14:14:37', '2026-07-09 16:46:24'),
('d969eb99-fc7f-4d33-bc28-2eef56b4dda7', 'LFC-295267', 'LFC-SCR-250-001', 'Stanley Alvin', 'stanleyalvin2ky@gmail.com', '+2343025345083', '3025345083', 'United States', 'California', 'San Francisco', 'Romance scam / Pig butchering (Sha Zhu Pan)', 'Coinbase / Coinbase Wallet', 'WhatsApp', 'Scammer-controlled wallet address', 'USDT', 'BNB Smart Chain (BEP-20)', '500', '700', '2026-07-17', 'stanleyalvin2ky@gmail.com', 'IYXGUYGS,uyguydsvgycgdycduygsauygd', 'mxdjydtymxdrstsgdfxgvykvmhgmv', 'tydtdthxdtydc', 'No — not yet filed', 'hfxyrmcgjcraetsetzdfuyf,ctdrysetslkd,7yfyjfjgv', 'tier-6', 'Critical Emergency Response', 6, 4999.00, 'tron', 'Tron USDT Treasury', 'LFC_TREASURY_TRON_USDT_ADDRESS', 'gmckmutftmcmyjdytrcycdrtdr', 'USDT', 'Standard network fee', 'verified', 't,cdmtkftymcmfxtnrdxmycmy', '2026-07-09 17:15:44', '2026-07-09 18:08:11', '2026-07-09 18:08:20', 'new', '2026-07-09 16:58:15', '2026-07-09 18:08:20');

-- --------------------------------------------------------

--
-- Table structure for table `service_tiers`
--

CREATE TABLE `service_tiers` (
  `id` int(11) NOT NULL,
  `tier_key` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `level` int(11) NOT NULL,
  `fee` decimal(10,2) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_tiers`
--

INSERT INTO `service_tiers` (`id`, `tier_key`, `name`, `level`, `fee`, `description`, `created_at`, `updated_at`) VALUES
(1, 'tier-1', 'Citizen Intake Review', 1, 49.00, 'Initial scam case review, public transaction assessment, and official reference issuance.', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(2, 'tier-2', 'Standard Scam Recovery', 2, 149.00, 'Full on-chain trace report, scammer wallet mapping, and exchange documentation package.', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(3, 'tier-3', 'Priority Case Escalation', 3, 349.00, 'Expedited review, dedicated case officer, and law enforcement evidence pack.', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(4, 'tier-4', 'Executive Multi-Agency', 4, 899.00, 'Highest priority — cross-border coordination, multi-chain tracing, and agency escalation.', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(5, 'tier-5', 'High-Value Loss Recovery', 5, 2499.00, 'For losses exceeding $50,000 — full forensic package and sworn affidavit support.', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(6, 'tier-6', 'Critical Emergency Response', 6, 4999.00, '24-hour response for active or recent losses with direct officer contact.', '2026-07-09 14:09:57', '2026-07-09 14:09:57');

-- --------------------------------------------------------

--
-- Table structure for table `treasury_wallets`
--

CREATE TABLE `treasury_wallets` (
  `id` int(11) NOT NULL,
  `wallet_key` varchar(50) NOT NULL,
  `name` varchar(255) NOT NULL,
  `asset` varchar(255) NOT NULL,
  `network` varchar(255) NOT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `treasury_wallets`
--

INSERT INTO `treasury_wallets` (`id`, `wallet_key`, `name`, `asset`, `network`, `address`, `created_at`, `updated_at`) VALUES
(1, 'btc', 'Bitcoin Treasury Wallet', 'BTC', 'Bitcoin Mainnet', 'bc1qLFC_TREASURY_BTC_WALLET_ADDRESS', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(2, 'eth', 'Ethereum Treasury Wallet', 'ETH / USDT / USDC', 'Ethereum ERC-20', '0xLFC_TREASURY_ETH_WALLET_ADDRESS', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(3, 'bnb', 'BNB Smart Chain Treasury', 'BNB / USDT / USDC', 'BEP-20', '0xLFC_TREASURY_BNB_WALLET_ADDRESS', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(4, 'sol', 'Solana Treasury Wallet', 'SOL / USDC', 'Solana', 'LFC_TREASURY_SOL_WALLET_ADDRESS', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(5, 'tron', 'Tron USDT Treasury', 'USDT', 'TRC-20', 'LFC_TREASURY_TRON_USDT_ADDRESS', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(6, 'xrp', 'XRP Treasury Wallet', 'XRP', 'XRP Ledger', 'rLFC_TREASURY_XRP_WALLET_ADDRESS', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(7, 'doge', 'Dogecoin Treasury Wallet', 'DOGE', 'Dogecoin', 'DLFC_TREASURY_DOGE_WALLET_ADDRESS', '2026-07-09 14:09:57', '2026-07-09 14:09:57'),
(8, 'ltc', 'Litecoin Treasury Wallet', 'LTC', 'Litecoin', 'ltc1qLFC_TREASURY_LTC_WALLET_ADDRESS', '2026-07-09 14:09:57', '2026-07-09 14:09:57');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_users`
--
ALTER TABLE `admin_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `portal_settings`
--
ALTER TABLE `portal_settings`
  ADD PRIMARY KEY (`setting_key`);

--
-- Indexes for table `recovery_cases`
--
ALTER TABLE `recovery_cases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `reference` (`reference`),
  ADD KEY `idx_payment_status` (`payment_status`),
  ADD KEY `idx_reference` (`reference`),
  ADD KEY `idx_email` (`email`);

--
-- Indexes for table `service_tiers`
--
ALTER TABLE `service_tiers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tier_key` (`tier_key`);

--
-- Indexes for table `treasury_wallets`
--
ALTER TABLE `treasury_wallets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `wallet_key` (`wallet_key`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_users`
--
ALTER TABLE `admin_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `service_tiers`
--
ALTER TABLE `service_tiers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `treasury_wallets`
--
ALTER TABLE `treasury_wallets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;







