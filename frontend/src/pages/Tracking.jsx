import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { MapPin, Shield, Clock, Navigation, Wifi, Copy } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../api/api'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

export default function Tracking() {
  const { user } = useApp()
  const { trackingId } = useParams()
  const [position, setPosition] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [timeAgo, setTimeAgo] = useState('Connecting...')
  const [errorCode, setError] = useState(null)
  const [viewingUserName, setViewingUserName] = useState('')
  const mapRef = useRef(null)

  // Watch remote position (from tracking session)
  useEffect(() => {
    if (!trackingId || trackingId === 'track' || trackingId === 'tracking') return

    const fetchTracking = async () => {
      const cleanId = trackingId.replace(/[.\s]+$/, '');
      try {
        let res = await api.get(`/api/tracking/public/${cleanId}`).catch(e => e.response)
        
        if (!res || (res.status === 404)) {
          res = await api.get(`/api/trip/track/${trackingId}`).catch(e => e.response)
        }

        if (!res || !res.data?.success) {
          setError(res?.data?.message || "Tracking ID not found or expired")
          return
        }

        const data = res.data
        if (data.location) {
          setPosition({ lat: data.location.lat, lng: data.location.lng })
          setLastUpdate(Date.now())
          setError(null)
          if (data.user?.name) setViewingUserName(data.user.name)
          if (data.status === 'completed' || data.status === 'inactive') {
            setError("This tracking session has ended safely")
          }
        }
      } catch (err) {
        setError("Network error. Retrying...")
      }
    }

    fetchTracking()
    const interval = setInterval(fetchTracking, 5000)
    return () => clearInterval(interval)
  }, [trackingId])

  // Watch local position (for self-tracking)
  useEffect(() => {
    const isDonor = !trackingId || trackingId === 'track' || trackingId === 'tracking'
    if (!navigator.geolocation || !isDonor) return

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
    if (!trackingId) return
    const baseUrl = window.location.origin
    const url = `${baseUrl}/track/${trackingId}`
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Tracking link copied!'))
      .catch(() => toast.success(`Link: ${url}`))
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-[700px] mx-auto stagger-children">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2.5 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
            <MapPin className="w-5 h-5 text-secondary-light" />
          </div>
          <span className="font-display text-xl font-bold text-primary tracking-tight">SafeSphere</span>
        </div>
        <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary tracking-tight">
          {viewingUserName ? `${viewingUserName} is sharing their location` : (trackingId && trackingId !== 'track' ? 'Tracking Session' : `${user.name} (You)`)}
        </h2>
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

      {errorCode && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-center mb-6">
          <p className="text-red-600 text-sm font-medium">{errorCode}</p>
        </div>
      )}

      {/* Map display */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-elevated mb-6" style={{ height: '400px' }}>
        {!position ? (
          <div className="absolute inset-0 bg-slate-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">Acquiring live GPS...</p>
            </div>
          </div>
        ) : (
          <MapContainer 
            center={[position.lat, position.lng]} 
            zoom={15} 
            style={{ height: '100%', width: '100%' }}
            className="z-0"
            ref={mapRef}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={[position.lat, position.lng]} icon={createIcon('#10B981')}>
              <Popup>
                <div className="text-xs font-semibold">{viewingUserName || 'User'}'s Current Location</div>
              </Popup>
            </Marker>
          </MapContainer>
        )}
      </div>

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
    </div>
  )
}
