export const SCAM_TYPES = [
  'Romance scam / Pig butchering (Sha Zhu Pan)',
  'Fake crypto investment platform',
  'Phishing link / wallet drainer',
  'Fake recovery scam (secondary victimization)',
  'Impersonation — government / law enforcement',
  'Impersonation — tech support / Microsoft',
  'Impersonation — celebrity or influencer',
  'Fake cryptocurrency exchange',
  'Employment / remote job scam',
  'Ransomware / sextortion payment',
  'SIM swap / account takeover',
  'Rug pull / honeypot token',
  'NFT / marketplace fraud',
  'Malicious token approval / airdrop scam',
  'Cloud mining / staking Ponzi',
  'DeFi / liquidity pool exploit (victim)',
  'Bridge or cross-chain transfer loss',
  'Watch-only wallet lock scam',
  'Blackmail / deepfake video scam',
  'Telegram / WhatsApp investment group',
  'Charity or disaster relief scam',
  'Pump-and-dump / signal group',
  'Loan or advance-fee scam',
  'Romance + investment hybrid',
  'Other / multiple scam types',
]

export const SCAM_PLATFORMS = [
  'MetaMask',
  'Trust Wallet',
  'Coinbase / Coinbase Wallet',
  'Binance / Binance.US',
  'Kraken',
  'KuCoin',
  'Bybit',
  'OKX',
  'Crypto.com',
  'Gemini',
  'Ledger Live',
  'Exodus',
  'Phantom (Solana)',
  'TronLink',
  'Telegram',
  'WhatsApp',
  'Discord',
  'Fake trading website / app',
  'Uniswap / PancakeSwap / DEX',
  'Unknown third-party platform',
  'Other platform',
]

export const CONTACT_METHODS = [
  'Email',
  'Telegram',
  'WhatsApp',
  'SMS / text message',
  'Phone call',
  'Discord',
  'Facebook / Instagram DM',
  'Dating app',
  'LinkedIn',
  'In-person referral',
  'Other',
]

export const LOCKED_LOCATIONS = [
  'Scammer-controlled wallet address',
  'Fake investment platform account',
  'Watch-only wallet (cannot withdraw)',
  'Compromised exchange account',
  'Bridge or cross-chain transaction',
  'Staking / DeFi / liquidity pool',
  'Rug-pulled token contract',
  'Phishing drainer destination',
  'Mixer or privacy protocol',
  'Unknown / still tracing',
  'Multiple destinations',
]

export const NETWORKS = [
  'Bitcoin',
  'Ethereum',
  'BNB Smart Chain (BEP-20)',
  'Solana',
  'Tron (TRC-20)',
  'Polygon',
  'Arbitrum',
  'Optimism',
  'Avalanche',
  'Base',
  'Litecoin',
  'Ripple (XRP Ledger)',
  'Dogecoin',
  'Cardano',
  'TON',
  'Cronos',
  'Fantom',
  'Other / multi-chain',
]

export const ASSETS = [
  'BTC', 'ETH', 'USDT', 'USDC', 'BNB', 'SOL', 'XRP', 'DOGE', 'TRX',
  'ADA', 'LTC', 'AVAX', 'MATIC', 'LINK', 'SHIB', 'DAI', 'TON',
  'Other token or NFT',
]

export const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany',
  'France', 'Netherlands', 'Switzerland', 'Singapore', 'Hong Kong',
  'Japan', 'South Korea', 'India', 'Brazil', 'Mexico', 'Nigeria',
  'South Africa', 'Philippines', 'Indonesia', 'Malaysia', 'Thailand',
  'Vietnam', 'United Arab Emirates', 'Saudi Arabia', 'Italy', 'Spain',
  'Sweden', 'Norway', 'Denmark', 'Belgium', 'Austria', 'Ireland',
  'New Zealand', 'Israel', 'Turkey', 'Poland', 'Romania', 'Other',
]

export const POLICE_REPORT_OPTIONS = [
  'Yes — report filed with reference number',
  'Yes — reported but no reference yet',
  'In progress — filing soon',
  'No — not yet filed',
  'Declined by local authority',
]

export const FEE_SPEED_OPTIONS = [
  'Standard network fee',
  'Priority network fee',
  'Lowest available fee',
  'USDT TRC-20 (recommended)',
  'Bitcoin mainnet',
  'Ethereum ERC-20',
  'Wire / bank transfer (if authorized)',
]

export const SCAM_SERVICES = [
  'On-chain transaction trace and timeline report',
  'Scammer wallet clustering and destination mapping',
  'Exchange freeze request documentation',
  'Law enforcement evidence package (FBI IC3 / local PD)',
  'Watch-only wallet access review',
  'Fake platform / website forensic report',
  'Romance scam communication log analysis',
  'Pig butchering case routing and escalation',
  'Phishing / drainer incident documentation',
  'Recovery scam double-victim case review',
  'Cross-border jurisdiction routing',
  'Multi-chain asset recovery pathway assessment',
  'Official case reference and correspondence',
  'Post-incident wallet and account hardening',
  'Victim affidavit and sworn statement support',
  'No custody — no seed phrase collection',
]

export const SCAM_FAQS = [
  [
    'What scam types do you handle?',
    'All authorized categories including romance scams, pig butchering, fake investment platforms, phishing drainers, impersonation, rug pulls, fake recovery scams, and cross-chain losses. No case type is excluded from intake.',
  ],
  [
    'Can you guarantee my funds will be returned?',
    'No legitimate service can guarantee blockchain recovery. We provide authorized case review, on-chain tracing, documentation for exchanges and law enforcement, and identify realistic recovery pathways.',
  ],
  [
    'I was scammed by another recovery company — can you help?',
    'Yes. Fake recovery scams are a recognized category. Submit your original loss details plus any secondary payments made to the fraudulent recovery service.',
  ],
  [
    'What information do I need to file?',
    'Public wallet addresses, transaction hashes (TXID), dates, platform names, scammer contact methods, and estimated loss amount. Never submit seed phrases or private keys.',
  ],
  [
    'How do tier fees work?',
    'Each tier covers a defined scope of review and support. Fees are published on this portal and confirmed on your official invoice before any treasury payment is authorized.',
  ],
  [
    'Is this portal authorized to handle my case?',
    'Liberty Forward Cyberspace operates as an authorized digital asset case intake and recovery coordination portal. All submissions receive an official reference number and case officer assignment.',
  ],
]

export const RECOVERY_STEPS = [
  {
    title: 'File authorized intake',
    text: 'Complete the full case form with scam type, platform, public wallet addresses, transaction hashes, and loss details.',
  },
  {
    title: 'Receive case assignment',
    text: 'An authorized case officer reviews on-chain data, traces fund movement, and identifies viable recovery pathways.',
  },
  {
    title: 'Authorize tier payment',
    text: 'Select your service tier, review the official invoice, and submit payment to the published treasury wallet.',
  },
  {
    title: 'Recovery coordination',
    text: 'Receive documentation for exchanges, law enforcement, and cross-border recovery actions as scoped in your tier.',
  },
]

export const SCAM_SLIDES = [
  {
    title: 'Romance & pig butchering cases',
    text: 'Authorized intake for Sha Zhu Pan, fake relationship investment schemes, and long-con crypto fraud with full communication and transaction tracing.',
    tag: 'Romance scam',
  },
  {
    title: 'Fake platform & investment fraud',
    text: 'Document losses from fraudulent trading apps, fake exchanges, and deposit-only platforms with on-chain proof packages.',
    tag: 'Investment fraud',
  },
  {
    title: 'Phishing & wallet drainer incidents',
    text: 'Trace stolen assets from malicious links, fake airdrops, and approval scams across all supported chain families.',
    tag: 'Phishing / drainer',
  },
  {
    title: 'Fake recovery scam victims',
    text: 'Secondary victimization cases where a prior recovery service demanded upfront payment. Full dual-loss documentation supported.',
    tag: 'Recovery scam',
  },
  {
    title: 'Impersonation & government fraud',
    text: 'Cases involving fake IRS, FBI, tech support, or celebrity impersonation demanding crypto payments.',
    tag: 'Impersonation',
  },
  {
    title: 'Cross-chain & DeFi losses',
    text: 'Bridge exploits, rug pulls, liquidity pool drains, and multi-chain tracing with no asset or network excluded.',
    tag: 'DeFi / cross-chain',
  },
]
