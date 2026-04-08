import { useState } from 'react'
import {
  Shield, ShieldCheck, Smartphone, Eye, Car, MapPin, Download, Phone,
  ChevronRight, Heart, Wifi, Lock, Users, BookOpen, AlertTriangle, Zap
} from 'lucide-react'

const helplines = [
  { name: 'Women Helpline', number: '1091', icon: Phone, color: 'bg-[#EC4899]', desc: '24/7 women safety assistance' },
  { name: 'Police', number: '100', icon: Shield, color: 'bg-secondary', desc: 'Emergency police response' },
  { name: 'NCW Helpline', number: '7827-170-170', icon: Users, color: 'bg-accent', desc: 'National Commission for Women' },
  { name: 'Ambulance', number: '102', icon: Heart, color: 'bg-success', desc: 'Medical emergency' },
  { name: 'One Stop Centre', number: '181', icon: ShieldCheck, color: 'bg-[#DB2777]', desc: 'Support for women in distress' },
  { name: 'Cyber Crime', number: '1930', icon: Wifi, color: 'bg-warning', desc: 'Online harassment & fraud' },
]

const tabs = [
  { id: 'selfdefense', label: 'Self-Defense', icon: Zap },
  { id: 'travel', label: 'Safe Travel', icon: Car },
  { id: 'digital', label: 'Digital Safety', icon: Lock },
]

const selfDefenseTips = [
  { title: 'Stay Aware of Surroundings', desc: 'Keep your head up and avoid distractions. Walk confidently and be mindful of exits.', icon: Eye },
  { title: 'Trust Your Instincts', desc: 'If a situation feels wrong, leave immediately. Your gut feeling is your best alarm.', icon: AlertTriangle },
  { title: 'Carry Personal Safety Tools', desc: 'Pepper spray, whistle, or personal alarm. Keep them easily accessible, not buried in your bag.', icon: Shield },
  { title: 'Learn Basic Self-Defense', desc: 'Know vulnerable points: eyes, nose, throat, groin, knee. Simple moves can create escape opportunities.', icon: Zap },
  { title: 'Keep Someone Informed', desc: 'Always tell someone where you\'re going and when you expect to return.', icon: Users },
  { title: 'Use SafeSphere SOS', desc: 'Keep the app ready. One tap sends your location to all emergency contacts instantly.', icon: Smartphone },
]

const travelTips = [
  { title: 'Share Live Location', desc: 'Always share your real-time location with trusted contacts when traveling alone.', icon: MapPin },
  { title: 'Verify Ride Details', desc: 'Check driver name, car model, and license plate before entering any ride-share vehicle.', icon: Car },
  { title: 'Sit Behind the Driver', desc: 'Gives you control of the rear doors and keeps you out of the driver\'s direct reach.', icon: Users },
  { title: 'Avoid Isolated Areas', desc: 'Stick to well-lit, populated routes. Avoid shortcuts through deserted areas at night.', icon: Eye },
  { title: 'Keep Emergency Contacts Ready', desc: 'Save local emergency numbers and keep your phone charged before heading out.', icon: Phone },
  { title: 'Plan Your Route', desc: 'Use SafeSphere\'s safety map to check route safety scores before you travel.', icon: BookOpen },
]

const digitalTips = [
  { title: 'Review Privacy Settings', desc: 'Regularly audit app permissions, especially location access. Disable what you don\'t need.', icon: Lock },
  { title: 'Beware of Social Engineering', desc: 'Don\'t share personal information online. Avoid posting real-time locations on social media.', icon: AlertTriangle },
  { title: 'Use Strong Passwords', desc: 'Use unique passwords for each account. Enable 2FA wherever possible.', icon: Shield },
  { title: 'Secure Your Devices', desc: 'Keep your phone locked with biometrics. Enable remote wipe for lost devices.', icon: Smartphone },
  { title: 'Know the Reporting Channels', desc: 'Report cyber harassment to cybercrime.gov.in or call 1930.', icon: Phone },
  { title: 'Safe Online Dating', desc: 'Meet in public places. Video call before meeting. Share date details with a friend.', icon: Users },
]

const tipsByTab = { selfdefense: selfDefenseTips, travel: travelTips, digital: digitalTips }

export default function WomenSafety() {
  const [activeTab, setActiveTab] = useState('selfdefense')

  const downloadChecklist = () => {
    const content = `SafeSphere Women's Safety Checklist\n${'='.repeat(40)}\n\n` +
      'Before Going Out:\n' +
      '□ Share live location with a trusted contact\n' +
      '□ Phone fully charged\n' +
      '□ SafeSphere SOS app ready\n' +
      '□ Emergency contacts saved\n' +
      '□ Personal safety tool accessible\n' +
      '□ Route planned and shared\n\n' +
      'While Traveling:\n' +
      '□ Stay in well-lit, populated areas\n' +
      '□ Verify ride-share details\n' +
      '□ Keep belongings close\n' +
      '□ Stay aware of surroundings\n\n' +
      'Digital Safety:\n' +
      '□ Privacy settings reviewed\n' +
      '□ Strong passwords set\n' +
      '□ 2FA enabled\n' +
      '□ Location sharing limited\n\n' +
      'Emergency Numbers:\n' +
      'Women Helpline: 1091\n' +
      'Police: 100\n' +
      'Ambulance: 102\n' +
      'NCW: 7827-170-170\n'

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'SafeSphere_Safety_Checklist.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="stagger-children">
      {/* Hero — Pink Theme */}
      <div className="relative rounded-2xl p-8 lg:p-10 text-white overflow-hidden mb-8 noise-overlay">
        <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899] via-[#DB2777] to-[#9D174D]" />
        <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-overlay-strong rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 left-20 w-[200px] h-[200px] bg-[#F472B6]/20 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute inset-0 geo-pattern opacity-10" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-text" />
              <span className="text-text text-sm font-heading font-semibold tracking-wide uppercase">Safety Resources</span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-heading font-bold mb-2 tracking-tight">Women's Safety Guide</h2>
            <p className="text-muted text-sm max-w-md">Empowering you with knowledge, tools, and resources to stay safe in every situation.</p>
          </div>
          <button
            onClick={downloadChecklist}
            className="inline-flex items-center gap-2 px-5 py-3 bg-white/15 backdrop-blur-sm border border-white/20 rounded-xl text-white font-heading font-semibold text-sm hover:bg-white/25 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4" /> Download Checklist
          </button>
        </div>
      </div>

      {/* Tabs — Pink active state */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[44px] ${
              activeTab === tab.id
                ? 'bg-[#EC4899] text-white border-[#EC4899] shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                : 'bg-surface text-muted border-border hover:border-[#EC4899]/40 hover:text-[#F472B6] hover:shadow-sm'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tips Grid — Pink accent cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tipsByTab[activeTab].map((tip, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden card-hover p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#EC4899]/10 flex items-center justify-center shrink-0">
                <tip.icon className="w-5 h-5 text-[#EC4899]" />
              </div>
              <div>
                <h4 className="text-sm font-heading font-bold text-text mb-1">{tip.title}</h4>
                <p className="text-xs text-muted leading-relaxed">{tip.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Helpline Numbers */}
      <div className="mb-4">
        <h3 className="text-lg font-heading font-bold text-text mb-1">Emergency Helplines</h3>
        <p className="text-sm text-muted mb-5">Tap any number to call directly</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {helplines.map((h, i) => (
          <a
            key={i}
            href={`tel:${h.number}`}
            className="group flex items-center gap-4 p-4 bg-surface rounded-xl border border-border shadow-card card-hover no-underline"
          >
            <div className={`w-12 h-12 rounded-xl ${h.color} flex items-center justify-center shadow-sm shrink-0`}>
              <h.icon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-heading font-bold text-text">{h.name}</div>
              <div className="text-xs text-muted">{h.desc}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-heading font-bold text-[#EC4899]">{h.number}</div>
              <ChevronRight className="w-4 h-4 text-muted/40 ml-auto group-hover:text-[#EC4899] group-hover:translate-x-1 transition-all" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
