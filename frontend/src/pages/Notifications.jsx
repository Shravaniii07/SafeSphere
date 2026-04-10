import { useState, useEffect } from 'react'
import { AlertTriangle, Globe, Activity, Info, Shield, Check, Trash2, BellOff, Bell, Megaphone } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Badge, EmptyState } from '../components/UI'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'
import api from '../api/api'

const iconMap = {
  sos: { icon: AlertTriangle, color: 'bg-accent/10 text-accent', border: 'border-accent/20' },
  location: { icon: Globe, color: 'bg-secondary/10 text-secondary', border: 'border-secondary/20' },
  contact: { icon: Activity, color: 'bg-info/10 text-info', border: 'border-info/20' },
  system: { icon: Shield, color: 'bg-primary/10 text-primary', border: 'border-primary/20' },
  trip: { icon: Globe, color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200' },
  info: { icon: Info, color: 'bg-slate-100 text-slate-500', border: 'border-slate-200' },
  admin: { icon: Megaphone, color: 'bg-secondary/10 text-secondary', border: 'border-secondary/20' },
}

function formatTimeAgo(dateInput) {
  const timestamp = new Date(dateInput).getTime()
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

const priorityLabels = {
  info: { label: 'Info', variant: 'info' },
  warning: { label: 'Warning', variant: 'warning' },
  critical: { label: 'Critical', variant: 'danger' },
}

export default function Notifications() {
  const { notifications, setNotifications, fetchNotifs, user } = useApp()
  const [filter, setFilter] = useState('all') // all, unread, admin

  useEffect(() => {
    fetchNotifs()
  }, [fetchNotifs])

  const unreadCount = user?.unreadNotifications || 0
  const adminCount = notifications.filter(n => n.isAdmin).length
  const displayed = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : filter === 'admin'
      ? notifications.filter(n => n.isAdmin)
      : notifications

  const markAsRead = async (id) => {
    try {
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n))
      await api.put(`/api/notifications/${id}/read`)
      fetchNotifs()
    } catch (err) {
      console.error("Mark read error:", err)
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
            <button className="text-secondary font-semibold underline cursor-pointer" onClick={() => {
              // Note: Undo here only restores local state
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
            <button className="text-secondary font-semibold underline cursor-pointer" onClick={() => {
              setNotifications(old)
              toast.dismiss(t.id)
            }}>Undo</button>
          </span>
        ),
        { duration: 5000 }
      )
    } catch (err) {
      console.error("Clear all error:", err)
    }
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Notifications</h1>
          <p className="text-slate-500 text-sm">
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
          <button onClick={() => setFilter('all')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${filter === 'all' ? 'bg-primary text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            All ({notifications.length})
          </button>
          <button onClick={() => setFilter('unread')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${filter === 'unread' ? 'bg-primary text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            Unread ({unreadCount})
          </button>
          {adminCount > 0 && (
            <button onClick={() => setFilter('admin')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${filter === 'admin' ? 'bg-secondary text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              <Megaphone className="w-3.5 h-3.5" />
              Admin ({adminCount})
            </button>
          )}
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
              title={filter === 'unread' ? 'No unread notifications' : filter === 'admin' ? 'No admin notifications' : 'No notifications'}
              description={filter === 'unread' ? 'Switch to "All" to see past notifications.' : filter === 'admin' ? 'Admin announcements will appear here.' : 'Notifications will appear here when events occur.'}
            />
          ) : (
            <div className="flex flex-col gap-1 stagger-children">
              {displayed.map((n) => {
                const isAdminNotif = n.isAdmin
                const cfg = isAdminNotif
                  ? (n.adminType === 'critical' ? iconMap.sos : n.adminType === 'warning' ? iconMap.system : iconMap.admin)
                  : (iconMap[n.type] || iconMap.info)
                const Icon = cfg.icon
                return (
                  <div
                    key={n._id}
                    className={`group flex items-start gap-4 p-4 rounded-xl transition-all duration-200 cursor-pointer hover:bg-slate-50 ${
                      !n.read
                        ? isAdminNotif
                          ? 'bg-secondary/[0.04] border border-secondary/15'
                          : 'bg-secondary/[0.03] border border-secondary/10'
                        : 'border border-transparent'
                    }`}
                    onClick={() => markAsRead(n._id)}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.color} transition-transform duration-200 group-hover:scale-105`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h5 className="text-sm font-display font-semibold text-primary">{n.title}</h5>
                        {!n.read && <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0" />}
                        {isAdminNotif && (
                          <Badge variant={priorityLabels[n.adminType]?.variant || 'info'} className="text-[10px] ml-1">
                            <Megaphone className="w-2.5 h-2.5 mr-0.5" />
                            Admin
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{n.desc || n.message}</p>
                      {isAdminNotif && n.adminType && (
                        <div className="flex items-center gap-2 mt-1.5">
                          <Badge variant={priorityLabels[n.adminType]?.variant || 'info'} className="text-[10px]">
                            {priorityLabels[n.adminType]?.label || 'Info'}
                          </Badge>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{formatTimeAgo(n.createdAt)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); dismissNotif(n._id) }}
                        className="p-1.5 rounded-lg text-slate-300 hover:bg-accent-50 hover:text-accent transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
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
