import { useState, useEffect } from 'react'
import {
  Phone, Search, Download, MapPin, Heart, Shield, Flame, Brain,
  Ambulance, ChevronRight, Building2, AlertTriangle, PhoneCall, Plus, X
} from 'lucide-react'
import { Card, CardBody, Badge, Button } from '../components/UI'
import toast from 'react-hot-toast'
import api from '../api/api'

const categories = [
  {
    id: 'medical',
    label: 'Medical',
    icon: Heart,
    color: 'bg-accent',
    gradient: 'from-accent/10 to-accent/5',
    contacts: [
      { name: 'Ambulance', number: '108', desc: 'Emergency medical services' },
      { name: 'AIIMS Emergency', number: '102', desc: 'All India Institute of Medical Sciences' },
      { name: 'Blood Bank', number: '104', desc: 'Blood bank helpline' },
    ],
  },
  {
    id: 'police',
    label: 'Police',
    icon: Shield,
    color: 'bg-primary',
    gradient: 'from-primary-50 to-primary-50/50',
    contacts: [
      { name: 'Police Emergency', number: '100', desc: 'Immediate police response' },
      { name: 'Emergency Number', number: '112', desc: 'Unified emergency number' },
      { name: 'Traffic Police', number: '103', desc: 'Traffic violations & accidents' },
    ],
  },
  {
    id: 'women',
    label: 'Women Helpline',
    icon: PhoneCall,
    color: 'bg-info',
    gradient: 'from-info-50 to-info-50/50',
    contacts: [
      { name: 'Women Helpline', number: '1091', desc: '24/7 women safety assistance' },
      { name: 'Women Helpline (Domestic)', number: '181', desc: 'Domestic abuse helpline' },
      { name: 'NCW Helpline', number: '7827-170-170', desc: 'National Commission for Women' },
    ],
  },
  {
    id: 'fire',
    label: 'Fire',
    icon: Flame,
    color: 'bg-amber-500',
    gradient: 'from-amber-50 to-amber-50/50',
    contacts: [
      { name: 'Fire Department', number: '101', desc: 'Fire emergency response' },
      { name: 'Disaster Mgmt.', number: '1078', desc: 'NDMA helpline' },
    ],
  },
  {
    id: 'mental',
    label: 'Mental Health',
    icon: Brain,
    color: 'bg-secondary',
    gradient: 'from-secondary-50 to-secondary-50/50',
    contacts: [
      { name: 'NIMHANS', number: '080-46110007', desc: 'National mental health helpline' },
      { name: 'iCall', number: '9152987821', desc: 'Psychosocial counselling' },
      { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 mental health support' },
      { name: 'KIRAN', number: '1800-599-0019', desc: 'Government mental health helpline (toll-free)' },
    ],
  },
]

// Location-based contacts — TODO: Replace with API-driven data
const cityContacts = {
  'Pune': { police: 'Pune City Police: 020-2612-4444', hospital: 'Sassoon Hospital: 020-2612-8000', women: 'Bharosa Cell: 020-2616-1953' },
  'Mumbai': { police: 'Mumbai Police: 022-2262-1855', hospital: 'KEM Hospital: 022-2413-6051', women: 'Mumbai Women Cell: 022-2261-2669' },
  'Delhi': { police: 'Delhi Police: 011-2585-1100', hospital: 'AIIMS: 011-2658-8500', women: 'DCW: 011-2330-7004' },
  'Bangalore': { police: 'Bangalore Police: 080-2294-2222', hospital: 'Victoria Hospital: 080-2670-1150', women: 'Women Helpline: 080-2252-7235' },
  'Chennai': { police: 'Chennai Police: 044-2345-6789', hospital: 'Rajiv Gandhi Hospital: 044-2530-5000', women: 'Women Cell: 044-2852-2359' },
}

export default function EmergencyContacts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('Pune')
  const [activeCategory, setActiveCategory] = useState(null)
  const [personalContacts, setPersonalContacts] = useState([])
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' })
  const [loading, setLoading] = useState(true)

  const fetchPersonalContacts = async () => {
    try {
      const res = await api.get('/api/user/contacts')
      setPersonalContacts(res.data || [])
    } catch (err) {
      console.error("Contacts fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPersonalContacts()
  }, [])

  const handleAddContact = async (e) => {
    e.preventDefault()
    if (!newContact.name || !newContact.phone) return
    try {
      await api.post('/api/user/contacts', newContact)
      toast.success('Contact added!')
      setNewContact({ name: '', phone: '', email: '' })
      fetchPersonalContacts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add contact')
    }
  }

  const handleDeleteContact = async (id) => {
    try {
      await api.delete(`/api/user/contacts/${id}`)
      toast.success('Contact removed')
      fetchPersonalContacts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove contact')
    }
  }

  const downloadPDF = () => {
    // TODO: Replace with proper PDF generation (jsPDF or backend)
    const lines = ['SafeSphere Emergency Contacts Directory', '='.repeat(45), '']
    categories.forEach(cat => {
      lines.push(`\n── ${cat.label} ──`)
      cat.contacts.forEach(c => lines.push(`${c.name}: ${c.number} — ${c.desc}`))
    })
    lines.push('\n── Location-Based (Selected: ' + selectedCity + ') ──')
    const city = cityContacts[selectedCity]
    if (city) Object.values(city).forEach(v => lines.push(v))

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'SafeSphere_Emergency_Contacts.txt'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Contacts downloaded!')
  }

  const filteredCategories = categories.map(cat => ({
    ...cat,
    contacts: cat.contacts.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.number.includes(searchQuery) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(cat => cat.contacts.length > 0)

  return (
    <div className="stagger-children">
      {/* Personal Contacts Section */}
      <Card className="mb-8 border-secondary/20 bg-secondary/5">
        <CardBody>
          <h3 className="text-lg font-display font-bold text-primary mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-secondary" /> My Emergency Contacts
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {personalContacts.map((contact) => (
              <div key={contact._id} className="p-4 bg-white rounded-xl border border-secondary/10 flex items-center justify-between group">
                <div>
                  <p className="font-bold text-primary">{contact.name}</p>
                  <p className="text-xs text-slate-500">{contact.phone} • {contact.email}</p>
                </div>
                <button onClick={() => handleDeleteContact(contact._id)} className="p-2 text-slate-300 hover:text-accent cursor-pointer transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {personalContacts.length === 0 && !loading && (
              <p className="text-sm text-slate-400 italic">No personal contacts added yet.</p>
            )}
          </div>
          
          <form onSubmit={handleAddContact} className="flex flex-wrap gap-3 p-4 bg-white/50 rounded-xl border border-dashed border-secondary/30">
            <input type="text" placeholder="Name" value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} className="px-3 py-2 text-sm border border-slate-200 rounded-lg flex-1 min-w-[150px]" />
            <input type="text" placeholder="Phone" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} className="px-3 py-2 text-sm border border-slate-200 rounded-lg flex-1 min-w-[150px]" />
            <input type="email" placeholder="Email (optional)" value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})} className="px-3 py-2 text-sm border border-slate-200 rounded-lg flex-1 min-w-[120px]" />
            <Button type="submit" size="sm" variant="secondary"><Plus className="w-4 h-4" /> Add</Button>
          </form>
        </CardBody>
      </Card>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Emergency Contacts</h1>
          <p className="text-slate-500 text-sm">Comprehensive emergency contact directory</p>
        </div>
        <button onClick={downloadPDF} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-display font-medium text-primary hover:border-primary hover:shadow-sm active:scale-[0.96] transition-all cursor-pointer">
          <Download className="w-4 h-4" /> Download
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search contacts, numbers, or categories..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3.5 border border-slate-200 rounded-xl bg-white text-sm text-slate-800 transition-all duration-200 hover:border-slate-300 focus:border-secondary focus:ring-2 focus:ring-secondary/10 focus:outline-none placeholder-slate-400"
        />
      </div>

      {/* Category Quick Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(activeCategory === cat.id ? null : cat.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 cursor-pointer whitespace-nowrap min-h-[40px] ${
              activeCategory === cat.id
                ? 'bg-primary text-white border-primary shadow-[0_2px_8px_rgba(15,23,42,0.2)]'
                : 'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary'
            }`}
          >
            <cat.icon className="w-4 h-4" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Contact Categories */}
      <div className="space-y-6 mb-8">
        {(activeCategory ? filteredCategories.filter(c => c.id === activeCategory) : filteredCategories).map(cat => (
          <div key={cat.id}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center`}>
                <cat.icon className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-display font-bold text-primary">{cat.label}</h3>
              <span className="text-[11px] text-slate-400 font-mono">{cat.contacts.length}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cat.contacts.map((contact, i) => (
                <a
                  key={i}
                  href={`tel:${contact.number.replace(/[^0-9+]/g, '')}`}
                  className={`group flex items-center gap-3 p-4 bg-gradient-to-br ${cat.gradient} rounded-xl border border-slate-100/80 hover:shadow-elevated transition-all duration-200 no-underline card-hover`}
                >
                  <div className={`w-11 h-11 rounded-xl ${cat.color} flex items-center justify-center shrink-0 shadow-sm`}>
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-display font-bold text-primary">{contact.name}</div>
                    <div className="text-xs text-slate-400">{contact.desc}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-display font-bold text-primary">{contact.number}</div>
                    <ChevronRight className="w-4 h-4 text-slate-300 ml-auto group-hover:text-secondary group-hover:translate-x-1 transition-all" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Location-Based */}
      <Card>
        <CardBody>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-display font-bold text-primary flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" /> Location-Based Contacts
            </h3>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-white outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/10 transition-all cursor-pointer"
            >
              {Object.keys(cityContacts).map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {cityContacts[selectedCity] && Object.entries(cityContacts[selectedCity]).map(([key, value]) => (
              <div key={key} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                <div className="text-[10px] font-display font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {key === 'police' ? '🚔 Police' : key === 'hospital' ? '🏥 Hospital' : '👩 Women'}
                </div>
                <p className="text-sm text-primary font-medium">{value}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
