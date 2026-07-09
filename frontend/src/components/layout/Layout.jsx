import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import officialSeal from '../../assets/official-seal.png'
import { STORAGE_KEYS } from '../../lib/storage.js'
import styles from './Layout.module.css'

function CookieBanner() {
  const [status, setStatus] = useState(() => (
    window.localStorage.getItem(STORAGE_KEYS.cookies) || 'pending'
  ))
  const [showPreferences, setShowPreferences] = useState(false)

  const saveChoice = (choice) => {
    window.localStorage.setItem(STORAGE_KEYS.cookies, choice)
    setStatus(choice)
  }

  if (status !== 'pending') {
    return null
  }

  return (
    <section className={styles.cookieBanner} aria-label="Cookie notice">
      <div>
        <strong>Official notice</strong>
        <p>
          Liberty Forward Cyberspace uses essential cookies to maintain portal
          security and session integrity. With your consent, analytics cookies
          may be used to improve case processing workflows.
        </p>
        {showPreferences && (
          <div className={styles.cookiePreferences}>
            <label>
              <input type="checkbox" checked readOnly />
              Strictly necessary cookies
            </label>
            <label>
              <input type="checkbox" />
              Analytics and performance cookies
            </label>
          </div>
        )}
      </div>
      <div className={styles.cookieActions}>
        <button type="button" onClick={() => setShowPreferences((value) => !value)}>
          Cookie preferences
        </button>
        <button type="button" onClick={() => saveChoice('rejected')}>
          Reject additional cookies
        </button>
        <button type="button" onClick={() => saveChoice('accepted')}>
          Accept and continue
        </button>
      </div>
    </section>
  )
}

function Layout({ children }) {
  return (
    <div className={styles.shell}>
      <div className={styles.officialBar}>
        <span>An official portal of Liberty Forward Cyberspace</span>
      </div>

      <header className={styles.header}>
        <Link className={styles.brand} to="/" aria-label="Liberty Forward Cyberspace home">
          <img className={styles.brandMark} src={officialSeal} alt="Official government seal" />
          <span className={styles.brandText}>
            <strong>Liberty Forward</strong>
            <small>Cyberspace · Office of Public Programs</small>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Primary navigation">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/recover">File Intake</NavLink>
          <NavLink to="/status">Check Status</NavLink>
          <NavLink to="/security">Security</NavLink>
        </nav>

        <Link className={styles.headerCta} to="/recover">
          Begin filing
        </Link>
      </header>

      {children}

      <footer className={styles.footer}>
        <div>
          <span className={styles.footerBrand}>
            <img src={officialSeal} alt="" />
            <strong>Liberty Forward Cyberspace</strong>
          </span>
          <p>Authorized digital asset scam recovery and case coordination services.</p>
          <p className={styles.footerDisclaimer}>
            Non-custodial. No seed phrases or private keys are ever requested.
          </p>
        </div>
        <div className={styles.footerLinks}>
          <Link to="/recover">File a case</Link>
          <Link to="/status">Check case status</Link>
          <Link to="/security">Security policy</Link>
        </div>
      </footer>

      <CookieBanner />
    </div>
  )
}

export default Layout
