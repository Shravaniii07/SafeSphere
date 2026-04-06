import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, AlertTriangle, Globe, Bell, User } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { id: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { id: '/notifications', label: 'Alerts', icon: Bell },
  { id: '/sos', label: 'SOS', icon: AlertTriangle, isSos: true },
  { id: '/location', label: 'Location', icon: Globe },
  { id: '/profile', label: 'Profile', icon: User },
]

export default function BottomNav() {
  const { user } = useApp()
  const { role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const activePage = location.pathname

  const filteredItems = role === 'admin' ? navItems.filter(item => !item.isSos) : navItems

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] glass border-t border-slate-100/60 px-2 pb-[env(safe-area-inset-bottom)]"
      role="navigation" aria-label="Mobile navigation">
      <div className="flex items-end justify-around h-16">
        {filteredItems.map(item => {
          const isActive = activePage === item.id
          if (item.isSos) {
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                className="relative -top-3 w-14 h-14 rounded-full bg-accent text-white flex items-center justify-center shadow-glow-accent active:scale-90 transition-all cursor-pointer"
                aria-label="Emergency SOS">
                <AlertTriangle className="w-6 h-6" />
              </button>
            )
          }
          return (
            <button key={item.id} onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 py-2 px-3 min-w-[56px] min-h-[44px] transition-colors cursor-pointer ${isActive ? 'text-primary' : 'text-slate-400'}`}
              aria-current={isActive ? 'page' : undefined}>
              <div className="relative">
                <item.icon className="w-5 h-5" />
                {item.id === '/notifications' && user.unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 bg-accent text-white text-[8px] font-bold rounded-full flex items-center justify-center">{user.unreadNotifications}</span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
              {isActive && <span className="w-1 h-1 rounded-full bg-secondary" />}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
