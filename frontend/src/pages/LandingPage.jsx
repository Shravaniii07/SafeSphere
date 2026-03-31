import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertTriangle, MapPin, Users, ChevronDown, Lock, Zap, Smartphone, Globe, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: AlertTriangle,
    title: 'Emergency SOS',
    desc: 'One tap sends your location to all trusted contacts instantly.',
    gradient: 'from-[#FF3B5C]/20 to-[#FF3B5C]/5',
    iconColor: 'text-[#FF3B5C]',
  },
  {
    icon: MapPin,
    title: 'Live Location',
    desc: 'Share real-time GPS with family and friends silently.',
    gradient: 'from-[#3B82F6]/20 to-[#3B82F6]/5',
    iconColor: 'text-[#3B82F6]',
  },
  {
    icon: Users,
    title: 'Trusted Contacts',
    desc: 'Build your circle of people who get alerted first.',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    iconColor: 'text-emerald-400',
  },
]

const steps = [
  { num: '01', title: 'Create your account', desc: 'Sign up in seconds with just your email.' },
  { num: '02', title: 'Add your trusted contacts', desc: 'Build your emergency contact circle.' },
  { num: '03', title: 'Hit SOS — we handle the rest', desc: 'One tap alerts everyone with your location.' },
]

const trustItems = [
  '🔒 End-to-end private',
  '⚡ Instant alerts',
  '📱 Works offline',
  '🌍 Global coverage',
  '🛡️ Always watching',
  '💚 Free forever',
]

export default function LandingPage() {
  const navigate = useNavigate()
  const observerRef = useRef(null)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
          }
        })
      },
      { threshold: 0.15 }
    )

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
      observerRef.current.observe(el)
    })

    return () => observerRef.current?.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      {/* ── Animated Background Orbs ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[15%] w-[400px] h-[400px] rounded-full bg-[#FF3B5C]/8 blur-[120px] landing-orb-1" />
        <div className="absolute top-[50%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#3B82F6]/6 blur-[140px] landing-orb-2" />
        <div className="absolute bottom-[10%] left-[40%] w-[350px] h-[350px] rounded-full bg-purple-500/5 blur-[100px] landing-orb-3" />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-2.5 landing-fade-up">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF3B5C] to-[#3B82F6] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">
            Safe<span className="bg-gradient-to-r from-[#FF3B5C] to-[#3B82F6] bg-clip-text text-transparent">Sphere</span>
          </span>
        </div>
        <div className="flex items-center gap-3 landing-fade-up landing-delay-1">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2.5 text-sm font-medium text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Log In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-5 py-2.5 text-sm font-semibold bg-[#FF3B5C] hover:bg-[#e6354f] rounded-xl text-white transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 lg:pt-24 lg:pb-32 min-h-[85vh]">
        {/* Shield Icon + Pulse Rings */}
        <div className="relative mb-8 landing-fade-up landing-delay-1">
          <div className="absolute inset-0 w-20 h-20 rounded-full border border-[#FF3B5C]/30 landing-ring" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border border-[#FF3B5C]/20 landing-ring-2" />
          <div className="absolute inset-0 w-20 h-20 rounded-full border border-[#FF3B5C]/10 landing-ring-3" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#FF3B5C] to-[#c0213a] flex items-center justify-center landing-shield-pulse">
            <Shield className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 landing-fade-up landing-delay-2">
          <span className="bg-gradient-to-r from-[#FF3B5C] via-[#a855f7] to-[#3B82F6] bg-clip-text text-transparent">
            SafeSphere
          </span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-gray-300 font-medium mb-3 landing-fade-up landing-delay-3">
          Your safety. Always within reach.
        </p>
        <p className="text-sm md:text-base text-gray-500 max-w-lg mb-10 landing-fade-up landing-delay-3">
          Real-time SOS alerts. Live location sharing. Trusted contacts.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 landing-fade-up landing-delay-4">
          <button
            onClick={() => navigate('/register')}
            className="flex items-center gap-2 px-8 py-4 bg-[#FF3B5C] hover:bg-[#e6354f] text-white font-semibold rounded-xl shadow-[0_0_30px_rgba(255,59,92,0.3)] hover:shadow-[0_0_50px_rgba(255,59,92,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer text-base"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-8 py-4 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer text-base"
          >
            Log In
          </button>
        </div>

        {/* Scroll Arrow */}
        <div className="absolute bottom-8 landing-bounce-arrow landing-fade-up landing-delay-5">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 px-6 lg:px-16 py-20">
        <div className="text-center mb-14 reveal-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Everything you need to <span className="bg-gradient-to-r from-[#FF3B5C] to-[#3B82F6] bg-clip-text text-transparent">stay safe</span>
          </h2>
          <p className="text-gray-400 max-w-md mx-auto">
            Powerful safety tools designed to protect you in any situation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div
              key={i}
              className="reveal-on-scroll group bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-7 hover:bg-white/[0.07] hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className={`w-7 h-7 ${f.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 px-6 lg:px-16 py-20">
        <div className="text-center mb-14 reveal-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How it works</h2>
          <p className="text-gray-400 max-w-md mx-auto">Get protected in three simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="reveal-on-scroll text-center md:text-left">
              <div className="text-4xl font-bold bg-gradient-to-r from-[#FF3B5C]/40 to-[#3B82F6]/40 bg-clip-text text-transparent mb-3">
                {s.num}
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-gray-400 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="relative z-10 py-8 border-y border-white/[0.06] overflow-hidden">
        <div className="landing-marquee flex items-center gap-12 whitespace-nowrap w-max">
          {[...trustItems, ...trustItems].map((item, i) => (
            <span key={i} className="text-sm text-gray-400 font-medium flex-shrink-0">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative z-10 px-6 lg:px-16 py-24 text-center">
        <div className="reveal-on-scroll">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to feel <span className="bg-gradient-to-r from-[#FF3B5C] to-[#3B82F6] bg-clip-text text-transparent">safer</span>?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands who trust SafeSphere for their personal safety.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#FF3B5C] hover:bg-[#e6354f] text-white font-semibold rounded-xl shadow-[0_0_30px_rgba(255,59,92,0.3)] hover:shadow-[0_0_50px_rgba(255,59,92,0.4)] transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer text-base mb-4"
          >
            Create Free Account <ArrowRight className="w-5 h-5" />
          </button>
          <p className="text-gray-500 text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login')} className="text-[#3B82F6] hover:text-[#60a5fa] font-medium transition-colors cursor-pointer">
              Log in
            </button>
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.06] px-6 lg:px-16 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#FF3B5C]" />
          <span className="text-sm text-gray-500">© 2026 SafeSphere. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
          <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  )
}
