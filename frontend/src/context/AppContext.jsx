import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import api from '../api/api'

const defaultSettings = {
  darkMode: false,
  pushNotifications: true,
  locationServices: true,
  soundAlerts: true,
}

const AppContext = createContext()

export function AppProvider({ children }) {
  const { user: authUser, role } = useAuth()

  const [user, setUser] = useState({
    name: 'User',
    initials: 'U',
    email: '',
    phone: '',
    location: '',
    unreadNotifications: 0,
    safetyScore: 96,
    activeContacts: 5,
    isAdmin: false,
  })

  const [notifications, setNotifications] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [searchLocation, setSearchLocation] = useState(null)
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('safesphere_settings')
      return saved ? JSON.parse(saved) : defaultSettings
    } catch (err) {
      console.error("Settings load error:", err)
      return defaultSettings
    }
  })

  // Persist settings
  useEffect(() => {
    localStorage.setItem('safesphere_settings', JSON.stringify(settings))
  }, [settings])

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await api.get('/api/notifications')
      const notifs = res.data || []
      setNotifications(notifs)
      setUser(prev => ({
        ...prev,
        unreadNotifications: notifs.filter(n => !n.read).length
      }))
    } catch (err) {
      console.error("Notifications fetch error (AppContext):", err)
    }
  }, [])

  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await api.get('/api/user/dashboard-stats')
      setDashboardStats(res.data)
    } catch (err) {
      console.error("Dashboard stats fetch error (AppContext):", err)
    }
  }, [])

  // Sync user profile from auth context
  useEffect(() => {
    if (authUser) {
      setUser(prev => ({
        ...prev,
        name: authUser.name || prev.name,
        initials: authUser.initials || prev.initials,
        email: authUser.email || prev.email,
        isAdmin: role === 'admin',
      }))
      fetchNotifs()
      fetchDashboardStats()
    } else {
      setNotifications([])
      setDashboardStats(null)
      setUser(prev => ({ ...prev, unreadNotifications: 0 }))
    }
  }, [authUser, role, fetchNotifs, fetchDashboardStats])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  return (
    <AppContext.Provider value={{ 
      user, setUser, 
      notifications, setNotifications, fetchNotifs,
      dashboardStats, setDashboardStats, fetchDashboardStats,
      searchLocation, setSearchLocation,
      settings, setSettings 
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
