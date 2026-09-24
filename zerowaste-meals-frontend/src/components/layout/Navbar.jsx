import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import Button from '../common/Button'
import logoMark from '../../assets/logo/logo-mark.svg'
import defaultAvatar from '../../assets/avatar/default-avatar.png'
import { ROLES } from '../../utils/constants'

function dashboardPath(user) {
  if (user.role === ROLES.ADMIN) return '/admin'
  if (user.role === ROLES.NGO) return '/available-food'
  return '/dashboard'
}

export function Navbar() {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src={logoMark} alt="ZeroWaste Meals logo" className="h-10 w-10" />
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-brand-800">
              ZeroWaste Meals
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-600">
              Reduce Waste · Feed Communities
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <a
            href="#how-it-works"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
          >
            How it works
          </a>
          <a
            href="#impact"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
          >
            Impact
          </a>
          <a
            href="#community"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
          >
            Community
          </a>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs capitalize text-gray-500">{user.role?.toLowerCase()}</p>
              </div>
              <Link to={dashboardPath(user)}>
                <Button size="sm" className="gap-2">
                  <img
                    src={defaultAvatar}
                    alt=""
                    className="h-6 w-6 rounded-full object-cover ring-1 ring-white"
                  />
                  Open Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="secondary" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar