import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import RegisterForm from '../../components/forms/RegisterForm'
import AuthLayout from '../../components/layout/AuthLayout'
import useAuth from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'

export function Register() {
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    setError('')
    setLoading(true)
    try {
      await register(values)
      toast.success('Account created! Please sign in to continue.')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.message || 'Registration failed. Try again.')
      toast.error(err.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Join ZeroWaste Meals" subtitle="Donate surplus food or claim it for your community.">
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <RegisterForm onSubmit={handleSubmit} loading={loading} />
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  )
}

export default Register