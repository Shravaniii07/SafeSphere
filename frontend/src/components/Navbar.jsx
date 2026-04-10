import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, AlertTriangle, Menu, Command, LogOut } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar({ title, onBurgerClick }) {
  const { user, setSearchLocation } = useApp()
  const { logout, role } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Keyword mapping for direct page navigation
  const SEARCH_KEYWORDS = {
    'dashboard': '/dashboard',
    'home': '/dashboard',
    'sos': '/sos',
    'emergency': '/sos',
    'map': '/map',
    'safety map': '/map',
    'danger': '/map',
    'heatmap': '/safety-map',
    'incident': '/safety-map',
    'tips': '/safety-tips',
    'guide': '/safety-tips',
    'learn': '/safety-tips',
    'women': '/women-safety',
    'she': '/women-safety',
    'nearby': '/nearby',
    'police': '/nearby',
    'hospital': '/nearby',
    'profile': '/profile',
    'account': '/profile',
    'settings': '/profile',
    'contacts': '/emergency-info',
    'numbers': '/emergency-info',
    'info': '/emergency-info',
    'fake': '/fake-call',
    'call': '/fake-call',
    'travel': '/travel',
    'notifications': '/notifications'
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/', { replace: true })
  }

  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      
      // 1. Check for keyword matches first
      if (SEARCH_KEYWORDS[query]) {
        toast.success(`Opening ${query}...`)
        navigate(SEARCH_KEYWORDS[query])
        setSearchQuery('')
        return
      }

      // 2. If no keyword match, proceed to geographical search
      setIsSearching(true)
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
        const data = await res.json()
        
        if (data && data.length > 0) {
          const { lat, lon, display_name } = data[0]
          setSearchLocation({
            lat: parseFloat(lat),
            lng: parseFloat(lon),
            name: display_name
          })
          toast.success(`Found: ${display_name.split(',')[0]}`)
          
          // Navigate to map if not already there
          if (window.location.pathname !== '/map') {
            navigate('/map')
          }
        } else {
          toast.error('Location not found')
        }
      } catch (err) {
        console.error("Search error:", err)
        toast.error('Search failed. Please try again.')
      } finally {
        setIsSearching(false)
        setSearchQuery('')
      }
    }
  }

  return (
    <header className="h-16 bg-white/80 backdrop-blur-2xl border-b border-gray-100 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center gap-4">
        <button onClick={onBurgerClick} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 hover:bg-gray-100 transition-colors duration-300 cursor-pointer" aria-label="Toggle menu">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[15px] font-semibold text-gray-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-2 bg-gray-50 border border-gray-100 rounded-xl min-w-[220px] group focus-within:bg-white focus-within:border-blue-200 focus-within:shadow-[0_0_0_3px_rgba(59,130,246,0.06)] transition-all duration-300">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0 group-focus-within:text-blue-500 transition-colors duration-300" />
          <input type="text" placeholder={isSearching ? "Searching..." : "Search..."} aria-label="Search" value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} disabled={isSearching}
            className={`border-none bg-transparent text-sm w-full text-gray-700 placeholder-gray-400 outline-none ${isSearching ? 'opacity-50' : ''}`} />
          <kbd className="hidden lg:inline-flex items-center gap-0.5 text-[10px] text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono"><Command className="w-2.5 h-2.5" />K</kbd>
        </div>

        {/* Notifications */}
        <button onClick={() => navigate('/notifications')} className="relative w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-300 cursor-pointer" aria-label="Notifications">
          <Bell className="w-[18px] h-[18px]" />
          {user.unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 text-[9px] font-bold bg-red-500 text-white rounded-full flex items-center justify-center shadow-sm">
              {user.unreadNotifications}
            </span>
          )}
        </button>
        {/* SOS */}
        {role !== 'admin' && (
          <button onClick={() => navigate('/sos')} className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-display font-semibold flex items-center gap-2 hover:bg-accent-dark hover:-translate-y-px active:scale-[0.96] transition-all duration-200 animate-sos-glow cursor-pointer min-h-[44px]" aria-label="Emergency SOS">
            <AlertTriangle className="w-4 h-4" /><span className="hidden sm:inline">SOS</span>
          </button>
        )}

        {/* Logout */}
        <button onClick={handleLogout} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:bg-accent-50 hover:text-accent transition-all duration-200 cursor-pointer min-h-[44px] min-w-[44px]" aria-label="Logout" title="Logout">
          <LogOut className="w-[18px] h-[18px]" />
        </button>

        {/* Profile */}
        <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white flex items-center justify-center text-xs font-semibold hover:shadow-md active:scale-95 transition-all duration-300 cursor-pointer" aria-label="Profile">
          {user.initials || '??'}
        </button>
      </div>
    </header>
  )
}
