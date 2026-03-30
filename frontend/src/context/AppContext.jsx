import { createContext, useContext, useState, useEffect } from 'react'

const defaultUser = {
  name: 'Yash',
  initials: 'Y',
  email: 'yash@example.com',
  phone: '+91 9322128275',
  location: 'pune, maharashtra',
  unreadNotifications: 3,
  safetyScore: 96,
  activeContacts: 5,
  isAdmin: true,
}

const defaultSettings = {
  darkMode: false,
  pushNotifications: true,
  locationServices: true,
  soundAlerts: true,
}

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(defaultUser)
  const [settings, setSettings] = useState(defaultSettings)

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
