import { useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, AlertTriangle, Globe, MapPin, Activity,
  Clock, Map, Bell, User, Radio, Shield, ChevronRight,
  ShieldCheck, Phone, Flame, Footprints, PhoneIncoming, Lightbulb
} from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { section: 'Main' },
  { id: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: '/sos', label: 'Smart SOS', icon: AlertTriangle },
  { id: '/location', label: 'Live Location', icon: Globe },
  { id: '/nearby', label: 'Nearby Services', icon: MapPin },
  { section: 'Safety' },
  { id: '/emergency', label: 'Emergency Info', icon: Activity },
  { id: '/women-safety', label: 'Women Safety', icon: ShieldCheck },
  { id: '/travel', label: 'Travel Safety', icon: Clock },
  { id: '/map', label: 'Safety Map', icon: Map },
  { id: '/safety-map', label: 'Incident Heatmap', icon: Flame },
  { id: '/emergency-info', label: 'Helpline Directory', icon: Phone },
  { id: '/emergency-safety', label: 'Emergency Guide', icon: Footprints },
  { id: '/safety-tips', label: 'Safety Tips', icon: Lightbulb },
  { section: 'Tools' },
  { id: '/fake-call', label: 'Fake Call', icon: PhoneIncoming },
  { id: '/tracking', label: 'Public Tracking', icon: Radio },
  { section: 'Account' },
  { id: '/notifications', label: 'Notifications', icon: Bell },
  { id: '/profile', label: 'Profile', icon: User },
  { id: '/heatmap', label: 'Safety Heatmap', icon: Map },
  { id: '/admin/dashboard', label: 'Admin Panel', icon: Shield, adminOnly: true },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useApp()
  const { role } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const activePage = location.pathname

  const handleNav = (path) => {
    navigate(path)
    onClose?.()
  }

  const filteredNavItems = role === 'admin' 
    ? navItems.filter(item => item.id === '/admin/dashboard' || item.id === '/profile').map(item => item.id === '/admin/dashboard' ? { ...item, label: 'Admin Panel' } : item)
    : navItems;

  return (
    <aside className={`w-[272px] fixed top-0 left-0 bottom-0 z-[100] flex flex-col transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-sidebar backdrop-blur-xl border-r border-border`}>
      {/* Logo */}
      <div className="relative z-10 px-6 py-7 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow-red">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="font-heading text-xl font-bold tracking-tight text-text flex items-center gap-2">
          Safe<span className="text-primary">Sphere</span>
          <span className="w-2 h-2 rounded-full bg-primary animate-glow-dot" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-3 flex-1 pb-4" role="navigation" aria-label="Main navigation">
        {filteredNavItems.map((item, i) => {
          if (item.adminOnly && role !== 'admin') return null
          if (item.section) return (
            <div key={i} className="text-[10px] font-heading font-semibold uppercase tracking-[0.12em] text-muted/50 px-4 pt-6 pb-2">{item.section}</div>
          )
          const isActive = activePage === item.id
          return (
            <button key={item.id} onClick={() => handleNav(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 mb-0.5 cursor-pointer min-h-[40px] group focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${isActive ? 'bg-primary/10 text-primary shadow-[inset_0_1px_0_rgba(230,57,70,0.1)]' : 'text-muted hover:bg-overlay-strong hover:text-text'}`}>
              <item.icon className={`w-[18px] h-[18px] transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted/60 group-hover:text-text'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === '/notifications' && user.unreadNotifications > 0 && (
                <span className="w-5 h-5 text-[10px] font-bold bg-primary rounded-full flex items-center justify-center text-white">{user.unreadNotifications}</span>
              )}
              {isActive && <ChevronRight className="w-3.5 h-3.5 text-primary/40" />}
            </button>
          )
        })}
      </nav>

      {/* System Status */}
      {role !== 'admin' && (
        <div className="relative z-10 px-6 py-3 border-t border-border">
          <div className="text-[10px] font-heading font-semibold uppercase tracking-[0.12em] text-muted/50 mb-2">System Status</div>
          <div className="flex items-center gap-4">
            <StatusDot label="GPS" />
            <StatusDot label="Network" />
            <StatusDot label="Shield" />
          </div>
        </div>
      )}

      {/* User */}
      <div className="relative z-10 px-3 py-4 border-t border-border">
        <button onClick={() => handleNav('/profile')}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-overlay transition-all duration-200 cursor-pointer min-h-[44px] group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-heading font-semibold text-sm text-white shadow-sm">{user.initials}</div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-sm font-medium text-text truncate">{user.name}</div>
            <div className="text-[11px] text-muted truncate">{user.email}</div>
          </div>
        </button>
      </div>
    </aside>
  )
}

function StatusDot({ label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-success" />
      </span>
      <span className="text-[10px] text-muted">{label}</span>
    </div>
  )
}
