import { useEffect, useState } from 'react'
import { copyToClipboard } from '../../lib/clipboard.js'
import styles from './Admin.module.css'

const STATUS_LABELS = {
  pending: 'Awaiting payment',
  submitted: 'Submitted',
  paid: 'Confirmed',
  verified: 'Verified',
}

function formatDate(value) {
  if (!value) return null
  return new Date(value).toLocaleString()
}

function formatDateOnly(value) {
  if (!value) return null
  return new Date(value).toLocaleDateString()
}

function displayValue(value) {
  if (value === null || value === undefined || value === '') return '—'
  return String(value)
}

function InfoField({ label, value, mono = false, full = false, copyable = false }) {
  const [copied, setCopied] = useState(false)
  const shown = displayValue(value)

  const handleCopy = async () => {
    if (!value) return
    try {
      await copyToClipboard(String(value))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={`${styles.field} ${full ? styles.fieldFull : ''}`}>
      <dt>{label}</dt>
      <dd className={mono ? styles.monoValue : ''}>
        <span>{shown}</span>
        {copyable && value && (
          <button type="button" className={styles.copyFieldBtn} onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </dd>
    </div>
  )
}

function DossierSection({ title, description, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <section className={styles.dossierSection}>
      <button
        type="button"
        className={`${styles.sectionToggle} ${open ? styles.sectionToggleOpen : ''}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div className={styles.sectionHead}>
          <h3>{title}</h3>
          {description && <p>{description}</p>}
        </div>
        <span className={styles.sectionChevron} aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open && <div className={styles.fieldGrid}>{children}</div>}
    </section>
  )
}

export default function CaseDossierCard({
  record,
  onPaymentStatus,
  onPaymentDetails,
  onDelete,
  showPaymentActions = true,
  paymentActions,
  paymentStatuses,
}) {
  const [paymentTxHash, setPaymentTxHash] = useState(record?.paymentTxHash || '')
  const [payingFrom, setPayingFrom] = useState(record?.payingFrom || '')
  const [savingPayment, setSavingPayment] = useState(false)

  useEffect(() => {
    setPaymentTxHash(record?.paymentTxHash || '')
    setPayingFrom(record?.payingFrom || '')
  }, [record?.id, record?.paymentTxHash, record?.payingFrom])

  if (!record) return null

  const savePaymentDetails = async (event) => {
    event.preventDefault()
    if (!onPaymentDetails) return

    setSavingPayment(true)
    try {
      await onPaymentDetails(record.id, {
        paymentTxHash,
        payingFrom,
      })
    } finally {
      setSavingPayment(false)
    }
  }

  return (
    <article className={styles.dossierCard}>
      <header className={styles.dossierHeader}>
        <div className={styles.dossierIdentity}>
          <span className={styles.dossierRef}>{record.reference}</span>
          <h2>{record.name}</h2>
          <p className={styles.dossierSub}>
            Form {displayValue(record.formId)} · Filed {formatDate(record.createdAt)}
          </p>
        </div>
        <div className={styles.dossierBadges}>
          <span className={`${styles.statusBadge} ${styles[`status_${record.paymentStatus}`]}`}>
            {STATUS_LABELS[record.paymentStatus] || record.paymentStatus}
          </span>
          {record.status && record.status !== 'new' && (
            <span className={styles.caseBadge}>{record.status}</span>
          )}
        </div>
      </header>

      <div className={styles.dossierSummary}>
        <div>
          <span>Total loss</span>
          <strong>${displayValue(record.totalLostUSD)}</strong>
        </div>
        <div>
          <span>Service tier</span>
          <strong>{record.tierName}</strong>
        </div>
        <div>
          <span>Tier fee</span>
          <strong>{record.reviewFee}</strong>
        </div>
        <div>
          <span>Scam type</span>
          <strong>{record.scamType}</strong>
        </div>
      </div>

      <DossierSection title="Contact information" description="Victim contact details and location." defaultOpen>
        <InfoField label="Full name" value={record.name} />
        <InfoField label="Email" value={record.email} copyable />
        <InfoField label="Phone" value={record.phone} copyable />
        <InfoField label="Alternate contact" value={record.contact} />
        <InfoField label="Country" value={record.country} />
        <InfoField label="State / region" value={record.stateRegion} />
        <InfoField label="City" value={record.city} />
      </DossierSection>

      <DossierSection title="Incident report" description="How the scam occurred and when.">
        <InfoField label="Scam type" value={record.scamType} full />
        <InfoField label="Platform / app used" value={record.scamPlatform} />
        <InfoField label="Contact method" value={record.contactMethod} />
        <InfoField label="Where funds were locked" value={record.lockedLocation} full />
        <InfoField label="Incident date" value={formatDateOnly(record.incidentDate)} />
        <InfoField label="Police report" value={record.policeReport} full />
      </DossierSection>

      <DossierSection title="Asset & loss details" description="Digital assets involved and amounts lost.">
        <InfoField label="Primary asset" value={record.asset} />
        <InfoField label="Network / chain" value={record.network} />
        <InfoField label="Locked amount" value={record.lockedAmount} />
        <InfoField label="Total loss (USD)" value={record.totalLostUSD} />
        <InfoField label="Exchange involved" value={record.exchangeInvolved} full />
      </DossierSection>

      <DossierSection title="Evidence & addresses" description="Wallet addresses, proof, and supporting documentation.">
        <InfoField label="Victim wallet address" value={record.walletAddress} mono copyable full />
        <InfoField label="Scammer address" value={record.scammerAddress} mono copyable full />
        <InfoField label="Transaction proof" value={record.transactionProof} mono full />
      </DossierSection>

      {record.scamDetails?.trim() && (
        <DossierSection title="Scam narrative" description="Victim statement in their own words.">
          <div className={`${styles.narrativeField} ${styles.fieldFull}`}>
            <p>{record.scamDetails}</p>
          </div>
        </DossierSection>
      )}

      <DossierSection title="Service & treasury" description="Selected recovery tier and payment destination.">
        <InfoField label="Service tier" value={`${record.tierName} (Level ${record.tierLevel})`} full />
        <InfoField label="Review fee" value={record.reviewFee} />
        <InfoField label="Payment asset" value={record.paymentAsset} />
        <InfoField label="Fee speed" value={record.feeSpeed} />
        <InfoField label="Treasury wallet" value={record.paymentWalletName} />
        <InfoField label="Treasury address" value={record.paymentWalletAddress} mono copyable full />
      </DossierSection>

      <DossierSection title="Payment & verification" description="Transaction hash, payer address, and confirmation timeline." defaultOpen>
        <InfoField label="Payment status" value={STATUS_LABELS[record.paymentStatus] || record.paymentStatus} />
        <InfoField label="Payment TXID" value={record.paymentTxHash} mono copyable full />
        <InfoField label="Paying from address" value={record.payingFrom} mono copyable full />
        <InfoField label="TX submitted" value={formatDate(record.paymentSubmittedAt)} />
        <InfoField label="Payment confirmed" value={formatDate(record.paidAt)} />
        <InfoField label="Case verified" value={formatDate(record.verifiedAt)} />
        <InfoField label="Last updated" value={formatDate(record.updatedAt)} />

        {onPaymentDetails && (
          <form className={`${styles.paymentEditForm} ${styles.fieldFull}`} onSubmit={savePaymentDetails}>
            <strong>Update payment details</strong>
            <label>
              Payment TXID
              <input
                type="text"
                value={paymentTxHash}
                onChange={(event) => setPaymentTxHash(event.target.value)}
                placeholder="Paste or correct the transaction hash"
              />
            </label>
            <label>
              Paying from address
              <input
                type="text"
                value={payingFrom}
                onChange={(event) => setPayingFrom(event.target.value)}
                placeholder="Wallet address funds were sent from"
              />
            </label>
            <button type="submit" disabled={savingPayment || (!paymentTxHash.trim() && !payingFrom.trim())}>
              {savingPayment ? 'Saving...' : 'Save payment details'}
            </button>
          </form>
        )}
      </DossierSection>

      {showPaymentActions && (
        <footer className={styles.dossierFooter}>
          {paymentActions ? (
            <div className={styles.paymentActions}>
              <p className={styles.actionLabel}>Manage payment status</p>
              <div className={styles.actionRow}>
                {(paymentActions[record.paymentStatus] || paymentActions.pending).map((action) => (
                  <button
                    key={action.status}
                    type="button"
                    className={styles[`action_${action.style}`]}
                    onClick={() => onPaymentStatus(record.id, action.status, { clearPayment: action.clearPayment })}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
              <div className={styles.statusRow}>
                {paymentStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={record.paymentStatus === status ? styles.statusBtnActive : styles.statusChip}
                    onClick={() => onPaymentStatus(record.id, status)}
                  >
                    Set {STATUS_LABELS[status] || status}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.recordActions}>
              {paymentStatuses.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={record.paymentStatus === status ? styles.statusBtnActive : ''}
                  onClick={() => onPaymentStatus(record.id, status)}
                >
                  {STATUS_LABELS[status] || status}
                </button>
              ))}
              <button type="button" className={styles.deleteBtn} onClick={() => onDelete(record.id)}>
                Delete case
              </button>
            </div>
          )}
        </footer>
      )}
    </article>
  )
}
