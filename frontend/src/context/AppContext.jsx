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
    phone: '+91 9322128275',
    location: 'pune, maharashtra',
    unreadNotifications: 3,
    safetyScore: 96,
    activeContacts: 5,
    isAdmin: false,
  })

  const [notifications, setNotifications] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [settings, setSettings] = useState(defaultSettings)

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
      const getInitials = (name) => name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'
      setUser(prev => ({
        ...prev,
        ...authUser,
        initials: getInitials(authUser.name),
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

  return (
    <AppContext.Provider value={{ 
      user, setUser, 
      notifications, setNotifications, fetchNotifs,
      dashboardStats, setDashboardStats, fetchDashboardStats,
      settings, setSettings 
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
