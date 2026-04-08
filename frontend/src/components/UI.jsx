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
    <div className={`${glass ? 'glass' : 'bg-surface'} rounded-2xl border border-border shadow-card overflow-hidden ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-border flex items-center justify-between ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

/* ═══ Button ═══ */
export function Button({ children, variant = 'primary', size = 'md', className = '', onClick, full, disabled, isLoading, type = 'button' }) {
  const base = `inline-flex items-center justify-center gap-2 font-heading font-semibold rounded-xl whitespace-nowrap cursor-pointer transition-all duration-200 ease-out active:scale-95 active:duration-75 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`
  const sizes = { sm: 'px-3.5 py-1.5 text-[13px]', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-[15px]' }
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white shadow-[0_0_20px_rgba(230,57,70,0.2)] hover:shadow-[0_0_30px_rgba(230,57,70,0.4)] hover:-translate-y-px',
    danger: 'bg-primary hover:bg-primary-dark text-white shadow-glow-red hover:-translate-y-px',
    teal: 'bg-accent hover:bg-accent-dark text-white hover:-translate-y-px',
    outline: 'bg-transparent text-accent border-2 border-accent hover:bg-accent/10 hover:-translate-y-px',
    'outline-danger': 'bg-transparent text-primary border-2 border-primary/40 hover:bg-primary/10',
    ghost: 'bg-transparent text-muted hover:bg-overlay-strong hover:text-text',
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
  const variants = { primary: 'bg-secondary/10 text-accent', danger: 'bg-primary/10 text-primary', success: 'bg-success/10 text-success', warning: 'bg-warning/10 text-warning', info: 'bg-accent/10 text-accent' }
  const dotColors = { success: 'bg-success', danger: 'bg-primary', warning: 'bg-warning', info: 'bg-accent', primary: 'bg-primary' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-primary'}`} />}
      {children}
    </span>
  )
}

/* ═══ Toggle ═══ */
export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group min-h-[44px]">
      <div>
        <span className="text-sm font-medium text-text group-hover:text-text transition-colors">{label}</span>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      <div className="relative inline-block w-12 h-[26px] flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <span className="absolute inset-0 bg-surface2 rounded-full transition-all duration-300 peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-primary/40" />
        <span className="absolute h-[20px] w-[20px] left-[3px] bottom-[3px] bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-[22px]" />
      </div>
    </label>
  )
}

/* ═══ Input ═══ */
export function Input({ label, type = 'text', placeholder, value, onChange, className = '', icon: Icon, error, ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-muted font-heading tracking-wide">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/60 pointer-events-none" />}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} {...rest}
          className={`w-full px-4 py-3 border rounded-xl bg-surface2 text-text text-sm transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-muted/40 ${Icon ? 'pl-10' : ''} ${error ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`} />
      </div>
      {error && <p className="text-xs text-primary mt-[-4px]">{error}</p>}
    </div>
  )
}

/* ═══ Select ═══ */
export function Select({ label, options = [], placeholder, value, onChange, className = '', error, ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-muted font-heading tracking-wide">{label}</label>}
      <select value={value} onChange={onChange} {...rest}
        className={`w-full px-4 py-3 border rounded-xl bg-surface2 text-text text-sm appearance-none bg-no-repeat bg-[right_14px_center] pr-10 transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none ${error ? 'border-primary ring-1 ring-primary/20' : 'border-border'}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
      {error && <p className="text-xs text-primary mt-[-4px]">{error}</p>}
    </div>
  )
}

/* ═══ Textarea ═══ */
export function Textarea({ label, placeholder, value, onChange, rows = 4, className = '', ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-muted font-heading tracking-wide">{label}</label>}
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} {...rest}
        className="w-full px-4 py-3 border border-border rounded-xl bg-surface2 text-text text-sm resize-y transition-all duration-200 hover:border-muted/30 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder-muted/40" />
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
      <div className="relative bg-surface rounded-2xl shadow-elevated border border-border w-full max-w-[440px] p-8" 
           style={{ animation: 'modal-content-in 0.3s cubic-bezier(0.16,1,0.3,1)' }} 
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-bold text-text">{title}</h3>
          <button onClick={onClose} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:bg-overlay-strong hover:text-text transition-all cursor-pointer min-h-[44px] min-w-[44px]">
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
    <div className={`relative rounded-2xl border-2 border-dashed border-border flex items-center justify-center flex-col gap-3 text-muted overflow-hidden ${height}`}>
      <div className="absolute inset-0 geo-pattern opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-secondary/5 to-primary/5" />
      <MapPin className="w-12 h-12 opacity-30 relative z-10 animate-float" />
      <span className="text-sm font-heading font-medium relative z-10 tracking-wide">{label}</span>
    </div>
  )
}

/* ═══ Filter Button ═══ */
export function FilterButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer inline-flex items-center gap-2 min-h-[44px] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${active ? 'bg-primary text-white border-primary shadow-[0_0_20px_rgba(230,57,70,0.3)]' : 'bg-surface2 text-muted border-border hover:border-primary/50 hover:text-text hover:shadow-sm'}`}>{children}</button>
  )
}

/* ═══ Stat Card ═══ */
export function StatCard({ value, label, change, up, icon: Icon }) {
  return (
    <div className="p-6 bg-surface rounded-2xl border border-border shadow-card card-interactive relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="text-3xl font-heading font-bold text-text mb-1 tracking-tight">{value}</div>
        <div className="text-sm text-muted">{label}</div>
        <div className={`text-xs font-semibold mt-3 ${up ? 'text-success' : 'text-primary'}`}>{change}</div>
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
      {Icon && <div className="w-16 h-16 rounded-2xl bg-overlay flex items-center justify-center mb-4"><Icon className="w-8 h-8 text-muted" /></div>}
      <h4 className="text-base font-heading font-semibold text-text mb-1">{title}</h4>
      {description && <p className="text-sm text-muted max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
