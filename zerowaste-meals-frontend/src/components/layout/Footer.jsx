import { Link } from 'react-router-dom'
import footerEarth from '../../assets/illustrations/footer-earth.png'
import mascot from '../../assets/illustrations/mascot-sidebar.png'
import logoMark from '../../assets/logo/logo-mark.svg'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-brand-900 text-white">
      <img
        src={footerEarth}
        alt=""
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 h-56 w-56 object-contain opacity-20"
      />
      <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <img src={logoMark} alt="ZeroWaste Meals logo" className="h-11 w-11" />
              <span className="leading-tight">
                <span className="block font-display text-lg font-bold">ZeroWaste Meals</span>
                <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-emerald-300">
                  Reduce Waste · Feed Communities
                </span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-emerald-100/70">
              We connect restaurants, households, and NGOs so surplus food reaches people who
              need it — one donation at a time.
            </p>
            <img
              src={mascot}
              alt="ZeroWaste Meals mascot"
              className="mt-4 hidden h-20 w-20 object-contain opacity-90 md:block"
            />
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-emerald-100/80">
              <li><Link to="/" className="transition hover:text-white">Home</Link></li>
              <li><Link to="/register" className="transition hover:text-white">Donate Food</Link></li>
              <li><Link to="/register" className="transition hover:text-white">Become an NGO Partner</Link></li>
              <li><Link to="/login" className="transition hover:text-white">Partner Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Our Mission
            </h4>
            <blockquote className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm italic leading-relaxed text-emerald-100/80">
              “No meal should go to waste while a neighbour goes hungry.”
            </blockquote>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-emerald-100/50 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} ZeroWaste Meals. All rights reserved.</p>
          <p>Made with 💚 to feed communities.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer