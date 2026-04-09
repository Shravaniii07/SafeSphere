import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Globe, Activity, ArrowUpRight, Shield, MapPin, Bell, TrendingUp, Users, Zap } from 'lucide-react'
import { Card, CardHeader, CardBody, Badge, EmptyState } from '../components/UI'
import { useApp } from '../context/AppContext'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function SafetyScoreRing({ score }) {
  const r = 44, c = 2 * Math.PI * r
  const offset = c - (score / 100) * c
  const color = score > 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
  const [animated, setAnimated] = useState(false)
  useEffect(() => { const t = setTimeout(() => setAnimated(true), 400); return () => clearTimeout(t) }, [])

  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-28 h-28">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#F3F4F6" strokeWidth="5" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
          style={{
            strokeDasharray: c,
            strokeDashoffset: animated ? offset : c,
            transition: 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%',
          }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tracking-tight" style={{ color }}>{score}</span>
        <span className="text-[10px] text-gray-400">/ 100</span>
      </div>
    </div>
  )
}

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
  const trips = getTripHistory()
  trips.slice(0, 3).forEach(trip => {
    activities.push({
      color: 'bg-emerald-500',
      text: 'Safe trip completed',
      desc: `${trip.from?.split(',')[0] || 'From'} → ${trip.to?.split(',')[0] || 'To'} (${trip.distance} km)`,
      time: formatTimeAgo(trip.startTime),
    })
  })

  try {
    const contacts = JSON.parse(localStorage.getItem('safesphere_emergency_contacts') || '[]')
    if (contacts.length > 3) {
      const latest = contacts[contacts.length - 1]
      activities.push({ color: 'bg-violet-500', text: 'Emergency contact added', desc: `Added ${latest.name}`, time: 'Recently' })
    }
  } catch { /* ignore */ }

  if (activities.length === 0) {
    activities.push(
      { color: 'bg-blue-500', text: 'SafeSphere activated', desc: 'Your safety dashboard is now live', time: 'Just now' },
      { color: 'bg-violet-500', text: 'Profile created', desc: 'Set up your emergency contacts to get started', time: 'Today' },
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
  let score = 60
  const contacts = getContactCount()
  score += Math.min(contacts * 5, 20)
  const trips = getTripHistory()
  if (trips.length > 0) score += 10
  if (trips.length > 3) score += 5
  return Math.min(score, 100)
}

export default function Dashboard() {
  const { user } = useApp()
  const navigate = useNavigate()
  const [contactCount] = useState(getContactCount)
  const [tripCount] = useState(() => getTripHistory().length)
  const [safetyScore] = useState(computeSafetyScore)
  const [recentActivity] = useState(getRecentActivity)

  return (
    <div className="stagger-children">
      {/* Welcome */}
      <div className="relative rounded-2xl p-8 lg:p-10 text-white overflow-hidden mb-8 noise-overlay">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900" />
        <div className="absolute -top-20 -right-20 w-[350px] h-[350px] bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-20 left-20 w-[250px] h-[250px] bg-violet-500/8 rounded-full blur-[60px]" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/[0.06] rounded-full border border-white/[0.06]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-medium">Systems Active</span>
            </div>
          </div>
          <h2 className="text-2xl lg:text-3xl font-bold mb-2 tracking-tight">{getGreeting()}, {user.name.split(' ')[0]}</h2>
          <p className="text-white/40 text-sm max-w-lg">Your safety dashboard is active. All systems operating normally.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Active Contacts" value={String(contactCount)} icon={Users} color="text-blue-500" bgColor="bg-blue-50" />
        <StatCard label="Location Shares" value={String(Math.min(contactCount, 3))} icon={Globe} color="text-violet-500" bgColor="bg-violet-50" />
        <StatCard label="Trips Completed" value={String(tripCount)} icon={TrendingUp} color="text-emerald-600" bgColor="bg-emerald-50" />
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-card card-interactive flex items-center gap-4">
          <SafetyScoreRing score={safetyScore} />
          <div>
            <div className="text-xs text-gray-400 font-medium">Safety Score</div>
            <div className="text-[11px] text-gray-400 mt-0.5">{safetyScore > 80 ? 'Excellent' : safetyScore >= 60 ? 'Good' : 'Needs work'}</div>
          </div>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <ActionCard icon={AlertTriangle} iconBg="bg-gradient-to-br from-red-500 to-orange-500" title="SOS Alert" desc="Trigger emergency alert" onClick={() => navigate('/sos')} />
        <ActionCard icon={Globe} iconBg="bg-gradient-to-br from-blue-500 to-cyan-500" title="Share Location" desc="Real-time GPS sharing" onClick={() => navigate('/location')} />
        <ActionCard icon={Activity} iconBg="bg-gradient-to-br from-violet-500 to-purple-500" title="Emergency Info" desc="Medical & contact details" onClick={() => navigate('/emergency')} />
      </div>

      {/* Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-semibold text-gray-900">Recent Activity</h3>
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

function StatCard({ label, value, icon: Icon, color, bgColor }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/60 p-5 shadow-card card-interactive">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-9 h-9 rounded-xl ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
      <div className={`text-2xl font-bold ${color} mb-0.5 tracking-tight`}>{value}</div>
      <div className="text-xs text-gray-400">{label}</div>
    </div>
  )
}

function ActionCard({ icon: Icon, iconBg, title, desc, onClick }) {
  return (
    <button onClick={onClick} className="group bg-white rounded-2xl border border-gray-200/60 shadow-card p-6 text-left cursor-pointer card-interactive relative overflow-hidden">
      <div className="relative z-10">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconBg} shadow-md`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-[15px] font-semibold text-gray-900">{title}</h4>
          <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
        </div>
        <p className="text-sm text-gray-400">{desc}</p>
      </div>
    </button>
  )
}

function ActivityItem({ color, text, desc, time, last }) {
  return (
    <div className={`flex items-start gap-4 py-4 ${!last ? 'border-b border-gray-100' : ''}`}>
      <div className="relative mt-1.5">
        <div className={`w-2 h-2 rounded-full ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700">{text}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <span className="text-[11px] text-gray-400 font-mono whitespace-nowrap">{time}</span>
    </div>
  )
}
