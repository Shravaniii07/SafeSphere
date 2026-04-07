import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Camera, Mail, Phone as PhoneIcon, MapPin as MapIcon, Shield, CheckCircle } from 'lucide-react'
import { Card, CardHeader, CardBody, Button, Input, Toggle, Badge } from '../components/UI'
import { useApp } from '../context/AppContext'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[+]?[0-9\s\-]{10,15}$/, 'Invalid phone number'),
  location: z.string().optional(),
})

export default function Profile() {
  const { user, setUser, settings, setSettings } = useApp()
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, email: user.email, phone: user.phone, location: user.location },
  })

  const onSubmit = (data) => {
    setSaving(true)
    setTimeout(() => {
      const initials = data.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
      setUser(prev => ({ ...prev, ...data, initials }))
      setSaving(false)
      toast.success('Profile updated!')
    }, 1500)
  }

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="stagger-children">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-1">Profile</h1>
        <p className="text-gray-400 text-sm">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <Card>
            <CardBody>
              <div className="flex items-center gap-6 mb-8">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-2xl text-white flex items-center justify-center text-3xl font-bold shadow-lg bg-gradient-to-br from-blue-500 to-violet-500">
                    {user.initials}
                  </div>
                  <button className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                  </button>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5"><Mail className="w-3.5 h-3.5" /> {user.email}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="success" dot>Verified</Badge>
                    <Badge variant="info">Free Plan</Badge>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-6" />

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

        <div className="lg:col-span-4 space-y-5">
          <Card>
            <CardHeader><h3 className="text-[15px] font-semibold text-gray-900">Preferences</h3></CardHeader>
            <CardBody>
              <div className="space-y-5">
                <Toggle label="Dark Mode" description="Switch to dark theme" checked={settings.darkMode} onChange={() => toggleSetting('darkMode')} />
                <Toggle label="Push Notifications" description="Receive alerts on phone" checked={settings.pushNotifications} onChange={() => toggleSetting('pushNotifications')} />
                <Toggle label="Location Services" description="Allow GPS tracking" checked={settings.locationServices} onChange={() => toggleSetting('locationServices')} />
                <Toggle label="Sound Alerts" description="Play sound on SOS" checked={settings.soundAlerts} onChange={() => toggleSetting('soundAlerts')} />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <h4 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-500" /> Account Security
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Two-factor auth</span>
                  <Badge variant="warning">Not set</Badge>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Last login</span>
                  <span className="text-sm font-semibold text-gray-900">Just now</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-500">Account status</span>
                  <Badge variant="success" dot>Active</Badge>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
