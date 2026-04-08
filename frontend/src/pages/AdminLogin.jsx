import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShieldCheck, Mail, Lock, Eye, EyeOff, KeyRound, ArrowRight, ArrowLeft, Sparkles, Fingerprint } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const adminSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  secretKey: z.string().optional(),
})

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { adminLogin } = useAuth()
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: { email: '', password: '', secretKey: '' },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await adminLogin(data.email, data.password, data.secretKey)
      toast.success('Admin access granted ✅')
      navigate('/admin/dashboard', { replace: true })
      await login(data.email, data.password)
      toast.success('OTP sent! Check your email 📧')
      navigate('/verify-otp', { state: { email: data.email, isAdmin: true } })
    } catch (err) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (hasError) => `w-full pl-10 pr-4 py-3 border rounded-xl bg-white/[0.04] text-white text-sm transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-white/20 ${hasError ? 'border-primary ring-1 ring-[#E63946]/20' : 'border-border'}`

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A0F1E 0%, #1D3557 50%, #0A0F1E 100%)' }}>
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/6 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent/6 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute inset-0 geo-pattern opacity-[0.04]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Back to user login */}
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-white/70 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to User Login
        </Link>

        {/* Logo */}
        <div className="text-center mb-8 animate-page-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E63946]/20 to-[#457B9D]/20 border border-border mb-5 shadow-glow-red">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <h1 className="text-xl font-heading font-bold text-white">Admin Portal</h1>
            <span className="px-2 py-0.5 text-[10px] font-heading font-bold uppercase tracking-wider text-primary bg-primary/10 rounded-full border border-primary/20">Restricted</span>
          </div>
          <p className="text-text-secondary text-sm">Authorized personnel only</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl border border-border p-8 animate-scale-pop shadow-elevated">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-muted font-heading tracking-wide">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50 pointer-events-none" />
                <input type="email" placeholder="admin@safesphere.com" {...register('email')} className={inputClass(errors.email)} />
              </div>
              {errors.email && <p className="text-xs text-primary">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-muted font-heading tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50 pointer-events-none" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-white/[0.04] text-white text-sm transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-white/20 ${errors.password ? 'border-primary ring-1 ring-[#E63946]/20' : 'border-border'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted/50 hover:text-muted transition-colors cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-primary">{errors.password.message}</p>}
            </div>

            {/* Secret Key */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-muted font-heading tracking-wide flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5" /> Admin Secret Key
                <span className="text-[10px] text-white/25 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Fingerprint className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/50 pointer-events-none" />
                <input type="password" placeholder="Enter secret key..." {...register('secretKey')} className={inputClass(false)} />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#E63946] to-[#c1121f] text-white font-heading font-semibold rounded-xl hover:shadow-glow-red hover:-translate-y-px active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Authenticating...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" /> Access Admin Panel <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-3.5 bg-white/[0.04] rounded-xl border border-border">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-heading font-semibold text-primary">Demo Credentials</span>
            </div>
            <p className="text-xs text-text-secondary font-mono">admin@safesphere.com / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
