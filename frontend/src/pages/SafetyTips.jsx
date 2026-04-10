import { useState } from 'react'
import { MapPin, Briefcase, Moon, Globe, Sparkles, ShieldAlert, Users } from 'lucide-react'
import { Card, CardBody, Badge } from '../components/UI'

const tipsData = {
  traveling: [
    'Share your live location with someone you trust via SafeSphere.',
    'Always check the license plate and driver photo before entering a commercial vehicle.',
    'Wait for public transport in well-lit, crowded areas.',
    'Keep your phone and valuables out of sight while walking in unfamiliar areas.',
    'Avoid wearing noise-canceling headphones when walking alone at night.',
  ],
  workplace: [
    'Know all emergency exits and alternate escape routes in your building.',
    'Report any unidentified individuals in "staff only" areas to security.',
    'Have a "buddy system" for leaving the office late at night.',
    'Keep your personal belongings in a locked drawer or locker.',
    'Trust your instincts; if a colleague or situation feels "off," report it.',
  ],
  night: [
    'Stick to primary, well-lit streets even if it makes your walk longer.',
    'Face oncoming traffic so you can see vehicles approaching.',
    'Hold your keys in your hand before you reach your door or car.',
    'If you think you are being followed, cross the street or head to a public place.',
    'Consider carrying a personal safety alarm or pepper spray where legal.',
  ],
  online: [
    'Enable Two-Factor Authentication (2FA) on all your sensitive accounts.',
    'Be cautious of social engineering; never share passwords or OTPs over the phone.',
    'Check your privacy settings regularly on social media platforms.',
    'Use a VPN when accessing sensitive information on public Wi-Fi.',
    'Think twice before sharing your current location in "real-time" on stories.',
  ],
  dating: [
    'Always meet in a public place for the first few dates.',
    'Tell a friend who you are meeting, where you are going, and when you expect to be back.',
    'Arrange your own transportation to and from the date.',
    'Keep your drink and food in your sight at all times.',
    'If you feel uncomfortable, don\'t feel obligated to stay. Make an excuse and leave.',
  ],
  home: [
    'Ensure all entry points (doors and windows) have working locks.',
    'Outdoor lighting should be motion-activated to deter intruders.',
    'Never open the door to strangers without verifying their identity.',
    'If you live alone, avoid advertising it on social media or your mailbox.',
    'Have an emergency "go-bag" ready with essentials in case of fire or natural disaster.',
  ],
}

const icons = {
  traveling: MapPin,
  workplace: Briefcase,
  night: Moon,
  online: Globe,
  dating: Users,
  home: Sparkles,
}

const categoryColors = {
  traveling: 'bg-secondary/10 text-secondary',
  workplace: 'bg-info/10 text-info',
  night: 'bg-accent/10 text-accent',
  online: 'bg-amber-500/10 text-amber-600',
  dating: 'bg-rose-500/10 text-rose-500',
  home: 'bg-emerald-500/10 text-emerald-600',
}

export default function SafetyTips() {
  const [category, setCategory] = useState('traveling')
  const [generatedTip, setGeneratedTip] = useState('')
  const [location, setLocation] = useState('street')
  const [time, setTime] = useState('day')

  const generateTip = () => {
    let tip = ''

    if (location === 'street' && time === 'night') {
      tip = 'Walk with confidence, stay in well-lit areas, and keep your hands free (avoid using your phone).'
    } else if (location === 'bus' && time === 'night') {
      tip = 'Sit as close to the driver as possible and stay awake. Know your stop in advance.'
    } else if (location === 'office' && time === 'night') {
      tip = 'Inform building security you are working late and ask for an escort to your car if needed.'
    } else if (location === 'bus' && time === 'day') {
      tip = 'Keep your bag in front of you and be aware of pickpockets in crowded areas.'
    } else if (location === 'street' && time === 'day') {
      tip = 'Stay aware of your surroundings and avoid using both earbuds even during the day.'
    } else {
      tip = 'Trust your intuition. If a situation feels wrong, remove yourself from it immediately.'
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
