import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { Map, Clock, AlertTriangle, TrendingUp, MapPin, BarChart3, Trash2 } from 'lucide-react'
import { Card, CardHeader, CardBody, Badge, FilterButton } from '../components/UI'
import 'leaflet/dist/leaflet.css'
import api from '../api/api'
import { useApp } from '../context/AppContext'

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
  High: 'bg-red-500 text-white',
  Medium: 'bg-amber-500 text-white',
  Low: 'bg-yellow-400 text-slate-900',
}
const severityBadge = {
  High: 'danger',
  Medium: 'warning',
  Low: 'warning', // Yellow-ish
}

export default function SafetyHeatmapView() {
  const { user } = useApp()
  const [timeFilter, setTimeFilter] = useState('7 Days')
  const [typeFilter, setTypeFilter] = useState('All')
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalReports: 0, riskLevel: 'safe' })
  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567])

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
          severity: inc.severity || 1, 
          userId: inc.user,
          createdAt: inc.timestamp || inc.createdAt
        }))

        const merged = [...reportsData, ...incidentsData]
        setReports(merged)
        setMapCenter([lat, lng])
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

    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => fetchHeatmap(pos.coords.latitude, pos.coords.longitude),
          () => fetchHeatmap(18.5204, 73.8567)
        )
      } else {
        fetchHeatmap(18.5204, 73.8567)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await api.delete(`/api/incidents/${id}`)
      if (res.data.success) {
        toast.success('Report deleted successfully')
        setReports(prev => prev.filter(p => p._id !== id))
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete report')
    }
  }

  const filteredIncidents = reports.map(r => ({
    id: r._id,
    type: r.category,
    location: `${r.location.coordinates[1].toFixed(2)}, ${r.location.coordinates[0].toFixed(2)}`,
    time: new Date(r.createdAt).toLocaleDateString(),
    severity: r.severity >= 4 ? 'High' : r.severity === 3 ? 'Medium' : 'Low',
    userId: r.userId,
    lat: r.location.coordinates[1],
    lng: r.location.coordinates[0]
  })).filter(inc => {
    // Check type filter
    const matchesType = typeFilter === 'All' || inc.type === typeFilter;
    
    // Check 10km radius filter
    const dist = mapCenter ? getDistance(mapCenter[0], mapCenter[1], inc.lat, inc.lng) : 0;
    const isNearby = dist <= 10;
    
    return matchesType && isNearby;
  })

  const highRisk = filteredIncidents.filter(i => i.severity === 'High').length
  const mediumRisk = filteredIncidents.filter(i => i.severity === 'Medium').length
  const lowRisk = filteredIncidents.filter(i => i.severity === 'Low').length
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
        <StatMini icon={AlertTriangle} label="High Risk" value={String(highRisk)} color="text-red-600" />
        <StatMini icon={AlertTriangle} label="Medium Risk" value={String(mediumRisk)} color="text-amber-500" />
        <StatMini icon={AlertTriangle} label="Low Risk" value={String(lowRisk)} color="text-yellow-500" />
      </div>

      {/* ✅ REAL Leaflet Map with incident markers from backend */}
      <Card className="mb-6" hover={false}>
        <div className="relative rounded-2xl overflow-hidden" style={{ height: '350px' }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <p className="text-sm text-slate-400 animate-pulse">Loading incident map…</p>
            </div>
          ) : (
            <MapContainer 
              center={mapCenter} 
              zoom={13} 
              style={{ height: '100%', width: '100%' }} 
              className="z-0"
              key={`${mapCenter[0]}-${mapCenter[1]}`}
            >
              <TileLayer
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />
              {/* Safe Area Shading (10km Circle) */}
              <Circle 
                center={mapCenter} 
                radius={10000} 
                pathOptions={{ 
                  fillColor: '#10B981', 
                  fillOpacity: 0.1, 
                  color: '#10B981', 
                  weight: 1 
                }} 
              />
              {filteredIncidents.map(inc => (
                <Marker
                  key={inc.id}
                  position={[inc.lat, inc.lng]}
                  icon={createIcon(
                    inc.severity === 'High' ? '#F43F5E' :
                    inc.severity === 'Medium' ? '#F59E0B' : '#FACC15'
                  )}
                >
                  <Popup>
                    <div className="font-sans">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <strong className="text-sm">⚠ {inc.type}</strong>
                        {inc.userId === user?._id && (
                          <button 
                            onClick={() => handleDelete(inc.id)}
                            className="p-1 hover:bg-red-50 text-red-500 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{inc.location}</p>
                      <p className="text-xs text-gray-400 mt-1">{inc.time}</p>
                      <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 font-medium ${
                        inc.severity === 'High' ? 'bg-red-50 text-red-600' :
                        inc.severity === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-yellow-50 text-yellow-600'
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
            <LegendItem color="bg-yellow-400" label="Low Risk" />
            <LegendItem color="bg-amber-500" label="Medium Risk" />
            <LegendItem color="bg-red-500" label="High Risk" />
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
                <div className="flex flex-col items-end gap-2">
                  <span className="text-[11px] text-slate-400 font-mono whitespace-nowrap">{inc.time}</span>
                  {inc.userId === user?._id && (
                    <button 
                      onClick={() => handleDelete(inc.id)}
                      className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
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
