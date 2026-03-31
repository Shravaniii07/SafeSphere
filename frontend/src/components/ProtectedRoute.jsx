import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Shield } from 'lucide-react'
import { Button } from './UI'

/**
 * ProtectedRoute — wraps routes that require authentication.
 * @param {string} requiredRole — if set, user must have this role ('admin')
 */
export default function ProtectedRoute({ requiredRole }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 mesh-gradient">
        <div className="bg-white rounded-2xl shadow-elevated-lg p-10 text-center max-w-md animate-scale-pop">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-accent" />
          </div>
          <h2 className="text-xl font-display font-bold text-primary mb-2">Access Restricted</h2>
          <p className="text-slate-500 text-sm mb-6">You don't have permission to access this area. Admin privileges are required.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => window.history.back()}>Go Back</Button>
            <Button onClick={() => window.location.href = '/dashboard'}>Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  return <Outlet />
}
