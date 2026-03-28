import { useState } from 'react'
import { AlertTriangle, MapPin, Info, CheckCircle, User, BellRing } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Badge, EmptyState } from '../components/UI'
import toast from 'react-hot-toast'

const initialNotifications = [
  { icon: AlertTriangle, iconBg: 'bg-accent/10 text-accent', title: 'SOS Alert Received', desc: 'Rahul triggered an SOS near Connaught Place', time: '5m', unread: true },
  { icon: MapPin, iconBg: 'bg-secondary/10 text-secondary', title: 'Location Shared', desc: 'Mom started sharing their location with you', time: '1h', unread: true },
  { icon: Info, iconBg: 'bg-info/10 text-info', title: 'Safety Alert', desc: 'High-risk area detected near your route', time: '3h', unread: true },
  { icon: CheckCircle, iconBg: 'bg-emerald-50 text-emerald-600', title: 'Trip Completed', desc: 'Your trip from Home to Office was completed safely', time: '1d', unread: false },
  { icon: User, iconBg: 'bg-primary-100 text-primary', title: 'Contact Added', desc: 'Rahul Kumar was added as an emergency contact', time: '2d', unread: false },
]

export default function Notifications() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    toast.success('All caught up!')
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Notifications</h1>
          <p className="text-slate-500 text-sm">Stay updated on safety alerts and activity</p>
        </div>
        {unreadCount > 0 && <Badge variant="danger" dot>{unreadCount} unread</Badge>}
      </div>

      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-display font-bold text-primary flex items-center gap-2"><BellRing className="w-4 h-4 text-secondary" /> All Notifications</h3>
          {unreadCount > 0 && <Button variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Button>}
        </CardHeader>
        <CardBody>
          {notifications.length === 0 ? (
            <EmptyState icon={BellRing} title="All caught up!" description="No new notifications right now" />
          ) : (
            <div className="flex flex-col gap-2 stagger-children">
              {notifications.map((n, i) => (
                <div key={i} className={`group flex gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-200 min-h-[44px] ${n.unread ? 'bg-gradient-to-r from-primary-50/50 to-transparent border-primary-200/60 hover:border-primary-200' : 'border-slate-100/60 hover:bg-slate-50 hover:border-slate-200'}`}>
                  {n.unread && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2 animate-pulse-status" />}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${n.iconBg} transition-transform duration-200 group-hover:scale-105`}><n.icon className="w-5 h-5" /></div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-semibold text-primary">{n.title}</h5>
                    <p className="text-[13px] text-slate-500 mt-0.5">{n.desc}</p>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap flex-shrink-0 mt-0.5">{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
