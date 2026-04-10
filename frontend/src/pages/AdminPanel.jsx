import { useState, useEffect } from 'react'
import { Users, CheckCircle2, Megaphone, Trash2, Clock, ChevronDown, ChevronUp, Send } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Badge, Skeleton, EmptyState } from '../components/UI'
import toast from 'react-hot-toast'
const ADMIN_NOTIF_KEY = 'safesphere_admin_notifications'

import api from '../api/api'
import { useAuth } from '../context/AuthContext'
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
  const { user: currentAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Notification compose state
  const [sending, setSending] = useState(false)
  const [sentNotifs, setSentNotifs] = useState([])
  const [showHistory, setShowHistory] = useState(false)

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/admin/users')
      const transformedUsers = res.data.map(u => ({
        ...u,
        initials: u.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '??',
        status: u.isVerified ? 'Active' : 'Unverified',
        sv: u.isVerified ? 'success' : 'warning',
        joined: new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        gradient: u.role === 'admin' ? 'from-primary to-primary-light' : 'from-secondary to-secondary-dark'
      }))
      setUsers(transformedUsers)
    } catch (err) {
      console.error("Users fetch error:", err)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const fetchAlerts = async () => {
    try {
      const res = await api.get('/api/admin/alerts')
      const formatted = res.data.map(a => ({
        id: a._id,
        title: a.title,
        desc: a.message,
        time: a.createdAt,
        type: a.type
      }))
      setSentNotifs(formatted)
    } catch (err) {
      console.error("Alerts fetch error:", err)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchAlerts()
  }, [])

  const statsData = [
    {
      icon: Users,
      label: 'Total Community Members',
      value: users.filter(u => u.role !== 'admin').length.toString(),
      change: `All registered users`,
    },
    {
      icon: CheckCircle2,
      label: 'Verified Identities',
      value: users.filter(u => u.isVerified && u.role !== 'admin').length.toString(),
      change: `${users.filter(u => !u.isVerified && u.role !== 'admin').length} unverified`,
    },
  ]

  const filtered = users.filter(u =>
    u.role !== 'admin' && (
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const handleAction = async (user, action) => {
    if (action === 'Block') {
      const confirmMsg = `Are you sure you want to permanently delete ${user.name}'s account and ALL their associated data? THIS CANNOT BE UNDONE.`
      if (!window.confirm(confirmMsg)) return

      try {
        await api.delete(`/api/admin/user/${user._id}`)
        toast.success(`${user.name} block/purged successfully`)
        fetchUsers()
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to block user")
      }
    }
  }

  const [notifTitle, setNotifTitle] = useState('')
  const [notifMessage, setNotifMessage] = useState('')

  const handleSendNotification = async () => {
    if (!notifTitle.trim() || !notifMessage.trim()) {
      toast.error('Please enter both title and message')
      return
    }

    setSending(true)
    try {
      await api.post('/api/admin/alert', {
        title: notifTitle.trim(),
        message: notifMessage.trim(),
        type: 'ALERT'
      })

      toast.success('System broadcast sent! 📢')
      
      setNotifTitle('')
      setNotifMessage('')
      fetchAlerts()
    } catch (err) {
      toast.error(err.response?.data?.message || "Broadcast failed")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Community management & global security alerts</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8 stagger-children">
        {statsData.map((s, i) => (
          <div key={i} className="group p-6 bg-white rounded-2xl border border-slate-100/80 shadow-elevated card-hover relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-3xl font-display font-bold text-primary tracking-tight">{s.value}</div>
                <div className="text-sm text-slate-500 mt-1">{s.label}</div>
                <div className="flex items-center gap-1 text-xs font-semibold mt-3 text-emerald-600">
                  {s.change}
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary"><s.icon className="w-6 h-6" /></div>
            </div>
          </div>
        ))}
      </div>

      {/* Broadcast Notification Section */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-[15px] font-display font-bold text-primary">Broadcast Notification</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Send alert to all community members</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Title</label>
                <input
                  type="text"
                  placeholder="Notification Title"
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">Message</label>
                <textarea
                  placeholder="Alert message details..."
                  value={notifMessage}
                  onChange={(e) => setNotifMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm focus:border-secondary focus:outline-none"
                />
              </div>
              <Button
                variant="teal"
                full
                onClick={handleSendNotification}
                disabled={sending || !notifTitle.trim() || !notifMessage.trim()}
                isLoading={sending}
              >
                {!sending && <Send className="w-4 h-4 mr-2" />}
                Send Broadcast
              </Button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-info/10 text-info">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h5 className="text-sm font-display font-semibold text-primary truncate">{notifTitle || 'Title Preview'}</h5>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2">{notifMessage || 'Message preview...'}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                      <Badge variant="info" className="text-[10px]">System Alert</Badge>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-3 tracking-wide uppercase font-semibold">Live Preview</p>
            </div>
          </div>

          {sentNotifs.length > 0 && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <button 
                onClick={() => setShowHistory(!showHistory)} 
                className="flex items-center gap-2 text-sm font-display font-semibold text-primary cursor-pointer"
              >
                <Clock className="w-4 h-4" /> History ({sentNotifs.length})
              </button>
              {showHistory && (
                <div className="mt-4 space-y-2">
                  {sentNotifs.map(n => (
                    <div key={n.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                      <div>
                        <p className="text-sm font-semibold text-primary">{n.title}</p>
                        <p className="text-xs text-slate-400">{n.desc}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-1">{formatTimeAgo(n.time)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-[15px] font-display font-bold text-primary">Community Members</h3>
            <input 
              type="text" 
              placeholder="Search..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-secondary" 
            />
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6"><Skeleton count={3} height={40} className="mb-2" /></div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={Users} title="No members found" />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400">Member</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-slate-400">Status</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-5 py-4 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${u.gradient} flex items-center justify-center text-[10px] font-bold text-white`}>{u.initials}</div>
                        <span className="font-medium text-primary">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 border-b border-slate-50 text-slate-500 text-xs">{u.email}</td>
                    <td className="px-5 py-4 border-b border-slate-50"><Badge variant={u.sv} size="sm">{u.status}</Badge></td>
                    <td className="px-5 py-4 border-b border-slate-50 text-right">
                      <Button variant="outline-danger" size="sm" onClick={() => handleAction(u, 'Block')}>
                        Block
                      </Button>
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
