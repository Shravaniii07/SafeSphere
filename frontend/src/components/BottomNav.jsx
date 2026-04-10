import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, Globe, MapPin, User, Bell } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { id: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { id: '/location', icon: Globe, label: 'Location' },
  { id: '/sos', icon: AlertTriangle, label: 'SOS', isCenter: true },
  { id: '/nearby', icon: MapPin, label: 'Services' },
  { id: '/profile', icon: User, label: 'Profile' },
]

export default function BottomNav() {
  const { user } = useApp()
  const { role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const filteredItems = role === 'admin' ? navItems.filter(item => !item.isSos) : navItems

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-2xl border-t border-gray-100 px-2 pb-[max(4px,env(safe-area-inset-bottom))]" role="navigation" aria-label="Bottom navigation">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {filteredItems.map(item => {
          const isActive = location.pathname === item.id

          if (item.isCenter || item.isSos) {
            return (
              <button key={item.id} onClick={() => navigate(item.id)} aria-label="SOS"
                className="relative -mt-5 w-14 h-14 rounded-full bg-red-500 text-white flex items-center justify-center shadow-[0_4px_20px_rgba(239,68,68,0.3)] cursor-pointer hover:bg-red-600 hover:scale-105 active:scale-95 transition-all duration-300 animate-sos-glow">
                <AlertTriangle className="w-6 h-6" />
              </button>
            )
          }

          return (
            <button key={item.id} onClick={() => navigate(item.id)} aria-label={item.label}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-xl transition-all duration-300 cursor-pointer ${isActive ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}>
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && <div className="absolute -bottom-1 w-5 h-0.5 rounded-full bg-blue-500" />}
              {item.id === '/profile' && user.unreadNotifications > 0 && (
                <span className="absolute top-0 right-2 w-3.5 h-3.5 text-[8px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center">{user.unreadNotifications}</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
