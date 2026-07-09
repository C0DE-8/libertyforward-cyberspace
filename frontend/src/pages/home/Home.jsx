import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout.jsx'
import officialSeal from '../../assets/official-seal.png'
import {
  ASSETS,
  RECOVERY_STEPS,
  SCAM_FAQS,
  SCAM_SERVICES,
  SCAM_SLIDES,
  SCAM_TYPES,
} from '../../lib/scamData.js'
import { getSettings } from '../../lib/api.js'
import { formatFee } from '../../lib/format.js'
import styles from './Home.module.css'


const stats = [
  ['25+', 'authorized scam categories'],
  ['18+', 'blockchain networks'],
  ['8+', 'treasury payment routes'],
  ['24h', 'priority case window'],
]

function Home() {
  const [tiers, setTiers] = useState([])
  const [activeSlide, setActiveSlide] = useState(0)
  const slide = SCAM_SLIDES[activeSlide]

  useEffect(() => {
    getSettings().then((data) => setTiers(data.tiers)).catch(() => {})
  }, [])

  const showSlide = (direction) => {
    setActiveSlide((current) => {
      const next = current + direction
      if (next < 0) return SCAM_SLIDES.length - 1
      if (next >= SCAM_SLIDES.length) return 0
      return next
    })
  }

  return (
    <Layout>
      <main>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Authorized scam recovery portal</p>
            <h1>Liberty Forward Cyberspace</h1>
            <p className={styles.lede}>
              The official authorized platform for digital asset scam recovery.
              All scam categories accepted — romance fraud, pig butchering, fake
              platforms, phishing drainers, impersonation, rug pulls, and fake
              recovery scams. No case type excluded.
            </p>
            <div className={styles.actions}>
              <Link className={styles.primaryButton} to="/recover">File authorized intake</Link>
              <Link className={styles.secondaryButton} to="/status">Check case status</Link>
              <Link className={styles.secondaryButton} to="/security">Security policy</Link>
            </div>
          </div>

          <div className={styles.sealStage} aria-label="Official portal preview">
            <div className={styles.orbitOne} aria-hidden="true"></div>
            <div className={styles.orbitTwo} aria-hidden="true"></div>
            <div className={styles.portalCard}>
              <img src={officialSeal} alt="Official government seal" className={styles.sealImage} />
              <div className={styles.portalTop}>
                <span>Recovery desk</span>
                <strong>Authorized</strong>
              </div>
              <div className={styles.statusCard}>
                <span>Active cases</span>
                <strong>All scam types</strong>
              </div>
              <div className={styles.assetList}>
                {ASSETS.slice(0, 8).map((asset) => (
                  <div key={asset}>
                    <span>{asset}</span>
                    <strong>Accepted</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.officialNotice}>
          <img src={officialSeal} alt="" className={styles.noticeSeal} />
          <div>
            <strong>Authorized notice:</strong>
            <span>
              This portal accepts intake for every recognized scam category.
              File your case, select an authorized service tier, and submit
              payment to the official treasury wallet to activate review.
              Form ID: LFC-SCR-250-001.
            </span>
          </div>
        </section>

        <section className={styles.stats} aria-label="Service highlights">
          {stats.map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>

        <section className={styles.scamTypesSection}>
          <div>
            <p className={styles.eyebrow}>Authorized categories</p>
            <h2>Every scam type. No exclusions.</h2>
            <p>All categories below are accepted for authorized intake and case officer assignment.</p>
          </div>
          <ul className={styles.scamTypeList}>
            {SCAM_TYPES.map((type) => (
              <li key={type}>{type}</li>
            ))}
          </ul>
        </section>

        <section className={styles.tierSection} aria-label="Service tiers">
          <div className={styles.tierIntro}>
            <p className={styles.eyebrow}>Authorized service tiers</p>
            <h2>Transparent fees for every case scope.</h2>
            <p>Six tiers from citizen intake through critical emergency response. Fees confirmed on official invoice.</p>
          </div>
          <div className={styles.tierGrid}>
            {(tiers.length ? tiers : []).map((tier, index) => (
              <article key={tier.id} style={{ '--delay': `${index * 80}ms` }}>
                <span>Tier {tier.level}</span>
                <h3>{tier.name}</h3>
                <strong>{formatFee(tier.fee)}</strong>
                <p>{tier.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.sliderSection} aria-label="Scam case types">
          <div className={styles.sliderCopy}>
            <p className={styles.eyebrow}>Case pathways</p>
            <h2>Authorized recovery for every scenario.</h2>
            <p>Each pathway includes on-chain tracing, documentation, and official case reference issuance.</p>
          </div>
          <div className={styles.slideCard}>
            <span>{slide.tag}</span>
            <h3>{slide.title}</h3>
            <p>{slide.text}</p>
            <div className={styles.slideControls}>
              <button type="button" onClick={() => showSlide(-1)} aria-label="Previous">Prev</button>
              <div aria-label="Slide position">
                {SCAM_SLIDES.map((item, index) => (
                  <button
                    className={index === activeSlide ? styles.activeDot : ''}
                    key={item.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    aria-label={`Show ${item.title}`}
                  ></button>
                ))}
              </div>
              <button type="button" onClick={() => showSlide(1)} aria-label="Next">Next</button>
            </div>
          </div>
        </section>

        <section className={styles.featureSection}>
          <div>
            <p className={styles.eyebrow}>Authorized workflow</p>
            <h2>From intake to recovery coordination.</h2>
          </div>
          <div className={styles.featureGrid}>
            {RECOVERY_STEPS.map((step, index) => (
              <article key={step.title}>
                <span>{index + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.supportSection}>
          <div>
            <p className={styles.eyebrow}>Authorized services</p>
            <h2>Full-scope scam recovery support.</h2>
            <p>Every service below is available across all authorized tiers and scam categories.</p>
          </div>
          <ul>
            {SCAM_SERVICES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.faqSection}>
          <div>
            <p className={styles.eyebrow}>Frequently asked</p>
            <h2>Before you file</h2>
          </div>
          <div className={styles.faqGrid}>
            {SCAM_FAQS.map(([question, answer]) => (
              <article key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  )
}

export default Home
