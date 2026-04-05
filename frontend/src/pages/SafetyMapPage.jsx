import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import {
  MapPin, AlertTriangle, Layers,
  X, Send
} from 'lucide-react'
import { Card, CardBody, Button, Badge } from '../components/UI'
import 'leaflet/dist/leaflet.css'
import toast from 'react-hot-toast'
import api from '../api/api'

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

// Mock data for nearby places
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
  const [showPinModal, setShowPinModal] = useState(false)
  const [clickedPos, setClickedPos] = useState(null)
  const [pinNote, setPinNote] = useState('')
  const [incidentType, setIncidentType] = useState('Other')
  const [userPins, setUserPins] = useState([])
  const [layers, setLayers] = useState({ police: true, hospitals: true, safeZones: true, userPins: true })

  const [center] = useState([18.5204, 73.8567]) // Pune default

  // Fetch incidents from backend
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
            type: inc.type
          })))
        }
      } catch (err) {
        console.error("Incidents fetch error:", err)
      }
    }
    fetchIncidents()
  }, [])

  const handleMapClick = (latlng) => {
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
        description: pinNote || `Reported ${incidentType}`
      })

      if (res.data.success) {
        const newInc = res.data.data
        setUserPins(prev => [...prev, {
          id: newInc._id,
          lat: newInc.location.lat,
          lng: newInc.location.lng,
          note: newInc.description,
          type: newInc.type
        }])
        setShowPinModal(false)
        setPinNote('')
        setIncidentType('Other')
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
          <p className="text-slate-500 text-sm">Explore nearby safe zones, services, and report unsafe areas</p>
        </div>
        <Badge variant="success" dot>Live</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Area */}
        <div className="lg:col-span-9">
          <Card hover={false}>
            <div className="relative rounded-2xl overflow-hidden" style={{ height: '520px' }}>
              <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
                <TileLayer
                  attribution='&copy; <a href="https://carto.com">CARTO</a>'
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />
                <ClickHandler onMapClick={handleMapClick} />

                {/* Police Stations */}
                {layers.police && mockPoliceStations.map(p => (
                  <Marker key={`police-${p.id}`} position={[p.lat, p.lng]} icon={createIcon('#0F172A')}>
                    <Popup>
                      <div className="font-sans">
                        <strong className="font-display text-sm">{p.name}</strong>
                        <p className="text-xs text-gray-500 mt-0.5">{p.address}</p>
                        <span className="inline-block text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full mt-1 font-medium">Police Station</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Hospitals */}
                {layers.hospitals && mockHospitals.map(h => (
                  <Marker key={`hosp-${h.id}`} position={[h.lat, h.lng]} icon={createIcon('#10B981')}>
                    <Popup>
                      <div className="font-sans">
                        <strong className="font-display text-sm">{h.name}</strong>
                        <p className="text-xs text-gray-500 mt-0.5">{h.address}</p>
                        <span className="inline-block text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full mt-1 font-medium">Hospital</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Safe Zones */}
                {layers.safeZones && mockSafeZones.map(s => (
                  <Marker key={`safe-${s.id}`} position={[s.lat, s.lng]} icon={createIcon('#06B6D4')}>
                    <Popup>
                      <div className="font-sans">
                        <strong className="font-display text-sm">{s.name}</strong>
                        <p className="text-xs text-gray-500 mt-0.5">{s.address}</p>
                        <span className="inline-block text-[10px] bg-secondary-50 text-secondary px-2 py-0.5 rounded-full mt-1 font-medium">Safe Zone</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* User Pins (Incidents) */}
                {layers.userPins && userPins.map(p => (
                  <Marker key={`pin-${p.id}`} position={[p.lat, p.lng]} icon={createIcon('#F43F5E')}>
                    <Popup>
                      <div className="font-sans">
                        <strong className="font-display text-sm text-accent">⚠ {p.type}</strong>
                        <p className="text-xs text-gray-500 mt-0.5">{p.note}</p>
                        <span className="inline-block text-[10px] bg-accent-50 text-accent px-2 py-0.5 rounded-full mt-1 font-medium">Incident Report</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}

              </MapContainer>
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-secondary" /> Map Layers
              </h4>
              <div className="space-y-3">
                <LayerToggle label="Police Stations" color="bg-primary" count={mockPoliceStations.length} active={layers.police} onClick={() => toggleLayer('police')} />
                <LayerToggle label="Hospitals" color="bg-emerald-500" count={mockHospitals.length} active={layers.hospitals} onClick={() => toggleLayer('hospitals')} />
                <LayerToggle label="Safe Zones" color="bg-secondary" count={mockSafeZones.length} active={layers.safeZones} onClick={() => toggleLayer('safeZones')} />
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
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 p-2.5 bg-accent-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-accent shrink-0" />
                  <span className="text-xs text-accent font-medium">{userPins.length} reports submitted</span>
                </div>
                <Button
                  variant="danger"
                  className="w-full text-xs py-2.5"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        handleMapClick({ lat: pos.coords.latitude, lng: pos.coords.longitude })
                      })
                    } else {
                      toast.error("Geolocation not supported. Please click on map.")
                    }
                  }}
                >
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Report at My Location
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-3">Legend</h4>
              <div className="space-y-2.5">
                <LegendDot color="bg-primary" label="Police Station" />
                <LegendDot color="bg-emerald-500" label="Hospital" />
                <LegendDot color="bg-secondary" label="Safe Zone" />
                <LegendDot color="bg-accent" label="User Report" />
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

            <textarea
              placeholder="Describe the incident..."
              value={pinNote}
              onChange={e => setPinNote(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm resize-none transition-all duration-200 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400 mb-4"
            />
            
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowPinModal(false)}>Cancel</Button>
              <Button variant="danger" onClick={submitPin}>
                <Send className="w-3.5 h-3.5" /> Submit Report
              </Button>
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
