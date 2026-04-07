import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Trash2, UserPlus, Heart, Pencil, Users, Phone } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, Select, Textarea, Modal, Badge, EmptyState } from '../components/UI'
import toast from 'react-hot-toast'
import api from '../api/api'

// ─── Validation schemas ────────────────────────────────────────────────────
const medicalSchema = z.object({
  bloodGroup: z.string().min(1, 'Blood group is required'),
  medicalConditions: z.string().optional(),
  emergencyNotes: z.string().optional(),
})

const contactSchema = z.object({
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().regex(/^[+]?[0-9\s\-]{10,15}$/, 'Enter a valid phone number (min 10 digits)'),
  email: z.string().email('Enter a valid email address'),
  relationship: z.string().min(1, 'Please select a relationship'),
})

const gradients = [
  'from-info to-indigo-600',
  'from-emerald-500 to-emerald-600',
  'from-amber-500 to-amber-600',
  'from-primary to-primary-light',
  'from-secondary to-secondary-dark',
  'from-accent to-accent-dark',
]

function getInitials(name) {
  return (name || '')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'
}

export default function EmergencyInfo() {
  // ── Contacts state ─────────────────────────────────────────────────────
  const [contacts, setContacts] = useState([])
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editContactId, setEditContactId] = useState(null) // null = add, string = edit
  const [savingContact, setSavingContact] = useState(false)

  // ── Medical info state ─────────────────────────────────────────────────
  const [savingMedical, setSavingMedical] = useState(false)

  // ── Forms ──────────────────────────────────────────────────────────────
  const {
    register: regMedical,
    handleSubmit: handleMedical,
    setValue: setMedValue,
    formState: { errors: medErrors },
  } = useForm({
    resolver: zodResolver(medicalSchema),
    defaultValues: { bloodGroup: '', medicalConditions: '', emergencyNotes: '' },
  })

  const {
    register: regContact,
    handleSubmit: handleContact,
    formState: { errors: conErrors },
    reset: resetContact,
    setValue: setConValue,
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { contactName: '', phone: '', email: '', relationship: '' },
  })

  // ── Load contacts from backend ─────────────────────────────────────────
  const fetchContacts = async () => {
    try {
      console.log('[EmergencyInfo] Fetching contacts from backend...')
      const res = await api.get('/api/user/contacts')
      setContacts(res.data || [])
      console.log('[EmergencyInfo] Contacts loaded:', res.data)
    } catch (err) {
      console.error('[EmergencyInfo] Failed to load contacts:', err)
      toast.error('Failed to load contacts')
    } finally {
      setLoadingContacts(false)
    }
  }

  // ── Load user profile (medical info) from backend ─────────────────────
  const fetchProfile = async () => {
    try {
      console.log('[EmergencyInfo] Fetching profile for medical info...')
      const res = await api.get('/api/user/profile')
      const user = res.data
      if (user.bloodGroup) setMedValue('bloodGroup', user.bloodGroup)
      if (user.medicalConditions) setMedValue('medicalConditions', user.medicalConditions)
      if (user.emergencyNotes) setMedValue('emergencyNotes', user.emergencyNotes)
      console.log('[EmergencyInfo] Medical info loaded:', user)
    } catch (err) {
      console.error('[EmergencyInfo] Failed to load medical info:', err)
    }
  }

  useEffect(() => {
    fetchContacts()
    fetchProfile()
  }, [])

  // ── Save medical info to backend ───────────────────────────────────────
  const saveMedical = async (data) => {
    setSavingMedical(true)
    try {
      console.log('[EmergencyInfo] Saving medical info:', data)
      await api.put('/api/user/emergency-info', {
        bloodGroup: data.bloodGroup,
        medicalConditions: data.medicalConditions,
        emergencyNotes: data.emergencyNotes,
      })
      toast.success('Medical info saved!')
    } catch (err) {
      console.error('[EmergencyInfo] Save medical error:', err)
      toast.error(err.message || 'Failed to save medical info')
    } finally {
      setSavingMedical(false)
    }
  }

  // ── Open Add modal ─────────────────────────────────────────────────────
  const openAddModal = () => {
    setEditContactId(null)
    resetContact({ contactName: '', phone: '', email: '', relationship: '' })
    setModalOpen(true) // open AFTER resetting — state is batched correctly
  }

  // ── Open Edit modal ────────────────────────────────────────────────────
  const openEditModal = (contact) => {
    setEditContactId(contact._id)
    setConValue('contactName', contact.name)
    setConValue('phone', contact.phone)
    setConValue('email', contact.email || '')
    setConValue('relationship', contact.relationship || '')
    setModalOpen(true)
  }

  // ── Save contact (Add or Edit) ─────────────────────────────────────────
  const saveContact = async (data) => {
    setSavingContact(true)
    try {
      if (editContactId) {
        // Edit: delete old + add new (backend has no PUT contacts/:id)
        await api.delete(`/api/user/contacts/${editContactId}`)
        await api.post('/api/user/contacts', {
          name: data.contactName,
          phone: data.phone,
          email: data.email,
          relationship: data.relationship,
        })
        toast.success('Contact updated!')
      } else {
        // Add new
        console.log('[EmergencyInfo] Adding contact:', data)
        await api.post('/api/user/contacts', {
          name: data.contactName,
          phone: data.phone,
          email: data.email,
          relationship: data.relationship,
        })
        toast.success('Contact added!')
      }
      await fetchContacts() // refresh from backend
      setModalOpen(false)
      setEditContactId(null)
      resetContact()
    } catch (err) {
      console.error('[EmergencyInfo] Save contact error:', err)
      toast.error(err.message || 'Failed to save contact')
    } finally {
      setSavingContact(false)
    }
  }

  // ── Delete contact ─────────────────────────────────────────────────────
  const deleteContact = async (id, name) => {
    try {
      await api.delete(`/api/user/contacts/${id}`)
      toast.success(`${name} removed`)
      await fetchContacts()
    } catch (err) {
      console.error('[EmergencyInfo] Delete contact error:', err)
      toast.error(err.message || 'Failed to remove contact')
    }
  }

  // ── Close modal cleanly ────────────────────────────────────────────────
  const closeModal = () => {
    if (savingContact) return // prevent close while saving
    setModalOpen(false)
    setEditContactId(null)
    resetContact()
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
        {/* Medical Info Form */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader>
              <h3 className="text-[15px] font-display font-bold text-primary flex items-center gap-2">
                <Heart className="w-4 h-4 text-accent" /> Medical Information
              </h3>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleMedical(saveMedical)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <Select
                    label="Blood Group"
                    placeholder="Select blood group"
                    options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
                    {...regMedical('bloodGroup')}
                    error={medErrors.bloodGroup?.message}
                  />
                </div>
                <Textarea
                  label="Medical Conditions"
                  placeholder="List any chronic conditions..."
                  className="mb-5"
                  {...regMedical('medicalConditions')}
                />
                <Textarea
                  label="Emergency Notes"
                  placeholder="Any additional information for first responders..."
                  rows={3}
                  className="mb-6"
                  {...regMedical('emergencyNotes')}
                />
                <Button type="submit" isLoading={savingMedical}>Save Information</Button>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Emergency Contacts */}
        <div className="lg:col-span-4">
          <Card>
            <CardHeader>
              <h3 className="text-[15px] font-display font-bold text-primary">Emergency Contacts</h3>
              <Button variant="teal" size="sm" onClick={openAddModal}>
                <UserPlus className="w-3.5 h-3.5" /> Add
              </Button>
            </CardHeader>
            <CardBody>
              {loadingContacts ? (
                <p className="text-sm text-slate-400 text-center py-6">Loading contacts...</p>
              ) : contacts.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No emergency contacts yet"
                  description="Add your first emergency contact to get started."
                  action={
                    <Button variant="teal" size="sm" onClick={openAddModal}>
                      <UserPlus className="w-3.5 h-3.5" /> Add your first contact
                    </Button>
                  }
                />
              ) : (
                <div className="flex flex-col gap-3 stagger-children">
                  {contacts.map((c, i) => (
                    <div
                      key={c._id}
                      className="group flex items-center gap-3 p-3.5 border border-slate-100/80 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all duration-200"
                    >
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center font-display font-semibold text-xs text-white flex-shrink-0 shadow-sm`}
                      >
                        {getInitials(c.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="text-sm font-semibold text-primary truncate">
                          {c.name} {c.relationship && <span className="font-normal text-slate-400 text-xs">({c.relationship})</span>}
                        </h5>
                        {/* ✅ CALL FUNCTION: tel: link opens device dialer */}
                        <a
                          href={`tel:${c.phone.replace(/\s/g, '')}`}
                          className="text-xs text-secondary hover:underline flex items-center gap-1 w-fit"
                        >
                          <Phone className="w-3 h-3" />
                          {c.phone}
                        </a>
                        <p className="text-xs text-slate-400 truncate">{c.email}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEditModal(c)}
                          className="p-2 rounded-lg text-slate-300 hover:bg-info-50 hover:text-info transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                          aria-label={`Edit ${c.name}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteContact(c._id, c.name)}
                          className="p-2 rounded-lg text-slate-300 hover:bg-accent-50 hover:text-accent transition-all cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                          aria-label={`Remove ${c.name}`}
                        >
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

      {/* ✅ ADD/EDIT MODAL — footer uses arrow function to prevent immediate invocation */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editContactId ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={savingContact}>
              Cancel
            </Button>
            {/* ✅ FIX: handleContact(saveContact) returns a function — wrap in arrow so it's called ON CLICK not during render */}
            <Button
              isLoading={savingContact}
              onClick={() => handleContact(saveContact)()}
            >
              {editContactId ? 'Save Changes' : 'Add Contact'}
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <Input
            label="Name"
            placeholder="Contact name"
            {...regContact('contactName')}
            error={conErrors.contactName?.message}
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            {...regContact('phone')}
            error={conErrors.phone?.message}
          />
          <Input
            label="Email"
            type="email"
            placeholder="contact@example.com"
            {...regContact('email')}
            error={conErrors.email?.message}
          />
          <Select
            label="Relationship"
            placeholder="Select"
            options={['Parent', 'Sibling', 'Spouse', 'Friend', 'Other']}
            {...regContact('relationship')}
            error={conErrors.relationship?.message}
          />
        </div>
      </Modal>
    </div>
  )
}
