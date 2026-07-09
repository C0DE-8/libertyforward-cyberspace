import styles from './VerifiedTelegramCta.module.css'

export default function VerifiedTelegramCta({ url, className = '' }) {
  if (!url?.trim()) return null

  return (
    <a
      href={url}
      className={`${styles.telegramBtn} ${className}`.trim()}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className={styles.telegramIcon} aria-hidden="true">✈</span>
      Contact case officer on Telegram
    </a>
  )
}
