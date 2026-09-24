import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'

export function LoginForm({ onSubmit, loading = false }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    if (!form.password) nextErrors.password = 'Password is required'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      onSubmit(form)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        name="password"
        type="password"
        label="Password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={form.password}
        onChange={(e) => setField('password', e.target.value)}
        error={errors.password}
      />

      <Button type="submit" className="w-full" loading={loading}>
        Sign in
      </Button>
    </form>
  )
}

export default LoginForm