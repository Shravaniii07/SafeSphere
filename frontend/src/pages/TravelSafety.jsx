import { useState } from 'react'
import { Play, Route } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, Toggle, Badge } from '../components/UI'
import toast from 'react-hot-toast'

export default function TravelSafety() {
  const [autoShare, setAutoShare] = useState(true)
  const [checkIns, setCheckIns] = useState(false)
  const [deviation, setDeviation] = useState(true)
  const [starting, setStarting] = useState(false)

  const startTrip = () => {
    setStarting(true)
    setTimeout(() => { setStarting(false); toast.success('Trip started! Contacts notified.') }, 1500)
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Travel Safety</h1>
          <p className="text-slate-500 text-sm">Track your trips and stay safe during travel</p>
        </div>
        <Badge variant="info" dot>Route Planner</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader><h3 className="text-[15px] font-display font-bold text-primary flex items-center gap-2"><Route className="w-4 h-4 text-secondary" /> Start a Trip</h3></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <Input label="From" placeholder="Starting location" defaultValue="Home — Sector 62, Noida" />
                <Input label="To" placeholder="Destination" defaultValue="Office — Connaught Place" />
              </div>
              <Button size="lg" full isLoading={starting} onClick={startTrip}><Play className="w-5 h-5" /> Start Trip</Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h3 className="text-[15px] font-display font-bold text-primary">Route Preview</h3></CardHeader>
            <CardBody>
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 stagger-children">
                <RouteStep color="bg-emerald-500" letter="A" title="Home — Sector 62, Noida" sub="Starting point" />
                <RouteStep color="bg-slate-300" letter="•" title="DND Flyway" sub="Via toll road · 12 km" />
                <RouteStep color="bg-slate-300" letter="•" title="ITO Junction" sub="Turn left · 6 km" />
                <RouteStep color="bg-accent" letter="B" title="Office — Connaught Place" sub="Destination · ~45 min" last />
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-4 space-y-5">
          <Card>
            <CardBody>
              <h4 className="text-sm font-display font-bold text-primary mb-4">Trip Status</h4>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span className="font-medium text-slate-600 text-sm">Not Started</span>
              </div>
              <div className="h-px bg-slate-100 mb-5" />
              <div className="space-y-3">
                <InfoRow label="Distance" value="22 km" />
                <InfoRow label="Est. Time" value="45 min" />
                <InfoRow label="Safety Score" value="High" valueClass="text-emerald-600" />
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
        </div>
      </div>
    </div>
  )
}

function RouteStep({ color, letter, title, sub, last }) {
  return (
    <div className="flex items-start gap-3 py-3 relative">
      {!last && <div className="absolute left-[11px] top-[34px] bottom-0 w-0.5 bg-slate-200" />}
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-display font-bold ${color} shadow-sm`}>{letter}</div>
      <div><p className="text-sm font-medium text-primary">{title}</p><span className="text-xs text-slate-400">{sub}</span></div>
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
