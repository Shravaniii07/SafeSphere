import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Users, AlertTriangle, Route, Server, Download } from 'lucide-react'
import { Card, CardHeader, Button, Badge, Skeleton, EmptyState } from '../components/UI'
import toast from 'react-hot-toast'

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

export default function AdminPanel() {
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { const t = setTimeout(() => setLoading(false), 1500); return () => clearTimeout(t) }, [])

  const filtered = allUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleAction = (user, action) => {
    if (action === 'Block') toast.success(`${user.name} has been blocked`)
    else toast.error(`${user.name} has been removed`)
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Admin Panel</h1>
          <p className="text-slate-500 text-sm">Manage users and view platform analytics</p>
        </div>
        <Button variant="outline" size="sm"><Download className="w-4 h-4" /> Export</Button>
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
                        <Button variant="ghost" size="sm">Edit</Button>
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
