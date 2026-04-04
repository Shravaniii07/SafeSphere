import { useState, useEffect } from 'react'
import { Activity, MapPin, Zap, LayoutGrid, ExternalLink, Loader2 } from 'lucide-react'
import { FilterButton, EmptyState, Badge } from '../components/UI'
import toast from 'react-hot-toast'

// ✅ MAP IMPORTS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ✅ FIX MARKER ICON ISSUE
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
})

const filters = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'hospital', label: 'Hospitals', icon: Activity },
  { id: 'police', label: 'Police', icon: MapPin },
  { id: 'fire', label: 'Fire Station', icon: Zap },
]

const typeConfig = {
  hospital: { color: 'bg-accent/10 text-accent', icon: Activity },
  police: { color: 'bg-primary-100 text-primary', icon: MapPin },
  fire: { color: 'bg-amber-50 text-amber-600', icon: Zap },
}

// distance
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

export default function NearbyServices() {
  const [active, setActive] = useState('all')
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [position, setPosition] = useState(null)
  const [error, setError] = useState(null)

  // location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported')
      setLoading(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {
        setError('Enable location to find nearby services')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }, [])

  // fetch
  useEffect(() => {
    if (!position) return

    const fetchNearby = async () => {
      setLoading(true)

      const { lat, lng } = position
      const radius = 5000 // 🔥 increased so fire stations show better

      const query = `
        [out:json][timeout:10];
        (
          node["amenity"="hospital"](around:${radius},${lat},${lng});
          node["amenity"="police"](around:${radius},${lat},${lng});
          node["amenity"="fire_station"](around:${radius},${lat},${lng});
        );
        out body;
      `

      try {
        const controller = new AbortController()
        setTimeout(() => controller.abort(), 15000)

        const res = await fetch('https://overpass.kumi.systems/api/interpreter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `data=${encodeURIComponent(query)}`,
          signal: controller.signal,
        })

        if (!res.ok) throw new Error(`Overpass failed: ${res.status}`)

        const text = await res.text()
        if (text.startsWith('<')) throw new Error('Invalid response')

        const data = JSON.parse(text)

        const results = data.elements
          .filter(el => el.tags?.name)
          .map(el => {
            const elLat = el.lat
            const elLng = el.lon
            const amenity = el.tags.amenity
            const dist = haversine(lat, lng, elLat, elLng)

            let type = 'hospital'
            if (amenity === 'police') type = 'police'
            if (amenity === 'fire_station') type = 'fire'

            const cfg = typeConfig[type]

            return {
              name: el.tags.name,
              address:
                el.tags['addr:street']
                  ? `${el.tags['addr:street']} ${el.tags['addr:housenumber'] || ''}, ${el.tags['addr:city'] || ''}`
                  : `${elLat.toFixed(4)}°N, ${elLng.toFixed(4)}°E`,
              dist: dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`,
              distRaw: dist,
              type,
              color: cfg.color,
              icon: cfg.icon,
              open: el.tags.opening_hours !== 'closed',
              lat: elLat,
              lng: elLng,
              phone: el.tags.phone || el.tags['contact:phone'] || null,
            }
          })
          .sort((a, b) => a.distRaw - b.distRaw)
          .slice(0, 20)

        setPlaces(results)

        if (results.length === 0) {
          toast('No services found nearby', { icon: '📍' })
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          toast('Server slow, try again...', { icon: '⏳' })
        } else {
          console.error(err)
          toast.error('Failed to fetch services')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchNearby()
  }, [position])

  const filtered = active === 'all' ? places : places.filter(p => p.type === active)

  const openDirections = (place) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`, '_blank')
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">
            Nearby Services
          </h1>
          <p className="text-slate-500 text-sm">
            {position
              ? `Showing services within 5 km of your location`
              : 'Find hospitals, police stations, and emergency services near you'}
          </p>
        </div>
        {places.length > 0 && <Badge variant="success" dot>{places.length} found</Badge>}
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map(f => (
          <FilterButton key={f.id} active={active === f.id} onClick={() => setActive(f.id)}>
            <f.icon className="w-4 h-4" /> {f.label}
          </FilterButton>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ✅ REAL MAP */}
        <div className="h-[420px] w-full rounded-2xl overflow-hidden border">
          {position && (
            <MapContainer
              center={[position.lat, position.lng]}
              zoom={14}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* USER */}
              <Marker position={[position.lat, position.lng]}>
                <Popup>📍 You are here</Popup>
              </Marker>

              {/* SERVICES */}
              {filtered.map((p, i) => (
                <Marker key={i} position={[p.lat, p.lng]}>
                  <Popup>
                    <strong>{p.name}</strong><br />
                    {p.type === 'hospital' && '🏥'}
                    {p.type === 'police' && '👮'}
                    {p.type === 'fire' && '🚒'}<br />
                    {p.dist}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-3 stagger-children">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
              <p className="text-sm text-slate-500">Searching nearby services...</p>
            </div>
          ) : error ? (
            <div className="bg-accent-50 border border-accent/20 rounded-xl p-6 text-center">
              <p className="text-sm text-accent font-medium mb-2">⚠️ Location Required</p>
              <p className="text-xs text-slate-500">{error}</p>
            </div>
          ) : filtered.map((p, i) => (
            <div key={i} onClick={() => openDirections(p)} className="group flex items-center gap-4 p-4 bg-white border rounded-2xl shadow cursor-pointer">
              <div className={`w-12 h-12 flex items-center justify-center rounded-xl ${p.color}`}>
                <p.icon className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <h5 className="text-sm font-semibold">{p.name}</h5>
                <p className="text-xs text-slate-400">{p.address}</p>
                {p.phone && <p className="text-xs text-secondary">📞 {p.phone}</p>}
              </div>

              <div className="text-sm font-bold">{p.dist}</div>
              <ExternalLink className="w-4 h-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// import { useState, useEffect } from 'react'
// import { Activity, MapPin, Zap, LayoutGrid, ExternalLink, Loader2, Navigation } from 'lucide-react'
// import { FilterButton, MapPlaceholder, EmptyState, Badge } from '../components/UI'
// import toast from 'react-hot-toast'

// const filters = [
//   { id: 'all', label: 'All', icon: LayoutGrid },
//   { id: 'hospital', label: 'Hospitals', icon: Activity },
//   { id: 'police', label: 'Police', icon: MapPin },
//   { id: 'fire', label: 'Fire Station', icon: Zap },
// ]

// const typeConfig = {
//   hospital: { color: 'bg-accent/10 text-accent', icon: Activity, tag: 'hospital' },
//   police: { color: 'bg-primary-100 text-primary', icon: MapPin, tag: 'police' },
//   fire: { color: 'bg-amber-50 text-amber-600', icon: Zap, tag: 'fire_station' },
// }

// // Haversine distance
// function haversine(lat1, lon1, lat2, lon2) {
//   const R = 6371
//   const dLat = (lat2 - lat1) * Math.PI / 180
//   const dLon = (lon2 - lon1) * Math.PI / 180
//   const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
// }

// export default function NearbyServices() {
//   const [active, setActive] = useState('all')
//   const [places, setPlaces] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [position, setPosition] = useState(null)
//   const [error, setError] = useState(null)

//   // Get user's GPS position
//   useEffect(() => {
//     if (!navigator.geolocation) {
//       setError('Geolocation not supported by your browser')
//       setLoading(false)
//       return
//     }

//     navigator.geolocation.getCurrentPosition(
//       (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
//       (err) => { setError('Please enable location to find nearby services'); setLoading(false) },
//       { enableHighAccuracy: true, timeout: 15000 }
//     )
//   }, [])

//   // Fetch real nearby services from Overpass API once we have position
//   useEffect(() => {
//     if (!position) return

//     const fetchNearby = async () => {
//       setLoading(true)
//       const { lat, lng } = position
//       const radius = 5000 // 5km radius

//       // Overpass query for hospitals, police stations, and fire stations
//       const query = `
//         [out:json][timeout:15];
//         (
//           node["amenity"="hospital"](around:${radius},${lat},${lng});
//           node["amenity"="police"](around:${radius},${lat},${lng});
//           node["amenity"="fire_station"](around:${radius},${lat},${lng});
//           way["amenity"="hospital"](around:${radius},${lat},${lng});
//           way["amenity"="police"](around:${radius},${lat},${lng});
//           way["amenity"="fire_station"](around:${radius},${lat},${lng});
//         );
//         out center body;
//       `

//       try {
//         const res = await fetch('https://overpass-api.de/api/interpreter', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
//           body: `data=${encodeURIComponent(query)}`,
//         })
//         const data = await res.json()

//         const results = data.elements
//           .filter(el => el.tags?.name)
//           .map(el => {
//             const elLat = el.lat || el.center?.lat
//             const elLng = el.lon || el.center?.lon
//             const amenity = el.tags.amenity
//             const dist = haversine(lat, lng, elLat, elLng)

//             let type = 'hospital'
//             if (amenity === 'police') type = 'police'
//             if (amenity === 'fire_station') type = 'fire'

//             const cfg = typeConfig[type]

//             return {
//               name: el.tags.name,
//               address: el.tags['addr:full'] || el.tags['addr:street']
//                 ? `${el.tags['addr:street'] || ''} ${el.tags['addr:housenumber'] || ''}, ${el.tags['addr:city'] || ''}`.trim().replace(/^,|,$/g, '')
//                 : `${elLat.toFixed(4)}°N, ${elLng.toFixed(4)}°E`,
//               dist: dist < 1 ? `${(dist * 1000).toFixed(0)} m` : `${dist.toFixed(1)} km`,
//               distRaw: dist,
//               type,
//               color: cfg.color,
//               icon: cfg.icon,
//               open: el.tags.opening_hours !== 'closed',
//               lat: elLat,
//               lng: elLng,
//               phone: el.tags.phone || el.tags['contact:phone'] || null,
//             }
//           })
//           .sort((a, b) => a.distRaw - b.distRaw)
//           .slice(0, 20) // top 20 nearest

//         setPlaces(results)

//         if (results.length === 0) {
//           toast('No services found within 5km. Try zooming out.', { icon: '📍' })
//         }
//       } catch (err) {
//         console.error('Overpass error:', err)
//         toast.error('Failed to fetch nearby services. Retrying...')
//         // Fallback: show a helpful empty state
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchNearby()
//   }, [position])

//   const filtered = active === 'all' ? places : places.filter(p => p.type === active)

//   const openDirections = (place) => {
//     const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`
//     window.open(url, '_blank', 'noopener')
//   }

//   return (
//     <div className="stagger-children">
//       <div className="flex items-start justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Nearby Services</h1>
//           <p className="text-slate-500 text-sm">
//             {position
//               ? `Showing services within 5 km of your location`
//               : 'Find hospitals, police stations, and emergency services near you'}
//           </p>
//         </div>
//         {places.length > 0 && <Badge variant="success" dot>{places.length} found</Badge>}
//       </div>

//       <div className="flex gap-2 flex-wrap mb-6">
//         {filters.map(f => (
//           <FilterButton key={f.id} active={active === f.id} onClick={() => setActive(f.id)}>
//             <f.icon className="w-4 h-4" /> {f.label}
//             {f.id !== 'all' && <span className="text-xs opacity-60 ml-1">({places.filter(p => f.id === 'all' || p.type === f.id).length})</span>}
//           </FilterButton>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <MapPlaceholder height="min-h-[420px]" label={position ? `📍 ${position.lat.toFixed(4)}°N, ${position.lng.toFixed(4)}°E` : 'Locating...'} />

//         <div className="flex flex-col gap-3 stagger-children">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-16">
//               <Loader2 className="w-8 h-8 text-secondary animate-spin mb-4" />
//               <p className="text-sm text-slate-500">Searching nearby services...</p>
//               <p className="text-xs text-slate-400 mt-1">Using OpenStreetMap data</p>
//             </div>
//           ) : error ? (
//             <div className="bg-accent-50 border border-accent/20 rounded-xl p-6 text-center">
//               <p className="text-sm text-accent font-medium mb-2">⚠️ Location Required</p>
//               <p className="text-xs text-slate-500">{error}</p>
//             </div>
//           ) : filtered.length === 0 ? (
//             <EmptyState icon={MapPin} title="No services found" description="Try selecting a different category or expand your search area." />
//           ) : filtered.map((p, i) => (
//             <div key={i} className="group flex items-center gap-4 p-4 bg-white border border-slate-100/80 rounded-2xl shadow-elevated card-hover cursor-pointer" onClick={() => openDirections(p)}>
//               <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${p.color} transition-transform duration-200 group-hover:scale-105`}><p.icon className="w-5 h-5" /></div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2">
//                   <h5 className="text-sm font-display font-semibold text-primary truncate">{p.name}</h5>
//                   <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.open ? 'bg-emerald-500' : 'bg-slate-300'}`} />
//                 </div>
//                 <p className="text-xs text-slate-400 mt-0.5">{p.address}</p>
//                 {p.phone && <p className="text-xs text-secondary mt-0.5">📞 {p.phone}</p>}
//               </div>
//               <div className="flex items-center gap-3 flex-shrink-0">
//                 <span className="text-sm text-secondary font-display font-bold">{p.dist}</span>
//                 <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// }
