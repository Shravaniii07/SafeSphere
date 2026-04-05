import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Mail, Phone as PhoneIcon, MapPin as MapIcon } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, Toggle, Badge } from '../components/UI'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext';

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[+]?[0-9\s\-]{10,15}$/, 'Invalid phone number'),
  location: z.string().optional(),
})

export default function Profile() {
  const { user: appUser, setUser, settings, setSettings } = useApp()
  const { updateProfile } = useAuth()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: appUser.name, email: appUser.email, phone: appUser.phone, location: appUser.location },
  })

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
                  <Input label="Email" type="email" icon={Mail} {...register('email')} error={errors.email?.message} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                  <Input label="Phone" type="tel" icon={PhoneIcon} {...register('phone')} error={errors.phone?.message} />
                  <Input label="Location" icon={MapIcon} {...register('location')} />
                </div>
                <Button type="submit" isLoading={saving}>Save Changes</Button>
              </form>
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
    </div>
  )
}
