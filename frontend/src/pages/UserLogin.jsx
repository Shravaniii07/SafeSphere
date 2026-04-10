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

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const response = await login(data.email.trim(), data.password.trim())
      if (response?.status === 'pending' || response?.otpRequired) {
        toast.success('Verification code sent! 📧')
        navigate('/verify-otp', { state: { email: data.email } })
      } else {
        toast.success('Welcome back! 🎉')
        navigate('/dashboard', { replace: true })
      }
      reset()
    } catch (err) {
      toast.error(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 login-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[120px] animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] animate-float-delayed" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8 animate-page-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              Safe<span className="text-blue-500">Sphere</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm">Sign in to access your safety dashboard</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-elevated-lg border border-gray-100 p-8 animate-scale-pop">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" />
                <input type="email" placeholder="you@example.com" {...register('email')}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white text-gray-800 text-sm transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/8 focus:outline-none placeholder-gray-400 ${errors.email ? 'border-red-300 ring-2 ring-red-500/8' : 'border-gray-200'}`} />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')}
                  className={`w-full pl-10 pr-12 py-2.5 border rounded-xl bg-white text-gray-800 text-sm transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/8 focus:outline-none placeholder-gray-400 ${errors.password ? 'border-red-300 ring-2 ring-red-500/8' : 'border-gray-200'}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-500 focus:ring-blue-500/20 cursor-pointer" />
                <span className="text-sm text-gray-500">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors duration-300 cursor-pointer">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.15" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Admin Login Button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link 
              to="/admin/login" 
              className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary/10 text-primary font-display font-bold rounded-xl hover:bg-primary/5 hover:border-primary/20 transition-all duration-200"
            >
              <Shield className="w-4 h-4 text-blue-500" />
              Access Admin Portal
            </Link>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100/60">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-blue-600">Demo Credentials</span>
            </div>
            <p className="text-xs text-gray-500 font-mono">user@safesphere.com / password123</p>
          </div>
        </div>

        <div className="text-center mt-6 animate-fade-in">
          <p className="text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-300">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
