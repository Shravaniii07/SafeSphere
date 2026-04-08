import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, AlertTriangle, Menu, Command, LogOut, Sun, Moon } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import toast from 'react-hot-toast'

export default function Navbar({ title, onBurgerClick }) {
  const { user } = useApp()
  const { logout, role } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/', { replace: true })
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      toast.success(`Searching for "${searchQuery}"...`)
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="h-16 glass-nav flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onBurgerClick} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-muted hover:bg-overlay-strong hover:text-text transition-colors min-h-[44px] min-w-[44px] cursor-pointer" aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-heading font-bold text-text tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-overlay border border-border rounded-xl min-w-[220px] group focus-within:bg-overlay-strong focus-within:border-primary/40 focus-within:shadow-[0_0_0_3px_rgba(230,57,70,0.1)] transition-all duration-200">
          <Search className="w-4 h-4 text-muted/60 flex-shrink-0 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            className="border-none bg-transparent text-sm w-full text-text placeholder-muted/40 outline-none"
          />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] text-muted/40 bg-overlay border border-border rounded px-1.5 py-0.5 font-mono"><Command className="w-2.5 h-2.5" />K</kbd>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:bg-overlay-strong hover:text-warning transition-all duration-300 cursor-pointer min-h-[44px] min-w-[44px] relative overflow-hidden"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          <div key={theme} className="animate-theme-icon">
            {isDark ? <Sun className="w-[19px] h-[19px]" /> : <Moon className="w-[19px] h-[19px]" />}
          </div>
        </button>

        <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:bg-overlay-strong hover:text-text transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px]" aria-label="Notifications">
          <Bell className="w-[19px] h-[19px]" />
          {user.unreadNotifications > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold bg-primary text-white rounded-full flex items-center justify-center shadow-[0_0_8px_rgba(230,57,70,0.5)]">{user.unreadNotifications}</span>}
        </button>
        {role !== 'admin' && (
          <button onClick={() => navigate('/sos')} className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-heading font-semibold flex items-center gap-2 hover:bg-primary-dark hover:-translate-y-px active:scale-95 transition-all duration-200 animate-danger-pulse cursor-pointer min-h-[44px]" aria-label="Emergency SOS">
            <AlertTriangle className="w-4 h-4" /><span className="hidden sm:inline">SOS</span>
          </button>
        )}
        <button onClick={handleLogout} className="w-10 h-10 rounded-xl flex items-center justify-center text-muted hover:bg-primary/10 hover:text-primary transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px]" aria-label="Logout" title="Logout">
          <LogOut className="w-[18px] h-[18px]" />
        </button>
        <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center font-heading font-semibold text-sm hover:shadow-[0_0_20px_rgba(230,57,70,0.4)] active:scale-95 transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px]" aria-label="Profile">
          {user.initials}
        </button>
      </div>
    </header>
  )
}
