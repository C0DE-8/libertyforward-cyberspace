import { useEffect } from 'react'
import styles from './Toast.module.css'

export default function Toast({
  visible,
  title,
  message,
  tone = 'success',
  actionLabel,
  onAction,
  onClose,
  autoCloseMs = 0,
}) {
  useEffect(() => {
    if (!visible || !autoCloseMs || !onClose) return undefined

    const timer = window.setTimeout(onClose, autoCloseMs)
    return () => window.clearTimeout(timer)
  }, [visible, autoCloseMs, onClose])

  if (!visible) return null

  return (
    <div className={styles.viewport} role="status" aria-live="polite">
      <div className={`${styles.toast} ${styles[tone]}`}>
        <div className={styles.content}>
          {title && <strong>{title}</strong>}
          {message && <p>{message}</p>}
        </div>
        <div className={styles.actions}>
          {actionLabel && onAction && (
            <button type="button" className={styles.actionBtn} onClick={onAction}>
              {actionLabel}
            </button>
          )}
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
