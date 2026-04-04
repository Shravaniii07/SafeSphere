import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

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

  const [settings, setSettings] = useState(defaultSettings)

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
    }
  }, [authUser, role])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  return (
    <AppContext.Provider value={{ user, setUser, settings, setSettings }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
