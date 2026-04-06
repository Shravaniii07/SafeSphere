import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Mail, Phone as PhoneIcon, MapPin as MapIcon, UserPlus, Shield, Trash2, AlertTriangle, LogOut } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, Toggle, Badge } from '../components/UI'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[+]?[0-9\s\-]{10,15}$/, 'Invalid phone number').optional(),
})

export default function Profile() {
  const { user: appUser, settings, setSettings } = useApp()
  const { updateProfile, deleteAccount, logout } = useAuth()
  const [saving, setSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { 
      name: appUser?.name || '', 
      email: appUser?.email || '', 
      phone: appUser?.phone || '' 
    },
  })

  // ✅ Fix persistence: Sync form with user data once it loads from backend
  useEffect(() => {
    if (appUser?.name) {
      reset({
        name: appUser.name,
        email: appUser.email,
        phone: appUser.phone || ''
      })
    }
  }, [appUser, reset])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      await updateProfile(data)
      toast.success('Profile updated!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm("Are you ABSOLUTELY sure? This will permanently delete your account and all associated safety data.")
    if (!confirm1) return
    
    const confirm2 = window.confirm("Final warning: This action is IRREVERSIBLE. Do you want to proceed?")
    if (!confirm2) return

    setIsDeleting(true)
    try {
      await deleteAccount()
      toast.success('Your account has been permanently deleted.')
    } catch (err) {
      toast.error(err.message)
      setIsDeleting(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
    } catch (err) {
      toast.error('Logout failed')
    }
  }

  return (
    <div className="stagger-children">
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-primary tracking-tight mb-1">Profile</h1>
        <p className="text-slate-500 text-sm">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardBody>
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-3xl font-display font-bold shadow-lg">{appUser.initials}</div>
                  <button className="absolute inset-0 rounded-2xl bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-primary">{appUser.name}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5" /> {appUser.email}</p>
                  <div className="mt-2"><Badge variant="success" dot>Verified</Badge></div>
                </div>
              </div>

              <div className="h-px bg-slate-100 mb-6" />

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <Input label="Full Name" {...register('name')} error={errors.name?.message} />
                  <Input label="Email" type="email" icon={Mail} {...register('email')} error={errors.email?.message} disabled title="Email cannot be changed" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <Input label="Phone" type="tel" icon={PhoneIcon} {...register('phone')} error={errors.phone?.message} />
                </div>
                <Button type="submit" isLoading={saving}>Save Changes</Button>
              </form>

              {/* Emergency Contacts Section - Hidden for Admins */}
              {appUser?.role !== 'admin' && (
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-display font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-4 h-4 text-secondary" /> Emergency Contacts
                    </h4>
                  </div>
                  
                  <div className="space-y-4">
                    {appUser.emergencyContacts?.length > 0 ? (
                      appUser.emergencyContacts.map((contact, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary font-bold shadow-sm border border-slate-200">
                              {contact.name?.[0] || 'C'}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary">{contact.name}</p>
                              <p className="text-xs text-slate-500 font-medium">{contact.relationship || 'Emergency Contact'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-mono font-medium text-slate-700">{contact.phone}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                        <p className="text-sm text-slate-400">No emergency contacts added yet.</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-secondary" onClick={() => window.location.href='/emergency-info'}>Add Contact</Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card>
            <CardHeader><h3 className="text-[15px] font-display font-bold text-primary">Settings</h3></CardHeader>
            <CardBody>
              <div className="space-y-5">
                <Toggle label="Dark Mode" description="Switch to dark theme" checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} />
                <Toggle label="Push Notifications" description="Receive alerts on phone" checked={settings.pushNotifications} onChange={() => toggleSetting('pushNotifications')} />
                <Toggle label="Location Services" description="Allow GPS tracking" checked={settings.locationServices} onChange={() => toggleSetting('locationServices')} />
                <Toggle label="Sound Alerts" description="Play sound on SOS" checked={settings.soundAlerts} onChange={() => toggleSetting('soundAlerts')} />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8">
        <Card className="border-red-100 bg-red-50/30">
          <CardHeader className="border-red-100">
            <div className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-4 h-4" />
              <h3 className="text-[15px] font-display font-bold">Danger Zone</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-md">
                <p className="text-sm font-bold text-red-900 mb-1">Delete Account</p>
                <p className="text-xs text-red-600/80 leading-relaxed">
                  Permanently delete your profile and all associated data including reports, trips, and notification history. This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button 
                  variant="outline" 
                  className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" /> Logout Only
                </Button>
                <Button 
                  variant="danger" 
                  onClick={handleDeleteAccount}
                  isLoading={isDeleting}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Permanently Delete
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
