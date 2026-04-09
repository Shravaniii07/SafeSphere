import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Shield, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'
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
      toast.success('Account created! Welcome to SafeSphere 🎉')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(err.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const inputClass = (hasError) => `w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white text-gray-800 text-sm transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/8 focus:outline-none placeholder-gray-400 ${hasError ? 'border-red-300 ring-2 ring-red-500/8' : 'border-gray-200'}`

  return (
    <div className="min-h-screen flex items-center justify-center p-4 login-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-blue-500/6 rounded-full blur-[120px] animate-float" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-violet-500/5 rounded-full blur-[100px] animate-float-delayed" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="text-center mb-8 animate-page-in">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-gray-900">
              Safe<span className="text-blue-500">Sphere</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-400 text-sm">Join SafeSphere and stay protected</p>
        </div>

        <div className="bg-white rounded-2xl shadow-elevated-lg border border-gray-100 p-8 animate-scale-pop">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" />
                <input type="text" placeholder="Your full name" {...register('name')} className={inputClass(errors.name)} />
              </div>
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Email</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" />
                <input type="email" placeholder="you@example.com" {...register('email')} className={inputClass(errors.email)} />
              </div>
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('password')} className={`${inputClass(errors.password)} !pr-12`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-300 cursor-pointer">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-gray-500">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" {...register('confirmPassword')} className={inputClass(errors.confirmPassword)} />
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2">
              {isLoading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.15" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg> Creating account...</>
              ) : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6 animate-fade-in space-y-3">
          <p className="text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-semibold transition-colors duration-300">Sign in</Link>
          </p>
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors duration-300 group">
            <Shield className="w-4 h-4 group-hover:text-blue-500 transition-colors duration-300" /> Back to SafeSphere
          </Link>
        </div>
      </div>
    </div>
  )
}
