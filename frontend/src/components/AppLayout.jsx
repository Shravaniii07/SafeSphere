import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/sos': 'Smart SOS',
  '/location': 'Live Location',
  '/nearby': 'Nearby Services',
  '/emergency': 'Emergency Info',
  '/tracking': 'Public Tracking',
  '/notifications': 'Notifications',
  '/travel': 'Travel Safety',
  '/heatmap': 'Safety Heatmap',
  '/profile': 'Profile',
  '/admin/dashboard': 'Admin Panel',
  '/women-safety': 'Women Safety',
  '/map': 'Safety Map',
  '/safety-map': 'Incident Heatmap',
  '/emergency-info': 'Emergency Contacts',
  '/emergency-safety': 'Emergency Guide',
  '/fake-call': 'Fake Call',
  '/safety-tips': 'Safety Tips',
}

const pageTints = {
  '/sos': 'mesh-sos',
  '/location': 'mesh-location',
  '/heatmap': 'mesh-heatmap',
  '/safety-map': 'mesh-heatmap',
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pathname = location.pathname

  const title = pageTitles[pathname] || 'SafeSphere'
  const bgClass = pageTints[pathname] || 'mesh-gradient'

  return (
    <div className={`flex min-h-screen ${bgClass}`}>
      <Toaster position="top-right" toastOptions={{
        style: { 
          fontFamily: "'Inter', system-ui", 
          borderRadius: '14px', 
          fontSize: '14px', 
          fontWeight: '500', 
          padding: '14px 18px', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          background: '#111827',
          color: '#F1FAEE',
        },
        success: { duration: 3000 },
        error: { duration: 4000 },
      }} />

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[99] lg:hidden"
          style={{ animation: 'modal-overlay-in 0.25s ease' }} onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 lg:ml-[272px] flex flex-col min-h-screen pb-16 lg:pb-0">
        <Navbar title={title} onBurgerClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <div className="animate-page-in max-w-[1400px] mx-auto" key={pathname}>
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
