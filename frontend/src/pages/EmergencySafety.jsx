import { useState } from 'react'
import {
  AlertTriangle, Car, Flame, Heart, ChevronRight, ChevronLeft,
  Phone, MapPin, Shield, Eye, Users, Volume2, ArrowRight, X,
  Footprints, Siren, PhoneCall
} from 'lucide-react'
import { Card, CardBody, Button, Badge } from '../components/UI'
import { useNavigate } from 'react-router-dom'

const scenarios = [
  {
    id: 'followed',
    title: 'Being Followed',
    icon: Footprints,
    color: 'bg-accent',
    gradient: 'from-accent to-accent-dark',
    desc: 'Someone is following you on the street',
    steps: [
      { title: 'Stay Calm & Aware', detail: 'Don\'t panic. Change your walking pace and direction to confirm you\'re being followed. Cross the street or take a different turn.', icon: Eye, action: 'Observe surroundings' },
      { title: 'Head to a Safe Location', detail: 'Walk toward a crowded, well-lit area — a store, restaurant, or public building. Do NOT go home.', icon: MapPin, action: 'Find public space' },
      { title: 'Call Someone', detail: 'Call a friend, family member, or emergency contact. Stay on the phone and describe your location.', icon: PhoneCall, action: 'Call trusted contact' },
      { title: 'Activate SafeSphere SOS', detail: 'Use your SOS button to alert all emergency contacts with your live location.', icon: Siren, action: 'Trigger SOS alert' },
      { title: 'Contact Police if Needed', detail: 'If the person persists, call 100 (Police) or 112. Give them your exact location and description of the follower.', icon: Shield, action: 'Call 100 or 112' },
    ],
    callNumber: '100',
  },
  {
    id: 'unsafe-cab',
    title: 'Unsafe Cab Ride',
    icon: Car,
    color: 'bg-amber-500',
    gradient: 'from-amber-500 to-amber-600',
    desc: 'You feel unsafe in a ride-share or cab',
    steps: [
      { title: 'Note the Details', detail: 'Remember or photograph the license plate, driver\'s name, and vehicle details shown in your ride app.', icon: Eye, action: 'Record details' },
      { title: 'Share Your Ride', detail: 'Use the ride app\'s share feature or send your live location to a trusted contact via SafeSphere.', icon: Users, action: 'Share live location' },
      { title: 'Ask to Stop', detail: 'Politely but firmly ask the driver to stop at a public place — a gas station, police station, or busy intersection.', icon: MapPin, action: 'Request a stop' },
      { title: 'Call for Help', detail: 'If the driver refuses to stop, call 100 or 112 immediately. Keep the call active and share your location verbally.', icon: PhoneCall, action: 'Call emergency' },
      { title: 'Draw Attention', detail: 'If in danger, make noise — honk, yell, wave at passersby. Use your personal safety alarm if you have one.', icon: Volume2, action: 'Alert others' },
    ],
    callNumber: '100',
  },
  {
    id: 'medical',
    title: 'Medical Emergency',
    icon: Heart,
    color: 'bg-emerald-500',
    gradient: 'from-emerald-500 to-emerald-600',
    desc: 'Someone needs immediate medical help',
    steps: [
      { title: 'Assess the Situation', detail: 'Check for consciousness, breathing, and visible injuries. Don\'t move the person unless they\'re in immediate danger.', icon: Eye, action: 'Quick assessment' },
      { title: 'Call Ambulance', detail: 'Dial 108 or 102 for an ambulance. Give your exact address and describe the situation clearly.', icon: PhoneCall, action: 'Call 108' },
      { title: 'Provide First Aid', detail: 'If trained, perform CPR if needed. Apply pressure to bleeding wounds. Keep the person warm and calm.', icon: Heart, action: 'Basic first aid' },
      { title: 'Send Location', detail: 'Share your exact GPS location with the ambulance service and emergency contacts via SafeSphere.', icon: MapPin, action: 'Share location' },
      { title: 'Stay Until Help Arrives', detail: 'Don\'t leave the person alone. Keep talking to them. Note any symptoms or changes for the paramedics.', icon: Users, action: 'Stay & monitor' },
    ],
    callNumber: '108',
  },
  {
    id: 'fire',
    title: 'Fire Emergency',
    icon: Flame,
    color: 'bg-orange-500',
    gradient: 'from-orange-500 to-orange-600',
    desc: 'Fire or smoke detected in your area',
    steps: [
      { title: 'Alert Everyone', detail: 'Shout "FIRE!" to warn others. Activate fire alarms if available. Don\'t waste time collecting belongings.', icon: Volume2, action: 'Sound the alarm' },
      { title: 'Evacuate Immediately', detail: 'Use stairs, NEVER elevators. Stay low if there\'s smoke — crawl if necessary. Feel doors before opening.', icon: Footprints, action: 'Leave the building' },
      { title: 'Call Fire Department', detail: 'Dial 101 for the fire department once you\'re safely outside. Give them the building address and floor.', icon: PhoneCall, action: 'Call 101' },
      { title: 'Help Others Evacuate', detail: 'If safe, help children, elderly, or disabled persons evacuate. Do NOT re-enter the building.', icon: Users, action: 'Assist others' },
      { title: 'Meet at Assembly Point', detail: 'Go to the designated assembly point. Account for everyone who was in the building. Wait for firefighters.', icon: MapPin, action: 'Assembly point' },
    ],
    callNumber: '101',
  },
]

export default function EmergencySafety() {
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const scenario = scenarios.find(s => s.id === selectedScenario)

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Emergency Guide</h1>
          <p className="text-slate-500 text-sm">Step-by-step response for emergency scenarios</p>
        </div>
        <Badge variant="danger" dot>Stay Prepared</Badge>
      </div>

      {!selectedScenario ? (
        /* Scenario Selection */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {scenarios.map(s => (
            <button
              key={s.id}
              onClick={() => { setSelectedScenario(s.id); setCurrentStep(0) }}
              className="group bg-white rounded-2xl border border-slate-100/80 shadow-elevated p-6 text-left cursor-pointer card-hover relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-current/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10 flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center shadow-sm shrink-0`}>
                  <s.icon className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-display font-bold text-primary">{s.title}</h3>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-[11px] text-slate-400 font-mono">{s.steps.length} steps</span>
                    <span className="text-slate-200">·</span>
                    <span className="text-[11px] text-accent font-mono flex items-center gap-1">
                      <Phone className="w-3 h-3" /> {s.callNumber}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        /* Step-by-step Walkthrough */
        <div>
          {/* Back button + Scenario Header */}
          <button
            onClick={() => setSelectedScenario(null)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors mb-5 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" /> Back to scenarios
          </button>

          <div className={`relative rounded-2xl p-6 lg:p-8 text-white overflow-hidden mb-6 noise-overlay`}>
            <div className={`absolute inset-0 bg-gradient-to-br ${scenario.gradient}`} />
            <div className="absolute -top-10 -right-10 w-[200px] h-[200px] bg-white/10 rounded-full blur-3xl animate-float" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <scenario.icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold">{scenario.title}</h2>
                <p className="text-white/60 text-sm">{scenario.desc}</p>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2 mb-6">
            {scenario.steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  i <= currentStep ? `bg-gradient-to-r ${scenario.gradient}` : 'bg-slate-200'
                }`}
              />
            ))}
          </div>

          {/* Current Step Card */}
          <Card className="mb-6" hover={false}>
            <CardBody>
              <div className="flex items-start gap-4" key={currentStep}>
                <div className={`w-12 h-12 rounded-2xl ${scenario.color} flex items-center justify-center shrink-0 shadow-sm`}>
                  {(() => { const StepIcon = scenario.steps[currentStep].icon; return <StepIcon className="w-6 h-6 text-white" /> })()}
                </div>
                <div className="flex-1 animate-page-in" key={currentStep}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-display font-semibold text-slate-400 uppercase tracking-wide">Step {currentStep + 1} of {scenario.steps.length}</span>
                  </div>
                  <h3 className="text-lg font-display font-bold text-primary mb-2">{scenario.steps[currentStep].title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{scenario.steps[currentStep].detail}</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
                    <span className="text-xs font-medium text-slate-600">🎯 {scenario.steps[currentStep].action}</span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </Button>

            {currentStep < scenario.steps.length - 1 ? (
              <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                Next Step <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button variant="danger" onClick={() => setSelectedScenario(null)}>
                Done <Shield className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Quick SOS */}
          <div className="fixed bottom-20 lg:bottom-6 right-6 z-50">
            <button
              onClick={() => navigate('/sos')}
              className="flex items-center gap-2 px-5 py-3 bg-accent text-white rounded-full font-display font-semibold text-sm shadow-glow-accent hover:bg-accent-dark active:scale-[0.95] transition-all cursor-pointer animate-sos-glow"
            >
              <AlertTriangle className="w-4 h-4" /> SOS
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
