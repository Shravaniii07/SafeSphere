import { useState } from 'react'
import { Activity, MapPin, Zap, LayoutGrid, ExternalLink } from 'lucide-react'
import { FilterButton, MapPlaceholder, EmptyState } from '../components/UI'

const filters = [
  { id: 'all', label: 'All', icon: LayoutGrid },
  { id: 'hospital', label: 'Hospitals', icon: Activity },
  { id: 'police', label: 'Police', icon: MapPin },
  { id: 'fire', label: 'Fire Station', icon: Zap },
]

const places = [
  { name: 'City General Hospital', address: '123 Medical Ave, New Delhi', dist: '0.8 km', type: 'hospital', color: 'bg-accent/10 text-accent', icon: Activity, open: true },
  { name: 'Central Police Station', address: '45 Law Enforcement Rd', dist: '1.2 km', type: 'police', color: 'bg-primary-100 text-primary', icon: MapPin, open: true },
  { name: 'Apollo Emergency Center', address: '789 Health Blvd', dist: '1.5 km', type: 'hospital', color: 'bg-accent/10 text-accent', icon: Activity, open: true },
  { name: 'District Police HQ', address: '22 Security Lane', dist: '2.1 km', type: 'police', color: 'bg-primary-100 text-primary', icon: MapPin, open: false },
  { name: 'Fire Station No. 5', address: '67 Emergency Way', dist: '2.4 km', type: 'fire', color: 'bg-amber-50 text-amber-600', icon: Zap, open: true },
]

export default function NearbyServices() {
  const [active, setActive] = useState('all')
  const filtered = active === 'all' ? places : places.filter(p => p.type === active)

  return (
    <div className="stagger-children">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Nearby Services</h1>
        <p className="text-slate-500 text-sm">Find hospitals, police stations, and emergency services near you</p>
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {filters.map(f => (
          <FilterButton key={f.id} active={active === f.id} onClick={() => setActive(f.id)}>
            <f.icon className="w-4 h-4" /> {f.label}
          </FilterButton>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MapPlaceholder height="min-h-[420px]" />
        <div className="flex flex-col gap-3 stagger-children">
          {filtered.length === 0 ? (
            <EmptyState icon={MapPin} title="No services found" description="Try selecting a different category" />
          ) : filtered.map((p, i) => (
            <div key={i} className="group flex items-center gap-4 p-4 bg-white border border-slate-100/80 rounded-2xl shadow-elevated card-hover cursor-pointer">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${p.color} transition-transform duration-200 group-hover:scale-105`}><p.icon className="w-5 h-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-display font-semibold text-primary truncate">{p.name}</h5>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${p.open ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{p.address}</p>
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
