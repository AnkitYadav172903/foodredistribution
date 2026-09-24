import { Navigate, useLocation } from 'react-router-dom'
import { Loader } from '../components/common/Loader'
import useAuth from '../hooks/useAuth'

export function ProtectedRoute({ role, children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    const fallback =
      user.role === 'ADMIN' ? '/admin' : user.role === 'NGO' ? '/available-food' : '/dashboard'
    return <Navigate to={fallback} replace />
  }

  return children
}

export default ProtectedRoute