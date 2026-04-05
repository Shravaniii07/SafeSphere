import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MapPin, Mail, Lock, Eye, EyeOff, User, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { register: authRegister } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await authRegister(data.name, data.email, data.password)
      toast.success('Success! Please verify your email 📧')
      navigate('/verify-otp', { state: { email: data.email } })
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 login-gradient relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-accent/8 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-info/5 rounded-full blur-3xl" />
        <div className="absolute inset-0 geo-pattern opacity-[0.03]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px]">
        {/* Logo */}
        <div className="text-center mb-8 animate-page-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center shadow-glow-teal">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Safe<span className="text-secondary">Sphere</span>
            </span>
          </div>
          <h1 className="text-xl font-display font-bold text-primary mb-1">Create your account</h1>
          <p className="text-slate-500 text-sm">Join SafeSphere and stay protected</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-elevated-lg border border-white/60 p-8 animate-scale-pop">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Your full name"
                  {...register('name')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white text-slate-800 text-sm transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400 ${errors.name ? 'border-accent ring-1 ring-accent/20' : 'border-slate-200'}`}
                />
              </div>
              {errors.name && <p className="text-xs text-accent">{errors.name.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white text-slate-800 text-sm transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400 ${errors.email ? 'border-accent ring-1 ring-accent/20' : 'border-slate-200'}`}
                />
              </div>
              {errors.email && <p className="text-xs text-accent">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('password')}
                  className={`w-full pl-10 pr-12 py-3 border rounded-xl bg-white text-slate-800 text-sm transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400 ${errors.password ? 'border-accent ring-1 ring-accent/20' : 'border-slate-200'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-accent">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-xl bg-white text-slate-800 text-sm transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400 ${errors.confirmPassword ? 'border-accent ring-1 ring-accent/20' : 'border-slate-200'}`}
                />
              </div>
              {errors.confirmPassword && <p className="text-xs text-accent">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-display font-semibold rounded-xl hover:bg-primary-light hover:shadow-[0_4px_16px_rgba(15,23,42,0.25)] hover:-translate-y-px active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Creating account...
                </>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <div className="text-center mt-6 animate-fade-in">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-secondary hover:text-secondary-dark font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to landing */}
        <div className="text-center mt-3 animate-fade-in">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors group">
            <Shield className="w-4 h-4 group-hover:text-secondary transition-colors" />
            Back to SafeSphere
          </Link>
        </div>
      </div>
    </div>
  )
}
