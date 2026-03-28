import { Search, Bell, AlertTriangle, Menu, Command } from 'lucide-react'
import { useApp } from '../context/AppContext'

export default function Navbar({ title, onNavigate, onBurgerClick }) {
  const { user } = useApp()
  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-100/60 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onBurgerClick} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors min-h-[44px] min-w-[44px] cursor-pointer" aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-display font-bold text-primary tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-50/80 border border-slate-100 rounded-xl min-w-[220px] group focus-within:bg-white focus-within:border-secondary focus-within:shadow-[0_0_0_3px_rgba(6,182,212,0.08)] transition-all duration-200">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0 group-focus-within:text-secondary transition-colors" />
          <input type="text" placeholder="Search..." aria-label="Search" className="border-none bg-transparent text-sm w-full text-slate-800 placeholder-slate-400 outline-none" />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.5 font-mono"><Command className="w-2.5 h-2.5" />K</kbd>
        </div>
        <button onClick={() => onNavigate('notifications')} className="relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px]" aria-label="Notifications">
          <Bell className="w-[19px] h-[19px]" />
          {user.unreadNotifications > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold bg-accent text-white rounded-full flex items-center justify-center shadow-[0_2px_4px_rgba(244,63,94,0.3)]">{user.unreadNotifications}</span>}
        </button>
        <button onClick={() => onNavigate('sos')} className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-display font-semibold flex items-center gap-2 hover:bg-accent-dark hover:-translate-y-px active:scale-[0.96] transition-all duration-200 animate-sos-glow cursor-pointer min-h-[44px]" aria-label="Emergency SOS">
          <AlertTriangle className="w-4 h-4" /><span className="hidden sm:inline">SOS</span>
        </button>
        <button onClick={() => onNavigate('profile')} className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center font-display font-semibold text-sm hover:shadow-[0_0_0_3px_rgba(15,23,42,0.15)] active:scale-95 transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px]" aria-label="Profile">
          {user.initials}
        </button>
      </div>
    </header>
  )
}
