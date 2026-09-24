import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import { ROLES, ROLE_LABELS } from '../../utils/constants'

const ROLE_OPTIONS = [
  { value: ROLES.DONOR, label: ROLE_LABELS[ROLES.DONOR], hint: 'Restaurants, caterers, bakeries, hotels' },
  { value: ROLES.NGO, label: ROLE_LABELS[ROLES.NGO], hint: 'NGOs & community kitchens' },
]

export function RegisterForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.DONOR,
    organization: '',
    city: '',
  })
  const [errors, setErrors] = useState({})

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Full name is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    if (form.password.length < 6) nextErrors.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match'
    if (!form.city.trim()) nextErrors.city = 'City is required'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      const { confirmPassword, ...payload } = form
      onSubmit(payload)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        name="name"
        label="Full name"
        placeholder="Your name"
        autoComplete="name"
        value={form.name}
        onChange={(e) => setField('name', e.target.value)}
        error={errors.name}
      />

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">I am a</label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {ROLE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`cursor-pointer rounded-lg border p-3 transition ${
                form.role === option.value
                  ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={option.value}
                checked={form.role === option.value}
                onChange={() => setField('role', option.value)}
                className="sr-only"
              />
              <span className="block text-sm font-semibold text-gray-900">{option.label}</span>
              <span className="mt-0.5 block text-xs text-gray-500">{option.hint}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          name="email"
          type="email"
          label="Email address"
          placeholder="you@example.com"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setField('email', e.target.value)}
          error={errors.email}
        />

        <Input
          name="city"
          label="City"
          placeholder="e.g. Mumbai"
          value={form.city}
          onChange={(e) => setField('city', e.target.value)}
          error={errors.city}
        />
      </div>

      <Input
        name="organization"
        label="Organization (optional)"
        placeholder={form.role === ROLES.NGO ? 'NGO / trust name' : 'Business name'}
        value={form.organization}
        onChange={(e) => setField('organization', e.target.value)}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setField('password', e.target.value)}
          error={errors.password}
        />

        <Input
          name="confirmPassword"
          type="password"
          label="Confirm password"
          placeholder="••••••••"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setField('confirmPassword', e.target.value)}
          error={errors.confirmPassword}
        />
      </div>

      <Button type="submit" className="w-full" loading={loading}>
        Create account
      </Button>
    </form>
  )
}

export default RegisterForm