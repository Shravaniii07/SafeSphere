import { useState, useEffect, useRef } from 'react'
import { Play, Route, Square, Clock, Navigation, MapPin, Shield, CheckCircle, History } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, Toggle, Badge, EmptyState } from '../components/UI'
import toast from 'react-hot-toast'
import api from '../api/api'

// ─── Haversine distance (km) ───────────────────────────────────────────────
function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function safetyScoreFromDistance(km) {
  if (km < 5) return { label: 'High', color: 'text-emerald-600' }
  if (km < 20) return { label: 'Medium', color: 'text-amber-600' }
  return { label: 'Use Caution', color: 'text-accent' }
}

function formatElapsed(secs) {
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return h > 0
    ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    : `${m}:${s.toString().padStart(2, '0')}`
}

function formatDuration(secs) {
  const m = Math.floor(secs / 60)
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`
}

export default function TravelSafety() {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [autoShare, setAutoShare] = useState(true)
  const [checkIns, setCheckIns] = useState(false)
  const [deviation, setDeviation] = useState(true)
  const [starting, setStarting] = useState(false)

  const [tripActive, setTripActive] = useState(false)
  const [tripData, setTripData] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [currentPosition, setCurrentPosition] = useState(null)

  const [tripHistory, setTripHistory] = useState([])

  const elapsedRef = useRef(null)
  const watchRef = useRef(null)
  const syncIntervalRef = useRef(null)

  // ── Fetch trip history on mount ────────────────────────────────────────
  useEffect(() => {
    api.get('/api/trip/recent')
      .then(res => setTripHistory(res.data.data || []))
      .catch(err => console.error('History fetch error:', err))
  }, [])

  // ── Get initial GPS position ───────────────────────────────────────────
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { enableHighAccuracy: true }
      )
    }
  }, [])

  // ── Auto-fill "From" with current GPS ─────────────────────────────────
  useEffect(() => {
    if (currentPosition && !from) {
      setFrom(`${currentPosition.lat.toFixed(4)}°N, ${currentPosition.lng.toFixed(4)}°E (Current Location)`)
    }
  }, [currentPosition, from])

  // ── Elapsed timer ─────────────────────────────────────────────────────
  useEffect(() => {
    if (tripActive) {
      elapsedRef.current = setInterval(() => setElapsed(prev => prev + 1), 1000)
      return () => clearInterval(elapsedRef.current)
    }
    return () => clearInterval(elapsedRef.current)
  }, [tripActive])

  // ── Watch position + sync to backend during active trip ───────────────
  useEffect(() => {
    if (tripActive && navigator.geolocation) {
      watchRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setCurrentPosition({ lat, lng })
        },
        () => {},
        { enableHighAccuracy: true }
      )

      // Sync location to backend every 10s
      syncIntervalRef.current = setInterval(() => {
        setCurrentPosition(pos => {
          if (pos) {
            api.post('/api/trip/update-location', { lat: pos.lat, lng: pos.lng })
              .catch(err => console.error('Location sync error:', err))
          }
          return pos
        })
      }, 10000)

      return () => {
        navigator.geolocation.clearWatch(watchRef.current)
        clearInterval(syncIntervalRef.current)
      }
    }
  }, [tripActive])

  // ── Geocode a place name via Nominatim ─────────────────────────────────
  const geocodePlaceName = async (place) => {
    if (!place || place.includes('°')) return null
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}&limit=1`,
        { headers: { 'Accept-Language': 'en' } }
      )
      const data = await res.json()
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
          name: data[0].display_name.split(',').slice(0, 2).join(', ')
        }
      }
    } catch { /* ignore */ }
    return null
  }

  // ── Start trip ─────────────────────────────────────────────────────────
  const startTrip = async () => {
    if (!from.trim() || !to.trim()) {
      toast.error('Please enter both From and To locations')
      return
    }

    setStarting(true)

    const fromNameForGeo = from.includes('°') ? '' : from
    const [fromGeo, toGeo] = await Promise.all([
      geocodePlaceName(fromNameForGeo),
      geocodePlaceName(to),
    ])

    const fromCoords = currentPosition || (fromGeo ? { lat: fromGeo.lat, lng: fromGeo.lng } : null)
    const toCoords = toGeo ? { lat: toGeo.lat, lng: toGeo.lng } : null

    if (!toCoords || !fromCoords) {
      toast.error('Could not determine locations. Try entering city names.')
      setStarting(false)
      return
    }

    const distance = haversine(fromCoords.lat, fromCoords.lng, toCoords.lat, toCoords.lng)
    const etaMinutes = Math.round(distance / 0.5) // ~30 km/h average

    try {
      console.log('[TravelSafety] Starting trip:', { destination: toGeo?.name || to, etaMinutes, fromCoords })
      const res = await api.post('/api/trip/start', {
        destination: toGeo?.name || to,
        eta: etaMinutes,
        lat: fromCoords.lat,
        lng: fromCoords.lng
      })

      const data = res.data.data
      console.log('[TravelSafety] Trip started:', data)

      setTripData({
        from: fromGeo?.name || from,
        to: toGeo?.name || to,
        distance: distance.toFixed(1),
        eta: etaMinutes,
        startTime: Date.now(),
        trackingId: data?.trackingId
      })
      setTripActive(true)
      setElapsed(0)
      toast.success('Trip started! Emergency contacts notified. ✅')
    } catch (err) {
      console.error('[TravelSafety] Start trip error:', err)
      toast.error(err.message || 'Failed to start trip')
    } finally {
      setStarting(false)
    }
  }

  // ── End trip ───────────────────────────────────────────────────────────
  const endTrip = async () => {
    try {
      // ✅ Call backend to end trip
      const res = await api.post('/api/trip/end')
      if (res.data.success) {
        toast.success('Trip completed safely! ✅')
      }
    } catch (err) {
      console.error('Failed to end trip on backend:', err)
      toast.error('Trip ended locally, but server update failed')
    } finally {
      // Clean up local state regardless of server success
      clearInterval(elapsedRef.current)
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current)
      if (syncIntervalRef.current) clearInterval(syncIntervalRef.current)

      setTripActive(false)
      setTripData(null)
      setElapsed(0)

      // Refresh history
      api.get('/api/trip/recent')
        .then(res => setTripHistory(res.data.data || []))
        .catch(err => console.error('History fetch error:', err))
    }
  }


  const safety = tripData
    ? safetyScoreFromDistance(parseFloat(tripData.distance))
    : { label: 'N/A', color: 'text-slate-400' }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Travel Safety</h1>
          <p className="text-slate-500 text-sm">Track your trips and stay safe during travel</p>
        </div>
        <Badge variant={tripActive ? 'success' : 'info'} dot>{tripActive ? 'Trip Active' : 'Route Planner'}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">

          {/* Start / Active Trip Card */}
          <Card>
            <CardHeader>
              <h3 className="text-[15px] font-display font-bold text-primary flex items-center gap-2">
                <Route className="w-4 h-4 text-secondary" /> {tripActive ? 'Active Trip' : 'Start a Trip'}
              </h3>
              {tripActive && (
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-sm font-mono font-semibold text-emerald-600 tabular-nums">{formatElapsed(elapsed)}</span>
                </div>
              )}
            </CardHeader>
            <CardBody>
              {!tripActive ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                    <Input label="From" placeholder="Your starting location" icon={Navigation} value={from} onChange={e => setFrom(e.target.value)} />
                    <Input label="To" placeholder="Where are you going?" icon={MapPin} value={to} onChange={e => setTo(e.target.value)} />
                  </div>
                  <Button size="lg" full isLoading={starting} onClick={startTrip}>
                    <Play className="w-5 h-5" /> Start Trip
                  </Button>
                </>
              ) : (
                <>
                  {/* Live trip route */}
                  <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 mb-5 stagger-children">
                    <RouteStep color="bg-emerald-500" letter="A" title={tripData.from} sub="Starting point" icon={Navigation} />
                    {parseFloat(tripData.distance) > 5 && (
                      <RouteStep color="bg-secondary" letter="→" title={`${tripData.distance} km route`} sub={`~${tripData.eta} min estimated`} icon={Clock} />
                    )}
                    <RouteStep color="bg-accent" letter="B" title={tripData.to} sub="Destination" icon={MapPin} last />
                  </div>

                  {/* Live position */}
                  {currentPosition && (
                    <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl mb-5">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
                        <Navigation className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-emerald-800">Live Position</p>
                        <p className="text-xs text-emerald-600 font-mono">{currentPosition.lat.toFixed(5)}°N, {currentPosition.lng.toFixed(5)}°E</p>
                      </div>
                    </div>
                  )}

                  <Button variant="danger" size="lg" full onClick={endTrip}>
                    <Square className="w-4 h-4" /> End Trip
                  </Button>
                </>
              )}
            </CardBody>
          </Card>

          {/* Trip History */}
          <Card>
            <CardHeader>
              <h3 className="text-[15px] font-display font-bold text-primary flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" /> Trip History
              </h3>
              {tripHistory.length > 0 && (
                <span className="text-xs text-slate-400 font-mono">{tripHistory.length} trips</span>
              )}
            </CardHeader>
            <CardBody>
              {tripHistory.length === 0 ? (
                <EmptyState icon={Route} title="No trips yet" description="Start your first trip to see it here." />
              ) : (
                <div className="flex flex-col gap-3 stagger-children">
                  {tripHistory.map((trip, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border border-slate-100/80 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-emerald-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary truncate">
                          {trip.destination || 'Unknown Destination'}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${trip.status === 'active' ? 'bg-emerald-500' : trip.status === 'completed' ? 'bg-secondary' : 'bg-slate-400'}`} />
                          {trip.status} · {new Date(trip.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Badge variant={trip.status === 'active' ? 'success' : 'primary'} dot>
                        {trip.status === 'active' ? 'Active' : trip.status === 'completed' ? 'Done' : 'Expired'}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-4">Trip Status</h4>
              <div className="flex items-center gap-3 mb-5">
                {tripActive ? (
                  <>
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="font-medium text-emerald-600 text-sm">In Progress</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <span className="font-medium text-slate-600 text-sm">Not Started</span>
                  </>
                )}
              </div>
              <div className="h-px bg-slate-100 mb-5" />
              <div className="space-y-3">
                <InfoRow label="Distance" value={tripData ? `${tripData.distance} km` : '—'} />
                <InfoRow label="Est. Time" value={tripData ? `${tripData.eta} min` : '—'} />
                <InfoRow label="Elapsed" value={tripActive ? formatElapsed(elapsed) : '—'} valueClass={tripActive ? 'text-secondary font-mono' : 'text-slate-400'} />
                <InfoRow label="Safety Score" value={safety.label} valueClass={safety.color} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-5">Safety Settings</h4>
              <div className="space-y-5">
                <Toggle label="Auto-share" description="Share with emergency contacts" checked={autoShare} onChange={() => setAutoShare(!autoShare)} />
                <Toggle label="Check-ins" description="Periodic safety confirmations" checked={checkIns} onChange={() => setCheckIns(!checkIns)} />
                <Toggle label="Deviation alerts" description="Alert on route changes" checked={deviation} onChange={() => setDeviation(!deviation)} />
              </div>
            </CardBody>
          </Card>

          {/* Live coordinates */}
          {currentPosition && (
            <Card>
              <CardBody>
                <h4 className="text-sm font-display font-bold text-primary mb-4 flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-secondary" /> Your Position
                </h4>
                <div className="space-y-3">
                  <InfoRow label="Latitude" value={`${currentPosition.lat.toFixed(5)}°`} valueClass="text-primary font-mono" />
                  <InfoRow label="Longitude" value={`${currentPosition.lng.toFixed(5)}°`} valueClass="text-primary font-mono" />
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function RouteStep({ color, letter, title, sub, icon: Icon, last }) {
  return (
    <div className="flex items-start gap-3 py-3 relative">
      {!last && <div className="absolute left-[11px] top-[34px] bottom-0 w-0.5 bg-slate-200" />}
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-display font-bold ${color} shadow-sm`}>{letter}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-primary">{title}</p>
        <span className="text-xs text-slate-400">{sub}</span>
      </div>
      {Icon && <Icon className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5" />}
    </div>
  )
}

function InfoRow({ label, value, valueClass = 'text-primary' }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-sm font-display font-semibold ${valueClass}`}>{value}</span>
    </div>
  )
}
