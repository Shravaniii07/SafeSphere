import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, MapPin } from 'lucide-react'


/* ═══ Spinner ═══ */
function Spinner({ className = 'w-4 h-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* ═══ Card ═══ */
export function Card({ children, className = '', glass = false, hover = true }) {
  return (
    <div className={`${glass ? 'glass' : 'bg-[#111827]'} rounded-2xl border border-white/10 shadow-card overflow-hidden ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-white/10 flex items-center justify-between ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

/* ═══ Button ═══ */
export function Button({ children, variant = 'primary', size = 'md', className = '', onClick, full, disabled, isLoading, type = 'button' }) {
  const base = `inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ease-out active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`
  const sizes = { sm: 'px-3.5 py-1.5 text-[13px]', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-[15px]' }
  const variants = {
    primary: 'bg-[#E63946] hover:bg-[#c1121f] text-white shadow-[0_0_20px_rgba(230,57,70,0.2)] hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] hover:-translate-y-px',
    danger: 'bg-[#E63946] hover:bg-[#c1121f] text-white shadow-glow-red hover:-translate-y-px',
    teal: 'bg-[#457B9D] hover:bg-[#356180] text-white hover:-translate-y-px',
    outline: 'bg-transparent text-[#457B9D] border-2 border-[#457B9D] hover:bg-[#457B9D]/10 hover:-translate-y-px',
    'outline-danger': 'bg-transparent text-[#E63946] border-2 border-[#E63946]/40 hover:bg-[#E63946]/10',
    ghost: 'bg-transparent text-[#A8B2C1] hover:bg-white/5 hover:text-white',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled || isLoading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}>
      {isLoading ? <><Spinner /> <span>Please wait...</span></> : children}
    </button>
  )
}

/* ═══ Badge ═══ */
export function Badge({ children, variant = 'primary', className = '', dot }) {
  const variants = { primary: 'bg-[#1D3557] text-[#457B9D]', danger: 'bg-[#E63946]/10 text-[#E63946]', success: 'bg-[#06D6A0]/10 text-[#06D6A0]', warning: 'bg-[#FFB703]/10 text-[#FFB703]', info: 'bg-[#457B9D]/10 text-[#457B9D]' }
  const dotColors = { success: 'bg-[#06D6A0]', danger: 'bg-[#E63946]', warning: 'bg-[#FFB703]', info: 'bg-[#457B9D]', primary: 'bg-[#E63946]' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-[#E63946]'}`} />}
      {children}
    </span>
  )
}

/* ═══ Toggle ═══ */
export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group min-h-[44px]">
      <div>
        <span className="text-sm font-medium text-[#F1FAEE] group-hover:text-white transition-colors">{label}</span>
        {description && <p className="text-xs text-[#A8B2C1] mt-0.5">{description}</p>}
      </div>
      <div className="relative inline-block w-12 h-[26px] flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <span className="absolute inset-0 bg-[#1F2937] rounded-full transition-all duration-300 peer-checked:bg-[#E63946] peer-focus-visible:ring-2 peer-focus-visible:ring-[#E63946]/40" />
        <span className="absolute h-[20px] w-[20px] left-[3px] bottom-[3px] bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-[22px]" />
      </div>
    </label>
  )
}

/* ═══ Input ═══ */
export function Input({ label, type = 'text', placeholder, value, onChange, className = '', icon: Icon, error, ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-[#A8B2C1] font-heading tracking-wide">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A8B2C1]/60 pointer-events-none" />}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} {...rest}
          className={`w-full px-4 py-3 border rounded-xl bg-[#1F2937] text-[#F1FAEE] text-sm transition-all duration-200 hover:border-white/20 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 focus:outline-none placeholder-[#A8B2C1]/40 ${Icon ? 'pl-10' : ''} ${error ? 'border-[#E63946] ring-1 ring-[#E63946]/20' : 'border-white/10'}`} />
      </div>
      {error && <p className="text-xs text-[#E63946] mt-[-4px]">{error}</p>}
    </div>
  )
}

/* ═══ Select ═══ */
export function Select({ label, options = [], placeholder, value, onChange, className = '', error, ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-[#A8B2C1] font-heading tracking-wide">{label}</label>}
      <select value={value} onChange={onChange} {...rest}
        className={`w-full px-4 py-3 border rounded-xl bg-[#1F2937] text-[#F1FAEE] text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%23A8B2C1%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27M6%209l6%206%206-6%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center] pr-10 transition-all duration-200 hover:border-white/20 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 focus:outline-none ${error ? 'border-[#E63946] ring-1 ring-[#E63946]/20' : 'border-white/10'}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
      {error && <p className="text-xs text-[#E63946] mt-[-4px]">{error}</p>}
    </div>
  )
}

/* ═══ Textarea ═══ */
export function Textarea({ label, placeholder, value, onChange, rows = 4, className = '', ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-[#A8B2C1] font-heading tracking-wide">{label}</label>}
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} {...rest}
        className="w-full px-4 py-3 border border-white/10 rounded-xl bg-[#1F2937] text-[#F1FAEE] text-sm resize-y transition-all duration-200 hover:border-white/20 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 focus:outline-none placeholder-[#A8B2C1]/40" />
    </div>
  )
}

/* ═══ Modal ═══ */
export function Modal({ isOpen, onClose, title, children, footer }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      const handler = (e) => e.key === 'Escape' && onClose()
      window.addEventListener('keydown', handler)
      return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', handler) }
    }
  }, [isOpen, onClose])
  if (!isOpen) return null
  
  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 outline-none focus:outline-none" 
         style={{ animation: 'modal-overlay-in 0.2s ease' }}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-[#111827] rounded-2xl shadow-elevated border border-white/10 w-full max-w-[440px] p-8" 
           style={{ animation: 'modal-content-in 0.3s cubic-bezier(0.16,1,0.3,1)' }} 
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-bold text-[#F1FAEE]">{title}</h3>
          <button onClick={onClose} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-[#A8B2C1] hover:bg-white/10 hover:text-white transition-all cursor-pointer min-h-[44px] min-w-[44px]">
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
        <div className="mb-6">{children}</div>
        {footer && <div className="flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}


/* ═══ Map Placeholder ═══ */
export function MapPlaceholder({ label = 'MAP COMPONENT', height = 'min-h-[350px]' }) {
  return (
    <div className={`relative rounded-2xl border-2 border-dashed border-white/10 flex items-center justify-center flex-col gap-3 text-[#A8B2C1] overflow-hidden ${height}`}>
      <div className="absolute inset-0 geo-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#457B9D]/5 via-[#1D3557]/5 to-[#E63946]/5" />
      <MapPin className="w-12 h-12 opacity-30 relative z-10 animate-float" />
      <span className="text-sm font-heading font-medium relative z-10 tracking-wide">{label}</span>
    </div>
  )
}

/* ═══ Filter Button ═══ */
export function FilterButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer inline-flex items-center gap-2 min-h-[44px] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${active ? 'bg-[#E63946] text-white border-[#E63946] shadow-[0_0_20px_rgba(230,57,70,0.3)]' : 'bg-[#1F2937] text-[#A8B2C1] border-white/10 hover:border-[#E63946]/50 hover:text-white hover:shadow-sm'}`}>{children}</button>
  )
}

/* ═══ Stat Card ═══ */
export function StatCard({ value, label, change, up, icon: Icon }) {
  return (
    <div className="p-6 bg-[#111827] rounded-2xl border border-white/10 shadow-card card-interactive relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#E63946]/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="text-3xl font-heading font-bold text-[#F1FAEE] mb-1 tracking-tight">{value}</div>
        <div className="text-sm text-[#A8B2C1]">{label}</div>
        <div className={`text-xs font-semibold mt-3 ${up ? 'text-[#06D6A0]' : 'text-[#E63946]'}`}>{change}</div>
      </div>
    </div>
  )
}

/* ═══ Skeleton ═══ */
export function Skeleton({ className = '', count = 1 }) {
  return <>{Array.from({ length: count }).map((_, i) => <div key={i} className={`skeleton ${className}`} />)}</>
}

/* ═══ Empty State ═══ */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      {Icon && <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4"><Icon className="w-8 h-8 text-[#A8B2C1]" /></div>}
      <h4 className="text-base font-heading font-semibold text-[#F1FAEE] mb-1">{title}</h4>
      {description && <p className="text-sm text-[#A8B2C1] max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
