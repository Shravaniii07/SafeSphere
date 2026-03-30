import { useState } from 'react'
import { Map, Filter, Clock, AlertTriangle, TrendingUp, Eye, MapPin, Users, BarChart3 } from 'lucide-react'
import { Card, CardHeader, CardBody, Badge, FilterButton } from '../components/UI'

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

  const filteredIncidents = mockIncidents.filter(inc =>
    typeFilter === 'All' || inc.type === typeFilter
  )

  const highRisk = filteredIncidents.filter(i => i.severity === 'High').length
  const totalReports = filteredIncidents.length

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
        <StatMini icon={BarChart3} label="Total Reports" value={String(totalReports)} color="text-primary" />
        <StatMini icon={AlertTriangle} label="High Risk" value={String(highRisk)} color="text-accent" />
        <StatMini icon={MapPin} label="Active Zones" value="12" color="text-amber-500" />
        <StatMini icon={TrendingUp} label="Resolved" value="34" color="text-emerald-600" />
      </div>

      {/* Heatmap Visualization */}
      <Card className="mb-6" hover={false}>
        <div className="relative min-h-[350px] rounded-2xl overflow-hidden">
          {/* Mock heatmap visualization */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="absolute inset-0 geo-pattern opacity-30" />
            {/* Heat spots */}
            <div className="absolute top-[20%] left-[30%] w-32 h-32 bg-accent/20 rounded-full blur-2xl animate-pulse" />
            <div className="absolute top-[40%] right-[25%] w-40 h-40 bg-accent/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="absolute bottom-[25%] left-[50%] w-24 h-24 bg-amber-400/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[60%] left-[20%] w-28 h-28 bg-amber-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-[15%] right-[40%] w-20 h-20 bg-emerald-400/15 rounded-full blur-2xl" />
            <div className="absolute bottom-[40%] right-[15%] w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Map className="w-12 h-12 text-slate-300 mx-auto mb-2 animate-float" />
              <p className="text-sm font-display font-medium text-slate-400">Heatmap Visualization</p>
              <p className="text-xs text-slate-300 mt-1">Interactive heatmap renders with live data</p>
            </div>
          </div>
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
        <div>
          <p className="text-xs text-slate-400 font-display font-semibold uppercase tracking-wide mb-2">Incident Type</p>
          <div className="flex gap-2 flex-wrap">
            {typeFilters.map(f => (
              <FilterButton key={f} active={typeFilter === f} onClick={() => setTypeFilter(f)}>
                {f}
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
