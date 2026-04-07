import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0A0F1E] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#E63946]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-[#457B9D]/5 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 animate-page-in">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#c1121f] flex items-center justify-center mx-auto mb-8 shadow-glow-red">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-8xl font-heading font-extrabold text-[#E63946] mb-4 tracking-tight">404</h1>
        <h2 className="text-2xl font-heading font-bold text-[#F1FAEE] mb-2">Page not found</h2>
        <p className="text-[#A8B2C1] mb-8 max-w-sm">The page you're looking for doesn't exist or has been moved.</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white font-heading font-semibold rounded-xl hover:bg-[#c1121f] hover:shadow-glow-red active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Go Home
        </button>
      </div>
    </div>
  )
}
