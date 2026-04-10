import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { MapPin, Shield, ArrowRight, KeyRound } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function VerifyOTP() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(59)
  const { verifyOTP, resendOTP } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email
  const isAdmin = location.state?.isAdmin || false  // ✅ flag set by AdminLogin

  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please login again.')
      navigate('/login')
    }
  }, [email, navigate])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(timerId)
  }, [timeLeft])

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus()
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus()
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join('')
    if (otpValue.length !== 6) {
      toast.error('Please enter the 6-digit code')
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyOTP(email, otpValue)
      
      // Sync pending contacts if any (from registration)
      const pendingContacts = JSON.parse(localStorage.getItem('safesphere_emergency_contacts') || '[]')
      if (pendingContacts.length > 0) {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
        for (const contact of pendingContacts) {
          try {
            await fetch(`${API_URL}/api/user/contacts`, {
              method: "POST",
              credentials: 'include',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: contact.name, phone: contact.phone, email: contact.email || '' }),
            })
          } catch (e) {
            console.error("Failed to sync contact:", contact.name)
          }
        }
        localStorage.removeItem('safesphere_emergency_contacts')
      }

      // ✅ Navigate based on actual role returned from verifyOTP (which awaited profile)
      const userRole = result?.role || 'user'
      console.log('[VerifyOTP] Role after OTP verify:', userRole, '| isAdmin flag:', isAdmin)

      if (userRole === 'admin' || isAdmin) {
        toast.success('Admin access granted! 🛡️')
        navigate('/admin/dashboard', { replace: true })
      } else {
        toast.success('Verification successful! Welcome 🎉')
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      toast.error(err.message || 'Verification failed')
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
          <h1 className="text-xl font-display font-bold text-primary mb-1">Verify your email</h1>
          <p className="text-slate-500 text-sm">We've sent a 6-digit code to <span className="font-medium text-slate-700">{email}</span></p>
        </div>

        {/* OTP Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-elevated-lg border border-white/60 p-8 animate-scale-pop">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="flex justify-between gap-2">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 h-14 text-center text-xl font-bold bg-white border-2 border-slate-100 rounded-xl focus:border-secondary focus:ring-4 focus:ring-secondary/10 focus:outline-none transition-all duration-200"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-primary text-white font-display font-semibold rounded-xl hover:bg-primary-light hover:shadow-[0_4px_16px_rgba(15,23,42,0.25)] hover:-translate-y-px active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Code <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-slate-500">
              Didn't receive the code?{' '}
              {timeLeft > 0 ? (
                <span className="font-medium text-slate-400 cursor-not-allowed">Resend in {timeLeft}s</span>
              ) : (
                <button 
                  type="button" 
                  disabled={isResending}
                  className="text-secondary hover:text-secondary-dark font-medium transition-colors cursor-pointer disabled:opacity-50" 
                  onClick={async () => {
                    if (!email) return;
                    setIsResending(true)
                    try {
                      await resendOTP(email)
                      setTimeLeft(59)
                      toast.success('OTP resent! Check your email.')
                    } catch (err) {
                      toast.error(err.message || 'Failed to resend OTP')
                    } finally {
                      setIsResending(false)
                    }
                }}>
                  {isResending ? 'Sending...' : 'Resend OTP'}
                </button>
              )}
            </p>
          </div>
        </div>

        {/* Back to login */}
        <div className="text-center mt-6 animate-fade-in">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary transition-colors group">
            <KeyRound className="w-4 h-4 group-hover:text-secondary transition-colors" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
