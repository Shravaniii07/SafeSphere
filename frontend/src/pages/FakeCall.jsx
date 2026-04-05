import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Phone, PhoneOff, PhoneIncoming, Mic, MicOff, Volume2, VolumeX,
  User, Clock, ChevronRight, Timer, X, Settings
} from 'lucide-react'
import { Card, CardBody, Button, Badge } from '../components/UI'
import toast from 'react-hot-toast'

const presets = [
  { name: 'Mom', avatar: '👩', color: 'from-accent to-accent-dark' },
  { name: 'Dad', avatar: '👨', color: 'from-primary to-primary-light' },
  { name: 'Boss', avatar: '👔', color: 'from-info to-indigo-600' },
  { name: 'Unknown', avatar: '❓', color: 'from-slate-500 to-slate-600' },
]

const delays = [
  { label: '10 sec', value: 10 },
  { label: '30 sec', value: 30 },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
]

// Simple Web Audio ringtone generator
function createRingtone(audioCtx) {
  const osc1 = audioCtx.createOscillator()
  const osc2 = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()

  osc1.type = 'sine'
  osc1.frequency.value = 440
  osc2.type = 'sine'
  osc2.frequency.value = 480

  osc1.connect(gainNode)
  osc2.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  gainNode.gain.value = 0.15

  return { osc1, osc2, gainNode }
}

export default function FakeCall() {
  const [callerName, setCallerName] = useState('Mom')
  const [customName, setCustomName] = useState('')
  const [selectedDelay, setSelectedDelay] = useState(30)
  const [phase, setPhase] = useState('setup') // setup | countdown | ringing | connected | ended
  const [countdown, setCountdown] = useState(0)
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeaker, setIsSpeaker] = useState(false)
  const audioRef = useRef(null)
  const countdownRef = useRef(null)
  const callTimerRef = useRef(null)
  const ringIntervalRef = useRef(null)
  const oscStopTimersRef = useRef([]) // track pending osc stop-timers

  const displayName = customName || callerName

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(countdownRef.current)
      clearInterval(callTimerRef.current)
      clearInterval(ringIntervalRef.current)
      stopRingtone()
    }
  }, [])

  const startRingtone = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      audioRef.current = audioCtx

      const playRing = () => {
        // Guard: don't play if context is already closed
        if (audioCtx.state === 'closed') return
        const { osc1, osc2, gainNode } = createRingtone(audioCtx)
        osc1.start()
        osc2.start()
        // Track the stop-timer so we can cancel it on stopRingtone
        const timerId = setTimeout(() => {
          try { osc1.stop() } catch { /* already stopped */ }
          try { osc2.stop() } catch { /* already stopped */ }
          // Remove from tracking array
          oscStopTimersRef.current = oscStopTimersRef.current.filter(id => id !== timerId)
        }, 1000)
        oscStopTimersRef.current.push(timerId)
      }

      playRing()
      ringIntervalRef.current = setInterval(playRing, 2500)
    } catch {
      // Audio not available
    }
  }, [])

  const stopRingtone = useCallback(() => {
    // 1. Stop the ring interval so no new oscillators are created
    clearInterval(ringIntervalRef.current)
    ringIntervalRef.current = null
    // 2. Cancel all pending oscillator stop-timers
    oscStopTimersRef.current.forEach(id => clearTimeout(id))
    oscStopTimersRef.current = []
    // 3. Close and discard the AudioContext
    if (audioRef.current && audioRef.current.state !== 'closed') {
      audioRef.current.close().catch(() => {})
      audioRef.current = null
    }
  }, [])

  const scheduleCall = () => {
    setPhase('countdown')
    setCountdown(selectedDelay)

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          setPhase('ringing')
          startRingtone()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancelCall = () => {
    clearInterval(countdownRef.current)
    clearInterval(callTimerRef.current)
    stopRingtone()
    setPhase('setup')
    setCountdown(0)
    setCallDuration(0)
  }

  const acceptCall = () => {
    stopRingtone()
    setPhase('connected')
    setCallDuration(0)
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1)
    }, 1000)
  }

  const declineCall = () => {
    stopRingtone()
    setPhase('ended')
    setTimeout(() => setPhase('setup'), 2000)
  }

  const endCall = () => {
    clearInterval(callTimerRef.current)
    callTimerRef.current = null
    stopRingtone() // safety: ensure any residual audio is stopped
    setPhase('ended')
    toast.success('Call ended')
    setTimeout(() => {
      setPhase('setup')
      setCallDuration(0)
    }, 1500)
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const selectedPreset = presets.find(p => p.name === callerName)

  // ── RINGING SCREEN ──
  if (phase === 'ringing') {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-between py-16 px-8 fake-call-bg" style={{ animation: 'modal-overlay-in 0.3s ease' }}>
        <div className="text-center animate-page-in">
          <p className="text-white/50 text-sm font-display mb-2">Incoming Call</p>
          {/* Rings */}
          <div className="relative w-28 h-28 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-sos-ring" />
            <div className="absolute inset-0 rounded-full bg-emerald-400/15 animate-sos-ring animate-sos-ring-2" />
            <div className="absolute inset-0 rounded-full bg-emerald-400/10 animate-sos-ring animate-sos-ring-3" />
            <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-5xl shadow-2xl border border-white/10">
              {selectedPreset?.avatar || '👤'}
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-white tracking-tight mb-1">{displayName}</h2>
          <p className="text-white/40 text-sm font-mono animate-pulse-status">Mobile · Ringing...</p>
        </div>

        <div className="flex items-center gap-12 mb-8">
          {/* Decline */}
          <button
            onClick={declineCall}
            className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white shadow-glow-accent active:scale-90 transition-all cursor-pointer"
          >
            <PhoneOff className="w-7 h-7" />
          </button>
          {/* Accept */}
          <button
            onClick={acceptCall}
            className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] active:scale-90 transition-all cursor-pointer animate-pulse"
          >
            <Phone className="w-7 h-7" />
          </button>
        </div>
      </div>
    )
  }

  // ── CONNECTED SCREEN ──
  if (phase === 'connected') {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-between py-16 px-8" style={{ background: 'linear-gradient(180deg, #065F46 0%, #064E3B 50%, #022C22 100%)', animation: 'modal-overlay-in 0.3s ease' }}>
        <div className="text-center animate-page-in">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 flex items-center justify-center text-4xl mx-auto mb-5 shadow-xl border border-emerald-500/30">
            {selectedPreset?.avatar || '👤'}
          </div>
          <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-1">{displayName}</h2>
          <p className="text-emerald-300/80 text-sm font-mono">{formatTime(callDuration)}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <CallButton icon={isMuted ? MicOff : Mic} label={isMuted ? 'Unmute' : 'Mute'} active={isMuted} onClick={() => setIsMuted(!isMuted)} />
          <CallButton icon={isSpeaker ? Volume2 : VolumeX} label="Speaker" active={isSpeaker} onClick={() => setIsSpeaker(!isSpeaker)} />
          <CallButton icon={User} label="Contact" />
        </div>

        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white shadow-glow-accent active:scale-90 transition-all cursor-pointer mb-4"
        >
          <PhoneOff className="w-7 h-7" />
        </button>
      </div>
    )
  }

  // ── ENDED SCREEN ──
  if (phase === 'ended') {
    return (
      <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center fake-call-bg" style={{ animation: 'modal-overlay-in 0.2s ease' }}>
        <div className="text-center animate-scale-pop">
          <PhoneOff className="w-12 h-12 text-accent mx-auto mb-3" />
          <h2 className="text-xl font-display font-bold text-white">Call Ended</h2>
          <p className="text-white/40 text-sm mt-1">{displayName} · {formatTime(callDuration)}</p>
        </div>
      </div>
    )
  }

  // ── SETUP / COUNTDOWN SCREEN ──
  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Fake Call</h1>
          <p className="text-slate-500 text-sm">Simulate an incoming call to exit uncomfortable situations</p>
        </div>
        <Badge variant="info" dot>Safety Tool</Badge>
      </div>

      {phase === 'countdown' ? (
        /* Countdown View */
        <Card className="mb-6" hover={false}>
          <CardBody>
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-secondary to-secondary-dark flex items-center justify-center mx-auto mb-4 shadow-glow-teal">
                <PhoneIncoming className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-lg font-display font-bold text-primary mb-1">Call Scheduled</h3>
              <p className="text-sm text-slate-500 mb-5">
                <span className="font-semibold text-primary">{displayName}</span> will call in...
              </p>
              <div className="text-5xl font-display font-bold text-secondary mb-6 tabular-nums">
                {formatTime(countdown)}
              </div>
              <div className="w-full max-w-xs mx-auto bg-slate-100 rounded-full h-2 mb-6 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-secondary to-secondary-dark rounded-full transition-all duration-1000 ease-linear"
                  style={{ width: `${((selectedDelay - countdown) / selectedDelay) * 100}%` }}
                />
              </div>
              <Button variant="outline" onClick={cancelCall}>
                <X className="w-4 h-4" /> Cancel Call
              </Button>
            </div>
          </CardBody>
        </Card>
      ) : (
        /* Setup View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Caller Presets */}
            <Card>
              <CardBody>
                <h4 className="text-sm font-display font-bold text-primary mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-secondary" /> Choose Caller
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  {presets.map(p => (
                    <button
                      key={p.name}
                      onClick={() => { setCallerName(p.name); setCustomName('') }}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        callerName === p.name && !customName
                          ? 'border-secondary bg-secondary-50 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.color} flex items-center justify-center text-2xl shadow-sm`}>
                        {p.avatar}
                      </div>
                      <span className="text-sm font-medium text-primary">{p.name}</span>
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Or enter a custom name..."
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400"
                  />
                </div>
              </CardBody>
            </Card>

            {/* Delay Timer */}
            <Card>
              <CardBody>
                <h4 className="text-sm font-display font-bold text-primary mb-4 flex items-center gap-2">
                  <Timer className="w-4 h-4 text-secondary" /> Call Delay
                </h4>
                <div className="grid grid-cols-5 gap-2">
                  {delays.map(d => (
                    <button
                      key={d.value}
                      onClick={() => setSelectedDelay(d.value)}
                      className={`py-3 rounded-xl text-sm font-display font-medium border-2 transition-all cursor-pointer ${
                        selectedDelay === d.value
                          ? 'border-secondary bg-secondary-50 text-secondary shadow-sm'
                          : 'border-slate-100 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </CardBody>
            </Card>

            {/* Schedule Button */}
            <Button size="lg" full onClick={scheduleCall}>
              <PhoneIncoming className="w-5 h-5" /> Schedule Fake Call
            </Button>
          </div>

          {/* Preview */}
          <div className="lg:col-span-5">
            <Card>
              <CardBody>
                <h4 className="text-sm font-display font-bold text-primary mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-slate-400" /> Preview
                </h4>
                <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 geo-pattern opacity-5" />
                  <div className="relative z-10">
                    <p className="text-white/40 text-xs mb-3">Incoming Call</p>
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${selectedPreset?.color || 'from-slate-600 to-slate-700'} flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg`}>
                      {selectedPreset?.avatar || '👤'}
                    </div>
                    <h3 className="text-lg font-display font-bold text-white">{displayName}</h3>
                    <p className="text-white/30 text-xs font-mono mt-0.5">Mobile · Ringing...</p>
                    <div className="flex items-center justify-center gap-6 mt-5">
                      <div className="w-10 h-10 rounded-full bg-accent/80 flex items-center justify-center">
                        <PhoneOff className="w-4 h-4 text-white" />
                      </div>
                      <div className="w-10 h-10 rounded-full bg-emerald-500/80 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <p className="text-white/20 text-[10px] mt-4 font-mono">Rings in {selectedDelay}s</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center">This simulates a realistic incoming call to help you leave uncomfortable situations.</p>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

function CallButton({ icon: Icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 cursor-pointer group">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${active ? 'bg-white text-emerald-800' : 'bg-white/10 text-white hover:bg-white/20'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs text-white/60">{label}</span>
    </button>
  )
}
