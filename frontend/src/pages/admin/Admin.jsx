import { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout.jsx'
import layoutStyles from '../../components/layout/Layout.module.css'
import {
  adminLogin,
  deleteCase,
  getAdminCases,
  getAdminToken,
  getSettings,
  setAdminToken,
  updatePaymentStatus,
  updatePaymentDetails,
  updatePortalSettings,
  updateTier,
  updateWallet,
} from '../../lib/api.js'
import { formatFee } from '../../lib/format.js'
import CaseDossierCard from './CaseDossierCard.jsx'
import CaseWorkbench from './CaseWorkbench.jsx'
import styles from './Admin.module.css'

const PAYMENT_STATUSES = ['pending', 'submitted', 'paid', 'verified']

const PAYMENT_ACTIONS = {
  submitted: [
    { status: 'paid', label: 'Confirm payment', style: 'confirm' },
    { status: 'pending', label: 'Reject / reset', style: 'reject', clearPayment: true },
  ],
  paid: [
    { status: 'verified', label: 'Verify & activate case', style: 'confirm' },
    { status: 'submitted', label: 'Back to submitted', style: 'neutral' },
  ],
  verified: [
    { status: 'paid', label: 'Revert to paid', style: 'neutral' },
  ],
  pending: [
    { status: 'submitted', label: 'Mark submitted', style: 'neutral' },
    { status: 'paid', label: 'Confirm payment', style: 'confirm' },
  ],
}

function Admin() {
  const [session, setSession] = useState(() => (
    getAdminToken() ? { email: 'admin@libertyforward.gov' } : null
  ))
  const [credentials, setCredentials] = useState({
    email: 'admin@libertyforward.gov',
    password: '',
  })
  const [records, setRecords] = useState([])
  const [settings, setSettings] = useState({ wallets: [], tiers: [], portal: { telegramUrl: '' } })
  const [activeTab, setActiveTab] = useState('requests')
  const [filterStatus, setFilterStatus] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('submitted')
  const [selectedCaseId, setSelectedCaseId] = useState(null)
  const [message, setMessage] = useState('')

  const refreshData = async () => {
    try {
      const [casesPayload, settingsPayload] = await Promise.all([
        getAdminCases(),
        getSettings(),
      ])
      setRecords(casesPayload.records)
      setSettings(settingsPayload)
      setMessage('')
    } catch (error) {
      setMessage(error.message)
    }
  }

  useEffect(() => {
    if (!getAdminToken()) return undefined

    let cancelled = false

    const load = async () => {
      try {
        const [casesPayload, settingsPayload] = await Promise.all([
          getAdminCases(),
          getSettings(),
        ])
        if (!cancelled) {
          setRecords(casesPayload.records)
          setSettings(settingsPayload)
        }
      } catch (error) {
        if (!cancelled) setMessage(error.message)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  const login = async (event) => {
    event.preventDefault()
    try {
      const payload = await adminLogin(credentials.email, credentials.password)
      setAdminToken(payload.token)
      setSession({ email: payload.email })
      setMessage('')
      await refreshData()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const logout = () => {
    setAdminToken('')
    setSession(null)
    setRecords([])
    setMessage('')
  }

  const handleDeleteRecord = async (id) => {
    try {
      await deleteCase(id)
      setRecords((current) => current.filter((record) => record.id !== id))
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handlePaymentStatus = async (id, paymentStatus, options = {}) => {
    try {
      const payload = await updatePaymentStatus(id, paymentStatus, options)
      setRecords((current) => current.map((record) => (
        record.id === id ? payload.record : record
      )))
      setMessage(`Payment status updated to ${paymentStatus}.`)
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handlePaymentDetails = async (id, data) => {
    try {
      const payload = await updatePaymentDetails(id, data)
      setRecords((current) => current.map((record) => (
        record.id === id ? payload.record : record
      )))
      setMessage('Payment details saved.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handleWalletBlur = async (wallet) => {
    try {
      await updateWallet(wallet.id, {
        name: wallet.name,
        asset: wallet.asset,
        network: wallet.network,
        address: wallet.address,
      })
      setMessage('Treasury wallet saved.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const handlePortalBlur = async () => {
    try {
      const payload = await updatePortalSettings({
        telegramUrl: settings.portal.telegramUrl,
      })
      setSettings((current) => ({
        ...current,
        portal: payload.portal,
      }))
      setMessage('Officer contact link saved.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const updatePortalField = (value) => {
    setSettings((current) => ({
      ...current,
      portal: { ...current.portal, telegramUrl: value },
    }))
  }

  const handleTierBlur = async (tier) => {
    try {
      await updateTier(tier.id, {
        name: tier.name,
        fee: tier.fee,
        description: tier.description,
      })
      setMessage('Service tier saved.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  const updateWalletField = (walletId, field, value) => {
    setSettings((current) => ({
      ...current,
      wallets: current.wallets.map((wallet) => (
        wallet.id === walletId ? { ...wallet, [field]: value } : wallet
      )),
    }))
  }

  const updateTierField = (tierId, field, value) => {
    setSettings((current) => ({
      ...current,
      tiers: current.tiers.map((tier) => (
        tier.id === tierId
          ? { ...tier, [field]: field === 'fee' ? Number(value) || 0 : value }
          : tier
      )),
    }))
  }

  const filteredRecords = filterStatus === 'all'
    ? records
    : records.filter((record) => record.paymentStatus === filterStatus)

  const submittedCount = records.filter((r) => r.paymentStatus === 'submitted').length
  const paidCount = records.filter((r) => (
    r.paymentStatus === 'paid' || r.paymentStatus === 'verified'
  )).length

  const paymentRecords = records
    .filter((record) => {
      if (paymentFilter === 'all') {
        return record.paymentStatus !== 'pending' || Boolean(record.paymentTxHash)
      }
      return record.paymentStatus === paymentFilter
    })

  if (!session) {
    return (
      <Layout>
        <main className={layoutStyles.page}>
          <section className={layoutStyles.pageIntro}>
            <p className={layoutStyles.kicker}>Administrator access</p>
            <h1>LFC Admin Portal</h1>
            <p>Manage case filings, confirm payments, treasury wallets, and tier fees.</p>
          </section>
          <form className={styles.loginCard} onSubmit={login}>
            <label>Administrator email
              <input type="email" name="email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} />
            </label>
            <label>Password
              <input type="password" name="password" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
            </label>
            <button type="submit">Sign in</button>
            {message && <p className={styles.message}>{message}</p>}
          </form>
        </main>
      </Layout>
    )
  }

  return (
    <Layout>
      <main className={`${layoutStyles.page} ${styles.adminPage}`}>
        <section className={layoutStyles.pageIntro}>
          <p className={layoutStyles.kicker}>Administrator portal</p>
          <h1>Case & treasury management</h1>
          <p>{records.length} cases · {submittedCount} need review · {paidCount} confirmed · {settings.wallets.length} wallets</p>
        </section>

        <div className={styles.tabBar}>
          {['requests', 'payments', 'wallets', 'tiers', 'portal'].map((tab) => (
            <button key={tab} type="button" className={activeTab === tab ? styles.tabActive : ''} onClick={() => setActiveTab(tab)}>
              {tab === 'requests' ? 'Case filings' : tab === 'payments' ? 'Payment management' : tab === 'wallets' ? 'Treasury wallets' : tab === 'tiers' ? 'Tier fees' : 'Officer contact'}
            </button>
          ))}
        </div>

        <div className={styles.adminActions}>
          <button type="button" onClick={refreshData}>Refresh</button>
          <button type="button" onClick={logout}>Sign out</button>
        </div>

        {message && <p className={styles.successMessage}>{message}</p>}

        {activeTab === 'requests' && (
          <section className={styles.adminPanel}>
            <div className={styles.panelHead}>
              <div>
                <h2 className={styles.panelTitle}>Case filings</h2>
                <p className={styles.panelDesc}>
                  Select a case from the list to open its full dossier.
                </p>
              </div>
              <label className={styles.filterInline}>
                Payment status
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All cases</option>
                  {PAYMENT_STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                </select>
              </label>
            </div>
            {filteredRecords.length === 0 ? (
              <p className={styles.emptyState}>No cases match this filter.</p>
            ) : (
              <CaseWorkbench
                records={filteredRecords}
                selectedId={selectedCaseId}
                onSelect={setSelectedCaseId}
                emptyMessage="No cases match this filter."
              >
                <CaseDossierCard
                  record={filteredRecords.find((record) => record.id === selectedCaseId)}
                  paymentStatuses={PAYMENT_STATUSES}
                  onPaymentStatus={handlePaymentStatus}
                  onPaymentDetails={handlePaymentDetails}
                  onDelete={handleDeleteRecord}
                  showPaymentActions
                />
              </CaseWorkbench>
            )}
          </section>
        )}

        {activeTab === 'payments' && (
          <section className={styles.adminPanel}>
            <h2 className={styles.panelTitle}>Payment management</h2>
            <p className={styles.panelDesc}>
              Review submitted TXIDs, confirm treasury payments, and activate cases.
              {submittedCount > 0 && (
                <strong> {submittedCount} payment{submittedCount !== 1 ? 's' : ''} awaiting your confirmation.</strong>
              )}
            </p>

            <div className={styles.paymentFilters}>
              {[
                ['submitted', 'Needs review'],
                ['paid', 'Confirmed'],
                ['verified', 'Verified'],
                ['pending', 'Reset / pending'],
                ['all', 'All activity'],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={paymentFilter === value ? styles.filterActive : ''}
                  onClick={() => setPaymentFilter(value)}
                >
                  {label}
                  {value === 'submitted' && submittedCount > 0 && (
                    <em>{submittedCount}</em>
                  )}
                </button>
              ))}
            </div>

            {paymentRecords.length === 0 ? (
              <p className={styles.emptyState}>No payments in this category.</p>
            ) : (
              <CaseWorkbench
                records={paymentRecords}
                selectedId={selectedCaseId}
                onSelect={setSelectedCaseId}
                emptyMessage="No payments in this category."
                searchPlaceholder="Search payments…"
              >
                <CaseDossierCard
                  record={paymentRecords.find((record) => record.id === selectedCaseId)}
                  paymentStatuses={PAYMENT_STATUSES}
                  paymentActions={PAYMENT_ACTIONS}
                  onPaymentStatus={handlePaymentStatus}
                  onPaymentDetails={handlePaymentDetails}
                  onDelete={handleDeleteRecord}
                  showPaymentActions
                />
              </CaseWorkbench>
            )}
          </section>
        )}

        {activeTab === 'wallets' && (
          <section className={styles.adminPanel}>
            <h2 className={styles.panelTitle}>Treasury wallets</h2>
            <div className={styles.configGrid}>
              {settings.wallets.map((wallet) => (
                <article className={styles.configCard} key={wallet.id}>
                  <h3>{wallet.name}</h3>
                  <label>Name<input type="text" value={wallet.name} onChange={(e) => updateWalletField(wallet.id, 'name', e.target.value)} onBlur={() => handleWalletBlur(settings.wallets.find((w) => w.id === wallet.id))} /></label>
                  <label>Asset<input type="text" value={wallet.asset} onChange={(e) => updateWalletField(wallet.id, 'asset', e.target.value)} onBlur={() => handleWalletBlur(settings.wallets.find((w) => w.id === wallet.id))} /></label>
                  <label>Network<input type="text" value={wallet.network} onChange={(e) => updateWalletField(wallet.id, 'network', e.target.value)} onBlur={() => handleWalletBlur(settings.wallets.find((w) => w.id === wallet.id))} /></label>
                  <label>Address<input type="text" value={wallet.address} onChange={(e) => updateWalletField(wallet.id, 'address', e.target.value)} onBlur={() => handleWalletBlur(settings.wallets.find((w) => w.id === wallet.id))} /></label>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'tiers' && (
          <section className={styles.adminPanel}>
            <h2 className={styles.panelTitle}>Service tiers</h2>
            <div className={styles.configGrid}>
              {settings.tiers.map((tier) => (
                <article className={styles.configCard} key={tier.id}>
                  <span className={styles.tierLevel}>Tier {tier.level}</span>
                  <label>Name<input type="text" value={tier.name} onChange={(e) => updateTierField(tier.id, 'name', e.target.value)} onBlur={() => handleTierBlur(settings.tiers.find((t) => t.id === tier.id))} /></label>
                  <label>Fee (USD)<input type="number" min="0" value={tier.fee} onChange={(e) => updateTierField(tier.id, 'fee', e.target.value)} onBlur={() => handleTierBlur(settings.tiers.find((t) => t.id === tier.id))} /></label>
                  <label>Description<textarea rows="3" value={tier.description} onChange={(e) => updateTierField(tier.id, 'description', e.target.value)} onBlur={() => handleTierBlur(settings.tiers.find((t) => t.id === tier.id))} /></label>
                  <p className={styles.tierPreview}>Display: <strong>{formatFee(tier.fee)}</strong></p>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'portal' && (
          <section className={styles.adminPanel}>
            <h2 className={styles.panelTitle}>Case officer contact</h2>
            <p className={styles.panelDesc}>
              When a case is marked <strong>verified</strong>, clients see a Telegram button
              that opens this link.
            </p>
            <article className={styles.portalCard}>
              <label>
                Telegram officer link
                <input
                  type="url"
                  value={settings.portal.telegramUrl}
                  onChange={(e) => updatePortalField(e.target.value)}
                  onBlur={handlePortalBlur}
                  placeholder="https://t.me/your_officer_username"
                />
              </label>
              <p className={styles.portalHint}>
                Use a full URL like <code>https://t.me/username</code>, or enter
                {' '}<code>@username</code> / <code>t.me/username</code>.
              </p>
              {settings.portal.telegramUrl && (
                <a
                  className={styles.portalPreview}
                  href={settings.portal.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview Telegram link →
                </a>
              )}
            </article>
          </section>
        )}
      </main>
    </Layout>
  )
}

export default Admin
