import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MapPin, Shield, Clock, Navigation, Wifi, Copy, AlertTriangle, X } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import { Card, CardBody, Badge, Button } from '../components/UI'


import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

export default function Tracking() {
  const { user } = useApp()
  const navigate = useNavigate()
  const [position, setPosition] = useState(null)
  const mapRef = useRef(null)


  const [lastUpdate, setLastUpdate] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [timeAgo, setTimeAgo] = useState('Connecting...')
  const [errorCode, setError] = useState(null)
  const [viewingUserName, setViewingUserName] = useState('')

  const { trackingId } = useParams()
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Fetch from backend if trackingId exists
  useEffect(() => {
    if (!trackingId || trackingId === 'track' || trackingId === 'tracking') return

    const fetchTracking = async () => {
      // Sanitize trackingId (strip trailing dots or spaces from copy-paste errors)
      const cleanId = trackingId.replace(/[.\s]+$/, '');
      
      try {
        // 1. Try public tracking session endpoint first
        let res = await fetch(`${API_URL}/api/tracking/public/${cleanId}`)
        
        // 2. Fallback to trip tracking if public tracking ID not found
        if (!res.ok && res.status === 404) {
          res = await fetch(`${API_URL}/api/trip/track/${trackingId}`)
        }

        if (!res.ok) {
          if (res.status === 404) {
            setError("Tracking ID not found or expired")
          } else {
            setError("Unable to connect to tracking server")
          }
          return
        }

        const data = await res.json()
        if (data.success && data.location) {
          setPosition({ lat: data.location.lat, lng: data.location.lng })
          setLastUpdate(Date.now())
          setError(null) // Clear any previous error

          // Update username if available from the public session
          if (data.user?.name) {
            setViewingUserName(data.user.name)
          }

          if (data.status === 'completed' || data.status === 'inactive') {
            setError("This tracking session has ended safely")
          }
        } else {
          setError(data.message || "Tracking not available")
        }
      } catch (err) {
        console.error("Tracking fetch error:", err)
        setError("Network error. Retrying...")
      }
    }

    fetchTracking()
    const interval = setInterval(fetchTracking, 5000)
    return () => clearInterval(interval)
  }, [trackingId, API_URL])


  // Also watch local position for donor
  useEffect(() => {
    // If no tracking ID is provided, assume this user wants to view/share their own location
    const isDonor = !trackingId || trackingId === 'track' || trackingId === 'tracking'
    
    if (!navigator.geolocation || !isDonor) return

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setAccuracy(Math.round(pos.coords.accuracy))
        setLastUpdate(Date.now())
      },
      (err) => {
        console.error("GPS Error:", err)
        setError("GPS permission denied or not available")
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    )

    return () => navigator.geolocation.clearWatch(id)
  }, [trackingId])


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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-secondary/10 overflow-x-hidden">
      {/* Standalone Public Header */}
      <nav className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/20">
            <Shield className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-primary tracking-tight leading-none block">SafeSphere</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Public Tracking</span>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="text-sm font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer">
          Home
        </button>
      </nav>

      <div className="max-w-[700px] mx-auto p-6 md:p-8 lg:p-12 animate-page-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-5">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
              <MapPin className="w-5 h-5 text-secondary-light" />
            </div>
            <span className="font-display text-xl font-bold text-primary tracking-tight">SafeSphere</span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary tracking-tight">{viewingUserName ? `${viewingUserName} is sharing their location` : 'Live Location Tracking'}</h2>
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

        <div className="relative rounded-2xl overflow-hidden border border-slate-100 shadow-elevated" style={{ height: '400px' }}>
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
                  <div className="text-xs font-semibold">User's Current Location</div>
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
