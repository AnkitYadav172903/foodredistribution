import { NavLink } from 'react-router-dom'
import logoMark from '../../assets/logo/logo-mark.svg'
import mascot from '../../assets/illustrations/mascot-sidebar.png'
import donateIcon from '../../assets/icons/donate.png'
import claimIcon from '../../assets/icons/claim.png'
import locationIcon from '../../assets/icons/location.png'
import userIcon from '../../assets/icons/user.png'
import uploadIcon from '../../assets/icons/upload.png'
import analyticsIcon from '../../assets/illustrations/analytics.png'
import { ROLES } from '../../utils/constants'
import useAuth from '../../hooks/useAuth'

const PREVIEW_ICON =
  'h-9 w-9 shrink-0 rounded-xl bg-white/10 p-1.5 object-contain transition duration-200'

export function Sidebar({ collapsed, mobileOpen, onClose, onToggle }) {
  const { user } = useAuth()

  const allItems = [
    { to: '/dashboard', label: 'Dashboard', icon: logoMark, roles: [ROLES.DONOR, ROLES.NGO] },
    { to: '/admin', label: 'Admin Dashboard', icon: userIcon, roles: [ROLES.ADMIN] },
    { to: '/donate', label: 'Donate Food', icon: donateIcon, roles: [ROLES.DONOR] },
    { to: '/my-listings', label: 'My Listings', icon: locationIcon, roles: [ROLES.DONOR] },
    { to: '/available-food', label: 'Claim Food', icon: claimIcon, roles: [ROLES.NGO] },
    { to: '/claimed-food', label: 'My Claims', icon: uploadIcon, roles: [ROLES.NGO] },
    { to: '/reports', label: 'Reports', icon: analyticsIcon, roles: [ROLES.DONOR, ROLES.NGO, ROLES.ADMIN] },
    { to: '/settings', label: 'Settings', icon: userIcon, roles: [ROLES.DONOR, ROLES.NGO, ROLES.ADMIN] },
  ]

  const items = user ? allItems.filter((item) => item.roles.includes(user.role)) : []

  const linkBase =
    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200'

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-900/50 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-brand-900 text-white transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className={`flex h-16 items-center gap-2.5 px-4 ${collapsed ? 'justify-center px-0' : ''}`}>
          <img
            src={logoMark}
            alt="ZeroWaste Meals"
            className="h-10 w-10 shrink-0"
          />
          {!collapsed && (
            <div className="min-w-0 leading-tight">
              <p className="font-display text-base font-bold">ZeroWaste Meals</p>
              <p className="text-[11px] text-emerald-200/70">Feed Communities</p>
            </div>
          )}
        </div>

        <div className={`no-scrollbar flex-1 space-y-1 overflow-y-auto px-3 py-4 ${collapsed ? 'px-2.5' : ''}`}>
          <div className={`mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-emerald-300/60 ${collapsed ? 'text-center' : ''}`}>
            {collapsed ? '•••' : 'Menu'}
          </div>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end={item.to === '/dashboard'}
              className={({ isActive }) =>
                `${linkBase} ${
                  isActive
                    ? 'bg-white/15 text-white shadow-inner ring-1 ring-white/10'
                    : 'text-emerald-100/80 hover:bg-white/10 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`
              }
              title={collapsed ? item.label : undefined}
            >
              <img src={item.icon} alt="" className={PREVIEW_ICON} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        <div className="p-3">
          {!collapsed ? (
            <div className="relative overflow-hidden rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
              <img
                src={mascot}
                alt="ZeroWaste Meals mascot"
                className="mx-auto -mt-2 h-28 w-28 object-contain drop-shadow animate-bounce-slow"
              />
              <p className="text-center text-xs font-medium text-emerald-100">
                Every meal you save makes a difference.
              </p>
            </div>
          ) : (
            <div className="flex justify-center">
              <img
                src={mascot}
                alt=""
                className="h-12 w-12 object-contain"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="m-3 mt-0 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-xs font-medium text-emerald-100/80 transition hover:bg-white/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
            {collapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
          {!collapsed && 'Collapse'}
        </button>
      </aside>
    </>
  )
}

export default Sidebar