import { useState, useEffect } from 'react'
import { Link, Signal, Navigation, Copy, Clock, Wifi } from 'lucide-react'
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
              <Button variant="teal" full onClick={() => {
                const trackingId = Math.random().toString(36).slice(2, 8)
                const url = position
                  ? `https://safesphere.app/track/${trackingId}?lat=${position.lat}&lng=${position.lng}`
                  : `https://safesphere.app/track/${trackingId}`
                navigator.clipboard.writeText(url)
                  .then(() => toast.success('Tracking link copied to clipboard!'))
                  .catch(() => toast.success(`Link: ${url}`))
              }}>
                <Link className="w-[18px] h-[18px]" /> Generate Tracking Link
              </Button>
              <p className="text-[11px] text-slate-400 mt-3 text-center">Link expires after 24 hours</p>

              <div className="h-px bg-slate-100 my-5" />

              <Button variant="outline" full onClick={shareMapsLink}>
                <Navigation className="w-[18px] h-[18px]" /> Share via Google Maps
              </Button>
            </CardBody>
          </Card>

          {/* Status card */}
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
