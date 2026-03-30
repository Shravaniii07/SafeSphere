import { Card, CardBody, MapPlaceholder } from '../components/UI'

export default function SafetyHeatmap() {
  return (
    <div className="stagger-children">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Safety Heatmap</h1>
        <p className="text-slate-500 text-sm">View safety levels across different areas</p>
      </div>

      <MapPlaceholder label="SAFETY HEATMAP COMPONENT" height="min-h-[460px]" />

      <Card className="mt-6">
        <CardBody>
          <h4 className="text-sm font-display font-bold text-primary mb-5">Risk Legend</h4>
          <div className="flex rounded-full overflow-hidden h-3 mb-5">
            <div className="flex-1 bg-gradient-to-r from-emerald-400 to-emerald-500" />
            <div className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500" />
            <div className="flex-1 bg-gradient-to-r from-accent-light to-accent" />
          </div>
          <div className="flex gap-8 flex-wrap">
            <LegendItem color="bg-emerald-500" label="Low Risk" desc="Safe zones" />
            <LegendItem color="bg-amber-500" label="Medium Risk" desc="Use caution" />
            <LegendItem color="bg-accent" label="High Risk" desc="Avoid if possible" />
          </div>
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
