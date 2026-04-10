import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import api from '../api/api'

// Mock credentials — TODO: Replace with backend API calls
const MOCK_USERS = {
  user: { email: 'user@safesphere.com', password: 'password123', name: 'Yash', initials: 'Y' },
  admin: { email: 'admin@safesphere.com', password: 'admin123', name: 'Admin', initials: 'A', secretKey: 'safesphere-admin-2026' },
}

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

  const refreshProfile = useCallback(async () => {
    try {
      const res = await api.get('/api/user/profile')
      const data = res.data
      const userData = { _id: data._id, name: data.name, email: data.email, initials: data.initials }
      setAuthState(prev => ({ ...prev, user: userData, role: data.role || 'user', isAuthenticated: true }))
      return data
    } catch (err) {
      console.error("Profile refresh failed:", err)
      return null
    }
  }, [])

  const login = useCallback(async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password })
      return res.data // Should trigger OTP notification on success
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }, [])

  const register = useCallback(async (name, email, password) => {
    try {
      const res = await api.post('/api/auth/register', { name, email, password })
      return res.data // Should trigger OTP notification on success
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
    }
  }, [])

  const verifyOTP = useCallback(async (email, otp) => {
    try {
      const res = await api.post('/api/auth/verify-otp', { email, otp })
      const data = res.data
      
      const userData = { _id: data._id, name: data.name, email: data.email }
      // Set initial auth state (role defaults to 'user' until profile loads)
      setAuthState({ user: userData, role: data.role || 'user', isAuthenticated: true })
      
      // ✅ Await profile fetch to get the TRUE role from DB before navigation
      const profile = await refreshProfile()
      const actualRole = profile?.role || data.role || 'user'
      
      // Persist with correct role
      setAuthState(prev => ({ ...prev, role: actualRole }))
      
      return { ...userData, role: actualRole }
    } catch (error) {
      throw new Error(error.message || 'OTP verification failed')
    }
  }, [refreshProfile])

  const adminLogin = useCallback(async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password })
      const data = res.data
      
      // ✅ If OTP is bypassed (Direct Login), update auth state immediately
      if (data.otpRequired === false) {
        const userData = { _id: data._id, name: data.name, email: data.email }
        setAuthState({ user: userData, role: data.role || 'admin', isAuthenticated: true })
        
        // Sync full profile (including role) from DB
        await refreshProfile()
      }
      
      return data
    } catch (error) {
      throw new Error(error.message || 'Admin login failed')
    }
  }, [refreshProfile])

  const resendOTP = useCallback(async (email) => {
    try {
      const res = await api.post('/api/auth/resend-otp', { email })
      return res.data
    } catch (error) {
      throw new Error(error.message || 'Failed to resend OTP')
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout')
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      setAuthState({ user: null, role: null, isAuthenticated: false })
      localStorage.removeItem('safesphere_auth')
    }
  }, [])

  const updateProfile = useCallback(async (profileData) => {
    try {
      const res = await api.put('/api/user/profile', profileData)
      await refreshProfile()
      return res.data
    } catch (error) {
      throw new Error(error.message || 'Profile update failed')
    }
  }, [refreshProfile])

  const deleteAccount = useCallback(async () => {
    try {
      await api.delete('/api/user/profile')
      setAuthState({ user: null, role: null, isAuthenticated: false })
      localStorage.removeItem('safesphere_auth')
    } catch (error) {
      throw new Error(error.message || 'Account deletion failed')
    }
  }, [])

  return (
    <AuthContext.Provider value={{ 
      ...authState, 
      login, 
      register, 
      verifyOTP, 
      adminLogin, 
      resendOTP, 
      logout, 
      updateProfile, 
      refreshProfile, 
      deleteAccount 
    }}>
      {children}
    </AuthContext.Provider>
  )
}


export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
