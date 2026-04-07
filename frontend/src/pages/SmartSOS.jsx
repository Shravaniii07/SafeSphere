import { useState, useEffect, useRef } from 'react'
import { AlertTriangle, Phone, MapPin, Wifi } from 'lucide-react'
import { Button, Modal } from '../components/UI'
import toast from 'react-hot-toast'
import api from '../api/api'

function HeartbeatLine() {
  return (
    <svg viewBox="0 0 200 40" className="w-48 h-8 text-[#E63946]/40">
      <path d="M0 20 L40 20 L50 8 L60 32 L70 12 L80 28 L90 20 L200 20"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
        style={{ strokeDasharray: 200, animation: 'heartbeat-line 2s linear infinite' }} />
    </svg>
  )
}

export default function SmartSOS() {
  const [modalOpen, setModalOpen] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const intervalRef = useRef(null)
  const [bgFlash, setBgFlash] = useState(false)

  const triggerSOSAlert = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      try {
        await api.post('/api/sos/trigger', { 
          location: { lat: latitude, lng: longitude } 
        })
        toast.success('SOS alert sent! Contacts notified. 🚨')
        setModalOpen(false)
      } catch (err) {
        toast.error(err.response?.data?.message || err.message)
      }
    }, () => toast.error('Unable to get location'))
  }

  useEffect(() => {
    if (countdown === null) return
    if (countdown === 0) {
      clearInterval(intervalRef.current)
      setCountdown(null)
      setModalOpen(true)
      return
    }
    setBgFlash(true)
    const t = setTimeout(() => setBgFlash(false), 300)
    return () => clearTimeout(t)
  }, [countdown])

  const startCountdown = () => {
    setCountdown(3)
    intervalRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); return 0 }
        return prev - 1
      })
    }, 1000)
  }

  const cancelCountdown = () => {
    clearInterval(intervalRef.current)
    setCountdown(null)
  }

  const isCountingDown = countdown !== null && countdown > 0

  return (
    <>
      {/* Red pulse background */}
      <div className={`fixed inset-0 pointer-events-none z-0 bg-radial-[at_50%_50%] from-[#E63946]/10 to-transparent ${bgFlash ? 'animate-sos-flash' : 'animate-sos-bg'}`} />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-[65vh] gap-10 stagger-children">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E63946]/10 rounded-full text-[#E63946] text-xs font-heading font-semibold mb-4 border border-[#E63946]/20">
            <Wifi className="w-3 h-3" /> {isCountingDown ? 'SENDING IN...' : 'EMERGENCY MODE READY'}
          </div>
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-[#F1FAEE] tracking-tight mb-2">Emergency SOS</h1>
          <p className="text-[#A8B2C1] max-w-sm mx-auto">Press the button to immediately alert your emergency contacts with your location</p>
        </div>

        {/* SOS Button — Massive circular with pulsing red ring */}
        <div className="relative flex items-center justify-center">
          <div className={`absolute w-[240px] h-[240px] rounded-full border-2 border-[#E63946]/30 opacity-0 ${isCountingDown ? 'animate-sos-ring-fast' : 'animate-sos-ring'}`} />
          <div className={`absolute w-[240px] h-[240px] rounded-full border-2 border-[#E63946]/20 opacity-0 ${isCountingDown ? 'animate-sos-ring-fast' : 'animate-sos-ring'} animate-sos-ring-2`} />
          <div className={`absolute w-[240px] h-[240px] rounded-full border-2 border-[#E63946]/10 opacity-0 ${isCountingDown ? 'animate-sos-ring-fast' : 'animate-sos-ring'} animate-sos-ring-3`} />
          <button
            onClick={isCountingDown ? cancelCountdown : startCountdown}
            className={`relative z-10 w-[200px] h-[200px] rounded-full bg-gradient-to-br from-[#E63946] via-[#E63946] to-[#c1121f] text-white flex flex-col items-center justify-center gap-3 shadow-[0_0_40px_rgba(230,57,70,0.5)] cursor-pointer transition-all duration-300 ${isCountingDown ? 'scale-110 shadow-[0_0_80px_rgba(230,57,70,0.7)]' : 'hover:scale-[1.04] hover:shadow-[0_0_60px_rgba(230,57,70,0.6)] active:scale-[0.96]'}`}>
            {isCountingDown ? (
              <span className="text-7xl font-heading font-bold animate-scale-pop" key={countdown}>{countdown}</span>
            ) : (
              <>
                <AlertTriangle className="w-10 h-10" />
                <span className="text-xl font-heading font-bold tracking-[0.15em]">HOLD FOR SOS</span>
              </>
            )}
          </button>
        </div>

        {/* Cancel / Actions */}
        {isCountingDown ? (
          <p className="text-[#E63946] font-heading font-bold text-sm tracking-wide animate-pulse-status cursor-pointer" onClick={cancelCountdown}>TAP TO CANCEL</p>
        ) : (
          <div className="flex gap-4 flex-wrap justify-center">
            <Button variant="outline" size="lg" onClick={() => { window.location.href = 'tel:100'; toast.success('Calling emergency contacts...') }}><Phone className="w-[18px] h-[18px]" /> Call Contacts</Button>
            <Button variant="outline" size="lg" onClick={() => {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (pos) => {
                    const { latitude, longitude } = pos.coords
                    const url = `https://maps.google.com/?q=${latitude},${longitude}`
                    navigator.clipboard.writeText(url).then(() => toast.success('Location copied to clipboard!')).catch(() => toast.success(`Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`))
                  },
                  () => toast.error('Unable to get location. Please enable GPS.')
                )
              } else {
                toast.error('Geolocation is not supported by your browser.')
              }
            }}><MapPin className="w-[18px] h-[18px]" /> Send Location</Button>
          </div>
        )}

        {/* Heartbeat */}
        <HeartbeatLine />
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="⚠️ Confirm SOS Alert"
        footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button variant="danger" onClick={triggerSOSAlert}>Send SOS Alert</Button></>}>
        <div className="p-4 bg-[#E63946]/10 rounded-xl border border-[#E63946]/20 mb-4">
          <p className="text-sm text-[#E63946] font-medium">This action cannot be undone easily.</p>
        </div>
        <p className="text-[#A8B2C1] text-sm leading-relaxed">
          This will immediately alert <strong className="text-[#F1FAEE]">all your emergency contacts</strong> with your current location. They will receive notifications via Email and in-app alerts.
        </p>
      </Modal>
    </>
  )
}
