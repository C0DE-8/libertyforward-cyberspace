import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout.jsx'
import styles from '../../components/layout/Layout.module.css'

function NotFound() {
  return (
    <Layout>
      <main className={styles.notFound}>
        <p className={styles.kicker}>404</p>
        <h1>Page not found</h1>
        <p>The page you are looking for does not exist.</p>
        <Link className={styles.headerCta} to="/">
          Go home
        </Link>
      </main>
    </Layout>
  )
}

export default NotFound
