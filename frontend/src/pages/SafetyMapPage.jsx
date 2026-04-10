import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Circle } from 'react-leaflet'
import L from 'leaflet'
import {
  MapPin, AlertTriangle, Layers,
  X, Send, Trash2, ShieldCheck, Building2, Cross, Navigation, Plus
} from 'lucide-react'
import api from '../api/api'
import { useApp } from '../context/AppContext'
import { useState, useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import { Card, CardBody, Button, Badge } from '../components/UI'
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
  html: `<div style="background:${color};width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;"></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

// Distance utility (Haversine formula)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Mock data for fallback or nearby places
const mockPoliceStations = [
  { id: 1, lat: 18.5260, lng: 73.8550, name: 'Shivajinagar Police Station', address: 'FC Road, Pune' },
  { id: 2, lat: 18.5080, lng: 73.8305, name: 'Swargate Police Station', address: 'Swargate, Pune' },
  { id: 3, lat: 18.5460, lng: 73.9000, name: 'Viman Nagar Police Station', address: 'Viman Nagar, Pune' },
]

const mockHospitals = [
  { id: 1, lat: 18.5310, lng: 73.8475, name: 'Sassoon General Hospital', address: 'Near Pune Station' },
  { id: 2, lat: 18.5120, lng: 73.8435, name: 'Ruby Hall Clinic', address: 'Sassoon Road, Pune' },
  { id: 3, lat: 18.5580, lng: 73.9100, name: 'Jehangir Hospital', address: 'Sassoon Road' },
]

const mockSafeZones = [
  { id: 1, lat: 18.5204, lng: 73.8567, name: 'FC Road Commercial Area', address: 'Fergusson College Rd' },
  { id: 2, lat: 18.5160, lng: 73.8400, name: 'Camp Area', address: 'MG Road, Pune Camp' },
]

function ClickHandler({ onMapClick }) {
  useMapEvents({ click: (e) => onMapClick(e.latlng) })
  return null
}

export default function SafetyMapPage() {
  const { user, searchLocation, setSearchLocation } = useApp()
  const [showPinModal, setShowPinModal] = useState(false)
  const [clickedPos, setClickedPos] = useState(null)
  const [pinNote, setPinNote] = useState('')
  const [incidentType, setIncidentType] = useState('Other')
  const [severity, setSeverity] = useState(3)
  const [userPins, setUserPins] = useState([])
  const [layers, setLayers] = useState({ safeZone: true, userPins: true, police: true, hospitals: true })
  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]) // Default Pune
  const [userLocation, setUserLocation] = useState(null)
  const mapRef = useRef(null)

  // 1. Get user location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation([latitude, longitude]);
        setMapCenter([latitude, longitude]);
      }, (err) => {
        console.error("Geolocation error:", err);
        toast.error("Could not find your location. Defaulting to center.");
      });
    }
  }, []);
  
  // 1b. Handle search from Navbar
  useEffect(() => {
    if (searchLocation && mapRef.current) {
      const { lat, lng } = searchLocation;
      setMapCenter([lat, lng]);
      mapRef.current.flyTo([lat, lng], 15);
      
      // Cleanup search location after use to avoid re-panning on mount
      // We wrap it in a timeout to ensure flyTo starts
      const timer = setTimeout(() => {
        setSearchLocation(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [searchLocation, setSearchLocation]);

  // 2. Fetch incidents
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await api.get('/api/incidents')
        if (res.data.success) {
          setUserPins(res.data.data.map(inc => ({
            id: inc._id,
            lat: inc.location.lat,
            lng: inc.location.lng,
            note: inc.description,
            type: inc.type,
            severity: inc.severity || 1,
            userId: inc.user?._id || inc.user
          })))
        }
      } catch (err) {
        console.error("Incidents fetch error:", err)
      }
    }

    fetchIncidents()
    const interval = setInterval(fetchIncidents, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await api.delete(`/api/incidents/${id}`)
      if (res.data.success) {
        toast.success('Report deleted successfully')
        setUserPins(prev => prev.filter(p => p.id !== id))
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete report')
    }
  }
  const handleMapClick = (latlng) => {
    if (!userLocation) {
      toast.error('Waiting for GPS signal...')
      return
    }

    // Check 10km radius
    const dist = getDistance(userLocation[0], userLocation[1], latlng.lat, latlng.lng)
    if (dist > 10) {
      toast.error('You can only report incidents within 10km of your location.')
      return
    }

    setClickedPos(latlng)
    setShowPinModal(true)
    setPinNote('')
  }

  const submitPin = async () => {
    if (!clickedPos) return
    try {
      const res = await api.post('/api/incidents/report', {
        lat: clickedPos.lat,
        lng: clickedPos.lng,
        type: incidentType,
        severity: severity,
        description: pinNote || `Reported ${incidentType}`
      })

      if (res.data.success) {
        const newInc = res.data.data
        setUserPins(prev => [...prev, {
          id: newInc._id,
          lat: newInc.location.lat,
          lng: newInc.location.lng,
          note: newInc.description,
          type: newInc.type,
          severity: newInc.severity,
          userId: newInc.user
        }])
        setShowPinModal(false)
        setPinNote('')
        setIncidentType('Other')
        setSeverity(3)
        toast.success('Incident reported successfully! 🛡️')
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
    }
  }

  const toggleLayer = (layer) => {
    setLayers(prev => ({ ...prev, [layer]: !prev[layer] }))
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Safety Map</h1>
          <p className="text-slate-500 text-sm">Stay informed with real-time community safety updates.</p>
        </div>
        <Badge variant="success" dot>Live</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map */}
        <div className="lg:col-span-9">
          <Card hover={false}>
            <div className="relative rounded-2xl overflow-hidden" style={{ height: '520px' }}>
              <MapContainer
                center={mapCenter}
                zoom={14}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
                ref={mapRef}
                key={`${mapCenter[0]}-${mapCenter[1]}`} // Force re-render when location found
              >
                <TileLayer
                  attribution='&copy; <a href="https://carto.com">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <ClickHandler onMapClick={handleMapClick} />

                {/* Safe Zone (10km Circle) */}
                {userLocation && (
                  <Circle
                    center={userLocation}
                    radius={10000} // 10km in meters
                    pathOptions={{
                      fillColor: '#10B981',
                      fillOpacity: 0.1,
                      color: '#10B981',
                      weight: 1
                    }}
                  />
                )}

                {/* User Pins (Incidents) */}
                {layers.userPins && userPins.map(p => {
                  const dist = userLocation ? getDistance(userLocation[0], userLocation[1], p.lat, p.lng) : 0
                  if (userLocation && dist > 10) return null

                  return (
                    <Marker
                      key={`pin-${p.id}`}
                      position={[p.lat, p.lng]}
                      icon={createIcon(
                        p.severity >= 4 ? '#F43F5E' : // High (Red)
                          p.severity === 3 ? '#F59E0B' : // Medium (Orange)
                            '#FACC15' // Low (Yellow)
                      )}
                    >
                      <Popup>
                        <div className="font-sans">
                          <div className="flex items-center justify-between mb-1 gap-4">
                            <strong className="font-display text-sm text-primary">⚠ {p.type}</strong>
                            {p.userId === user?._id && (
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors cursor-pointer"
                                title="Delete report"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{p.note}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${p.severity >= 4 ? 'bg-red-50 text-red-600' :
                                p.severity === 3 ? 'bg-amber-50 text-amber-600' : 'bg-yellow-50 text-yellow-600'
                              }`}>
                              {p.severity >= 4 ? 'High Risk' : p.severity === 3 ? 'Medium Risk' : 'Low Risk'}
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}

                {/* Nearby Services Fallback (Hospitals & Police) */}
                {layers.police && mockPoliceStations.map(s => (
                  <Marker key={`police-${s.id}`} position={[s.lat, s.lng]} icon={createIcon('#3B82F6')}>
                    <Popup>
                      <div className="font-sans">
                        <strong className="font-display text-sm text-blue-600">Police Station</strong>
                        <p className="text-xs text-slate-900 font-bold mt-1">{s.name}</p>
                        <p className="text-[10px] text-slate-500">{s.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
                {layers.hospitals && mockHospitals.map(h => (
                  <Marker key={`hosp-${h.id}`} position={[h.lat, h.lng]} icon={createIcon('#10B981')}>
                    <Popup>
                      <div className="font-sans">
                        <strong className="font-display text-sm text-emerald-600">Hospital</strong>
                        <p className="text-xs text-slate-900 font-bold mt-1">{h.name}</p>
                        <p className="text-[10px] text-slate-500">{h.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-secondary" /> Map Layers
              </h4>
              <div className="space-y-3">
                <LayerToggle label="Active Safe Zone" color="bg-emerald-500" count="1" active={layers.safeZone} onClick={() => toggleLayer('safeZone')} />
                <LayerToggle label="Danger Reports" color="bg-accent" count={userPins.length} active={layers.userPins} onClick={() => toggleLayer('userPins')} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-accent" /> Report Unsafe Area
              </h4>
              <p className="text-xs text-slate-500 mb-3">Click anywhere on the map to drop a pin and mark an unsafe location.</p>
              <div className="flex items-center gap-2 p-2.5 bg-accent-50 rounded-lg">
                <MapPin className="w-4 h-4 text-accent shrink-0" />
                <span className="text-xs text-accent font-medium">{userPins.length} reports submitted</span>
              </div>
            </CardBody>
          </Card>

        </div>
      </div>

      {/* Pin Modal - Portaled to body to ensure it appears above all stacking contexts (including Leaflet) */}
      {showPinModal && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-primary-dark/60 backdrop-blur-md" style={{ animation: 'modal-overlay-in 0.2s ease' }}>
          {/* Backdrop Overlay (closes modal on click) */}
          <div className="absolute inset-0" onClick={() => setShowPinModal(false)} />

          {/* Modal Content */}
          <div
            className="relative bg-white rounded-2xl shadow-elevated-lg w-full max-w-[400px] p-6 lg:p-8"
            style={{ animation: 'modal-content-in 0.3s cubic-bezier(0.16,1,0.3,1)' }}
            onClick={(e) => e.stopPropagation()} // ✅ Prevent click from bubbling to backdrop
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-primary flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent" /> Mark Unsafe Area
              </h3>
              <button onClick={() => setShowPinModal(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 mb-4 font-medium uppercase tracking-wider">
              Location: {clickedPos?.lat.toFixed(4)}, {clickedPos?.lng.toFixed(4)}
            </p>

            <div className="mb-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Report Type</label>
              <div className="grid grid-cols-2 gap-2">
                {['Crime', 'Emergency', 'Harassment', 'Theft', 'Accident', 'Other'].map(type => (
                  <button
                    key={type}
                    onClick={() => setIncidentType(type)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${incidentType === type
                      ? 'bg-accent border-accent text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Severity (1-5)</label>
              <div className="flex items-center justify-between gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                {[1, 2, 3, 4, 5].map(v => (
                  <button
                    key={v}
                    onClick={() => setSeverity(v)}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${severity === v
                      ? (v >= 4 ? 'bg-red-500 text-white' : v === 3 ? 'bg-amber-500 text-white' : 'bg-yellow-400 text-slate-900')
                      : 'bg-transparent text-slate-400 hover:text-slate-600'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <div className="flex justify-between mt-1 px-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase">Low Risk</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase">High Risk</span>
              </div>
            </div>

            <textarea
              placeholder="Describe why this area is unsafe..."
              value={pinNote}
              onChange={e => setPinNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm resize-none transition-all duration-200 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400 mb-4"
            />
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowPinModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={submitPin}><Send className="w-3.5 h-3.5" /> Submit Report</Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}

function LayerToggle({ label, color, count, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all cursor-pointer ${active ? 'bg-slate-50' : 'opacity-40 hover:opacity-70'}`}>
      <div className={`w-3 h-3 rounded-full ${color} ${!active && 'grayscale'} transition-all`} />
      <span className="text-sm text-primary flex-1">{label}</span>
      <span className="text-[11px] text-slate-400 font-mono">{count}</span>
    </button>
  )
}

function LegendDot({ color, label }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
      <span className="text-xs text-slate-600">{label}</span>
    </div>
  )
}
