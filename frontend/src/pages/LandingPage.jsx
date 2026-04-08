import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, AlertTriangle, MapPin, Users, ChevronDown, Zap, Globe, ArrowRight, Star, Check, Heart, Phone, Lock } from 'lucide-react'

const features = [
  {
    icon: AlertTriangle,
    title: 'Emergency SOS',
    desc: 'One tap sends your location to all trusted contacts instantly with real-time GPS coordinates.',
    gradient: 'from-primary to-primary-dark',
  },
  {
    icon: MapPin,
    title: 'Live Tracking',
    desc: 'Share real-time GPS with family and friends. Track journeys and get safety corridor alerts.',
    gradient: 'from-accent to-secondary',
  },
  {
    icon: Users,
    title: 'Trusted Circle',
    desc: 'Build your network of people who get alerted first. Manage contacts with one tap.',
    gradient: 'from-success to-[#059669]',
  },
  {
    icon: Shield,
    title: 'Safety Insights',
    desc: 'AI-powered safety scores, heatmaps, and route analysis to keep you informed and prepared.',
    gradient: 'from-warning to-[#F59E0B]',
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
    <div className="min-h-screen bg-bg text-text overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[5%] left-[15%] w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[150px] landing-orb-1" />
        <div className="absolute top-[45%] right-[5%] w-[500px] h-[500px] rounded-full bg-accent/[0.05] blur-[140px] landing-orb-2" />
        <div className="absolute bottom-[5%] left-[35%] w-[400px] h-[400px] rounded-full bg-secondary/[0.08] blur-[130px] landing-orb-3" />
      </div>

      {/* Subtle Grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.3]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

      {/* Nav — Frosted glass */}
      <nav className="relative z-20 flex items-center justify-between px-6 lg:px-20 py-6 backdrop-blur-md bg-overlay border-b border-border">
        <div className="flex items-center gap-2.5 landing-fade-up">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow-red">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-text flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Safe<span className="text-primary">Sphere</span>
            <span className="w-2 h-2 rounded-full bg-primary animate-glow-dot" />
          </span>
        </div>
        <div className="flex items-center gap-3 landing-fade-up landing-delay-1">
          <button onClick={() => navigate('/login')} className="px-5 py-2.5 text-sm font-medium text-muted hover:text-text transition-colors duration-300 cursor-pointer relative group">
            Log In
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          </button>
          <button onClick={() => navigate('/register')} className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-primary text-white hover:bg-primary-dark hover:shadow-[0_0_30px_rgba(230,57,70,0.3)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-28 lg:pt-24 lg:pb-40 min-h-[90vh]">
        {/* Shield + Rings */}
        <div className="relative mb-10 landing-fade-up landing-delay-1">
          <div className="absolute inset-0 w-24 h-24 rounded-full border border-primary/30 landing-ring" />
          <div className="absolute inset-0 w-24 h-24 rounded-full border border-primary/20 landing-ring-2" />
          <div className="absolute inset-0 w-24 h-24 rounded-full border border-primary/10 landing-ring-3" />
          <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow-red-intense" style={{ animation: 'hero-shield-glow 3.5s ease-in-out infinite' }}>
            <Shield className="w-11 h-11 text-white" />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-overlay border border-border rounded-full mb-8 landing-fade-up landing-delay-1 shadow-sm backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[13px] font-medium text-muted">Protecting thousands worldwide</span>
        </div>

        {/* Heading */}
        <h1 className="text-[clamp(2.5rem,7vw,5.5rem)] font-extrabold tracking-tight leading-[1.05] mb-6 landing-fade-up landing-delay-2 max-w-4xl text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Your Safety,{' '}
          <span className="bg-gradient-to-r from-primary via-primary-light to-[#E63946] bg-clip-text text-transparent">
            Reimagined
          </span>
        </h1>

        <p className="text-[17px] text-muted leading-relaxed mb-4 max-w-lg landing-fade-up landing-delay-3">
          Real-time SOS alerts. Live location sharing. Trusted contacts. All in one powerful safety platform.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-10 landing-fade-up landing-delay-4">
          <button onClick={() => navigate('/register')}
            className="group flex items-center gap-2.5 px-8 py-4 bg-primary text-white font-semibold rounded-2xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(230,57,70,0.4)] active:scale-95 cursor-pointer text-[15px]">
            Get Started Free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
          </button>
          <button onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-8 py-4 border border-accent hover:border-accent/80 hover:bg-accent/10 text-accent font-medium rounded-2xl transition-all duration-300 cursor-pointer text-[15px]">
            Sign In
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-10 lg:gap-16 mt-20 landing-fade-up landing-delay-5">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-text tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</div>
              <div className="text-xs text-muted mt-1 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-10 landing-bounce-arrow landing-fade-up landing-delay-5">
          <ChevronDown className="w-5 h-5 text-muted/50" />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 px-6 lg:px-20 py-28">
        <div className="text-center mb-20 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-warning/10 border border-[#FFB703]/20 rounded-full mb-5">
            <Star className="w-3.5 h-3.5 text-warning" />
            <span className="text-xs font-semibold text-warning">Core Features</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-5 text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-primary to-[#FF4D5A] bg-clip-text text-transparent">stay safe</span>
          </h2>
          <p className="text-muted max-w-md mx-auto text-[16px] leading-relaxed">
            Built with precision. Designed for emergencies. Trusted by thousands.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div key={i} className="reveal-on-scroll group bg-surface border border-border rounded-2xl p-8 hover:shadow-[0_0_30px_rgba(230,57,70,0.1)] hover:border-muted/30 hover:-translate-y-1 transition-all duration-500 cursor-default backdrop-blur-sm">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                <f.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 tracking-tight text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 px-6 lg:px-20 py-28">
        <div className="text-center mb-16 reveal-on-scroll">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-5 text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Three steps to <span className="bg-gradient-to-r from-success to-[#457B9D] bg-clip-text text-transparent">safety</span>
          </h2>
          <p className="text-muted max-w-md mx-auto text-[16px]">Get protected in under a minute.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <div key={i} className="reveal-on-scroll text-center group">
              <div className="w-16 h-16 rounded-2xl bg-surface border border-border flex items-center justify-center mx-auto mb-5 shadow-card group-hover:shadow-[0_0_20px_rgba(230,57,70,0.15)] group-hover:border-primary/30 group-hover:-translate-y-1 transition-all duration-500">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <div className="text-xs font-bold text-primary mb-2 tracking-widest font-mono">{s.num}</div>
              <h3 className="text-[17px] font-semibold mb-2 tracking-tight text-text" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</h3>
              <p className="text-muted text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="relative z-10 py-6 border-y border-border overflow-hidden bg-overlay">
        <div className="landing-marquee flex items-center gap-14 whitespace-nowrap w-max">
          {[...trustItems, ...trustItems].map((item, i) => (
            <span key={i} className="text-sm text-muted/60 font-medium flex-shrink-0">{item}</span>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="relative z-10 px-6 lg:px-20 py-28">
        <div className="max-w-3xl mx-auto text-center reveal-on-scroll">
          <div className="inline-flex items-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 text-warning fill-warning" />
            ))}
          </div>
          <blockquote className="text-2xl lg:text-3xl font-semibold text-text leading-snug mb-8 tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            "SafeSphere gave me peace of mind during my solo travels. The instant SOS feature is a game changer."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-semibold text-sm">
              A
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-text">Ananya S.</div>
              <div className="text-xs text-muted">Solo Traveler & SafeSphere User</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-20 py-32 text-center">
        <div className="reveal-on-scroll max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-[#1D3557] via-surface to-secondary rounded-3xl p-12 lg:p-16 shadow-2xl relative overflow-hidden border border-border">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-[60px]" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-5 text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Ready to feel{' '}
                <span className="bg-gradient-to-r from-primary via-primary-light to-[#E63946] bg-clip-text text-transparent">safer</span>?
              </h2>
              <p className="text-text-secondary mb-10 max-w-md mx-auto text-[16px] leading-relaxed">
                Join thousands who trust SafeSphere for their personal safety. Free forever.
              </p>
              <button onClick={() => navigate('/register')}
                className="group inline-flex items-center gap-2.5 px-10 py-4 bg-primary text-white font-semibold rounded-2xl transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(230,57,70,0.4)] active:scale-95 cursor-pointer text-[15px] mb-4">
                Create Free Account <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-300" />
              </button>
              <p className="text-text-secondary text-sm">
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-primary hover:text-[#FF4D5A] font-medium transition-colors duration-300 cursor-pointer">Log in</button>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border px-6 lg:px-20 py-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-overlay">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted/60">© 2026 SafeSphere. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-muted/60">
          <span className="hover:text-text transition-colors duration-300 cursor-pointer">Privacy</span>
          <span className="hover:text-text transition-colors duration-300 cursor-pointer">Terms</span>
          <span className="hover:text-text transition-colors duration-300 cursor-pointer">Contact</span>
        </div>
      </footer>
    </div>
  )
}
