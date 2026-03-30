import { useState, useEffect } from 'react'
import { MapPin, Shield, Clock, Navigation, Wifi, Copy } from 'lucide-react'
import { MapPlaceholder } from '../components/UI'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

export default function Tracking() {
  const { user } = useApp()
  const [position, setPosition] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [timeAgo, setTimeAgo] = useState('Connecting...')

  // Watch real GPS position
  useEffect(() => {
    if (!navigator.geolocation) return

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setAccuracy(Math.round(pos.coords.accuracy))
        setLastUpdate(Date.now())
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000 }
    )

    return () => navigator.geolocation.clearWatch(id)
  }, [])

  // Update "time ago" every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!lastUpdate) return
      const diff = Math.floor((Date.now() - lastUpdate) / 1000)
      if (diff < 5) setTimeAgo('Just now')
      else if (diff < 60) setTimeAgo(`${diff}s ago`)
      else setTimeAgo(`${Math.floor(diff / 60)}m ago`)
    }, 1000)
    return () => clearInterval(interval)
  }, [lastUpdate])

  const copyLink = () => {
    if (!position) return
    const url = `https://safesphere.app/track?lat=${position.lat}&lng=${position.lng}`
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Tracking link copied!'))
      .catch(() => toast.success(`Location: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`))
  }

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

      {/* Live coordinates display */}
      {position && (
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="bg-slate-50 rounded-xl border border-slate-100 px-5 py-3 flex items-center gap-3">
            <Navigation className="w-4 h-4 text-secondary" />
            <span className="text-sm font-mono font-semibold text-primary tabular-nums">
              {position.lat.toFixed(6)}°, {position.lng.toFixed(6)}°
            </span>
            <button onClick={copyLink} className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-slate-100 transition-all cursor-pointer" aria-label="Copy link">
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      <MapPlaceholder label={position ? `📍 ${position.lat.toFixed(4)}°N, ${position.lng.toFixed(4)}°E` : 'Acquiring GPS...'} height="min-h-[320px]" />

      <div className="flex items-center justify-center gap-6 p-5 bg-white rounded-2xl border border-slate-100/80 shadow-elevated mt-6">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-sm font-medium text-emerald-600">Live</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <Clock className="w-3.5 h-3.5" /> Updated {timeAgo}
        </div>
        <div className="w-px h-4 bg-slate-200" />
        {accuracy && (
          <>
            <div className="flex items-center gap-1.5 text-sm text-slate-500"><Wifi className="w-3.5 h-3.5" /> ±{accuracy}m</div>
            <div className="w-px h-4 bg-slate-200" />
          </>
        )}
        <div className="flex items-center gap-1.5 text-sm text-slate-500"><Shield className="w-3.5 h-3.5" /> E2E Encrypted</div>
      </div>
    </div>
  )
}
