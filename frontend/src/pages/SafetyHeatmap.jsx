import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet'
import L from 'leaflet'
import { Card, CardBody } from '../components/UI'
import 'leaflet/dist/leaflet.css'
import api from '../api/api'

// Fix leaflet default marker icon (same pattern as SafetyMapPage)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Color markers by severity (matches Incident Heatmap legend)
const severityColor = (severity) => {
  if (severity >= 4) return '#F43F5E'  // High — red (accent)
  if (severity >= 2) return '#F59E0B'  // Medium — amber
  return '#10B981'                      // Low — green
}

const createIcon = (color) => L.divIcon({
  className: 'custom-marker',
  html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
})

// Category → readable label map
const categoryLabel = {
  harassment: 'Harassment',
  theft: 'Theft',
  dark_area: 'Dark Area',
  accident: 'Accident',
  other: 'Unsafe Area',
}

export default function SafetyHeatmap() {
  const [reports, setReports] = useState([])
  const [riskLevel, setRiskLevel] = useState('safe')
  const [totalReports, setTotalReports] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userPos, setUserPos] = useState([18.5204, 73.8567]) // Pune default

  // Get user GPS location first, then fetch heatmap data
  useEffect(() => {
    const fetchData = (lat, lng) => {
      console.log('[SafetyHeatmap] Fetching heatmap for:', lat, lng)
      api.get('/api/reports/heatmap', { params: { lat, lng } })
        .then(res => {
          const data = res.data
          console.log('[SafetyHeatmap] Heatmap data:', data)
          setReports(data.reports || [])
          setRiskLevel(data.riskLevel || 'safe')
          setTotalReports(data.totalReports || 0)
        })
        .catch(err => console.error('[SafetyHeatmap] Fetch error:', err))
        .finally(() => setLoading(false))
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          setUserPos([lat, lng])
          fetchData(lat, lng)
        },
        () => fetchData(userPos[0], userPos[1]), // fallback to default
        { enableHighAccuracy: true }
      )
    } else {
      fetchData(userPos[0], userPos[1])
    }
  }, [])

  const riskColors = {
    safe: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', label: 'Safe' },
    medium: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', label: 'Medium Risk' },
    risky: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: 'High Risk' },
  }
  const risk = riskColors[riskLevel] || riskColors.safe

  return (
    <div className="stagger-children">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Safety Heatmap</h1>
        <p className="text-slate-500 text-sm">View safety levels across different areas based on community reports</p>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-xl border ${risk.bg} ${risk.border}`}>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Area Risk Level</p>
          <p className={`text-xl font-display font-bold ${risk.text}`}>{risk.label}</p>
        </div>
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Reports in 3km</p>
          <p className="text-xl font-display font-bold text-primary">{loading ? '…' : totalReports}</p>
        </div>
        <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">Data Radius</p>
          <p className="text-xl font-display font-bold text-primary">3 km</p>
        </div>
      </div>

      {/* Leaflet Map */}
      <Card className="mb-6" hover={false}>
        <div className="relative rounded-2xl overflow-hidden" style={{ height: '460px' }}>
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
              <p className="text-sm text-slate-400 animate-pulse">Loading map data…</p>
            </div>
          ) : (
            <MapContainer center={userPos} zoom={13} style={{ height: '100%', width: '100%' }} className="z-0">
              <TileLayer
                attribution='&copy; <a href="https://carto.com">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
              />

              {/* User position marker */}
              <Marker position={userPos} icon={createIcon('#06B6D4')}>
                <Popup>
                  <div className="font-sans">
                    <strong className="text-sm">Your Location</strong>
                    <p className="text-xs text-gray-500 mt-0.5">Centre point for heatmap</p>
                  </div>
                </Popup>
              </Marker>

              {/* 3km radius circle */}
              <Circle
                center={userPos}
                radius={3000}
                pathOptions={{ color: '#06B6D4', fillColor: '#06B6D4', fillOpacity: 0.04, weight: 1.5, dashArray: '6 4' }}
              />

              {/* Report markers from backend */}
              {reports.map((r) => {
                const lat = r.location?.coordinates?.[1]
                const lng = r.location?.coordinates?.[0]
                if (!lat || !lng) return null
                const color = severityColor(r.severity)
                return (
                  <Marker key={r._id} position={[lat, lng]} icon={createIcon(color)}>
                    <Popup>
                      <div className="font-sans">
                        <strong className="text-sm" style={{ color }}>
                          ⚠ {categoryLabel[r.category] || r.category}
                        </strong>
                        {r.description && (
                          <p className="text-xs text-gray-500 mt-0.5">{r.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Severity: {r.severity}/5 · {new Date(r.createdAt).toLocaleDateString('en-IN')}
                        </p>
                        <span
                          className="inline-block text-[10px] px-2 py-0.5 rounded-full mt-1 font-medium"
                          style={{ background: `${color}20`, color }}
                        >
                          {r.severity >= 4 ? 'High Risk' : r.severity >= 2 ? 'Medium Risk' : 'Low Risk'}
                        </span>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
            </MapContainer>
          )}
        </div>

        {/* Legend */}
        <CardBody>
          <div className="flex rounded-full overflow-hidden h-3 mb-5">
            <div className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
            <div className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500" />
            <div className="flex-1 bg-gradient-to-r from-red-400 to-red-500" />
          </div>
          <div className="flex gap-8 flex-wrap">
            <LegendItem color="bg-emerald-500" label="Low Risk" desc="Severity 1" />
            <LegendItem color="bg-amber-500" label="Medium Risk" desc="Severity 2–3" />
            <LegendItem color="bg-red-500" label="High Risk" desc="Severity 4–5" />
            <LegendItem color="bg-secondary" label="Your Location" desc="Centre point" />
          </div>

          {/* Empty state */}
          {!loading && reports.length === 0 && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-sm text-emerald-700 text-center">✅ No incidents reported in your area. Stay safe!</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

function LegendItem({ color, label, desc }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-3 h-3 rounded-sm ${color} shadow-sm`} />
      <div>
        <span className="text-sm font-medium text-primary">{label}</span>
        <span className="text-xs text-slate-400 ml-1.5">· {desc}</span>
      </div>
    </div>
  )
}
