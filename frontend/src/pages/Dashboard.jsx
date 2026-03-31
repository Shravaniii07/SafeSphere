import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Globe, Activity, ArrowUpRight, Shield, CheckCircle, MapPin, User, Bell } from 'lucide-react'
import { Card, CardHeader, CardBody, Badge, EmptyState } from '../components/UI'
import { useApp } from '../context/AppContext'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function SafetyScoreRing({ score }) {
  const r = 42, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const color = score > 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#F43F5E'
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 200); return () => clearTimeout(t) }, [])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-20 h-20">
        <circle cx="50" cy="50" r={r} fill="none" stroke="currentColor" strokeWidth="6" className="text-slate-100" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
          style={{
            '--score-circumference': `${c}`,
            '--score-offset': `${offset}`,
            strokeDasharray: c,
            strokeDashoffset: animated ? offset : c,
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1)',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-display font-bold" style={{ color }}>{score}%</span>
      </div>
    </div>
  )
}

// Pull real data from localStorage
function getContactCount() {
  try {
    const stored = localStorage.getItem('safesphere_emergency_contacts')
    if (stored) return JSON.parse(stored).length
  } catch { /* ignore */ }
  return 3
}

function getTripHistory() {
  try {
    const stored = localStorage.getItem('safesphere_trips')
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return []
}

function getRecentActivity() {
  const activities = []
  const now = Date.now()

  // Pull real trips
  const trips = getTripHistory()
  trips.slice(0, 3).forEach(trip => {
    const ago = formatTimeAgo(trip.startTime)
    activities.push({
      color: 'bg-emerald-500',
      text: 'Safe trip completed',
      desc: `${trip.from?.split(',')[0] || 'From'} → ${trip.to?.split(',')[0] || 'To'} (${trip.distance} km)`,
      time: ago,
    })
  })

  // Pull real contacts
  try {
    const contacts = JSON.parse(localStorage.getItem('safesphere_emergency_contacts') || '[]')
    if (contacts.length > 3) {
      const latest = contacts[contacts.length - 1]
      activities.push({
        color: 'bg-info',
        text: 'Emergency contact added',
        desc: `Added ${latest.name}`,
        time: 'Recently',
      })
    }
  } catch { /* ignore */ }

  // If empty, show default
  if (activities.length === 0) {
    activities.push(
      { color: 'bg-secondary', text: 'SafeSphere activated', desc: 'Your safety dashboard is now live', time: 'Just now' },
      { color: 'bg-info', text: 'Profile created', desc: 'Set up your emergency contacts to get started', time: 'Today' },
    )
  }

  return activities
}

function formatTimeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  return `${days}d ago`
}

function computeSafetyScore() {
  let score = 60 // base
  const contacts = getContactCount()
  score += Math.min(contacts * 5, 20) // +5 per contact, max +20
  const trips = getTripHistory()
  if (trips.length > 0) score += 10 // completed trips
  if (trips.length > 3) score += 5
  return Math.min(score, 100)
}

export default function Dashboard() {
  const { user } = useApp()
  const navigate = useNavigate()
  const [contactCount, setContactCount] = useState(getContactCount)
  const [tripCount, setTripCount] = useState(() => getTripHistory().length)
  const [safetyScore, setSafetyScore] = useState(computeSafetyScore)
  const [recentActivity, setRecentActivity] = useState(getRecentActivity)

  // Refresh data when page is focused (user navigates back)
  useEffect(() => {
    const refresh = () => {
      setContactCount(getContactCount())
      setTripCount(getTripHistory().length)
      setSafetyScore(computeSafetyScore())
      setRecentActivity(getRecentActivity())
    }
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  return (
    <div className="stagger-children">
      {/* Welcome Banner */}
      <div className="relative rounded-2xl p-8 lg:p-10 text-white overflow-hidden mb-8 noise-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-light to-[#1e40af]" />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-secondary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 left-20 w-[200px] h-[200px] bg-accent/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-0 right-0 w-full h-full geo-pattern opacity-10" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-secondary-light" />
            <span className="text-secondary-light text-sm font-display font-semibold tracking-wide uppercase">SafeSphere Active</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-display font-bold mb-2 tracking-tight">{getGreeting()}, {user.name.split(' ')[0]}</h2>
          <p className="text-white/60 text-sm max-w-md">Your safety dashboard is active and all systems are operating normally. Stay protected.</p>
        </div>
      </div>

      {/* Quick Stats — pulled from real data */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MiniStat label="Active Contacts" value={String(contactCount)} accent="text-secondary" />
        <MiniStat label="Location Shares" value={String(user.activeContacts > 0 ? Math.min(contactCount, 3) : 0)} accent="text-info" />
        <MiniStat label="Trips Completed" value={String(tripCount)} accent="text-emerald-600" />
        <div className="bg-white rounded-xl border border-slate-100/80 p-4 shadow-elevated card-hover flex items-center gap-3">
          <SafetyScoreRing score={safetyScore} />
          <div>
            <div className="text-xs text-slate-500">Safety Score</div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <ActionCard icon={AlertTriangle} gradient="from-accent/10 to-accent/5" iconColor="text-accent" title="SOS Alert" desc="Trigger emergency alert" onClick={() => navigate('/sos')} />
        <ActionCard icon={Globe} gradient="from-secondary/10 to-secondary/5" iconColor="text-secondary" title="Share Location" desc="Real-time location sharing" onClick={() => navigate('/location')} />
        <ActionCard icon={Activity} gradient="from-info/10 to-info/5" iconColor="text-info" title="Emergency Info" desc="Medical & contact details" onClick={() => navigate('/emergency')} />
      </div>

      {/* Recent Activity — pulled from real trips & contacts */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-display font-bold text-primary">Recent Activity</h3>
          <Badge dot>Today</Badge>
        </CardHeader>
        <CardBody className="stagger-children">
          {recentActivity.length === 0 ? (
            <EmptyState icon={Bell} title="No activity yet" description="Start a trip or add contacts to see activity here." />
          ) : (
            recentActivity.map((a, i) => (
              <ActivityItem key={i} color={a.color} text={a.text} desc={a.desc} time={a.time} last={i === recentActivity.length - 1} />
            ))
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function MiniStat({ label, value, accent }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100/80 p-4 shadow-elevated card-hover">
      <div className={`text-2xl font-display font-bold ${accent} mb-0.5`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}

function ActionCard({ icon: Icon, gradient, iconColor, title, desc, onClick }) {
  return (
    <button onClick={onClick} className="group bg-white rounded-2xl border border-slate-100/80 shadow-elevated p-6 text-left cursor-pointer card-hover relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconColor} bg-current/10`}><Icon className="w-6 h-6" /></div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[15px] font-display font-bold text-primary">{title}</h4>
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-current group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200" />
        </div>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
    </button>
  )
}

function ActivityItem({ color, text, desc, time, last }) {
  return (
    <div className={`flex items-start gap-4 py-4 group ${!last ? 'border-b border-slate-100/60' : ''}`}>
      <div className="relative mt-1">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
        <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${color} opacity-30 group-hover:animate-ping`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-800">{text}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{time}</span>
    </div>
  )
}
