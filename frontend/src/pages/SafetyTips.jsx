import { useState } from 'react'
import { MapPin, Briefcase, Moon, Globe, Sparkles, ShieldAlert } from 'lucide-react'
import { Card, CardBody, Badge } from '../components/UI'

const tipsData = {
  traveling: [
    'Share your live location with someone you trust.',
    'Avoid empty or isolated places.',
    'Keep emergency contacts easily accessible.',
  ],
  workplace: [
    'Know all emergency exits in your building.',
    'Report suspicious behavior immediately.',
    'Avoid staying late alone when possible.',
  ],
  night: [
    'Stick to well-lit streets and public areas.',
    'Avoid distractions like phones while walking.',
    'Keep keys ready before reaching your door.',
  ],
  online: [
    'Never share personal information publicly.',
    'Use strong and unique passwords.',
    'Avoid clicking unknown links.',
  ],
}

const icons = {
  traveling: MapPin,
  workplace: Briefcase,
  night: Moon,
  online: Globe,
}

const categoryColors = {
  traveling: 'bg-secondary/10 text-secondary',
  workplace: 'bg-info/10 text-info',
  night: 'bg-accent/10 text-accent',
  online: 'bg-amber-500/10 text-amber-600',
}

export default function SafetyTips() {
  const [category, setCategory] = useState('traveling')
  const [generatedTip, setGeneratedTip] = useState('')
  const [location, setLocation] = useState('street')
  const [time, setTime] = useState('day')

  const generateTip = () => {
    let tip = ''

    if (location === 'street' && time === 'night') {
      tip = 'Stay in well-lit areas and avoid isolated streets.'
    } else if (location === 'bus') {
      tip = 'Sit near other passengers and stay alert.'
    } else if (location === 'office') {
      tip = 'Inform someone if you are working late.'
    } else {
      tip = 'Always stay aware and trust your instincts.'
    }

    setGeneratedTip(tip)
  }

  const ActiveIcon = icons[category]

  return (
    <div className="stagger-children">
      {/* Hero */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">
            Safety Tips
          </h1>
          <p className="text-slate-500 text-sm">
            Stay safe with smart tips tailored to your environment
          </p>
        </div>
        <Badge variant="info" dot>Situational</Badge>
      </div>

      {/* Category Buttons */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {Object.keys(tipsData).map((key) => {
          const Icon = icons[key]
          return (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[44px] capitalize ${
                category === key
                  ? 'bg-primary text-white border-primary shadow-[0_2px_8px_rgba(15,23,42,0.2)]'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary hover:shadow-sm'
              }`}
            >
              <Icon className="w-4 h-4" />
              {key}
            </button>
          )
        })}
      </div>

      {/* Tips Card */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-10 h-10 rounded-xl ${categoryColors[category]} flex items-center justify-center`}>
              <ActiveIcon className="w-5 h-5" />
            </div>
            <h2 className="text-[15px] font-display font-bold text-primary capitalize">
              {category} Tips
            </h2>
          </div>

          <div className="space-y-3">
            {tipsData[category].map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/80 border border-slate-100/60">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-display font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Smart Tip Generator */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <h2 className="text-[15px] font-display font-bold text-primary">
                Smart Tip Generator
              </h2>
              <p className="text-xs text-slate-400">Get personalized safety advice</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-3 mb-5">
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-primary font-medium focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer"
            >
              <option value="street">Street</option>
              <option value="bus">Bus</option>
              <option value="office">Office</option>
            </select>

            <select
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-primary font-medium focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20 transition-all cursor-pointer"
            >
              <option value="day">Day</option>
              <option value="night">Night</option>
            </select>

            <button
              onClick={generateTip}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-secondary-dark text-white text-sm font-display font-semibold shadow-glow-teal hover:shadow-lg active:scale-[0.96] transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate
            </button>
          </div>

          <div className={`p-4 rounded-xl border text-sm leading-relaxed transition-all duration-300 ${
            generatedTip
              ? 'bg-secondary/5 border-secondary/20 text-primary'
              : 'bg-slate-50 border-slate-100 text-slate-400'
          }`}>
            {generatedTip || 'Your personalized safety tip will appear here'}
          </div>
        </CardBody>
      </Card>

      {/* Emergency Note */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-accent/10 border border-accent/20">
        <ShieldAlert className="w-5 h-5 text-accent shrink-0" />
        <p className="text-sm font-medium text-accent">
          In case of danger, use the SOS feature immediately.
        </p>
      </div>
    </div>
  )
}
