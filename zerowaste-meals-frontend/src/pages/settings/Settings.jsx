import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import Button from '../../components/common/Button'
import Avatar from '../../components/common/Avatar'
import Badge from '../../components/common/Badge'
import logoMark from '../../assets/logo/logo-mark.svg'
import defaultAvatar from '../../assets/avatar/default-avatar.png'
import { ROLES } from '../../utils/constants'

const ROLE_LABELS = {
  [ROLES.DONOR]: 'Donor',
  [ROLES.NGO]: 'NGO Partner',
  [ROLES.ADMIN]: 'Administrator',
}

const THEMES = ['#047857', '#0f766e', '#166534', '#065f46']

function Toggle({ checked, onChange, label, hint }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        {hint && <span className="block text-xs text-gray-400">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </label>
  )
}

export function Settings() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState(true)
  const [sms, setSms] = useState(false)
  const [theme, setTheme] = useState(THEMES[0])
  const [saveLoading, setSaveLoading] = useState(false)

  const handleSave = () => {
    setSaveLoading(true)
    setTimeout(() => {
      setSaveLoading(false)
      toast.success('Settings saved successfully!')
    }, 800)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your profile, preferences and notification controls
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
          <div className="flex items-center gap-4">
            <Avatar src={defaultAvatar} alt={user?.name} size="lg" className="h-20 w-20" />
            <div>
              <h2 className="font-display text-lg font-bold text-gray-900">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <div className="mt-2">
                <Badge color="brand" dot>{ROLE_LABELS[user?.role] || user?.role}</Badge>
              </div>
            </div>
          </div>

          <dl className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-gray-500">City</dt>
              <dd className="font-semibold text-gray-900 capitalize">{user?.city || '—'}</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-gray-500">Organization</dt>
              <dd className="font-semibold text-gray-900">{user?.organization || 'Individual'}</dd>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <dt className="text-gray-500">Member since</dt>
              <dd className="font-semibold text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
              </dd>
            </div>
          </dl>

          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-brand-50 p-4">
            <img src={logoMark} alt="" className="h-9 w-9" />
            <p className="text-xs text-brand-900">
              Your account powers Verified, ZeroWaste Meals partner status.
            </p>
          </div>

          <Button variant="danger" className="mt-6 w-full" onClick={handleLogout}>
            Sign out of account
          </Button>
        </section>

        <section className="space-y-6 lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-gray-900">Notifications</h2>
            <p className="text-xs text-gray-400">Choose how ZeroWaste Meals contacts you</p>
            <div className="mt-3 divide-y divide-gray-100">
              <Toggle
                checked={notifications}
                onChange={setNotifications}
                label="New donations near me"
                hint="Instant alerts when surplus food is published in your city"
              />
              <Toggle
                checked={sms}
                onChange={setSms}
                label="Claim & pickup updates"
                hint="Get SMS updates when a claim is confirmed or collected"
              />
              <Toggle
                checked
                onChange={() => {}}
                label="Community digest"
                hint="A weekly impact summary of meals rescued"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <h2 className="font-display text-lg font-bold text-gray-900">Appearance</h2>
            <p className="text-xs text-gray-400">Pick the brand accent for your dashboard</p>
            <div className="mt-4 flex items-center gap-3">
              {THEMES.map((color) => (
                <button
                  key={color}
                  type="button"
                  aria-label={`Theme ${color}`}
                  onClick={() => setTheme(color)}
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                    theme === color ? 'ring-2 ring-gray-900 ring-offset-2' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color }}
                >
                  {theme === color && (
                    <svg viewBox="0 0 20 20" className="h-5 w-5 text-white" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 5.29a.75.75 0 01.006 1.06l-7.5 7.75a.75.75 0 01-1.08-.01l-3.75-4a.75.75 0 111.14-1.07l3.22 3.44 6.93-7.16a.75.75 0 011.06-.01z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-700 to-brand-900 p-5 text-white">
              <div>
                <p className="font-semibold">ZeroWaste Meals premium theme</p>
                <p className="text-xs text-emerald-100/80">Smooth greens, soft shadows, joyful clay imagery.</p>
              </div>
              <Badge color="brand" className="bg-white/20 text-white">Active</Badge>
            </div>
          </div>

          <div className="flex justify-end">
            <Button size="lg" onClick={handleSave} loading={saveLoading}>
              Save changes
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Settings