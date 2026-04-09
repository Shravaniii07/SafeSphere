import { useEffect } from 'react'
import { X, MapPin } from 'lucide-react'

function Spinner({ className = 'w-4 h-4' }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.15" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/* ═══ Card ═══ */
export function Card({ children, className = '', glass = false, hover = true }) {
  return (
    <div className={`${glass ? 'glass-card' : 'bg-white'} rounded-2xl border border-gray-200/60 shadow-card overflow-hidden ${hover ? 'card-interactive gradient-border' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between ${className}`}>{children}</div>
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-6 ${className}`}>{children}</div>
}

/* ═══ Button ═══ */
export function Button({ children, variant = 'primary', size = 'md', className = '', onClick, full, disabled, isLoading, type = 'button' }) {
  const base = `inline-flex items-center justify-center gap-2 font-semibold rounded-xl border-2 border-transparent whitespace-nowrap cursor-pointer transition-all duration-300 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100`
  const sizes = {
    sm: 'px-3.5 py-1.5 text-[13px]',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-[15px]',
  }
  const variants = {
    primary: 'bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5',
    danger: 'bg-red-500 text-white hover:bg-red-600 hover:shadow-glow-accent hover:-translate-y-0.5',
    teal: 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-glow-blue hover:-translate-y-0.5',
    outline: 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-0.5 hover:shadow-sm',
    'outline-danger': 'bg-white text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300',
    ghost: 'bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-800',
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
  const variants = {
    primary: 'bg-gray-100 text-gray-700 border-gray-200',
    danger: 'bg-red-50 text-red-600 border-red-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    info: 'bg-violet-50 text-violet-600 border-violet-100',
  }
  const dotColors = {
    success: 'bg-emerald-500',
    danger: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-violet-500',
    primary: 'bg-gray-600',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border ${variants[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || 'bg-gray-600'}`} />}
      {children}
    </span>
  )
}

/* ═══ Toggle ═══ */
export function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer group min-h-[44px]">
      <div>
        <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors duration-300">{label}</span>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="relative inline-block w-11 h-6 flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
        <span className="absolute inset-0 bg-gray-200 rounded-full transition-all duration-400 peer-checked:bg-blue-500" />
        <span className="absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full shadow-sm transition-all duration-400 peer-checked:translate-x-5" />
      </div>
    </label>
  )
}

/* ═══ Input ═══ */
export function Input({ label, type = 'text', placeholder, value, onChange, className = '', icon: Icon, error, ...rest }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-[13px] font-medium text-gray-500">{label}</label>}
      <div className="relative group">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors duration-300" />}
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} {...rest}
          className={`w-full px-4 py-2.5 border rounded-xl bg-white text-gray-800 text-sm transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/8 focus:outline-none placeholder-gray-400 ${Icon ? 'pl-10' : ''} ${error ? 'border-red-300 ring-2 ring-red-500/8' : 'border-gray-200'}`} />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

/* ═══ Select ═══ */
export function Select({ label, options = [], placeholder, value, onChange, className = '', error, ...rest }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-[13px] font-medium text-gray-500">{label}</label>}
      <select value={value} onChange={onChange} {...rest}
        className={`w-full px-4 py-2.5 border rounded-xl bg-white text-gray-800 text-sm appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%27http%3A//www.w3.org/2000/svg%27%20width%3D%2712%27%20height%3D%2712%27%20viewBox%3D%270%200%2024%2024%27%20fill%3D%27none%27%20stroke%3D%27%239CA3AF%27%20stroke-width%3D%272%27%20stroke-linecap%3D%27round%27%20stroke-linejoin%3D%27round%27%3E%3Cpath%20d%3D%27M6%209l6%206%206-6%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_14px_center] pr-10 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/8 focus:outline-none ${error ? 'border-red-300' : 'border-gray-200'}`}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
      </select>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

/* ═══ Textarea ═══ */
export function Textarea({ label, placeholder, value, onChange, rows = 4, className = '', ...rest }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && <label className="text-[13px] font-medium text-gray-500">{label}</label>}
      <textarea placeholder={placeholder} value={value} onChange={onChange} rows={rows} {...rest}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-gray-800 text-sm resize-y transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/8 focus:outline-none placeholder-gray-400" />
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
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" style={{ animation: 'modal-overlay-in 0.25s ease' }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-elevated-lg w-full max-w-[440px] p-8 border border-gray-100" style={{ animation: 'modal-content-in 0.4s cubic-bezier(0.16,1,0.3,1)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-all duration-300 cursor-pointer"><X className="w-[18px] h-[18px]" /></button>
        </div>
        <div className="mb-6">{children}</div>
        {footer && <div className="flex gap-3 justify-end">{footer}</div>}
      </div>
    </div>
  )
}

/* ═══ Map Placeholder ═══ */
export function MapPlaceholder({ label = 'MAP COMPONENT', height = 'min-h-[350px]' }) {
  return (
    <div className={`relative rounded-2xl border border-gray-200/60 flex items-center justify-center flex-col gap-3 text-gray-400 overflow-hidden ${height} bg-gradient-to-br from-gray-50 to-white`}>
      <div className="absolute inset-0 dot-pattern opacity-50" />
      <MapPin className="w-10 h-10 opacity-20 relative z-10 animate-float" />
      <span className="text-sm font-medium relative z-10">{label}</span>
    </div>
  )
}

/* ═══ Filter Button ═══ */
export function FilterButton({ children, active, onClick }) {
  return (
    <button onClick={onClick} className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 cursor-pointer inline-flex items-center gap-2 min-h-[40px] ${active ? 'bg-gray-900 text-white border-gray-900 shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700 hover:shadow-sm'}`}>{children}</button>
  )
}

/* ═══ Stat Card ═══ */
export function StatCard({ value, label, change, up, icon: Icon }) {
  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200/60 shadow-card card-interactive relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative">
        <div className="text-3xl font-bold text-gray-900 mb-1 tracking-tight">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className={`text-xs font-medium mt-3 ${up ? 'text-emerald-600' : 'text-red-500'}`}>{change}</div>
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
      {Icon && <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-5"><Icon className="w-7 h-7 text-gray-400" /></div>}
      <h4 className="text-[15px] font-semibold text-gray-600 mb-1.5">{title}</h4>
      {description && <p className="text-sm text-gray-400 max-w-sm leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
