import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { Map, Clock, AlertTriangle, TrendingUp, MapPin, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardBody, Badge, FilterButton } from '../components/UI'
import 'leaflet/dist/leaflet.css'
import api from '../api/api'

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:26px;height:26px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

// Mock incident data — TODO: Replace with API call
const mockIncidents = [
  { id: 1, type: 'Harassment', location: 'FC Road, Pune', time: '2 hours ago', severity: 'High', lat: 18.526, lng: 73.841 },
  { id: 2, type: 'Stalking', location: 'Koregaon Park', time: '5 hours ago', severity: 'Medium', lat: 18.536, lng: 73.893 },
  { id: 3, type: 'Unsafe Area', location: 'Near Railway Station', time: '12 hours ago', severity: 'High', lat: 18.528, lng: 73.874 },
  { id: 4, type: 'Eve Teasing', location: 'Camp Area', time: '1 day ago', severity: 'Medium', lat: 18.516, lng: 73.871 },
  { id: 5, type: 'Theft', location: 'Swargate Bus Stand', time: '1 day ago', severity: 'Low', lat: 18.501, lng: 73.862 },
  { id: 6, type: 'Harassment', location: 'Viman Nagar', time: '2 days ago', severity: 'High', lat: 18.567, lng: 73.914 },
  { id: 7, type: 'Unsafe Area', location: 'Kothrud', time: '3 days ago', severity: 'Low', lat: 18.507, lng: 73.808 },
  { id: 8, type: 'Stalking', location: 'Baner Road', time: '4 days ago', severity: 'Medium', lat: 18.559, lng: 73.783 },
]

const timeFilters = ['24 Hours', '7 Days', '30 Days', 'All Time']
const typeFilters = ['All', 'Harassment', 'Stalking', 'Unsafe Area', 'Eve Teasing', 'Theft']

const severityColors = {
  High: 'bg-accent text-white',
  Medium: 'bg-amber-500 text-white',
  Low: 'bg-emerald-500 text-white',
}
const severityBadge = {
  High: 'danger',
  Medium: 'warning',
  Low: 'success',
}

export default function SafetyHeatmapView() {
  const [timeFilter, setTimeFilter] = useState('7 Days')
  const [typeFilter, setTypeFilter] = useState('All')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalReports: 0, riskLevel: 'safe' })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  useEffect(() => {
    const fetchHeatmap = async (lat, lng) => {
      try {
        setLoading(true)
        console.log('[IncidentHeatmap] Fetching from reports and incidents...')
        
        // Fetch from legacy reports heatmap
        const reportsRes = await api.get('/api/reports/heatmap', { params: { lat, lng } })
        
        // Fetch from new incidents API
        const incidentsRes = await api.get('/api/incidents')

        const reportsData = reportsRes.data.reports || []
        const incidentsData = (incidentsRes.data.data || []).map(inc => ({
          _id: inc._id,
          category: inc.type,
          location: { type: 'Point', coordinates: [inc.location.lng, inc.location.lat] },
          description: inc.description,
          severity: 3, // Default for user reports
          createdAt: inc.timestamp || inc.createdAt
        }))

        const merged = [...reportsData, ...incidentsData]
        setReports(merged)
        setStats({ 
          totalReports: merged.length, 
          riskLevel: reportsRes.data.riskLevel || 'safe' 
        })
        
      } catch (err) {
        console.error('Heatmap fetch error:', err)
      } finally {
        setLoading(false)
      }
    }


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchHeatmap(pos.coords.latitude, pos.coords.longitude),
        () => fetchHeatmap(18.5204, 73.8567), // fallback to Pune
        { enableHighAccuracy: true }
      )
    } else {
      fetchHeatmap(18.5204, 73.8567)
    }
  }, [])

  const filteredIncidents = reports.map(r => ({
    id: r._id,
    type: r.category,
    location: `${r.location.coordinates[1].toFixed(2)}, ${r.location.coordinates[0].toFixed(2)}`,
    time: new Date(r.createdAt).toLocaleDateString(),
    severity: r.severity >= 4 ? 'High' : r.severity >= 2 ? 'Medium' : 'Low',
    lat: r.location.coordinates[1],
    lng: r.location.coordinates[0]
  })).filter(inc =>
    typeFilter === 'All' || inc.type === typeFilter
  )

  const highRisk = filteredIncidents.filter(i => i.severity === 'High').length
  const totalReportsCount = stats.totalReports

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Incident Heatmap</h1>
          <p className="text-slate-500 text-sm">Community-reported safety incidents in your area</p>
        </div>
        <Badge variant="warning" dot>Live Data</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatMini icon={BarChart3} label="Total Reports" value={String(totalReportsCount)} color="text-primary" />
        <StatMini icon={AlertTriangle} label="High Risk" value={String(highRisk)} color="text-accent" />
        <StatMini icon={MapPin} label="Active Zones" value="12" color="text-amber-500" />
        <StatMini icon={TrendingUp} label="Resolved" value="34" color="text-emerald-600" />
      </div>

      {/* ✅ REAL Leaflet Map with incident markers from backend */}
      <Card className="mb-6" hover={false}>
        <div className="relative rounded-2xl overflow-hidden" style={{ height: '350px' }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <p className="text-sm text-slate-400 animate-pulse">Loading incident map…</p>
            </div>
          ) : (
            <MapContainer center={[18.5204, 73.8567]} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
              <TileLayer
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {filteredIncidents.map(inc => (
                <Marker
                  key={inc.id}
                  position={[inc.lat, inc.lng]}
                  icon={createIcon(
                    inc.severity === 'High' ? '#F43F5E' :
                    inc.severity === 'Medium' ? '#F59E0B' : '#10B981'
                  )}
                >
                  <Popup>
                    <div className="font-sans">
                      <strong className="text-sm">⚠ {inc.type}</strong>
                      <p className="text-xs text-gray-500 mt-0.5">{inc.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{inc.time}</p>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 font-medium ${
                        inc.severity === 'High' ? 'bg-red-50 text-red-600' :
                        inc.severity === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>{inc.severity} Risk</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          )}
        </div>

        {/* Legend */}
        <CardBody>
          <div className="flex rounded-full overflow-hidden h-2.5 mb-4">
            <div className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
            <div className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500" />
            <div className="flex-1 bg-gradient-to-r from-accent-light to-accent" />
          </div>
          <div className="flex gap-8 flex-wrap">
            <LegendItem color="bg-emerald-500" label="Low Risk" />
            <LegendItem color="bg-amber-500" label="Medium Risk" />
            <LegendItem color="bg-accent" label="High Risk" />
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <p className="text-xs text-slate-400 font-display font-semibold uppercase tracking-wide mb-2">Time Range</p>
          <div className="flex gap-2 flex-wrap">
            {timeFilters.map(f => (
              <FilterButton key={f} active={timeFilter === f} onClick={() => setTimeFilter(f)}>
                <Clock className="w-3.5 h-3.5" /> {f}
              </FilterButton>
            ))}
          </div>
        </div>
      </div>



      {/* Incident Reports */}
      <Card>
        <CardHeader>
          <h3 className="text-[15px] font-display font-bold text-primary flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-accent" /> Recent Reports
          </h3>
          <span className="text-xs text-slate-400">{filteredIncidents.length} incidents</span>
        </CardHeader>
        <CardBody>
          <div className="space-y-3 stagger-children">
            {filteredIncidents.map(inc => (
              <div key={inc.id} className="flex items-center gap-4 p-3.5 border border-slate-100/80 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all duration-200 group">
                <div className={`w-10 h-10 rounded-xl ${severityColors[inc.severity]} flex items-center justify-center shrink-0 shadow-sm`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h5 className="text-sm font-semibold text-primary">{inc.type}</h5>
                    <Badge variant={severityBadge[inc.severity]} dot>{inc.severity}</Badge>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {inc.location}
                  </p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{inc.time}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

function StatMini({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100/80 p-4 shadow-elevated card-hover">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
        <div>
          <div className={`text-xl font-display font-bold ${color}`}>{value}</div>
          <div className="text-[11px] text-slate-400">{label}</div>
        </div>
      </div>
    </div>
  )
}

function LegendItem({ color, label }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-sm ${color}`} />
      <span className="text-sm text-slate-600">{label}</span>
    </div>
  )
}
