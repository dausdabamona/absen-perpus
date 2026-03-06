import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import BottomNav from './components/layout/BottomNav'
import ScanPage from './pages/ScanPage'
import HistoryPage from './pages/HistoryPage'
import ReportPage from './pages/ReportPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        <Route path="/" element={<ScanPage />} />
        <Route path="/riwayat" element={<HistoryPage />} />
        <Route path="/laporan" element={<ReportPage />} />
        <Route path="/pengaturan" element={<SettingsPage />} />
      </Routes>
      <BottomNav />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '600',
          },
        }}
      />
    </div>
  )
}
