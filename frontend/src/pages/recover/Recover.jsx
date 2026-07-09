import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../components/layout/Layout.jsx'
import CustomSelect from '../../components/CustomSelect/CustomSelect.jsx'
import Toast from '../../components/Toast/Toast.jsx'
import VerifiedTelegramCta from '../../components/VerifiedTelegramCta/VerifiedTelegramCta.jsx'
import {
  ASSETS,
  CONTACT_METHODS,
  COUNTRIES,
  FEE_SPEED_OPTIONS,
  LOCKED_LOCATIONS,
  NETWORKS,
  POLICE_REPORT_OPTIONS,
  SCAM_PLATFORMS,
  SCAM_TYPES,
} from '../../lib/scamData.js'
import {
  createCase,
  getCaseByReference,
  getSettings,
  submitPayment,
} from '../../lib/api.js'
import { formatFee } from '../../lib/format.js'
import { copyToClipboard } from '../../lib/clipboard.js'
import { PAYMENT_LABELS, PAYMENT_STATUS_MESSAGES } from '../../lib/caseStatus.js'
import styles from './Recover.module.css'

const STEPS = [
  { id: 1, title: 'Contact', short: 'You' },
  { id: 2, title: 'Incident', short: 'Scam' },
  { id: 3, title: 'Evidence', short: 'Proof' },
  { id: 4, title: 'Service', short: 'Tier' },
]

const DRAFT_KEY = 'lfc-recovery-draft'
const REF_KEY = 'lfc-active-reference'

const initialFormData = {
  name: '', email: '', phone: '', contact: '', country: '',
  stateRegion: '', city: '', scamType: '', scamPlatform: '',
  contactMethod: '', lockedLocation: '', asset: '', network: '',
  lockedAmount: '', totalLostUSD: '', incidentDate: '',
  walletAddress: '', scammerAddress: '', transactionProof: '',
  exchangeInvolved: '', policeReport: '', scamDetails: '',
  serviceTier: '', paymentWallet: '', payingFrom: '',
  paymentAsset: '', feeSpeed: '', authorized: false,
}

function syncPaymentRecord(nextRecord) {
  window.localStorage.setItem(REF_KEY, nextRecord.reference)
  return nextRecord
}

function paymentStatusMessage(record, previousStatus) {
  const base = PAYMENT_STATUS_MESSAGES[record.paymentStatus] || PAYMENT_STATUS_MESSAGES.pending

  if (previousStatus && previousStatus !== record.paymentStatus) {
    if (
      (previousStatus === 'paid' || previousStatus === 'verified')
      && (record.paymentStatus === 'pending' || record.paymentStatus === 'submitted')
    ) {
      return 'Treasury updated your payment status. Please review the instructions below.'
    }
    if (record.paymentStatus === 'paid' || record.paymentStatus === 'verified') {
      return `Status updated: ${base}`
    }
    return base
  }

  return `Last checked: ${base}`
}

function PaymentFlow({ record: initialRecord }) {
  const navigate = useNavigate()
  const [record, setRecord] = useState(initialRecord)
  const [txHash, setTxHash] = useState(initialRecord.paymentTxHash || '')
  const [payingFrom, setPayingFrom] = useState(initialRecord.payingFrom || '')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [message, setMessage] = useState('')
  const [lastCheckedAt, setLastCheckedAt] = useState('')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState({ visible: false })
  const [telegramUrl, setTelegramUrl] = useState('')
  const editingPaymentRef = useRef(false)

  const loadTelegramUrl = async () => {
    try {
      const data = await getSettings()
      setTelegramUrl(data.portal?.telegramUrl || '')
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    loadTelegramUrl()
  }, [])

  const status = PAYMENT_LABELS[record.paymentStatus] || PAYMENT_LABELS.pending

  const syncFormFields = (synced, previousStatus) => {
    const statusChanged = previousStatus !== synced.paymentStatus

    if (!statusChanged) return

    setTxHash(synced.paymentTxHash || '')
    setPayingFrom(synced.payingFrom || '')
    editingPaymentRef.current = false
  }

  const syncFromServer = async ({ announce = false, reference = record.reference, syncFields = false } = {}) => {
    const payload = await getCaseByReference(reference)
    setRecord((current) => {
      const synced = syncPaymentRecord(payload.record)

      if (syncFields && !editingPaymentRef.current) {
        setTxHash(synced.paymentTxHash || '')
        setPayingFrom(synced.payingFrom || '')
      } else {
        syncFormFields(synced, current.paymentStatus)
      }

      setLastCheckedAt(new Date().toLocaleTimeString())
      if (announce) {
        setMessage(paymentStatusMessage(synced, current.paymentStatus))
      } else if (current.paymentStatus !== synced.paymentStatus) {
        setMessage(paymentStatusMessage(synced, current.paymentStatus))
      }
      return synced
    })
    return payload.record
  }

  const refreshStatus = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        syncFromServer({ announce: true }),
        loadTelegramUrl(),
      ])
    } catch {
      setMessage('Could not refresh payment status. Check your connection and try again.')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    const poll = async ({ announce = false, syncFields = false } = {}) => {
      try {
        if (!cancelled) {
          await Promise.all([
            syncFromServer({
              announce,
              syncFields,
              reference: initialRecord.reference,
            }),
            loadTelegramUrl(),
          ])
        }
      } catch {
        if (announce && !cancelled) {
          setMessage('Could not load the latest payment status.')
        }
      }
    }

    poll({ syncFields: true })
    const interval = setInterval(() => poll(), 5000)

    const onVisible = () => {
      if (document.visibilityState === 'visible') poll()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [initialRecord.reference])

  const copyAddress = async () => {
    try {
      await copyToClipboard(record.paymentWalletAddress)
      setCopied(true)
      setMessage('Treasury address copied to clipboard.')
      window.setTimeout(() => setCopied(false), 2500)
    } catch (error) {
      setCopied(false)
      setMessage(error.message || 'Could not copy address. Tap the address to select it manually.')
    }
  }

  const confirmPayment = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const payload = await submitPayment(record.reference, {
        paymentTxHash: txHash,
        payingFrom,
      })
      const synced = syncPaymentRecord(payload.record)
      editingPaymentRef.current = false
      setRecord(synced)
      setTxHash(synced.paymentTxHash || '')
      setPayingFrom(synced.payingFrom || '')
      setLastCheckedAt(new Date().toLocaleTimeString())
      setMessage(payload.message || paymentStatusMessage(synced, record.paymentStatus))
      setToast({
        visible: true,
        title: 'Payment submitted',
        message: `Reference ${synced.reference}. Treasury will confirm your payment shortly.`,
      })
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.paymentFlow}>
      <div className={styles.paymentHero}>
        <p className={styles.formTag}>Case reference</p>
        <h2>{record.reference}</h2>
        <span className={`${styles.statusPill} ${styles[`pill_${status.tone}`]}`}>
          {status.text}
        </span>
        <Link className={styles.statusPageLink} to={`/status?ref=${encodeURIComponent(record.reference)}`}>
          View full case status →
        </Link>
      </div>

      <div className={styles.paymentSteps}>
        <article className={styles.paymentStep}>
          <span>1</span>
          <div>
            <strong>Send tier fee</strong>
            <p>Transfer {record.reviewFee} to the official treasury wallet below.</p>
          </div>
        </article>
        <article className={styles.paymentStep}>
          <span>2</span>
          <div>
            <strong>Copy treasury address</strong>
            <p>Use the exact network shown. Wrong-chain transfers cannot be recovered.</p>
          </div>
        </article>
        <article className={styles.paymentStep}>
          <span>3</span>
          <div>
            <strong>Submit transaction hash</strong>
            <p>Enter your TXID so treasury can confirm your payment.</p>
          </div>
        </article>
      </div>

      <div className={styles.treasuryCard}>
        <div className={styles.treasuryRow}>
          <span>Tier</span>
          <strong>{record.tierName}</strong>
        </div>
        <div className={styles.treasuryRow}>
          <span>Fee</span>
          <strong>{record.reviewFee}</strong>
        </div>
        <div className={styles.treasuryRow}>
          <span>Wallet</span>
          <strong>{record.paymentWalletName}</strong>
        </div>
        <div className={styles.treasuryAddress}>
          <span>Treasury address</span>
          <code
            className={styles.addressCode}
            onClick={(event) => {
              const selection = window.getSelection()
              const range = document.createRange()
              range.selectNodeContents(event.currentTarget)
              selection?.removeAllRanges()
              selection?.addRange(range)
            }}
          >
            {record.paymentWalletAddress}
          </code>
          <button
            type="button"
            className={copied ? styles.copyBtnDone : styles.copyBtn}
            onClick={copyAddress}
          >
            {copied ? 'Copied to clipboard' : 'Copy address'}
          </button>
          {copied && (
            <p className={styles.copyToast} role="status" aria-live="polite">
              Address copied — paste it in your wallet app.
            </p>
          )}
        </div>
      </div>

      {(record.paymentStatus === 'pending' || record.paymentStatus === 'submitted') && (
        <form className={styles.txForm} onSubmit={confirmPayment}>
          <label>
            Your payment transaction hash (TXID) *
            <input
              type="text"
              value={txHash}
              onFocus={() => { editingPaymentRef.current = true }}
              onChange={(e) => {
                editingPaymentRef.current = true
                setTxHash(e.target.value)
              }}
              placeholder="Paste TXID after sending payment"
              required
              disabled={record.paymentStatus === 'paid' || record.paymentStatus === 'verified'}
            />
          </label>
          <label>
            Paying from address
            <input
              type="text"
              value={payingFrom}
              onFocus={() => { editingPaymentRef.current = true }}
              onChange={(e) => {
                editingPaymentRef.current = true
                setPayingFrom(e.target.value)
              }}
              placeholder="Public wallet you sent from"
            />
          </label>
          <button type="submit" disabled={loading || record.paymentStatus === 'submitted'}>
            {loading ? 'Submitting...' : record.paymentStatus === 'submitted' ? 'Payment submitted' : 'Confirm payment sent'}
          </button>
        </form>
      )}

      {(record.paymentStatus === 'paid' || record.paymentStatus === 'verified') && (
        <div className={styles.confirmedBanner}>
          <strong>{record.paymentStatus === 'verified' ? 'Case verified' : 'Payment confirmed'}</strong>
          <p>
            {record.paymentStatus === 'verified'
              ? 'Your case has been verified and a case officer has been assigned.'
              : 'Your tier fee has been verified. Case review is now active.'}
            {record.paymentTxHash && (
              <> TXID: <code>{record.paymentTxHash}</code></>
            )}
          </p>
        </div>
      )}

      {record.paymentStatus === 'verified' && (
        <div className={styles.verifiedCta}>
          <p>Continue with your assigned case officer on Telegram.</p>
          {telegramUrl ? (
            <VerifiedTelegramCta url={telegramUrl} />
          ) : (
            <p className={styles.verifiedNote}>
              Officer contact link will appear here automatically once treasury publishes it.
            </p>
          )}
        </div>
      )}

      <div className={styles.paymentActions}>
        <button
          type="button"
          className={styles.refreshBtn}
          onClick={refreshStatus}
          disabled={refreshing}
        >
          {refreshing ? 'Checking status...' : 'Refresh payment status'}
        </button>
        {lastCheckedAt && (
          <p className={styles.lastChecked}>Live updates on · Last synced at {lastCheckedAt}</p>
        )}
      </div>

      {message && (
        <p
          className={`${styles.infoMessage} ${
            record.paymentStatus === 'paid' || record.paymentStatus === 'verified'
              ? styles.infoMessageSuccess
              : record.paymentStatus === 'pending' || record.paymentStatus === 'submitted'
                ? styles.infoMessagePending
                : ''
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      )}

      <Toast
        visible={toast.visible}
        title={toast.title}
        message={toast.message}
        tone="success"
        actionLabel="View case status"
        onAction={() => {
          setToast((current) => ({ ...current, visible: false }))
          navigate(`/status?ref=${encodeURIComponent(record.reference)}`)
        }}
        onClose={() => setToast((current) => ({ ...current, visible: false }))}
      />
    </section>
  )
}

function Recover() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [wallets, setWallets] = useState([])
  const [tiers, setTiers] = useState([])
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submission, setSubmission] = useState(null)
  const [filedToast, setFiledToast] = useState({ visible: false, reference: '' })

  const [formData, setFormData] = useState(() => {
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY)
      return saved ? { ...initialFormData, ...JSON.parse(saved) } : initialFormData
    } catch {
      return initialFormData
    }
  })

  useEffect(() => {
    getSettings()
      .then((data) => {
        setWallets(data.wallets)
        setTiers(data.tiers)
      })
      .catch(() => setError('Could not load portal settings. Is the API server running?'))
      .finally(() => setLoadingSettings(false))
  }, [])

  useEffect(() => {
    const savedRef = window.localStorage.getItem(REF_KEY)
    if (!savedRef) return

    getCaseByReference(savedRef)
      .then((payload) => setSubmission(payload.record))
      .catch(() => window.localStorage.removeItem(REF_KEY))
  }, [])

  const selectedWallet = wallets.find((w) => w.id === formData.paymentWallet)
  const selectedTier = tiers.find((t) => t.id === formData.serviceTier)

  const updateFormData = (event) => {
    const { name, value, type, checked } = event.target
    const next = { ...formData, [name]: type === 'checkbox' ? checked : value }
    setFormData(next)
    window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next))
  }

  const stepFields = {
    1: ['name', 'email', 'country'],
    2: ['scamType', 'scamPlatform', 'contactMethod', 'lockedLocation', 'asset', 'network', 'lockedAmount', 'totalLostUSD', 'incidentDate', 'policeReport'],
    3: ['walletAddress', 'transactionProof'],
    4: ['serviceTier', 'paymentWallet'],
  }

  const validateStep = (currentStep) => {
    const missing = stepFields[currentStep].find((field) => !String(formData[field]).trim())
    if (missing) {
      setError('Please complete all required fields before continuing.')
      return false
    }
    setError('')
    return true
  }

  const goNext = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 4))
  }

  const goBack = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 1))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!validateStep(4)) return

    if (!formData.authorized) {
      setError('Please certify the authorization checkbox.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const payload = await createCase({
        ...formData,
        tierId: selectedTier.id,
        tierName: selectedTier.name,
        tierLevel: selectedTier.level,
        feeAmount: selectedTier.fee,
        paymentWallet: selectedWallet.id,
        paymentWalletName: selectedWallet.name,
        paymentWalletAddress: selectedWallet.address,
      })

      window.localStorage.removeItem(DRAFT_KEY)
      window.localStorage.setItem(REF_KEY, payload.record.reference)
      setSubmission(payload.record)
      setFiledToast({
        visible: true,
        reference: payload.record.reference,
      })
      setStep(5)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (submission && step === 5) {
    return (
      <Layout>
        <main className={styles.page}>
          <PaymentFlow record={submission} />
        </main>
        <Toast
          visible={filedToast.visible}
          title="Case filed successfully"
          message={`Your reference is ${filedToast.reference}. Save it to check your status anytime.`}
          tone="info"
          actionLabel="View case status"
          onAction={() => {
            setFiledToast((current) => ({ ...current, visible: false }))
            navigate(`/status?ref=${encodeURIComponent(filedToast.reference)}`)
          }}
          onClose={() => setFiledToast((current) => ({ ...current, visible: false }))}
        />
      </Layout>
    )
  }

  return (
    <Layout>
      <main className={styles.page}>
        <header className={styles.pageHeader}>
          <div>
            <p className={styles.formTag}>Authorized intake · LFC-SCR-250-001</p>
            <h1>Scam Recovery Filing</h1>
            <p>Complete each step. All scam categories accepted.</p>
          </div>
        </header>

        <nav className={styles.stepNav} aria-label="Form progress">
          {STEPS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.stepItem} ${step === item.id ? styles.stepActive : ''} ${step > item.id ? styles.stepDone : ''}`}
              onClick={() => item.id < step && setStep(item.id)}
            >
              <span>{item.id}</span>
              <strong>{item.short}</strong>
            </button>
          ))}
        </nav>

        {loadingSettings ? (
          <p className={styles.loading}>Loading portal settings...</p>
        ) : (
          <form className={styles.formCard} onSubmit={step === 4 ? handleSubmit : (e) => e.preventDefault()}>
            {step === 1 && (
              <section className={styles.stepPanel}>
                <h2>Contributor information</h2>
                <div className={styles.grid}>
                  <label>Legal full name *
                    <input type="text" name="name" value={formData.name} onChange={updateFormData} placeholder="Full legal name" required />
                  </label>
                  <label>Email address *
                    <input type="email" name="email" value={formData.email} onChange={updateFormData} placeholder="you@example.com" required />
                  </label>
                  <label>Telephone
                    <input type="tel" name="phone" value={formData.phone} onChange={updateFormData} placeholder="+1 555 000 0000" />
                  </label>
                  <label>Telegram / WhatsApp
                    <input type="text" name="contact" value={formData.contact} onChange={updateFormData} placeholder="@username" />
                  </label>
                  <CustomSelect name="country" label="Country *" value={formData.country} onChange={updateFormData} options={COUNTRIES} placeholder="Select country" required />
                  <label>State / region
                    <input type="text" name="stateRegion" value={formData.stateRegion} onChange={updateFormData} />
                  </label>
                  <label>City
                    <input type="text" name="city" value={formData.city} onChange={updateFormData} />
                  </label>
                </div>
              </section>
            )}

            {step === 2 && (
              <section className={styles.stepPanel}>
                <h2>Scam incident details</h2>
                <div className={styles.grid}>
                  <CustomSelect name="scamType" label="Scam type *" value={formData.scamType} onChange={updateFormData} options={SCAM_TYPES} placeholder="Select scam category" required />
                  <CustomSelect name="scamPlatform" label="Platform *" value={formData.scamPlatform} onChange={updateFormData} options={SCAM_PLATFORMS} placeholder="Select platform" required />
                  <CustomSelect name="contactMethod" label="Contact method *" value={formData.contactMethod} onChange={updateFormData} options={CONTACT_METHODS} placeholder="How they reached you" required />
                  <CustomSelect name="lockedLocation" label="Funds destination *" value={formData.lockedLocation} onChange={updateFormData} options={LOCKED_LOCATIONS} placeholder="Where funds went" required />
                  <CustomSelect name="asset" label="Asset lost *" value={formData.asset} onChange={updateFormData} options={ASSETS} placeholder="Select asset" required />
                  <CustomSelect name="network" label="Network *" value={formData.network} onChange={updateFormData} options={NETWORKS} placeholder="Select network" required />
                  <label>Amount lost (crypto) *
                    <input type="text" name="lockedAmount" value={formData.lockedAmount} onChange={updateFormData} placeholder="2.5 ETH" required />
                  </label>
                  <label>USD equivalent *
                    <input type="text" name="totalLostUSD" value={formData.totalLostUSD} onChange={updateFormData} placeholder="$45,000" required />
                  </label>
                  <label>Incident date *
                    <input type="date" name="incidentDate" value={formData.incidentDate} onChange={updateFormData} required />
                  </label>
                  <CustomSelect name="policeReport" label="Police report *" value={formData.policeReport} onChange={updateFormData} options={POLICE_REPORT_OPTIONS} placeholder="Report status" required />
                  <label className={styles.full}>Exchange involved
                    <input type="text" name="exchangeInvolved" value={formData.exchangeInvolved} onChange={updateFormData} placeholder="Coinbase, Binance, etc." />
                  </label>
                  <label className={styles.full}>Scam narrative
                    <textarea name="scamDetails" rows="3" value={formData.scamDetails} onChange={updateFormData} placeholder="Brief timeline of events" />
                  </label>
                </div>
              </section>
            )}

            {step === 3 && (
              <section className={styles.stepPanel}>
                <h2>On-chain evidence</h2>
                <p className={styles.hint}>Public data only — never share seed phrases or private keys.</p>
                <div className={styles.grid}>
                  <label className={styles.full}>Your wallet address *
                    <input type="text" name="walletAddress" value={formData.walletAddress} onChange={updateFormData} required />
                  </label>
                  <label className={styles.full}>Scammer address
                    <input type="text" name="scammerAddress" value={formData.scammerAddress} onChange={updateFormData} />
                  </label>
                  <label className={styles.full}>Transaction hashes (TXID) *
                    <textarea name="transactionProof" rows="4" value={formData.transactionProof} onChange={updateFormData} required />
                  </label>
                </div>
              </section>
            )}

            {step === 4 && (
              <section className={styles.stepPanel}>
                <h2>Service tier & treasury</h2>
                <div className={styles.tierList}>
                  {tiers.map((tier) => (
                    <label key={tier.id} className={`${styles.tierCard} ${formData.serviceTier === tier.id ? styles.tierCardActive : ''}`}>
                      <input type="radio" name="serviceTier" value={tier.id} checked={formData.serviceTier === tier.id} onChange={updateFormData} />
                      <div>
                        <span>Tier {tier.level}</span>
                        <strong>{tier.name}</strong>
                        <em>{formatFee(tier.fee)}</em>
                        <p>{tier.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className={styles.walletList}>
                  {wallets.map((wallet) => (
                    <label key={wallet.id} className={`${styles.walletCard} ${formData.paymentWallet === wallet.id ? styles.walletCardActive : ''}`}>
                      <input type="radio" name="paymentWallet" value={wallet.id} checked={formData.paymentWallet === wallet.id} onChange={updateFormData} />
                      <div>
                        <strong>{wallet.name}</strong>
                        <small>{wallet.asset} · {wallet.network}</small>
                      </div>
                    </label>
                  ))}
                </div>

                <div className={styles.grid}>
                  <CustomSelect name="paymentAsset" label="Payment asset" value={formData.paymentAsset} onChange={updateFormData} options={ASSETS} placeholder="Select asset" searchable={false} />
                  <CustomSelect name="feeSpeed" label="Fee preference" value={formData.feeSpeed} onChange={updateFormData} options={FEE_SPEED_OPTIONS} placeholder="Select preference" searchable={false} />
                </div>

                {selectedTier && selectedWallet && (
                  <div className={styles.summaryStrip}>
                    <span>{selectedTier.name}</span>
                    <strong>{formatFee(selectedTier.fee)}</strong>
                    <em>{selectedWallet.network}</em>
                  </div>
                )}

                <label className={styles.certBox}>
                  <input type="checkbox" name="authorized" checked={formData.authorized} onChange={updateFormData} />
                  <span>I certify this information is accurate and authorize Liberty Forward Cyberspace to process this recovery intake.</span>
                </label>
              </section>
            )}

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              {step > 1 && (
                <button type="button" className={styles.backBtn} onClick={goBack}>Back</button>
              )}
              {step < 4 ? (
                <button type="button" className={styles.nextBtn} onClick={goNext}>Continue</button>
              ) : (
                <button type="submit" className={styles.nextBtn} disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit & proceed to payment'}
                </button>
              )}
            </div>
          </form>
        )}
      </main>
    </Layout>
  )
}

export default Recover
