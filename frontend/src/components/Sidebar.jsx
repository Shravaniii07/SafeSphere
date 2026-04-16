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
  { id: '/emergency-info', label: 'Emergency Contacts', icon: Phone },
  { id: '/emergency-safety', label: 'Emergency Guide', icon: Footprints },
  { id: '/safety-tips', label: 'Safety Tips', icon: Lightbulb },
  { section: 'Tools' },
  { id: '/fake-call', label: 'Fake Call', icon: PhoneIncoming },
  { id: '/tracking', label: 'Public Tracking', icon: Radio },
  { section: 'Account' },
  { id: '/notifications', label: 'Notifications', icon: Bell },
  { id: '/profile', label: 'Profile', icon: User },
  { id: '/admin/dashboard', label: 'Admin Panel', icon: Shield, adminOnly: true },
]

function StatusDot({ label }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-50" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
      </span>
      <span className="text-[10px] text-white/30">{label}</span>
    </div>
  )
}

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
    ? navItems.filter(item => item.id === '/admin/dashboard' || item.id === '/profile' || item.section === 'Account')
    : navItems;

  return (
    <aside className={`w-[272px] fixed top-0 left-0 bottom-0 z-[100] flex flex-col transition-transform duration-400 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      style={{ background: 'linear-gradient(180deg, #111827 0%, #1F2937 100%)', transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>

      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-md">
          <Shield className="w-[18px] h-[18px] text-white" />
        </div>
        <span className="text-[17px] font-semibold tracking-tight text-white">
          Safe<span className="text-blue-400">Sphere</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-3 flex-1 pb-4" role="navigation" aria-label="Main navigation">
        {filteredNavItems.map((item, i) => {
          if (item.adminOnly && role !== 'admin') return null
          if (item.section) return (
            <div key={i} className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/20 px-4 pt-6 pb-2">
              {item.section}
            </div>
          )
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-300 mb-0.5 cursor-pointer min-h-[38px] group relative ${
                isActive ? 'bg-white/[0.08] text-white' : 'text-white/45 hover:bg-white/[0.04] hover:text-white/70'
              }`}
            >
              {isActive && <div className="absolute left-0 w-[3px] h-4 rounded-r-full bg-blue-400" />}
              <item.icon className={`w-[17px] h-[17px] transition-colors duration-300 flex-shrink-0 ${
                isActive ? 'text-blue-400' : 'text-white/30 group-hover:text-white/50'
              }`} />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.id === '/notifications' && user.unreadNotifications > 0 && (
                <span className="w-5 h-5 text-[10px] font-bold bg-red-500 rounded-full flex items-center justify-center text-white">
                  {user.unreadNotifications}
                </span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 text-white/25" />}
            </button>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="relative z-10 px-6 py-3 border-t border-white/[0.06]">
        <div className="text-[10px] font-display font-semibold uppercase tracking-[0.12em] text-white/30 mb-2.5">
          System Status
        </div>
        <div className="flex items-center gap-4">
          <StatusDot label="GPS" />
          <StatusDot label="Network" />
          <StatusDot label="Shield" />
        </div>
      </div>

      {/* User Profile */}
      <div className="relative z-10 px-3 py-4 border-t border-white/[0.06]">
        <button
          onClick={() => handleNav('/profile')}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-semibold shadow-sm">
            {user.initials || '??'}
          </div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-sm font-medium text-white/75 truncate">{user.name}</div>
            <div className="text-[11px] text-white/30 truncate">{user.email}</div>
          </div>
        </button>
      </div>
    </aside>
  )
}
