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
    <div className={`${glass ? 'glass' : 'bg-white'} rounded-2xl border border-slate-100/80 shadow-elevated overflow-hidden ${hover ? 'card-hover' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-slate-100/60 flex items-center justify-between ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

/* ═══ Button ═══ */
export function Button({ children, variant = 'primary', size = 'md', className = '', onClick, full, disabled, isLoading }) {
  const base = `inline-flex items-center justify-center gap-2 font-display font-medium rounded-xl border-2 border-transparent whitespace-nowrap cursor-pointer transition-all duration-200 ease-out active:scale-[0.96] active:duration-75 focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`
  const sizes = { sm: 'px-3.5 py-1.5 text-[13px]', md: 'px-5 py-2.5 text-sm', lg: 'px-7 py-3.5 text-[15px]' }
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light hover:shadow-[0_4px_16px_rgba(15,23,42,0.25)] hover:-translate-y-px',
    danger: 'bg-accent text-white hover:bg-accent-dark hover:shadow-glow-accent hover:-translate-y-px',
    teal: 'bg-secondary text-white hover:bg-secondary-dark hover:shadow-glow-teal hover:-translate-y-px',
    outline: 'bg-transparent text-primary border-slate-200 hover:border-primary hover:bg-primary-50 hover:-translate-y-px',
    'outline-danger': 'bg-transparent text-accent border-accent/40 hover:bg-accent-50 hover:border-accent',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800',
  }
  return (
    <button onClick={onClick} disabled={disabled || isLoading}
      className={`${base} ${sizes[size]} ${variants[variant]} ${full ? 'w-full' : ''} ${className}`}>
      {isLoading ? <><Spinner /> <span>Please wait...</span></> : children}
    </button>
  )
}

/* ═══ Badge ═══ */
export function Badge({ children, variant = 'primary', className = '', dot }) {
  const variants = { primary: 'bg-primary-100 text-primary', danger: 'bg-accent-50 text-accent', success: 'bg-emerald-50 text-emerald-600', warning: 'bg-amber-50 text-amber-600', info: 'bg-indigo-50 text-indigo-600' }
  const dotColors = { success: 'bg-emerald-500', danger: 'bg-accent', warning: 'bg-amber-500', info: 'bg-indigo-500', primary: 'bg-primary' }
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
        <span className="text-sm font-medium text-slate-800 group-hover:text-primary transition-colors">{label}</span>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      <div className="relative inline-block w-12 h-[26px] flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <span className="absolute inset-0 bg-slate-200 rounded-full transition-all duration-300 peer-checked:bg-secondary peer-focus-visible:ring-2 peer-focus-visible:ring-secondary/40" />
        <span className="absolute h-[20px] w-[20px] left-[3px] bottom-[3px] bg-white rounded-full shadow-md transition-all duration-300 peer-checked:translate-x-[22px]" />
      </div>
    </label>
  )
}

/* ═══ Input ═══ */
export function Input({ label, type = 'text', placeholder, value, onChange, className = '', icon: Icon, error, ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} {...rest}
          className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-800 text-sm transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400 ${Icon ? 'pl-10' : ''} ${error ? 'border-accent ring-1 ring-accent/20' : 'border-slate-200'}`} />
      </div>
      {error && <p className="text-xs text-accent mt-[-4px]">{error}</p>}
    </div>
  )
}

/* ═══ Select ═══ */
export function Select({ label, options = [], placeholder, value, onChange, className = '', error, ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">{label}</label>}
      <select value={value} onChange={onChange} {...rest}
        className={`w-full px-4 py-3 border rounded-xl bg-white text-slate-800 text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%2394A3B8%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27M6%209l6%206%206-6%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center] pr-10 transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none ${error ? 'border-accent ring-1 ring-accent/20' : 'border-slate-200'}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
      {error && <p className="text-xs text-accent mt-[-4px]">{error}</p>}
    </div>
  )
}

/* ═══ Textarea ═══ */
export function Textarea({ label, placeholder, value, onChange, rows = 4, className = '', ...rest }) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && <label className="text-[13px] font-semibold text-slate-700 font-display tracking-wide">{label}</label>}
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} {...rest}
        className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-800 text-sm resize-y transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400" />
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
      <div className="absolute inset-0 bg-primary-dark/60 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-elevated-lg w-full max-w-[440px] p-8" 
           style={{ animation: 'modal-content-in 0.3s cubic-bezier(0.16,1,0.3,1)' }} 
           onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-display font-bold text-primary">{title}</h3>
          <button onClick={onClose} 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-all cursor-pointer min-h-[44px] min-w-[44px]">
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
    <div className={`relative rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center flex-col gap-3 text-slate-400 overflow-hidden ${height}`}>
      <div className="absolute inset-0 geo-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-info/5 to-accent/5" />
      <MapPin className="w-12 h-12 opacity-30 relative z-10 animate-float" />
      <span className="text-sm font-display font-medium relative z-10 tracking-wide">{label}</span>
    </div>
  )
}

/* ═══ Filter Button ═══ */
export function FilterButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer inline-flex items-center gap-2 min-h-[44px] focus-visible:outline-2 focus-visible:outline-secondary focus-visible:outline-offset-2 ${active ? 'bg-primary text-white border-primary shadow-[0_2px_8px_rgba(15,23,42,0.2)]' : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary hover:shadow-sm'}`}>{children}</button>
  )
}

/* ═══ Stat Card ═══ */
export function StatCard({ value, label, change, up, icon: Icon }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-slate-100/80 shadow-elevated card-hover relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-secondary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="text-3xl font-display font-bold text-primary mb-1 tracking-tight">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
        <div className={`text-xs font-semibold mt-3 ${up ? 'text-emerald-600' : 'text-accent'}`}>{change}</div>
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
      {Icon && <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4"><Icon className="w-8 h-8 text-slate-400" /></div>}
      <h4 className="text-base font-display font-semibold text-slate-700 mb-1">{title}</h4>
      {description && <p className="text-sm text-slate-400 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
