import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout.jsx'
import layoutStyles from '../../components/layout/Layout.module.css'
import { getCaseByReference, getSettings } from '../../lib/api.js'
import VerifiedTelegramCta from '../../components/VerifiedTelegramCta/VerifiedTelegramCta.jsx'
import {
  PAYMENT_LABELS,
  STATUS_STEPS,
  formatCaseDate,
  getActiveStepIndex,
} from '../../lib/caseStatus.js'
import styles from './CaseStatus.module.css'

const REF_KEY = 'lfc-active-reference'

function CaseStatusView({ record, onRefresh, refreshing, telegramUrl, lastSyncedAt }) {
  const status = PAYMENT_LABELS[record.paymentStatus] || PAYMENT_LABELS.pending
  const activeStep = getActiveStepIndex(record)

  return (
    <section className={styles.statusCard}>
      <header className={styles.statusHeader}>
        <div>
          <span className={styles.ref}>{record.reference}</span>
          <h2>{record.name}</h2>
          <p>Filed {formatCaseDate(record.createdAt)}</p>
        </div>
        <span className={`${styles.statusPill} ${styles[`pill_${status.tone}`]}`}>
          {status.text}
        </span>
      </header>

      <ol className={styles.timeline}>
        {STATUS_STEPS.map((step, index) => {
          const done = index <= activeStep
          const current = index === activeStep
          const date = formatCaseDate(record[step.field])

          return (
            <li
              key={step.key}
              className={`${styles.timelineItem} ${done ? styles.timelineDone : ''} ${current ? styles.timelineCurrent : ''}`}
            >
              <span className={styles.timelineDot} />
              <div>
                <strong>{step.label}</strong>
                <p>{date || (done ? 'Completed' : 'Pending')}</p>
              </div>
            </li>
          )
        })}
      </ol>

      <dl className={styles.summaryGrid}>
        <div>
          <dt>Service tier</dt>
          <dd>{record.tierName}</dd>
        </div>
        <div>
          <dt>Tier fee</dt>
          <dd>{record.reviewFee}</dd>
        </div>
        <div>
          <dt>Scam type</dt>
          <dd>{record.scamType}</dd>
        </div>
        <div>
          <dt>Total loss (USD)</dt>
          <dd>${record.totalLostUSD}</dd>
        </div>
        {record.paymentTxHash && (
          <div className={styles.fullRow}>
            <dt>Payment TXID</dt>
            <dd><code>{record.paymentTxHash}</code></dd>
          </div>
        )}
      </dl>

      {record.paymentStatus === 'verified' && (
        <div className={styles.verifiedCta}>
          <strong>Case verified — officer assigned</strong>
          <p>Your case has been verified. Continue with your assigned case officer on Telegram.</p>
          {telegramUrl ? (
            <VerifiedTelegramCta url={telegramUrl} />
          ) : (
            <p className={styles.verifiedNote}>
              Officer contact link will appear here automatically once treasury publishes it.
            </p>
          )}
        </div>
      )}

      <div className={styles.statusActions}>
        <div className={styles.statusActionRow}>
          <button type="button" className={styles.refreshBtn} onClick={onRefresh} disabled={refreshing}>
            {refreshing ? 'Refreshing...' : 'Refresh status'}
          </button>

          {(record.paymentStatus === 'pending' || record.paymentStatus === 'submitted') && (
            <Link className={styles.primaryBtn} to="/recover">
              {record.paymentStatus === 'pending' ? 'Complete payment' : 'View payment page'}
            </Link>
          )}
        </div>
        {lastSyncedAt && (
          <p className={styles.liveStatus}>
            Live updates on · Last synced at {lastSyncedAt}
          </p>
        )}
      </div>
    </section>
  )
}

const POLL_INTERVAL_MS = 5000

function CaseStatus() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [reference, setReference] = useState(searchParams.get('ref') || '')
  const [record, setRecord] = useState(null)
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [telegramUrl, setTelegramUrl] = useState('')
  const [lastSyncedAt, setLastSyncedAt] = useState('')

  const loadPortalSettings = async () => {
    try {
      const data = await getSettings()
      setTelegramUrl(data.portal?.telegramUrl || '')
    } catch {
      /* ignore */
    }
  }

  const syncCase = async (refValue, { isRefresh = false, silent = false } = {}) => {
    const trimmed = refValue.trim().toUpperCase()
    if (!trimmed) {
      if (!silent) setError('Enter your case reference number.')
      return false
    }

    if (isRefresh) setRefreshing(true)
    else if (!silent) setLoading(true)

    if (!silent) setError('')

    try {
      const [payload] = await Promise.all([
        getCaseByReference(trimmed),
        loadPortalSettings(),
      ])
      setRecord(payload.record)
      setReference(trimmed)
      setLastSyncedAt(new Date().toLocaleTimeString())
      if (!silent) {
        window.localStorage.setItem(REF_KEY, trimmed)
        navigate(`/status?ref=${encodeURIComponent(trimmed)}`, { replace: true })
      }
      return true
    } catch {
      if (!silent) {
        setRecord(null)
        setError('Case not found. Check your reference and try again.')
      }
      return false
    } finally {
      if (!silent || isRefresh) {
        setLoading(false)
        setRefreshing(false)
      }
    }
  }

  const lookupCase = (refValue, options = {}) => syncCase(refValue, options)

  useEffect(() => {
    loadPortalSettings()
    const refFromUrl = searchParams.get('ref')
    if (refFromUrl) {
      setReference(refFromUrl)
      syncCase(refFromUrl)
    }
  }, [])

  useEffect(() => {
    if (!record?.reference) return undefined

    let cancelled = false

    const poll = async () => {
      if (cancelled) return
      await syncCase(record.reference, { silent: true })
    }

    const interval = setInterval(poll, POLL_INTERVAL_MS)

    const onVisible = () => {
      if (document.visibilityState === 'visible') poll()
    }
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [record?.reference])

  const handleSubmit = (event) => {
    event.preventDefault()
    lookupCase(reference)
  }

  return (
    <Layout>
      <main className={`${layoutStyles.page} ${styles.page}`}>
        <section className={styles.intro}>
          <p className={styles.kicker}>Case status portal</p>
          <h1>Check your case status</h1>
          <p>
            Enter the reference number from your filing confirmation to view payment
            status and case progress. Updates automatically every few seconds.
          </p>
        </section>

        <form className={styles.lookupForm} onSubmit={handleSubmit}>
          <label>
            Case reference number
            <input
              type="text"
              value={reference}
              onChange={(event) => setReference(event.target.value.toUpperCase())}
              placeholder="e.g. LFC-477508"
              autoComplete="off"
              spellCheck={false}
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Looking up...' : 'Check status'}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}

        {record && (
          <CaseStatusView
            record={record}
            refreshing={refreshing}
            telegramUrl={telegramUrl}
            lastSyncedAt={lastSyncedAt}
            onRefresh={() => lookupCase(record.reference, { isRefresh: true })}
          />
        )}
      </main>
    </Layout>
  )
}

export default CaseStatus
