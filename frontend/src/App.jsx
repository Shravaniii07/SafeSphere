import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AppLayout from './components/AppLayout'
import { Toaster } from 'react-hot-toast'

// Public pages
import LandingPage from './pages/LandingPage'
import UserLogin from './pages/UserLogin'
import VerifyOTP from './pages/VerifyOTP'
import AdminLogin from './pages/AdminLogin'
import RegisterPage from './pages/RegisterPage'
import NotFound from './pages/NotFound'

// Protected pages
import Dashboard from './pages/Dashboard'
import SmartSOS from './pages/SmartSOS'
import LiveLocation from './pages/LiveLocation'
import NearbyServices from './pages/NearbyServices'
import EmergencyInfo from './pages/EmergencyInfo'
import Tracking from './pages/Tracking'
import Notifications from './pages/Notifications'
import TravelSafety from './pages/TravelSafety'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'

// New pages
import WomenSafety from './pages/WomenSafety'
import SafetyMapPage from './pages/SafetyMapPage'
import SafetyHeatmapView from './pages/SafetyHeatmapView'
import EmergencyContacts from './pages/EmergencyContacts'
import EmergencySafety from './pages/EmergencySafety'
import FakeCall from './pages/FakeCall'
import SafetyTips from './pages/SafetyTips'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <Toaster position="top-right" toastOptions={{
            style: { fontFamily: "'Inter', system-ui", borderRadius: '14px', fontSize: '14px', fontWeight: '500', padding: '14px 18px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.04)', letterSpacing: '-0.01em' },
            success: { duration: 3000 },
            error: { duration: 4000 },
          }} />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<UserLogin />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Route>

            {/* Protected Routes — any authenticated user */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/sos" element={<SmartSOS />} />
                <Route path="/location" element={<LiveLocation />} />
                <Route path="/nearby" element={<NearbyServices />} />
                <Route path="/emergency" element={<EmergencyInfo />} />
                <Route path="/tracking" element={<Tracking />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/travel" element={<TravelSafety />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/women-safety" element={<WomenSafety />} />
                <Route path="/map" element={<SafetyMapPage />} />
                <Route path="/safety-map" element={<SafetyHeatmapView />} />
                <Route path="/emergency-info" element={<EmergencyContacts />} />
                <Route path="/emergency-safety" element={<EmergencySafety />} />
                <Route path="/fake-call" element={<FakeCall />} />
                <Route path="/safety-tips" element={<SafetyTips />} />
              </Route>
            </Route>

            {/* Admin-only Routes */}
            <Route element={<ProtectedRoute requiredRole="admin" />}>
              <Route element={<AppLayout />}>
                <Route path="/admin/dashboard" element={<AdminPanel />} />
              </Route>
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
