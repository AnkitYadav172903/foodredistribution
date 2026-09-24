import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PageLayout from '../components/layout/PageLayout'
import AppLayout from '../components/layout/AppLayout'
import { Loader } from '../components/common/Loader'
import useAuth from '../hooks/useAuth'
import { ROLES } from '../utils/constants'

const Home = lazy(() => import('../pages/Home').then((m) => ({ default: m.Home })))
const Login = lazy(() => import('../pages/auth/Login').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('../pages/auth/Register').then((m) => ({ default: m.Register })))
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard').then((m) => ({ default: m.Dashboard })))
const DonorPage = lazy(() => import('../pages/donor/DonorPage').then((m) => ({ default: m.DonorPage })))
const MyListings = lazy(() => import('../pages/donor/MyListings').then((m) => ({ default: m.MyListings })))
const AvailableFood = lazy(() => import('../pages/ngo/AvailableFood').then((m) => ({ default: m.AvailableFood })))
const ClaimedFood = lazy(() => import('../pages/ngo/ClaimedFood').then((m) => ({ default: m.ClaimedFood })))
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const Reports = lazy(() => import('../pages/reports/Reports').then((m) => ({ default: m.Reports })))
const Settings = lazy(() => import('../pages/settings/Settings').then((m) => ({ default: m.Settings })))

function SuspenseFallback() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader />
    </div>
  )
}

function RoleHome() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (user.role === ROLES.ADMIN) return <Navigate to="/admin" replace />
  if (user.role === ROLES.NGO) return <Navigate to="/available-food" replace />
  return <Navigate to="/dashboard" replace />
}

export function AppRoutes() {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/donate"
            element={
              <ProtectedRoute role={ROLES.DONOR}>
                <DonorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-listings"
            element={
              <ProtectedRoute role={ROLES.DONOR}>
                <MyListings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/available-food"
            element={
              <ProtectedRoute role={ROLES.NGO}>
                <AvailableFood />
              </ProtectedRoute>
            }
          />
          <Route
            path="/claimed-food"
            element={
              <ProtectedRoute role={ROLES.NGO}>
                <ClaimedFood />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<RoleHome />} />
      </Routes>
    </Suspense>
  )
}

export default AppRoutes