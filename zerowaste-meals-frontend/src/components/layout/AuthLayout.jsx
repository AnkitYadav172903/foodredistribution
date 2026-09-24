import { Link } from 'react-router-dom'
import logoMark from '../../assets/logo/logo-mark.svg'
import welcomeHero from '../../assets/illustrations/welcome-hero.png'
import footerEarth from '../../assets/illustrations/footer-earth.png'

const STATS = [
  { value: '12,500+', label: 'Meals rescued' },
  { value: '240+', label: 'NGOs connected' },
  { value: '4,800 kg', label: 'Waste saved' },
]

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="relative hidden w-1/2 overflow-hidden bg-brand-900 lg:block">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(45rem 32rem at 80% 15%, rgba(16,185,129,0.4), transparent 60%), radial-gradient(36rem 28rem at 15% 85%, rgba(52,211,153,0.22), transparent 60%)',
          }}
        />
        <img
          src={footerEarth}
          alt=""
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-16 h-80 w-80 object-contain opacity-15"
        />
        <div className="relative flex h-full flex-col justify-between px-12 py-12">
          <Link to="/" className="flex w-fit items-center gap-3">
            <img src={logoMark} alt="ZeroWaste Meals logo" className="h-11 w-11" />
            <span className="leading-tight">
              <span className="block font-display text-xl font-bold text-white">ZeroWaste Meals</span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.2em] text-emerald-300">
                Reduce Waste · Feed Communities
              </span>
            </span>
          </Link>

          <div className="text-white">
            <img
              src={welcomeHero}
              alt="A community sharing meals"
              className="mx-auto mb-6 w-full max-w-md object-contain drop-shadow-2xl"
            />
            <h2 className="font-display text-3xl font-bold leading-tight">
              Where surplus food becomes shared meals.
            </h2>
            <p className="mt-3 max-w-md text-emerald-100/80">
              Join restaurants, caterers, NGOs and community kitchens reducing food waste together —
              one donation at a time.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur">
                <p className="font-display text-lg font-bold text-brand-300">{stat.value}</p>
                <p className="mt-1 text-[11px] text-emerald-100/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-12">
        <div className="absolute inset-0 lg:hidden">
          <img
            src={welcomeHero}
            alt=""
            className="h-full w-full object-cover opacity-10"
          />
        </div>
        <div className="relative w-full max-w-md">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-brand-600"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
              <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
            </svg>
            Back to home
          </Link>

          <div className="mb-8 lg:hidden">
            <img src={logoMark} alt="" className="h-12 w-12" />
          </div>

          <div className="glass animate-fade-in-up rounded-3xl border border-white/60 p-7 shadow-lift sm:p-9">
            <h1 className="font-display text-2xl font-bold text-gray-900">{title}</h1>
            <p className="mb-7 mt-1.5 text-sm text-gray-500">{subtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthLayout