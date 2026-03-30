import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2, UserPlus, Heart, Pencil, Users } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, Select, Textarea, Modal, Badge, EmptyState } from '../components/UI'
import toast from 'react-hot-toast'

const STORAGE_KEY = 'safesphere_emergency_contacts'

const medicalSchema = z.object({
  bloodGroup: z.string().min(1, 'Blood group is required'),
  allergies: z.string().optional(),
  medicalConditions: z.string().optional(),
  additionalNotes: z.string().optional(),
})

const contactSchema = z.object({
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[+]?[0-9\s\-]{10,15}$/, 'Enter a valid phone number (min 10 digits)'),
  relationship: z.string().min(1, 'Please select a relationship'),
})

const defaultContacts = [
  { initials: 'MS', name: 'Mom', phone: '+91 98765 43210', rel: 'Parent', gradient: 'from-primary to-primary-light' },
  { initials: 'DS', name: 'Dad', phone: '+91 98765 43211', rel: 'Parent', gradient: 'from-secondary to-secondary-dark' },
  { initials: 'RK', name: 'Rahul', phone: '+91 91234 56789', rel: 'Friend', gradient: 'from-accent to-accent-dark' },
]

function loadContacts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch { /* ignore */ }
  return defaultContacts
}

function saveContacts(contacts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts))
  } catch { /* ignore */ }
}

export default function EmergencyInfo() {
  const [contacts, setContacts] = useState(loadContacts)
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null) // null = add, number = edit
  const [savingMedical, setSavingMedical] = useState(false)
  const [savingContact, setSavingContact] = useState(false)

  // Persist contacts to localStorage whenever they change
  useEffect(() => {
    saveContacts(contacts)
  }, [contacts])

  const { register: regMedical, handleSubmit: handleMedical, formState: { errors: medErrors } } = useForm({
    resolver: zodResolver(medicalSchema), defaultValues: { bloodGroup: '', allergies: '', medicalConditions: '', additionalNotes: '' },
  })

  const { register: regContact, handleSubmit: handleContact, formState: { errors: conErrors }, reset: resetContact, setValue } = useForm({
    resolver: zodResolver(contactSchema), defaultValues: { contactName: '', phone: '', relationship: '' },
  })

  const saveMedical = () => {
    setSavingMedical(true)
    setTimeout(() => { setSavingMedical(false); toast.success('Medical info saved!') }, 1500)
  }

  const openAddModal = () => {
    setEditIndex(null)
    resetContact({ contactName: '', phone: '', relationship: '' })
    setModalOpen(true)
  }

  const openEditModal = (index) => {
    setEditIndex(index)
    const c = contacts[index]
    setValue('contactName', c.name)
    setValue('phone', c.phone)
    setValue('relationship', c.rel)
    setModalOpen(true)
  }

  const gradients = ['from-info to-indigo-600', 'from-emerald-500 to-emerald-600', 'from-amber-500 to-amber-600', 'from-primary to-primary-light', 'from-secondary to-secondary-dark', 'from-accent to-accent-dark']

  const saveContact = (data) => {
    setSavingContact(true)
    setTimeout(() => {
      const initials = data.contactName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

      if (editIndex !== null) {
        // Edit existing contact
        setContacts(prev => prev.map((c, i) => i === editIndex
          ? { ...c, initials, name: data.contactName, phone: data.phone, rel: data.relationship }
          : c
        ))
        toast.success('Contact updated!')
      } else {
        // Add new contact
        setContacts(prev => [...prev, {
          initials,
          name: data.contactName,
          phone: data.phone,
          rel: data.relationship,
          gradient: gradients[contacts.length % gradients.length],
        }])
        toast.success('Contact added!')
      }
      setSavingContact(false)
      setModalOpen(false)
      resetContact()
      setEditIndex(null)
    }, 1000)
  }

  const deleteContact = (index) => {
    const removed = contacts[index]
    setContacts(prev => prev.filter((_, i) => i !== index))
    toast.success(
      (t) => (
        <span className="flex items-center gap-3">
          Contact removed
          <button className="text-secondary font-semibold underline cursor-pointer" onClick={() => { setContacts(prev => [...prev.slice(0, index), removed, ...prev.slice(index)]); toast.dismiss(t.id) }}>Undo</button>
        </span>
      ),
      { duration: 5000 }
    )
  }

  return (
    <div className="stagger-children">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Emergency Information</h1>
          <p className="text-slate-500 text-sm">Keep your medical and emergency details updated</p>
        </div>
        <Badge variant="success" dot>Up to date</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <h3 className="text-[15px] font-display font-bold text-primary flex items-center gap-2"><Heart className="w-4 h-4 text-accent" /> Medical Information</h3>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleMedical(saveMedical)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <Select label="Blood Group" placeholder="Select blood group" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} {...regMedical('bloodGroup')} error={medErrors.bloodGroup?.message} />
                  <Input label="Allergies" placeholder="e.g., Penicillin, Peanuts" {...regMedical('allergies')} error={medErrors.allergies?.message} />
                </div>
                <Textarea label="Medical Conditions" placeholder="List any chronic conditions..." className="mb-5" {...regMedical('medicalConditions')} />
                <Textarea label="Additional Notes" placeholder="Any additional information..." rows={3} className="mb-6" {...regMedical('additionalNotes')} />
                <Button type="submit" isLoading={savingMedical}>Save Information</Button>
              </form>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <h3 className="text-[15px] font-display font-bold text-primary">Emergency Contacts</h3>
              <Button variant="teal" size="sm" onClick={openAddModal}><UserPlus className="w-3.5 h-3.5" /> Add</Button>
            </CardHeader>
            <CardBody>
              {contacts.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No emergency contacts yet"
                  description="Add your first emergency contact to get started."
                  action={<Button variant="teal" size="sm" onClick={openAddModal}><UserPlus className="w-3.5 h-3.5" /> Add your first contact</Button>}
                />
              ) : (
                <div className="flex flex-col gap-3 stagger-children">
                  {contacts.map((c, i) => (
                    <div key={i} className="group flex items-center gap-3 p-3.5 border border-slate-100/80 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all duration-200">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center font-display font-semibold text-xs text-white flex-shrink-0 shadow-sm`}>{c.initials}</div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-primary truncate">{c.name}</h5>
                        <p className="text-xs text-slate-400">{c.phone} · {c.rel}</p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEditModal(i)} className="p-2 rounded-lg text-slate-300 hover:bg-info-50 hover:text-info transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center" aria-label={`Edit ${c.name}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deleteContact(i)} className="p-2 rounded-lg text-slate-300 hover:bg-accent-50 hover:text-accent transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center" aria-label={`Remove ${c.name}`}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditIndex(null) }} title={editIndex !== null ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
        footer={<><Button variant="outline" onClick={() => { setModalOpen(false); setEditIndex(null) }}>Cancel</Button><Button isLoading={savingContact} onClick={handleContact(saveContact)}>{editIndex !== null ? 'Save Changes' : 'Add Contact'}</Button></>}>
        <div className="flex flex-col gap-4">
          <Input label="Name" placeholder="Contact name" {...regContact('contactName')} error={conErrors.contactName?.message} />
          <Input label="Phone Number" type="tel" placeholder="+91 XXXXX XXXXX" {...regContact('phone')} error={conErrors.phone?.message} />
          <Select label="Relationship" placeholder="Select" options={['Parent', 'Sibling', 'Spouse', 'Friend', 'Other']} {...regContact('relationship')} error={conErrors.relationship?.message} />
        </div>
      </Modal>
    </div>
  )
}
