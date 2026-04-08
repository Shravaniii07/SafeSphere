import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Check your email for OTP! 📧')
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 login-gradient relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-primary/8 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent/8 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute inset-0 geo-pattern opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-8 animate-page-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E63946] to-[#c1121f] flex items-center justify-center shadow-glow-red">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="font-heading text-2xl font-bold tracking-tight text-text flex items-center gap-2">
              Safe<span className="text-primary">Sphere</span>
              <span className="w-2 h-2 rounded-full bg-primary animate-glow-dot" />
            </span>
          </div>
          <h1 className="text-xl font-heading font-bold text-text mb-1">Welcome back</h1>
          <p className="text-muted text-sm">Sign in to access your safety dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-surface/90 backdrop-blur-xl rounded-2xl shadow-elevated border border-border p-8 animate-scale-pop">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-muted font-heading tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-surface2 text-text text-sm transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-[#A8B2C1]/30 ${errors.email ? 'border-primary ring-1 ring-[#E63946]/20' : 'border-border'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-primary">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-muted font-heading tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/40 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-surface2 text-text text-sm transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-[#A8B2C1]/30 ${errors.password ? 'border-primary ring-1 ring-[#E63946]/20' : 'border-border'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted/40 hover:text-muted transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-primary">{errors.password.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-heading font-semibold rounded-xl hover:bg-primary-dark hover:shadow-[0_0_30px_rgba(230,57,70,0.3)] hover:-translate-y-px active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Admin Login Button */}
          <div className="mt-4 pt-4 border-t border-border">
            <Link 
              to="/admin/login" 
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-accent/30 text-accent font-heading font-bold rounded-xl hover:bg-accent/10 hover:border-accent/50 transition-all duration-200"
            >
              <Shield className="w-4 h-4" />
              Access Admin Portal
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-3.5 bg-primary/5 rounded-xl border border-primary/10">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-heading font-semibold text-primary">Demo Credentials</span>
            </div>
            <p className="text-xs text-muted font-mono">user@safesphere.com / password123</p>
          </div>
        </div>

        {/* Register link */}
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-sm text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary hover:text-[#FF4D5A] font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
