import { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { Shield } from 'lucide-react'
import { AppProvider, useApp } from './context/AppContext'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'
import BottomNav from './components/BottomNav'
import { Button } from './components/UI'
import Dashboard from './pages/Dashboard'
import SmartSOS from './pages/SmartSOS'
import LiveLocation from './pages/LiveLocation'
import NearbyServices from './pages/NearbyServices'
import EmergencyInfo from './pages/EmergencyInfo'
import Tracking from './pages/Tracking'
import Notifications from './pages/Notifications'
import TravelSafety from './pages/TravelSafety'
import SafetyHeatmap from './pages/SafetyHeatmap'
import Profile from './pages/Profile'
import AdminPanel from './pages/AdminPanel'
import Home from './pages/SheSafe/Home'
import SelfDefense from './pages/SheSafe/SelfDefense'
import SafetyTips from './pages/SheSafe/SafetyTips'
import Laws from './pages/SheSafe/Laws'


const pageTitles = {
  dashboard: 'Dashboard', sos: 'Smart SOS', location: 'Live Location',
  nearby: 'Nearby Services', emergency: 'Emergency Info', tracking: 'Public Tracking',
  notifications: 'Notifications', travel: 'Travel Safety', heatmap: 'Safety Heatmap',
  profile: 'Profile', admin: 'Admin Panel',
  SheSafe: 'Women Safety',
  selfDefense: 'Self Defense',
  safetyTips: 'Safety Tips',
  laws: "Laws",
}

const pageTints = {
  sos: 'mesh-sos', location: 'mesh-location', heatmap: 'mesh-heatmap',
}

function AppInner() {
  const [activePage, setActivePage] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user } = useApp()

  // ✅ FIXED + DEBUG
  const navigate = (page) => {
    console.log("Navigating to:", page)   // 👈 DEBUG
    setActivePage(page)
    setSidebarOpen(false)
  }

  const renderPage = () => {
    console.log("Active Page:", activePage) // 👈 DEBUG

    if (activePage === 'admin' && !user.isAdmin) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Shield className="w-16 h-16 text-slate-300" />
          <h2 className="text-xl font-display font-bold text-primary">Access Restricted</h2>
          <p className="text-slate-500 text-sm">You don&apos;t have admin privileges.</p>
          <Button onClick={() => navigate('dashboard')}>Go to Dashboard</Button>
        </div>
      )
    }

    const pages = {
      dashboard: <Dashboard onNavigate={navigate} />,
      sos: <SmartSOS />,
      location: <LiveLocation />,
      nearby: <NearbyServices />,
      emergency: <EmergencyInfo />,
      tracking: <Tracking />,
      notifications: <Notifications />,
      travel: <TravelSafety />,
      heatmap: <SafetyHeatmap />,
      profile: <Profile />,
      admin: <AdminPanel />,
      // SheSafe: <Home />, // ✅ CORRECT
      SheSafe: <Home onNavigate={navigate} />,

      selfDefense: <SelfDefense />,
      safetyTips: <SafetyTips />,
      laws: <Laws/>,
    }

    return pages[activePage] || <Dashboard onNavigate={navigate} />
  }

  const bgClass = pageTints[activePage] || 'mesh-gradient'

  return (
    <div className={`flex min-h-screen ${bgClass}`}>
      <Toaster position="top-right" />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[99] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        activePage={activePage}
        onNavigate={navigate}
        isOpen={sidebarOpen}
      />

      <div className="flex-1 lg:ml-[272px] flex flex-col min-h-screen pb-16 lg:pb-0">
        
        {/* ✅ SAFE NAVBAR PASS */}
        <Navbar
          title={pageTitles[activePage]}
          onNavigate={(page) => {
            console.log("Navbar clicked:", page) // 👈 DEBUG
            navigate(page)
          }}
          onBurgerClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div key={activePage} className="animate-page-in max-w-[1400px] mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      <BottomNav activePage={activePage} onNavigate={navigate} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
