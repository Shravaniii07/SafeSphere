import { useNavigate } from 'react-router-dom'
import { Shield, ArrowLeft, MapPin } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center p-6 login-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[400px] h-[400px] bg-accent/8 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[350px] h-[350px] bg-secondary/6 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute inset-0 geo-pattern opacity-[0.03]" />
      </div>

      <div className="relative z-10 text-center animate-scale-pop">
        <div className="inline-flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center shadow-glow-teal">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-primary">
            Safe<span className="text-secondary">Sphere</span>
          </span>
        </div>

        <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <Shield className="w-10 h-10 text-slate-400" />
        </div>

        <h1 className="text-6xl font-display font-bold text-primary mb-2">404</h1>
        <h2 className="text-xl font-display font-bold text-primary mb-2">Page Not Found</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back to safety.
        </p>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-display font-semibold rounded-xl hover:bg-primary-light hover:shadow-[0_4px_16px_rgba(15,23,42,0.25)] hover:-translate-y-px active:scale-[0.98] transition-all duration-200 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Go Home
        </button>
      </div>
    </div>
  )
}
