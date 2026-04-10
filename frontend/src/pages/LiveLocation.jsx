import { useState, useEffect, useRef } from 'react'
import { Link, Signal, Navigation, Copy, Clock, Wifi, Shield } from 'lucide-react'
import api from '../api/api'
import { Card, CardHeader, CardBody, Button, Toggle, MapPlaceholder, Badge } from '../components/UI'
import toast from 'react-hot-toast'

export default function LiveLocation() {
  const [sharing, setSharing] = useState(true)
  const [position, setPosition] = useState(null)
  const [accuracy, setAccuracy] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [error, setError] = useState(null)
  const [watchId, setWatchId] = useState(null)
  const [address, setAddress] = useState('Locating...')
  const [activeTrackingId, setActiveTrackingId] = useState(null)
  const [trackingLink, setTrackingLink] = useState('')
  
  const lastSentPosition = useRef(null)

  // Calculate distance between two coordinates in meters
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  // Start GPS tracking
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      return
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setAccuracy(Math.round(pos.coords.accuracy))
        setLastUpdate(new Date())
        setError(null)
        // Sync with backend if sharing is enabled and position has changed significantly (> 10m)
        if (sharing) {
          const latitude = pos.coords.latitude;
          const longitude = pos.coords.longitude;
          const distance = lastSentPosition.current 
            ? getDistance(latitude, longitude, lastSentPosition.current.lat, lastSentPosition.current.lng)
            : Infinity;

          if (distance > 10) { // Only send if moved more than 10 meters
            // 1. Update general user location
            api.post('/api/location/update', { latitude, longitude })
              .then(() => {
                lastSentPosition.current = { lat: latitude, lng: longitude };
              })
              .catch(err => console.error("Location sync error:", err))

            // 2. Update active public tracking session (if exists)
            if (activeTrackingId) {
              api.post(`/api/tracking/update/${activeTrackingId}`, { lat: latitude, lng: longitude })
                .catch(err => console.error("Public tracking sync error:", err))
            }
          }
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    )
    setWatchId(id)

    return () => navigator.geolocation.clearWatch(id)
  }, [])

  // Reverse geocode to get address
  useEffect(() => {
    if (!position) return
    const controller = new AbortController()

    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}&zoom=16`, {
      signal: controller.signal,
      headers: { 'Accept-Language': 'en' }
    })
      .then(r => r.json())
      .then(data => {
        if (data.display_name) {
          setAddress(data.display_name.split(',').slice(0, 3).join(', '))
        }
      })
      .catch(() => {})

    return () => controller.abort()
  }, [position?.lat?.toFixed(3), position?.lng?.toFixed(3)]) // Only re-fetch on significant position change

  const copyCoords = () => {
    if (!position) return
    const text = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Coordinates copied!'))
      .catch(() => toast.success(`Location: ${text}`))
  }

  const shareMapsLink = () => {
    if (!position) return
    const url = `https://maps.google.com/?q=${position.lat},${position.lng}`
    navigator.clipboard.writeText(url)
      .then(() => toast.success('Google Maps link copied!'))
      .catch(() => toast.success(`Link: ${url}`))
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Live Location</h1>
          <p className="text-slate-500 text-sm">{sharing ? 'Broadcasting your position in real-time' : 'Location sharing paused'}</p>
        </div>
        <Badge variant={sharing ? 'success' : 'warning'} dot>{sharing ? 'Live' : 'Paused'}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <h3 className="text-[15px] font-display font-bold text-primary flex items-center gap-2">
                <Navigation className="w-4 h-4 text-secondary" /> Your Position
              </h3>
              {position && (
                <button onClick={copyCoords} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary transition-colors cursor-pointer">
                  <Copy className="w-3 h-3" /> Copy
                </button>
              )}
            </CardHeader>
            <CardBody>
              {error ? (
                <div className="bg-accent-50 border border-accent/20 rounded-xl p-5 text-center">
                  <p className="text-sm text-accent font-medium mb-2">⚠️ Location Error</p>
                  <p className="text-xs text-slate-500">{error}</p>
                  <p className="text-xs text-slate-400 mt-2">Please enable location services in your browser settings.</p>
                </div>
              ) : position ? (
                <div className="space-y-4">
                  {/* Live coords */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-5">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Latitude</p>
                        <p className="text-lg font-mono font-bold text-primary tabular-nums">{position.lat.toFixed(6)}°</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Longitude</p>
                        <p className="text-lg font-mono font-bold text-primary tabular-nums">{position.lng.toFixed(6)}°</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      {accuracy && (
                        <span className="flex items-center gap-1"><Wifi className="w-3 h-3" /> ±{accuracy}m accuracy</span>
                      )}
                      {lastUpdate && (
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lastUpdate.toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                      <Signal className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-800">Current Address</p>
                      <p className="text-xs text-emerald-600 mt-0.5">{address}</p>
                    </div>
                  </div>

                  {/* Map placeholder with real link */}
                  <MapPlaceholder label={`${position.lat.toFixed(4)}°N, ${position.lng.toFixed(4)}°E`} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-10 h-10 border-4 border-secondary border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-sm text-slate-500">Acquiring GPS signal...</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-5">Sharing Settings</h4>
              <div className="space-y-5 mb-6">
                <Toggle label="Live Sharing" description="Real-time broadcast to contacts" checked={sharing} onChange={() => setSharing(!sharing)} />
              </div>
              <div className="h-px bg-slate-100 mb-6" />
              <Button 
                variant="teal" 
                full 
                onClick={async () => {
                  if (!position) {
                    toast.error('Location not available yet')
                    return
                  }
                  try {
                    const res = await api.post('/api/tracking/create')
                    if (res.data.success) {
                      const tid = res.data.trackingId
                      setActiveTrackingId(tid)
                      
                      const link = `${window.location.origin}/track/${tid}`
                      setTrackingLink(link)
                      
                      navigator.clipboard.writeText(link)
                        .then(() => toast.success('Real-time tracking link generated and copied!'))
                      
                      api.post(`/api/tracking/update/${tid}`, { lat: position.lat, lng: position.lng })
                    }
                  } catch (err) {
                    toast.error('Failed to generate tracking link')
                  }
                }}
              >
                <Link className="w-[18px] h-[18px]" /> {activeTrackingId ? 'Regenerate Tracking Link' : 'Generate Tracking Link'}
              </Button>

              {trackingLink && (
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-dashed border-secondary/30 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-[10px] text-secondary-dark uppercase font-extrabold tracking-wider flex items-center gap-1">
                        <Shield className="w-2.5 h-2.5" /> SafeSphere Live Link
                      </p>
                      <button onClick={() => {
                        navigator.clipboard.writeText(trackingLink)
                          .then(() => toast.success('SafeSphere link copied!'))
                      }} className="p-1 px-2 rounded-md bg-secondary-50 hover:bg-secondary-100 text-[10px] font-bold text-secondary-dark transition-colors flex items-center gap-1 cursor-pointer">
                        <Copy className="w-2.5 h-2.5" /> Copy
                      </button>
                    </div>
                    <p className="text-xs font-mono text-primary break-all leading-relaxed p-2 bg-slate-50/50 rounded-lg border border-slate-100">{trackingLink}</p>
                  </div>
                </div>
              )}
              
              <p className="text-[11px] text-slate-400 mt-3 text-center">Generated link allows anyone to track your live movement</p>

              <div className="h-px bg-slate-100 my-5" />

              <Button variant="outline" full onClick={shareMapsLink}>
                <Navigation className="w-[18px] h-[18px]" /> Share via Google Maps
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-4">Signal Status</h4>
              <div className="space-y-3">
                <StatusRow label="GPS Signal" value={position ? 'Active' : 'Searching...'} color={position ? 'text-emerald-600' : 'text-amber-500'} />
                <StatusRow label="Accuracy" value={accuracy ? `±${accuracy}m` : '—'} color="text-primary" />
                <StatusRow label="Sharing" value={sharing ? 'Broadcasting' : 'Paused'} color={sharing ? 'text-emerald-600' : 'text-amber-500'} />
                <StatusRow label="Last Update" value={lastUpdate ? lastUpdate.toLocaleTimeString() : '—'} color="text-primary" />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatusRow({ label, value, color = 'text-primary' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-display font-semibold ${color}`}>{value}</span>
    </div>
  )
}
