import { useEffect, useMemo, useState } from 'react'
import styles from './Admin.module.css'

const STATUS_LABELS = {
  pending: 'Awaiting payment',
  submitted: 'Submitted',
  paid: 'Confirmed',
  verified: 'Verified',
}

function formatShortDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

export default function CaseWorkbench({
  records,
  selectedId,
  onSelect,
  emptyMessage,
  searchPlaceholder = 'Search by name, reference, or email…',
  children,
}) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return records

    return records.filter((record) => (
      record.reference?.toLowerCase().includes(query)
      || record.name?.toLowerCase().includes(query)
      || record.email?.toLowerCase().includes(query)
      || record.scamType?.toLowerCase().includes(query)
    ))
  }, [records, search])

  useEffect(() => {
    if (filtered.length === 0) {
      if (selectedId !== null) onSelect(null)
      return
    }

    if (!filtered.some((record) => record.id === selectedId)) {
      onSelect(filtered[0].id)
    }
  }, [filtered, selectedId, onSelect])

  if (records.length === 0) {
    return <p className={styles.emptyState}>{emptyMessage}</p>
  }

  return (
    <div className={styles.workbench}>
      <aside className={styles.caseListPanel}>
        <div className={styles.caseListHead}>
          <strong>{filtered.length} case{filtered.length !== 1 ? 's' : ''}</strong>
          <input
            type="search"
            className={styles.caseSearch}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>

        <ul className={styles.caseList}>
          {filtered.length === 0 ? (
            <li className={styles.caseListEmpty}>No cases match your search.</li>
          ) : (
            filtered.map((record) => (
              <li key={record.id}>
                <button
                  type="button"
                  className={`${styles.caseListItem} ${selectedId === record.id ? styles.caseListItemActive : ''}`}
                  onClick={() => onSelect(record.id)}
                >
                  <div className={styles.caseListTop}>
                    <span>{record.reference}</span>
                    <span className={`${styles.statusBadge} ${styles[`status_${record.paymentStatus}`]}`}>
                      {STATUS_LABELS[record.paymentStatus] || record.paymentStatus}
                    </span>
                  </div>
                  <strong>{record.name}</strong>
                  <p>{record.scamType}</p>
                  <div className={styles.caseListMeta}>
                    <span>${record.totalLostUSD} loss</span>
                    <span>{record.reviewFee}</span>
                    <span>{formatShortDate(record.createdAt)}</span>
                  </div>
                </button>
              </li>
            ))
          )}
        </ul>
      </aside>

      <div className={styles.caseDetailPanel}>
        {selectedId && filtered.some((record) => record.id === selectedId) ? (
          children
        ) : (
          <div className={styles.caseDetailEmpty}>
            <h3>Select a case</h3>
            <p>Choose a filing from the list to review the full dossier.</p>
          </div>
        )}
      </div>
    </div>
  )
}
