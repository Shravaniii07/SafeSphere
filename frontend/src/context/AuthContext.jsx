import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Mock credentials — TODO: Replace with backend API calls
const MOCK_USERS = {
  user: { email: 'user@safesphere.com', password: 'password123', name: 'Yash', initials: 'Y' },
  admin: { email: 'admin@safesphere.com', password: 'admin123', name: 'Admin', initials: 'A', secretKey: 'safesphere-admin-2026' },
}
import api from '../api/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    try {
      const stored = localStorage.getItem('safesphere_auth')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.isAuthenticated) return parsed
      }
    } catch { /* ignore corrupted storage */ }
    return { user: null, role: null, isAuthenticated: false }
  })

  // Persist auth state
  useEffect(() => {
    if (authState.isAuthenticated) {
      localStorage.setItem('safesphere_auth', JSON.stringify(authState))
    } else {
      localStorage.removeItem('safesphere_auth')
    }
  }, [authState])

  const login = useCallback(async (email, password) => {
    // TODO: Replace with actual API call — POST /api/auth/login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mock = MOCK_USERS.user
        if (email === mock.email && password === mock.password) {
          const userData = { name: mock.name, email: mock.email, initials: mock.initials }
          setAuthState({ user: userData, role: 'user', isAuthenticated: true })
          resolve(userData)
        } else {
          reject(new Error('Invalid email or password'))
        }
      }, 1200)
    })
  }, [])

  const register = useCallback(async (name, email, password) => {
    // TODO: Replace with actual API call — POST /api/auth/register
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!name || !email || !password) {
          reject(new Error('All fields are required'))
          return
        }
        // Mock: accept any registration
        const initials = name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        const userData = { name, email, initials }
        setAuthState({ user: userData, role: 'user', isAuthenticated: true })
        resolve(userData)
      }, 1200)
    })
  }, [])

  const adminLogin = useCallback(async (email, password, secretKey = '') => {
    // TODO: Replace with actual API call — POST /api/auth/admin-login
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const mock = MOCK_USERS.admin
        if (email === mock.email && password === mock.password) {
          const userData = { name: mock.name, email: mock.email, initials: mock.initials }
          setAuthState({ user: userData, role: 'admin', isAuthenticated: true })
          resolve(userData)
        } else {
          reject(new Error('Invalid admin credentials'))
        }
      }, 1200)
    })
  }, [])

  const logout = useCallback(() => {
    setAuthState({ user: null, role: null, isAuthenticated: false })
    localStorage.removeItem('safesphere_auth')
  }, [])

  return (
    <AuthContext.Provider value={{ ...authState, login, register, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
