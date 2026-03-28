import { useState } from 'react'
import { Link, Signal, Navigation } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Toggle, MapPlaceholder, Badge } from '../components/UI'

export default function LiveLocation() {
  const [sharing, setSharing] = useState(true)

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Live Location</h1>
          <p className="text-slate-500 text-sm">Share your real-time location with trusted contacts</p>
        </div>
        <Badge variant={sharing ? 'success' : 'warning'} dot>{sharing ? 'Sharing Active' : 'Paused'}</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <MapPlaceholder height="min-h-[420px]" />
        </div>
        <div className="lg:col-span-4 flex flex-col gap-5">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-display font-bold text-primary flex items-center gap-2">
                <Navigation className="w-4 h-4 text-secondary" /> Position
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-4">
                <CoordItem label="Latitude" value="28.6139° N" />
                <CoordItem label="Longitude" value="77.2090° E" />
                <CoordItem label="Accuracy" value="±15m" />
                <CoordItem label="Altitude" value="216m" />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="mb-6">
                <Toggle label="Live Sharing" description="Real-time broadcast to contacts" checked={sharing} onChange={() => setSharing(!sharing)} />
              </div>
              <div className="h-px bg-slate-100 mb-6" />
              <Button variant="teal" full>
                <Link className="w-[18px] h-[18px]" /> Generate Tracking Link
              </Button>
              <p className="text-[11px] text-slate-400 mt-3 text-center">Link expires after 24 hours</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CoordItem({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
      <span className="text-[11px] uppercase tracking-wider font-display font-semibold text-slate-400">{label}</span>
      <span className="text-sm font-mono font-medium text-primary">{value}</span>
    </div>
  )
}
