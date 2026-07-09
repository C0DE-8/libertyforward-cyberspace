export const PAYMENT_LABELS = {
  pending: { text: 'Awaiting payment', tone: 'pending' },
  submitted: { text: 'Payment submitted — awaiting confirmation', tone: 'submitted' },
  paid: { text: 'Payment confirmed — case review activated', tone: 'paid' },
  verified: { text: 'Payment verified — case officer assigned', tone: 'verified' },
}

export const PAYMENT_STATUS_MESSAGES = {
  pending: 'Awaiting payment. Send the tier fee, then submit your transaction hash.',
  submitted: 'Payment submitted. Awaiting treasury confirmation.',
  paid: 'Payment confirmed. Your case review is now active.',
  verified: 'Payment verified. A case officer has been assigned.',
}

export const STATUS_STEPS = [
  { key: 'filed', label: 'Case filed', field: 'createdAt' },
  { key: 'submitted', label: 'Payment submitted', field: 'paymentSubmittedAt' },
  { key: 'paid', label: 'Payment confirmed', field: 'paidAt' },
  { key: 'verified', label: 'Case verified', field: 'verifiedAt' },
]

export function formatCaseDate(value) {
  if (!value) return null
  return new Date(value).toLocaleString()
}

export function getActiveStepIndex(record) {
  if (record.verifiedAt || record.paymentStatus === 'verified') return 3
  if (record.paidAt || record.paymentStatus === 'paid') return 2
  if (record.paymentSubmittedAt || record.paymentStatus === 'submitted') return 1
  return 0
}
