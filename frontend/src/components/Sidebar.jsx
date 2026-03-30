import {
  LayoutDashboard, AlertTriangle, Globe, MapPin, Activity,
  Clock, Map, Bell, User, Radio, Shield, ChevronRight, Wifi, Navigation, Lock
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navItems = [
  { section: 'Main' },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sos', label: 'Smart SOS', icon: AlertTriangle },
  { id: 'location', label: 'Live Location', icon: Globe },
  { id: 'nearby', label: 'Nearby Services', icon: MapPin },
  { section: 'Safety' },
  { id: 'emergency', label: 'Emergency Info', icon: Activity },
  { id: 'travel', label: 'Travel Safety', icon: Clock },
  { id: 'heatmap', label: 'Safety Heatmap', icon: Map },
  { section: 'Account' },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'tracking', label: 'Public Tracking', icon: Radio },
  { id: 'admin', label: 'Admin Panel', icon: Shield, adminOnly: true },
]

export default function Sidebar({ activePage, onNavigate, isOpen }) {
  const { user } = useApp()

  return (
    <aside className={`w-[272px] fixed top-0 left-0 bottom-0 z-[100] flex flex-col transition-transform duration-300 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 glass-dark noise-overlay`}>
      {/* Logo */}
      <div className="relative z-10 px-6 py-7 flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center shadow-glow-teal">
          <MapPin className="w-5 h-5 text-white" />
        </div>
        <div className="font-display text-xl font-bold tracking-tight text-white">
          Safe<span className="text-secondary-light">Sphere</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-3 flex-1 pb-4" role="navigation" aria-label="Main navigation">
        {navItems.map((item, i) => {
          if (item.adminOnly && !user.isAdmin) return null
          if (item.section) return (
            <div key={i} className="text-[10px] font-display font-semibold uppercase tracking-[0.12em] text-white/30 px-4 pt-6 pb-2">{item.section}</div>
          )
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              aria-current={activePage === item.id ? 'page' : undefined}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 mb-0.5 cursor-pointer min-h-[40px] group focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 ${activePage === item.id ? 'bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]' : 'text-white/60 hover:bg-white/[0.07] hover:text-white/90'}`}>
              <item.icon className={`w-[18px] h-[18px] transition-colors duration-200 ${activePage === item.id ? 'text-secondary-light' : 'text-white/40 group-hover:text-white/70'}`} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'notifications' && user.unreadNotifications > 0 && (
                <span className="w-5 h-5 text-[10px] font-bold bg-accent rounded-full flex items-center justify-center text-white">{user.unreadNotifications}</span>
              )}
              {activePage === item.id && <ChevronRight className="w-3.5 h-3.5 text-white/40" />}
            </button>
          )
        })}
      </nav>

      {/* System Status */}
      <div className="relative z-10 px-6 py-3 border-t border-white/[0.06]">
        <div className="text-[10px] font-display font-semibold uppercase tracking-[0.12em] text-white/30 mb-2">System Status</div>
        <div className="flex items-center gap-4">
          <StatusDot label="GPS" />
          <StatusDot label="Network" />
          <StatusDot label="Shield" />
        </div>
      </div>

      {/* User */}
      <div className="relative z-10 px-3 py-4 border-t border-white/[0.06]">
        <button onClick={() => onNavigate('profile')}
          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.07] transition-all duration-200 cursor-pointer min-h-[44px] group">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center font-display font-semibold text-sm text-white shadow-sm">{user.initials}</div>
          <div className="text-left flex-1 min-w-0">
            <div className="text-sm font-medium text-white/90 truncate">{user.name}</div>
            <div className="text-[11px] text-white/40 truncate">{user.email}</div>
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
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
      </span>
      <span className="text-[10px] text-white/40">{label}</span>
    </div>
  )
}
