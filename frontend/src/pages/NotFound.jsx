import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: '#F7F8FC' }}>
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="absolute top-[20%] left-[30%] w-[400px] h-[400px] bg-blue-500/[0.04] rounded-full blur-[120px]" />
      <div className="absolute bottom-[20%] right-[20%] w-[300px] h-[300px] bg-violet-500/[0.03] rounded-full blur-[100px]" />
      
      <div className="relative z-10 text-center max-w-md">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0EA5E9, #6366F1)' }}>
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-7xl font-display font-bold text-primary mb-2 tracking-tight">404</h1>
        <p className="text-xl font-display font-bold text-primary mb-2">Page not found</p>
        <p className="text-slate-400 text-sm mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-display font-semibold text-slate-600 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-3 text-white rounded-xl text-sm font-display font-semibold hover:-translate-y-px transition-all cursor-pointer"
            style={{ background: 'linear-gradient(135deg, #0F1729, #1A2744)' }}>
            <Home className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
