import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Users, AlertTriangle, Route, Server, Download, Send, Bell, Megaphone, Trash2, Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Badge, Skeleton, EmptyState } from '../components/UI'
import toast from 'react-hot-toast'

const ADMIN_NOTIF_KEY = 'safesphere_admin_notifications'

const allUsers = [
  { initials: 'AS', name: 'Aarav Singh', email: 'aarav@email.com', status: 'Active', sv: 'success', joined: 'Jan 15, 2026', gradient: 'from-primary to-primary-light' },
  { initials: 'PK', name: 'Priya Kumar', email: 'priya@email.com', status: 'Active', sv: 'success', joined: 'Feb 02, 2026', gradient: 'from-secondary to-secondary-dark' },
  { initials: 'RM', name: 'Ravi Mehta', email: 'ravi@email.com', status: 'Suspended', sv: 'warning', joined: 'Feb 20, 2026', gradient: 'from-amber-500 to-amber-600' },
  { initials: 'NK', name: 'Neha Kapoor', email: 'neha@email.com', status: 'Active', sv: 'success', joined: 'Mar 10, 2026', gradient: 'from-accent to-accent-dark' },
  { initials: 'VG', name: 'Vikas Gupta', email: 'vikas@email.com', status: 'Blocked', sv: 'danger', joined: 'Mar 18, 2026', gradient: 'from-info to-indigo-600' },
]

const stats = [
  { value: '1,247', label: 'Total Users', change: '+12%', up: true, icon: Users },
  { value: '89', label: 'Active SOS', change: '-3%', up: false, icon: AlertTriangle },
  { value: '456', label: 'Trips Today', change: '+8%', up: true, icon: Route },
  { value: '99.9%', label: 'Uptime', change: 'Stable', up: true, icon: Server },
]

const priorityConfig = {
  info: { label: 'Info', color: 'bg-info/10 text-info border-info/20', dot: 'bg-info', badge: 'info' },
  warning: { label: 'Warning', color: 'bg-amber-50 text-amber-600 border-amber-200', dot: 'bg-amber-500', badge: 'warning' },
  critical: { label: 'Critical', color: 'bg-accent/10 text-accent border-accent/20', dot: 'bg-accent', badge: 'danger' },
}

function loadAdminNotifications() {
  try {
    const stored = localStorage.getItem(ADMIN_NOTIF_KEY)
    if (stored) return JSON.parse(stored)
  } catch { /* ignore */ }
  return []
}

function saveAdminNotifications(notifs) {
  try { localStorage.setItem(ADMIN_NOTIF_KEY, JSON.stringify(notifs)) } catch { /* ignore */ }
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
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

export default function AdminPanel() {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Notification compose state
  const [notifTitle, setNotifTitle] = useState('')
  const [notifMessage, setNotifMessage] = useState('')
  const [notifPriority, setNotifPriority] = useState('info')
  const [notifAudience, setNotifAudience] = useState('all')
  const [sending, setSending] = useState(false)
  const [sentNotifs, setSentNotifs] = useState(loadAdminNotifications)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t) }, [])

  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleAction = (user, action) => {
    if (action === 'Block') toast.success(`${user.name} has been blocked`)
    else toast.error(`${user.name} has been removed`)
  }

  const handleSendNotification = () => {
    if (!notifTitle.trim()) {
      toast.error('Please enter a notification title')
      return
    }
    if (!notifMessage.trim()) {
      toast.error('Please enter a notification message')
      return
    }

    setSending(true)

    // Simulate network delay for realistic feel
    setTimeout(() => {
      const newNotif = {
        id: Date.now(),
        type: notifPriority === 'critical' ? 'sos' : notifPriority === 'warning' ? 'system' : 'info',
        adminType: notifPriority,
        title: notifTitle.trim(),
        desc: notifMessage.trim(),
        time: Date.now(),
        read: false,
        audience: notifAudience,
        sentBy: 'Admin',
        isAdmin: true,
      }

      const updated = [newNotif, ...sentNotifs]
      setSentNotifs(updated)
      saveAdminNotifications(updated)

      // Also push to user notifications store so users see it
      try {
        const userNotifKey = 'safesphere_notifications'
        const userNotifs = JSON.parse(localStorage.getItem(userNotifKey) || '[]')
        userNotifs.unshift(newNotif)
        localStorage.setItem(userNotifKey, JSON.stringify(userNotifs))
      } catch { /* ignore */ }

      setNotifTitle('')
      setNotifMessage('')
      setNotifPriority('info')
      setNotifAudience('all')
      setSending(false)

      const audienceText = notifAudience === 'all' ? 'all users' : `${notifAudience} users`
      toast.success(
        <span className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Notification sent to {audienceText}!
        </span>,
        { duration: 3000 }
      )
    }, 1200)
  }

  const deleteNotif = (id) => {
    const updated = sentNotifs.filter(n => n.id !== id)
    setSentNotifs(updated)
    saveAdminNotifications(updated)

    // Also remove from user feed
    try {
      const userNotifKey = 'safesphere_notifications'
      const userNotifs = JSON.parse(localStorage.getItem(userNotifKey) || '[]')
      localStorage.setItem(userNotifKey, JSON.stringify(userNotifs.filter(n => n.id !== id)))
    } catch { /* ignore */ }

    toast.success('Notification deleted')
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Manage users, analytics & broadcast notifications</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => {
          const csvHeader = 'Name,Email,Status,Joined\n'
          const csvRows = allUsers.map(u => `${u.name},${u.email},${u.status},${u.joined}`).join('\n')
          const blob = new Blob([csvHeader + csvRows], { type: 'text/csv' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a'); a.href = url; a.download = 'safesphere_users.csv'; a.click()
          URL.revokeObjectURL(url)
          toast.success('Users exported as CSV!')
        }}><Download className="w-4 h-4" /> Export</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger-children">
        {stats.map((s, i) => (
          <div key={i} className="group p-5 bg-white rounded-2xl border border-slate-100/80 shadow-elevated card-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-2xl font-display font-bold text-primary tracking-tight">{s.value}</div>
                <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                <div className={`flex items-center gap-1 text-xs font-semibold mt-2 ${s.up ? 'text-emerald-600' : 'text-accent'}`}>
                  {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{s.change}
                </div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary"><s.icon className="w-5 h-5" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ Broadcast Notification Section ═══ */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-display font-bold text-primary">Broadcast Notification</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Send announcements to all users</p>
            </div>
          </div>
          <Badge variant="info" dot>
            {sentNotifs.length} sent
          </Badge>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compose Form */}
            <div className="space-y-4">
              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Title</label>
                <input
                  type="text"
                  placeholder="e.g. System Maintenance Tonight"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  maxLength={80}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400"
                />
                <div className="text-[11px] text-slate-400 text-right">{notifTitle.length}/80</div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Message</label>
                <textarea
                  placeholder="Write your notification message..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  rows={3}
                  maxLength={300}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm resize-y transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400"
                />
                <div className="text-[11px] text-slate-400 text-right">{notifMessage.length}/300</div>
              </div>

              {/* Priority & Audience */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Priority</label>
                  <div className="flex gap-2">
                    {Object.entries(priorityConfig).map(([key, cfg]) => (
                      <button
                        key={key}
                        onClick={() => setNotifPriority(key)}
                        className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                          notifPriority === key
                            ? `${cfg.color} border-current shadow-sm`
                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {cfg.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Audience</label>
                  <select
                    value={notifAudience}
                    onChange={(e) => setNotifAudience(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%2394A3B8%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27M6%209l6%206%206-6%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center] pr-10 transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none"
                  >
                    <option value="all">All Users</option>
                    <option value="active">Active Users Only</option>
                    <option value="new">New Users (This Month)</option>
                  </select>
                </div>
              </div>

              {/* Send Button */}
              <Button
                variant="teal"
                full
                onClick={handleSendNotification}
                disabled={sending || !notifTitle.trim() || !notifMessage.trim()}
                isLoading={sending}
                className="mt-2"
              >
                {!sending && <Send className="w-4 h-4" />}
                {sending ? 'Sending...' : 'Send Notification'}
              </Button>
            </div>

            {/* Live Preview */}
            <div>
              <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide mb-3 block">Preview</label>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${priorityConfig[notifPriority].color}`}>
                      {notifPriority === 'critical' ? <AlertTriangle className="w-5 h-5" /> :
                       notifPriority === 'warning' ? <Bell className="w-5 h-5" /> :
                       <Megaphone className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="text-sm font-display font-semibold text-primary truncate">
                          {notifTitle || 'Notification title...'}
                        </h5>
                        <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {notifMessage || 'Your notification message will appear here...'}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                        <Badge variant={priorityConfig[notifPriority].badge} className="text-[10px]">
                          {priorityConfig[notifPriority].label}
                        </Badge>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {notifAudience === 'all' ? 'All Users' : notifAudience === 'active' ? 'Active' : 'New'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 text-center mt-3">This is how users will see your notification</p>
              </div>
            </div>
          </div>

          {/* Sent History */}
          {sentNotifs.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 text-sm font-display font-semibold text-primary cursor-pointer hover:text-secondary transition-colors"
              >
                <Clock className="w-4 h-4" />
                Sent History ({sentNotifs.length})
                {showHistory ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showHistory && (
                <div className="flex flex-col gap-2 mt-4 stagger-children">
                  {sentNotifs.map((n) => {
                    const pcfg = priorityConfig[n.adminType] || priorityConfig.info
                    return (
                      <div
                        key={n.id}
                        className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all duration-200"
                      >
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${pcfg.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-primary truncate">{n.title}</span>
                            <Badge variant={pcfg.badge} className="text-[10px]">{pcfg.label}</Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{n.desc}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono">{formatTimeAgo(n.time)}</span>
                          <button
                            onClick={() => deleteNotif(n.id)}
                            className="p-1.5 rounded-lg text-slate-300 hover:bg-accent-50 hover:text-accent transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            aria-label="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* ═══ Users Table ═══ */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-display font-bold text-primary">Users</h3>
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
            className="px-3.5 py-2 text-[13px] border border-slate-200 rounded-xl bg-white outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all w-48" />
        </CardHeader>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6"><Skeleton className="h-12 w-full mb-2" count={3} /></div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Users} title="No users found" description="Try a different search term" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80">
                  {['User', 'Email', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-display font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={i} className="group hover:bg-primary-50/40 transition-colors duration-150">
                    <td className="px-5 py-4 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${u.gradient} flex items-center justify-center text-[11px] font-display font-bold text-white shadow-sm`}>{u.initials}</div>
                        <span className="font-medium text-primary">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 border-b border-slate-50 text-slate-500 font-mono text-xs">{u.email}</td>
                    <td className="px-5 py-4 border-b border-slate-50"><Badge variant={u.sv} dot>{u.status}</Badge></td>
                    <td className="px-5 py-4 border-b border-slate-50 text-slate-400 text-xs font-mono">{u.joined}</td>
                    <td className="px-5 py-4 border-b border-slate-50">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button variant="ghost" size="sm" onClick={() => toast.success(`Editing ${u.name}...`)}>Edit</Button>
                        <Button variant="outline-danger" size="sm" onClick={() => handleAction(u, u.status === 'Blocked' ? 'Remove' : 'Block')}>
                          {u.status === 'Blocked' ? 'Remove' : 'Block'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  )
}
