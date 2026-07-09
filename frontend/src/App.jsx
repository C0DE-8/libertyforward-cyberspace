import { Route, Routes } from 'react-router-dom'
import Admin from './pages/admin/Admin.jsx'
import Home from './pages/home/Home.jsx'
import NotFound from './pages/not-found/NotFound.jsx'
import Recover from './pages/recover/Recover.jsx'
import Security from './pages/security/Security.jsx'
import CaseStatus from './pages/status/CaseStatus.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/status" element={<CaseStatus />} />
      <Route path="/security" element={<Security />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
