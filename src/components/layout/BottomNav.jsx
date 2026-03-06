import { NavLink } from 'react-router-dom'
import { ScanLine, Clock, BarChart3, Settings } from 'lucide-react'
import clsx from 'clsx'

const tabs = [
  { to: '/', icon: ScanLine, label: 'Scan' },
  { to: '/riwayat', icon: Clock, label: 'Riwayat' },
  { to: '/laporan', icon: BarChart3, label: 'Laporan' },
  { to: '/pengaturan', icon: Settings, label: 'Pengaturan' },
]

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-bottom z-40">
      <div className="flex">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              clsx(
                'flex-1 flex flex-col items-center py-2 text-xs font-semibold transition-colors',
                isActive
                  ? 'text-primary-500'
                  : 'text-gray-400 hover:text-gray-600'
              )
            }
          >
            <Icon size={22} />
            <span className="mt-0.5">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
