import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Activity, MapPin, Zap, LayoutGrid, ExternalLink, Loader2, Navigation } from 'lucide-react'
import { FilterButton, EmptyState, Badge } from '../components/UI'
import toast from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'

// Fix leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const filters = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'hospital', label: 'Hospitals', icon: Activity },
  { id: 'police', label: 'Police', icon: MapPin },
]

const typeConfig = {
  hospital: { color: 'bg-gradient-to-br from-red-500/10 to-orange-500/10 text-red-500', icon: Activity, tag: 'hospital' },
  police: { color: 'bg-gradient-to-br from-blue-500/10 to-indigo-500/10 text-blue-600', icon: MapPin, tag: 'police' },
  fire: { color: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 text-amber-600', icon: Zap, tag: 'fire_station' },
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function NearbyServices() {
  const [active, setActive] = useState('all')
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) { setError('Geolocation not supported'); setLoading(false); return }
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { setError('Please enable location to find nearby services'); setLoading(false) },
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }, [])

  const [retrying, setRetrying] = useState(false)
  const fetchNearby = async () => {
    if (!position) return
    setLoading(true)
    setError(null)
    const { lat, lng } = position
    const radius = 5000
    const query = `[out:json][timeout:25];(node["amenity"="hospital"](around:${radius},${lat},${lng});node["amenity"="police"](around:${radius},${lat},${lng});node["amenity"="fire_station"](around:${radius},${lat},${lng});way["amenity"="hospital"](around:${radius},${lat},${lng});way["amenity"="police"](around:${radius},${lat},${lng});way["amenity"="fire_station"](around:${radius},${lat},${lng}););out center body;`
    
    // Multiple mirrors for reliability
    const mirrors = [
      'https://overpass-api.de/api/interpreter',
      'https://lz4.overpass-api.de/api/interpreter',
      'https://z.overpass-api.de/api/interpreter'
    ]

    let lastError = null
    for (const mirror of mirrors) {
      try {
        const res = await fetch(mirror, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
        })
        
        if (!res.ok) throw new Error(`Mirror ${mirror} failed: ${res.status}`)
        
        const data = await res.json()
        const results = data.elements.filter(el => el.tags?.name).map(el => {
          const elLat = el.lat || el.center?.lat
          const elLng = el.lon || el.center?.lon
          const amenity = el.tags.amenity
          const dist = haversine(lat, lng, elLat, elLng)
          let type = 'hospital'
          if (amenity === 'police') type = 'police'
          if (amenity === 'fire_station') type = 'fire'
          const cfg = typeConfig[type]
          return {
            name: el.tags.name,
            address: el.tags['addr:full'] || el.tags['addr:street'] ? `${el.tags['addr:street'] || ''} ${el.tags['addr:housenumber'] || ''}, ${el.tags['addr:city'] || ''}`.trim().replace(/^,|,$/g, '') : `${elLat.toFixed(4)}°N, ${elLng.toFixed(4)}°E`,
            dist: dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`,
            distRaw: dist, type, color: cfg.color, icon: cfg.icon, open: el.tags.opening_hours !== 'closed',
            lat: elLat, lng: elLng, phone: el.tags.phone || el.tags['contact:phone'] || null,
          }
        }).sort((a, b) => a.distRaw - b.distRaw).slice(0, 20)
        
        setPlaces(results)
        setLoading(false)
        setRetrying(false)
        if (results.length === 0) toast('No services found nearby.', { icon: '📍' })
        return // Success!
      } catch (err) {
        console.warn(`Overpass mirror ${mirror} failed, trying next...`, err)
        lastError = err
      }
    }
    
    setError('Overpass API is currently overloaded (504). Please try again in a moment.')
    setLoading(false)
    setRetrying(false)
    toast.error('Service data unavailable. Retrying might help.')
  }

  useEffect(() => {
    fetchNearby()
  }, [position])

  const filtered = active === 'all' ? places : places.filter(p => p.type === active)

  const openDirections = (place) => {
    if (!position) return
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${position.lat},${position.lng}&destination=${place.lat},${place.lng}`, '_blank')
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Nearby Services</h1>
          <p className="text-slate-400 text-sm">
            {position ? 'Showing services within 5 km of your location' : 'Find hospitals, police stations, and emergency services near you'}
          </p>
        </div>
        {places.length > 0 && <Badge variant="success" dot>{places.length} found</Badge>}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map(f => (
          <FilterButton key={f.id} active={active === f.id} onClick={() => setActive(f.id)}>
            <f.icon className="w-4 h-4" /> {f.label}
            {f.id !== 'all' && <span className="text-xs opacity-60 ml-1">({places.filter(p => f.id === 'all' || p.type === f.id).length})</span>}
          </FilterButton>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* REAL MAP */}
        <div className="h-[420px] w-full rounded-2xl overflow-hidden border border-slate-100 shadow-elevated">
          {position && (
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={14}
              className="h-full w-full z-0"
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              {/* USER */}
              <Marker position={[position.lat, position.lng]}>
                <Popup>📍 You are here</Popup>
              </Marker>

              {/* SERVICES */}
              {filtered.map((p, i) => (
                <Marker key={i} position={[p.lat, p.lng]}>
                  <Popup>
                    <div className="font-sans">
                      <strong className="text-sm text-primary">{p.name}</strong><br />
                      <span className="text-xs text-slate-500">{p.type === 'hospital' ? '🏥 Hospital' : p.type === 'police' ? '👮 Police Station' : '🔥 Fire Station'}</span><br />
                      <span className="text-xs font-bold text-secondary">{p.dist}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>
        <div className="flex flex-col gap-3 stagger-children">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
              <p className="text-sm text-slate-500">Searching nearby services...</p>
              <p className="text-xs text-slate-400 mt-1">Using OpenStreetMap data</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-center">
              <p className="text-sm text-accent font-medium mb-2">⚠️ Location Required</p>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState icon={MapPin} title="No services found" description="Try selecting a different category or expand your search area." />
          ) : filtered.map((p, i) => (
            <div key={i} className="group flex items-center gap-4 p-4 bg-white border border-slate-200/60 rounded-2xl shadow-card card-interactive cursor-pointer" onClick={() => openDirections(p)}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${p.color} transition-transform duration-200 group-hover:scale-105`}><p.icon className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-display font-semibold text-primary truncate">{p.name}</h5>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.open ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{p.address}</p>
                {p.phone && <p className="text-xs text-secondary mt-0.5">📞 {p.phone}</p>}
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm text-secondary font-display font-bold">{p.dist}</span>
                <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
