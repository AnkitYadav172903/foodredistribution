import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import LoginForm from '../../components/forms/LoginForm'
import AuthLayout from '../../components/layout/AuthLayout'
import useAuth from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import { ROLES } from '../../utils/constants'

function homeFor(user) {
  if (user.role === ROLES.ADMIN) return '/admin'
  if (user.role === ROLES.NGO) return '/available-food'
  return '/dashboard'
}

export function Login() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setError('')
    setLoading(true)
    try {
      const user = await login(values)
      toast.success(`Welcome back, ${user.name || 'friend'}!`)
      const from = location.state?.from?.pathname || homeFor(user)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password')
      toast.error(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your ZeroWaste Meals account.">
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <LoginForm onSubmit={handleSubmit} loading={loading} />
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Login