import { MapPin, Shield, Clock } from 'lucide-react'
import { MapPlaceholder } from '../components/UI'
import { useApp } from '../context/AppContext'

export default function Tracking() {
  const { user } = useApp()

  return (
    <div className="max-w-[700px] mx-auto stagger-children">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-secondary-light" />
          </div>
          <span className="font-display text-xl font-bold text-primary tracking-tight">SafeSphere</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary tracking-tight">{user.name} is sharing their location</h2>
        <p className="text-slate-500 text-sm mt-2">Real-time tracking link · Encrypted & secure</p>
      </div>

      <MapPlaceholder label="MAP WITH USER MARKER" height="min-h-[320px]" />

      <div className="flex items-center justify-center gap-6 p-5 bg-white rounded-2xl border border-slate-100/80 shadow-elevated mt-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-emerald-600">Live</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-1.5 text-sm text-slate-500"><Clock className="w-3.5 h-3.5" /> Updated 2 min ago</div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-1.5 text-sm text-slate-500"><Shield className="w-3.5 h-3.5" /> E2E Encrypted</div>
      </div>
    </div>
  )
}
