import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout.jsx'
import layoutStyles from '../../components/layout/Layout.module.css'
import styles from './Security.module.css'

const POLICY_META = {
  id: 'LFC-SEC-POL-2024-001',
  effective: 'January 1, 2024',
  revised: 'July 9, 2026',
  authority: 'Office of Public Programs · Liberty Forward Cyberspace',
}

const PRINCIPLES = [
  {
    title: 'Non-custodial intake',
    text: 'This portal does not request, store, or process seed phrases, private keys, wallet passwords, or remote access to your devices. Case review is conducted on information you voluntarily submit.',
  },
  {
    title: 'Published treasury only',
    text: 'Tier fees are payable exclusively to treasury wallet addresses published within this authorized portal. Payments sent to addresses obtained through email, social media, or third-party messages are not recognized.',
  },
  {
    title: 'Reference-based accountability',
    text: 'Every accepted filing receives an official case reference number. Status, payment confirmation, and officer assignment are tracked against that reference in the case management system.',
  },
  {
    title: 'Review before representation',
    text: 'No case officer contact is initiated until intake review is complete and payment status reflects treasury confirmation in accordance with the published service tier.',
  },
]

const PROHIBITED = [
  'Requesting a victim\'s seed phrase, private key, or exchange login credentials under any circumstance.',
  'Directing victims to send cryptocurrency to wallets not listed on this portal\'s Treasury Wallets configuration.',
  'Claiming guaranteed recovery of funds or promising specific blockchain reversal outcomes.',
  'Soliciting payment through unsolicited direct messages on Telegram, WhatsApp, SMS, or social media.',
  'Impersonating federal law enforcement, judicial officers, or employees of Liberty Forward Cyberspace.',
]

const VERIFICATION_STEPS = [
  {
    step: '01',
    title: 'Confirm the official domain',
    text: 'Access the portal only through the authorized Liberty Forward Cyberspace entry point. Do not follow links from unsolicited messages.',
  },
  {
    step: '02',
    title: 'Verify your case reference',
    text: 'Use the Check Status portal with the reference issued at filing. Do not share your reference publicly or with unverified third parties.',
  },
  {
    step: '03',
    title: 'Match treasury addresses',
    text: 'Before sending payment, compare the treasury address shown in your case file with the address published under Treasury Wallets in this portal.',
  },
  {
    step: '04',
    title: 'Await verified assignment',
    text: 'Officer contact links are displayed only after case verification is recorded in the system. Unsolicited contact prior to verification should be treated as fraudulent.',
  },
]

const DOCUMENTATION_STANDARDS = [
  {
    title: 'Incident narrative',
    text: 'Provide a clear chronological account of how contact was made, how funds were transferred, and which platforms or wallets were involved. Include dates where known.',
  },
  {
    title: 'Transaction records',
    text: 'Submit wallet addresses, transaction hashes, and exchange records relevant to the loss. These materials are reviewed as part of the authorized tier scope.',
  },
  {
    title: 'Law enforcement reference',
    text: 'If a police or regulatory report has been filed, enter the report number and issuing authority during intake. This information is retained with your case file for coordination purposes.',
  },
  {
    title: 'Communication preservation',
    text: 'Retain screenshots, email headers, and message logs with suspected perpetrators. Do not delete accounts or evidence until instructed by your assigned case officer after verification.',
  },
  {
    title: 'Portal-only submission',
    text: 'All documentation must be submitted through this authorized intake system. Materials sent through unofficial channels are not accepted into the case record.',
  },
  {
    title: 'Reference retention',
    text: 'Safeguard your case reference number issued at filing. Use the Check Status portal to monitor payment confirmation, verification, and officer assignment.',
  },
]

function Security() {
  return (
    <Layout>
      <main className={`${layoutStyles.page} ${styles.page}`}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Official publication · Security & integrity policy</p>
            <h1>Information security and victim protection standards</h1>
            <p className={styles.lede}>
              This document establishes the authorized security framework governing
              digital asset scam recovery intake, treasury payment handling, and case
              officer assignment within Liberty Forward Cyberspace.
            </p>
          </div>
          <aside className={styles.metaCard} aria-label="Policy metadata">
            <dl>
              <div><dt>Policy ID</dt><dd>{POLICY_META.id}</dd></div>
              <div><dt>Effective date</dt><dd>{POLICY_META.effective}</dd></div>
              <div><dt>Last revised</dt><dd>{POLICY_META.revised}</dd></div>
              <div><dt>Issuing authority</dt><dd>{POLICY_META.authority}</dd></div>
            </dl>
          </aside>
        </section>

        <nav className={styles.toc} aria-label="Policy sections">
          <span>Sections</span>
          <a href="#purpose">Purpose & scope</a>
          <a href="#principles">Security principles</a>
          <a href="#treasury">Treasury & payments</a>
          <a href="#prohibited">Prohibited conduct</a>
          <a href="#verification">Official verification</a>
          <a href="#reporting">Documentation standards</a>
        </nav>

        <section className={styles.policySection} id="purpose">
          <h2>§ 1. Purpose and scope</h2>
          <div className={styles.prose}>
            <p>
              Liberty Forward Cyberspace maintains this portal as the official channel
              for victims of digital asset fraud to file structured recovery cases,
              submit evidentiary materials, and complete authorized tier-fee payments
              to designated treasury wallets.
            </p>
            <p>
              The Office of Public Programs is responsible for intake integrity,
              payment verification, and assignment of case officers following treasury
              confirmation. This policy applies to all filers, administrative personnel,
              and any party representing itself in connection with Liberty Forward
              Cyberspace services.
            </p>
          </div>
          <div className={styles.notice}>
            <strong>Official notice</strong>
            <p>
              Cryptocurrency transactions conducted on public blockchains are generally
              irreversible. Case review focuses on documentation, trace analysis, and
              coordination within the scope of the selected service tier. No outcome is
              guaranteed.
            </p>
          </div>
        </section>

        <section className={styles.policySection} id="principles">
          <h2>§ 2. Information security principles</h2>
          <p className={styles.sectionLead}>
            The following principles govern all interactions between filers and this portal.
          </p>
          <div className={styles.principleGrid}>
            {PRINCIPLES.map((item) => (
              <article key={item.title} className={styles.principleCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.policySection} id="treasury">
          <h2>§ 3. Treasury payment security</h2>
          <div className={styles.prose}>
            <p>
              Service tier fees are published transparently prior to filing. Upon case
              submission, filers are directed to a single treasury wallet corresponding
              to the network selected during intake. Payment submission requires a
              valid on-chain transaction hash (TXID) for treasury reconciliation.
            </p>
          </div>
          <ul className={styles.officialList}>
            <li>Pay only to addresses displayed on this portal at the time of payment.</li>
            <li>Confirm the correct blockchain network before initiating any transfer.</li>
            <li>Retain your TXID and the public address used to send payment.</li>
            <li>Do not send payment in response to instructions received outside this portal.</li>
            <li>Payment status advances only after administrative treasury review.</li>
          </ul>
        </section>

        <section className={styles.policySection} id="prohibited">
          <h2>§ 4. Prohibited conduct</h2>
          <p className={styles.sectionLead}>
            The following actions are inconsistent with authorized Liberty Forward
            Cyberspace operations and may constitute further victimization.
          </p>
          <ul className={styles.prohibitedList}>
            {PROHIBITED.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.policySection} id="verification">
          <h2>§ 5. Official verification procedures</h2>
          <p className={styles.sectionLead}>
            Filers should follow these procedures before providing information or
            making payment to any party claiming affiliation with this office.
          </p>
          <ol className={styles.stepList}>
            {VERIFICATION_STEPS.map((item) => (
              <li key={item.step}>
                <span>{item.step}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className={styles.policySection} id="reporting">
          <h2>§ 6. Incident documentation standards</h2>
          <p className={styles.sectionLead}>
            Complete and accurate documentation supports timely case review. Filers
            are responsible for providing the following materials through the
            authorized intake process. All records are handled in accordance with
            this office&apos;s information security principles.
          </p>
          <div className={styles.reportingGrid}>
            {DOCUMENTATION_STANDARDS.map((item) => (
              <article key={item.title} className={styles.reportingCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className={styles.notice}>
            <strong>Record integrity</strong>
            <p>
              Liberty Forward Cyberspace maintains case files exclusively within this
              portal. Do not transmit sensitive documentation through unsolicited email,
              messaging applications, or third-party websites claiming affiliation with
              this office.
            </p>
          </div>
        </section>

        <section className={styles.ctaBand}>
          <div>
            <h2>Authorized intake and status review</h2>
            <p>
              To file a case or review an existing reference, use the official
              portals linked below. Administrative staff never initiate contact
              requesting payment outside these channels.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <Link className={styles.primaryBtn} to="/recover">File authorized intake</Link>
            <Link className={styles.secondaryBtn} to="/status">Check case status</Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default Security
