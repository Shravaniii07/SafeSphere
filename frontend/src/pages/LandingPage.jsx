import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertTriangle, MapPin, Users, ChevronDown, Zap, Globe, ArrowRight, Star, Check, Heart, Phone, Lock } from 'lucide-react'

const features = [
  {
    icon: AlertTriangle,
    title: 'Emergency SOS',
    desc: 'One tap sends your location to all trusted contacts instantly with real-time GPS coordinates.',
    gradient: 'from-red-500 to-orange-500',
    lightBg: 'bg-red-50',
    lightText: 'text-red-500',
  },
  {
    icon: MapPin,
    title: 'Live Tracking',
    desc: 'Share real-time GPS with family and friends. Track journeys and get safety corridor alerts.',
    gradient: 'from-blue-500 to-cyan-500',
    lightBg: 'bg-blue-50',
    lightText: 'text-blue-500',
  },
  {
    icon: Users,
    title: 'Trusted Circle',
    desc: 'Build your network of people who get alerted first. Manage contacts with one tap.',
    gradient: 'from-emerald-500 to-teal-500',
    lightBg: 'bg-emerald-50',
    lightText: 'text-emerald-500',
  },
  {
    icon: Shield,
    title: 'Safety Insights',
    desc: 'AI-powered safety scores, heatmaps, and route analysis to keep you informed and prepared.',
    gradient: 'from-violet-500 to-purple-500',
    lightBg: 'bg-violet-50',
    lightText: 'text-violet-500',
  },
]

const steps = [
  { num: '01', title: 'Create your account', desc: 'Sign up in seconds with just your email.', icon: Lock },
  { num: '02', title: 'Add trusted contacts', desc: 'Build your emergency contact network.', icon: Phone },
  { num: '03', title: 'Stay protected', desc: 'One tap SOS sends alerts with your live location.', icon: Shield },
]

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '<2s', label: 'Alert Speed' },
  { value: '24/7', label: 'Monitoring' },
]

const trustItems = ['🔒 End-to-end private', '⚡ Instant alerts', '📱 Works offline', '🌍 Global coverage', '🛡️ Always watching', '💚 Free forever']

export default function LandingPage() {
  const navigate = useNavigate()
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('revealed') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observerRef.current.observe(el))
    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFBFE] text-gray-900 overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Background Orbs — soft light colors */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[15%] w-[600px] h-[600px] rounded-full bg-blue-400/[0.06] blur-[150px] landing-orb-1" />
        <div className="absolute top-[45%] right-[5%] w-[500px] h-[500px] rounded-full bg-violet-400/[0.05] blur-[140px] landing-orb-2" />
        <div className="absolute bottom-[5%] left-[35%] w-[400px] h-[400px] rounded-full bg-pink-300/[0.04] blur-[130px] landing-orb-3" />
      </div>

      {/* Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-20 py-6">
        <div className="flex items-center gap-2.5 landing-fade-up">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-md shadow-blue-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900">
            Safe<span className="text-blue-500">Sphere</span>
          </span>
        </div>
        <div className="flex items-center gap-3 landing-fade-up landing-delay-1">
          <button onClick={() => navigate('/login')} className="px-5 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-300 cursor-pointer">
            Log In
          </button>
          <button onClick={() => navigate('/register')} className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/10 transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-28 lg:pt-24 lg:pb-40 min-h-[90vh]">
        {/* Shield + Rings */}
        <div className="relative mb-10 landing-fade-up landing-delay-1">
          <div className="absolute inset-0 w-24 h-24 rounded-full border border-blue-300/30 landing-ring" />
          <div className="absolute inset-0 w-24 h-24 rounded-full border border-blue-200/20 landing-ring-2" />
          <div className="absolute inset-0 w-24 h-24 rounded-full border border-blue-100/10 landing-ring-3" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-xl shadow-blue-500/25" style={{ animation: 'hero-shield-glow 3.5s ease-in-out infinite' }}>
            <Shield className="w-11 h-11 text-white" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/80 rounded-full mb-8 landing-fade-up landing-delay-1 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[13px] font-medium text-gray-500">Protecting thousands worldwide</span>
        </div>

        {/* Heading */}
        <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold tracking-tight leading-[1.05] mb-6 landing-fade-up landing-delay-2 max-w-4xl text-gray-900">
          Your Safety,{' '}
          <span className="bg-gradient-to-r from-blue-500 via-violet-500 to-pink-500 bg-clip-text text-transparent">
            Reimagined
          </span>
        </h1>

        <p className="text-[17px] text-gray-400 leading-relaxed mb-4 max-w-lg landing-fade-up landing-delay-3">
          Real-time SOS alerts. Live location sharing. Trusted contacts. All in one powerful safety platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 landing-fade-up landing-delay-4">
          <button onClick={() => navigate('/register')}
            className="group flex items-center gap-2.5 px-8 py-4 bg-gray-900 text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gray-900/15 active:scale-95 cursor-pointer text-[15px]">
            Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
          <button onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-8 py-4 border border-gray-200 hover:border-gray-300 hover:bg-white text-gray-600 font-medium rounded-2xl transition-all duration-300 cursor-pointer text-[15px] bg-white/50">
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10 lg:gap-16 mt-20 landing-fade-up landing-delay-5">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">{s.value}</div>
              <div className="text-xs text-gray-400 mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 landing-bounce-arrow landing-fade-up landing-delay-5">
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-20 py-28">
        <div className="text-center mb-20 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-200/60 rounded-full mb-5">
            <Star className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-semibold text-amber-600">Core Features</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-5 text-gray-900">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-blue-500 to-violet-500 bg-clip-text text-transparent">stay safe</span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-[16px] leading-relaxed">
            Built with precision. Designed for emergencies. Trusted by thousands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="reveal-on-scroll group bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-xl hover:shadow-gray-900/[0.04] hover:border-gray-200 hover:-translate-y-1 transition-all duration-500 cursor-default">
              <div className={`w-12 h-12 rounded-xl ${f.lightBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                <f.icon className={`w-6 h-6 ${f.lightText}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight text-gray-900">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 lg:px-20 py-28 bg-gradient-to-b from-transparent via-gray-50/80 to-transparent">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-5 text-gray-900">
            Three steps to <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">safety</span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto text-[16px]">Get protected in under a minute.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="reveal-on-scroll text-center group">
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mx-auto mb-5 shadow-sm group-hover:shadow-md group-hover:border-blue-200 group-hover:-translate-y-1 transition-all duration-500">
                <s.icon className="w-7 h-7 text-blue-500" />
              </div>
              <div className="text-xs font-bold text-blue-400 mb-2 tracking-widest">{s.num}</div>
              <h3 className="text-[17px] font-semibold mb-2 tracking-tight text-gray-900">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="relative z-10 py-6 border-y border-gray-100 overflow-hidden bg-white/60">
        <div className="landing-marquee flex items-center gap-14 whitespace-nowrap w-max">
          {[...trustItems, ...trustItems].map((item, i) => (
            <span key={i} className="text-sm text-gray-400 font-medium flex-shrink-0">{item}</span>
          ))}
        </div>
      </section>

      {/* Testimonial / Social Proof */}
      <section className="relative z-10 px-6 lg:px-20 py-28">
        <div className="max-w-3xl mx-auto text-center reveal-on-scroll">
          <div className="inline-flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
          <blockquote className="text-2xl lg:text-3xl font-semibold text-gray-800 leading-snug mb-8 tracking-tight">
            "SafeSphere gave me peace of mind during my solo travels. The instant SOS feature is a game changer."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-violet-400 flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-800">Ananya S.</div>
              <div className="text-xs text-gray-400">Solo Traveler & SafeSphere User</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-20 py-32 text-center">
        <div className="reveal-on-scroll max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-12 lg:p-16 shadow-2xl shadow-gray-900/15 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-500/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-5 text-white">
                Ready to feel{' '}
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">safer</span>?
              </h2>
              <p className="text-white/50 mb-10 max-w-md mx-auto text-[16px] leading-relaxed">
                Join thousands who trust SafeSphere for their personal safety. Free forever.
              </p>
              <button onClick={() => navigate('/register')}
                className="group inline-flex items-center gap-2.5 px-10 py-4 bg-white text-gray-900 font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-xl active:scale-95 cursor-pointer text-[15px] mb-4">
                Create Free Account <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
              <p className="text-white/40 text-sm">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300 cursor-pointer">Log in</button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-100 px-6 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-white/50">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span className="text-sm text-gray-400">© 2026 SafeSphere. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-gray-400">
          <span className="hover:text-gray-600 transition-colors duration-300 cursor-pointer">Privacy</span>
          <span className="hover:text-gray-600 transition-colors duration-300 cursor-pointer">Terms</span>
          <span className="hover:text-gray-600 transition-colors duration-300 cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  )
}
