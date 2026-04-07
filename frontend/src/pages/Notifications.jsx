import { useState, useEffect } from 'react'
import { AlertTriangle, Globe, Activity, Info, Shield, Check, Trash2, BellOff, Bell, Megaphone } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Badge, EmptyState } from '../components/UI'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'
import api from '../api/api'

const iconMap = {
  SOS: { icon: AlertTriangle, color: 'bg-[#E63946]/10 text-[#E63946]', border: 'border-[#E63946]/20', label: 'SOS Alert' },
  INFO: { icon: Info, color: 'bg-[#457B9D]/10 text-[#457B9D]', border: 'border-[#457B9D]/20', label: 'System Info' },
  ALERT: { icon: Megaphone, color: 'bg-[#FFB703]/10 text-[#FFB703]', border: 'border-[#FFB703]/20', label: 'Official Alert' },
}

function formatTimeAgo(timestamp) {
  const date = new Date(timestamp).getTime()
  const diff = Date.now() - date
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

export default function Notifications() {
  const { notifications, setNotifications, fetchNotifs, user } = useApp()
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchNotifs()
  }, [fetchNotifs])

  const unreadCount = user.unreadNotifications
  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications

  const markAsRead = async (id) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
      await api.put(`/api/notifications/${id}/read`)
      fetchNotifs()
    } catch (err) {
      console.error("Mark read error:", err)
      fetchNotifs()
    }
  }

  const markAllRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      await api.put('/api/notifications/read-all')
      toast.success('All notifications marked as read')
      fetchNotifs()
    } catch (err) {
      console.error("Mark all read error:", err)
      fetchNotifs()
    }
  }

  const dismissNotif = async (id) => {
    try {
      const removed = notifications.find(n => n._id === id)
      setNotifications(prev => prev.filter(n => n._id !== id))
      await api.delete(`/api/notifications/${id}`)
      fetchNotifs()
      
      toast.success(
        (t) => (
          <span className="flex items-center gap-3">
            Notification dismissed
            <button className="text-[#E63946] font-semibold underline cursor-pointer" onClick={() => {
              setNotifications(prev => [...prev, removed].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
              toast.dismiss(t.id)
              toast.error("Note: Undo is temporary and won't persist after refresh", { id: 'undo-warn' })
            }}>Undo</button>
          </span>
        ),
        { duration: 4000 }
      )
    } catch (err) {
      console.error("Dismiss error:", err)
      fetchNotifs()
    }
  }

  const clearAll = async () => {
    try {
      const old = [...notifications]
      setNotifications([])
      await api.delete('/api/notifications')
      fetchNotifs()
      
      toast.success(
        (t) => (
          <span className="flex items-center gap-3">
            All notifications cleared
            <button className="text-[#E63946] font-semibold underline cursor-pointer" onClick={() => {
              setNotifications(old)
              toast.dismiss(t.id)
              toast.error("Note: Undo is temporary and won't persist after refresh", { id: 'undo-warn' })
            }}>Undo</button>
          </span>
        ),
        { duration: 5000 }
      )
    } catch (err) {
      console.error("Clear all error:", err)
      fetchNotifs()
    }
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-[#F1FAEE] tracking-tight mb-1">Notifications</h1>
          <p className="text-[#A8B2C1] text-sm">
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "You're all caught up!"}
          </p>
        </div>
        <Badge variant={unreadCount > 0 ? 'warning' : 'success'} dot>
          {unreadCount > 0 ? `${unreadCount} unread` : 'All read'}
        </Badge>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${filter === 'all' ? 'bg-[#E63946] text-white shadow-[0_0_15px_rgba(230,57,70,0.2)]' : 'bg-[#111827] border border-white/10 text-[#A8B2C1] hover:bg-white/5'}`}>
            All ({notifications.length})
          </button>
          <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${filter === 'unread' ? 'bg-[#E63946] text-white shadow-[0_0_15px_rgba(230,57,70,0.2)]' : 'bg-[#111827] border border-white/10 text-[#A8B2C1] hover:bg-white/5'}`}>
            Unread ({unreadCount})
          </button>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllRead}><Check className="w-3.5 h-3.5" /> Mark all read</Button>
          )}
          {notifications.length > 0 && (
            <Button variant="outline-danger" size="sm" onClick={clearAll}><Trash2 className="w-3.5 h-3.5" /> Clear all</Button>
          )}
        </div>
      </div>

      {/* Notifications list */}
      <Card>
        <CardBody>
          {displayed.length === 0 ? (
            <EmptyState
              icon={BellOff}
              title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              description={filter === 'unread' ? 'Switch to "All" to see past notifications.' : 'Notifications will appear here when events occur.'}
            />
          ) : (
            <div className="flex flex-col gap-1 stagger-children">
              {displayed.map((n) => {
                const cfg = iconMap[n.type] || iconMap.INFO
                const Icon = cfg.icon
                return (
                  <div
                    key={n._id}
                    className={`group flex items-start gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer hover:bg-white/[0.03] ${
                      !n.read
                        ? 'bg-[#E63946]/[0.03] border border-[#E63946]/10'
                        : 'border border-transparent'
                    }`}
                    onClick={() => markAsRead(n._id)}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color} transition-transform duration-200 group-hover:scale-105`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h5 className="text-sm font-heading font-semibold text-[#F1FAEE]">{cfg.label}</h5>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-[#E63946] flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-[#A8B2C1] leading-relaxed">{n.message}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-[#A8B2C1]/60 font-mono whitespace-nowrap">{formatTimeAgo(n.createdAt)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismissNotif(n._id) }}
                        className="p-1.5 rounded-lg text-[#A8B2C1]/40 hover:bg-[#E63946]/10 hover:text-[#E63946] transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                        aria-label="Dismiss"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
