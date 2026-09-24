import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import { StatCounter } from '../components/common/StatCounter'
import logoMark from '../assets/logo/logo-mark.svg'
import welcomeHero from '../assets/illustrations/welcome-hero.png'
import donateCard from '../assets/illustrations/donate-card.png'
import ngoCard from '../assets/illustrations/ngo-card.png'
import wasteCard from '../assets/illustrations/waste-card.png'
import pickupLocation from '../assets/illustrations/pickup-location.png'
import notification from '../assets/illustrations/notification.png'
import mascot from '../assets/illustrations/mascot-sidebar.png'
import donateIcon from '../assets/icons/donate.png'
import claimIcon from '../assets/icons/claim.png'
import locationIcon from '../assets/icons/location.png'
import userIcon from '../assets/icons/user.png'
import uploadIcon from '../assets/icons/upload.png'
import donut from '../assets/images/donut.jpg'
import biryani from '../assets/images/biryani.jpg'
import pizza from '../assets/images/pizza.jpg'
import rice from '../assets/images/rice.jpg'

const FEATURES = [
  {
    icon: donateIcon,
    title: 'Donate surplus food',
    description: 'Restaurants, caterers and households list leftover food in minutes instead of throwing it away.',
  },
  {
    icon: claimIcon,
    title: 'Claim for communities',
    description: 'NGOs and community kitchens browse nearby listings and claim what they need instantly.',
  },
  {
    icon: locationIcon,
    title: 'Local, fast, fresh',
    description: 'City-wise matching keeps pickup distances short so food stays fresh and safe.',
  },
]

const ROLE_CARDS = [
  {
    image: donateCard,
    badge: 'For Donors & Businesses',
    title: 'Turn surplus into impact',
    description: 'Publish surplus cooked meals, bakery items and produce — we match you with verified NGOs near you.',
    to: '/register',
    cta: 'Start donating',
  },
  {
    image: ngoCard,
    badge: 'For NGOs & Kitchens',
    title: 'Feed your community',
    description: 'Find verified surplus food in your city and claim it in a single tap to feed those who need it most.',
    to: '/register',
    cta: 'Join as an NGO',
  },
  {
    image: wasteCard,
    badge: 'For the Planet',
    title: 'Less waste, more meals',
    description: 'Every rescued meal cuts landfill waste and greenhouse gas — food should fill plates, not dumps.',
    to: '/',
    cta: 'Learn more',
  },
]

const WORK_STEPS = [
  {
    step: '01',
    icon: uploadIcon,
    image: pickupLocation,
    title: 'Post a donation',
    description: 'Add photos, quantity and a pickup time. Your surplus food is live for nearby NGOs in seconds.',
  },
  {
    step: '02',
    icon: userIcon,
    image: notification,
    title: 'NGOs get notified',
    description: 'Partner NGOs in your area are instantly alerted, so nothing fresh sits around and goes to waste.',
  },
  {
    step: '03',
    icon: claimIcon,
    image: welcomeHero,
    title: 'Pickup & share',
    description: 'An NGO confirms and collects at a time that works for you. Every meal reaches a plate, not a bin.',
  },
]

const IMPACT = [
  { value: 12500, suffix: '+', label: 'Meals rescued' },
  { value: 240, suffix: '+', label: 'NGOs connected' },
  { value: 4800, suffix: ' kg', label: 'Food waste saved' },
  { value: 14, suffix: '', label: 'Cities served' },
]

const TESTIMONIALS = [
  {
    quote:
      'We used to throw away 40 plates of food every evening. Now those meals feed a children’s shelter nearby — every single day.',
    name: 'Priya Sharma',
    role: 'Restaurant Owner, Delhi',
  },
  {
    quote:
      'ZeroWaste Meals cut our kitchen operating cost and food waste in half within two months. The claim flow is effortless.',
    name: 'Rahul Verma',
    role: 'Caterer, Mumbai',
  },
  {
    quote:
      'As an NGO we receive fresh, verified food daily. The instant notifications mean we never miss a listing near our centre.',
    name: 'Asha Krishnan',
    role: 'Community Kitchen, Bengaluru',
  },
]

const FOOD_SAMPLES = [
  { src: donut, alt: 'Bakery items' },
  { src: biryani, alt: 'Cooked meals' },
  { src: rice, alt: 'Bulk servings' },
  { src: pizza, alt: 'Fresh food' },
]

export function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-brand-900">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(50rem 30rem at 85% 10%, rgba(16,185,129,0.35), transparent 60%), radial-gradient(40rem 28rem at 5% 90%, rgba(52,211,153,0.18), transparent 60%)',
          }}
        />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div className="animate-fade-in-up">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-medium text-emerald-100 backdrop-blur">
              <img src={logoMark} alt="" className="h-5 w-5" />
              Reduce Waste. Feed Communities.
            </div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl lg:text-[3.4rem]">
              Reduce Food Waste.
              <br />
              <span className="bg-gradient-to-r from-brand-300 via-emerald-200 to-brand-300 bg-clip-text text-transparent">
                Feed Communities.
              </span>
              <br />
              One Donation at a Time.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-emerald-100/85">
              The simplest way to share surplus food. Businesses and households post extra meals,
              and nearby NGOs collect them — turning waste into warmth.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="shadow-glow">
                  Donate Food
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/60 text-white hover:border-white hover:bg-white/10"
                >
                  Become NGO Partner
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute -inset-6 rounded-full bg-brand-400/20 blur-3xl" />
            <img
              src={welcomeHero}
              alt="Meals rescued and shared in the community"
              className="relative w-full rounded-3xl object-contain drop-shadow-2xl"
            />
            <div className="glass absolute -bottom-5 left-6 flex items-center gap-3 rounded-2xl border border-white/40 px-4 py-3 shadow-lift">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold text-gray-900">1,250+ meals</p>
                <p className="text-xs text-gray-500">rescued this week</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Why ZeroWaste Meals</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-gray-900">Surplus food, smartly shared</h2>
          <p className="mt-3 text-gray-500">
            One-third of all food produced worldwide is wasted, while millions go hungry. We fix that
            mismatch with a simple, trusted loop.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 transition duration-300 group-hover:scale-110 group-hover:bg-brand-100">
                <img src={feature.icon} alt="" className="h-11 w-11 rounded-xl object-contain" />
              </div>
              <h3 className="text-base font-bold text-gray-900">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="overflow-hidden bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">How it works</p>
              <h2 className="mt-2 font-display text-3xl font-bold text-gray-900">From surplus to supper in 3 steps</h2>
            </div>
            <Link to="/register">
              <Button variant="outline">Start sharing today</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {WORK_STEPS.map((step, idx) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <span className="absolute right-6 top-4 font-display text-6xl font-extrabold text-brand-50 transition group-hover:text-brand-100">
                  {step.step}
                </span>
                <img
                  src={step.image}
                  alt=""
                  className="mx-auto h-36 w-36 object-cover rounded-2xl transition duration-300 group-hover:scale-105" 
                />
                <h3 className="mt-5 flex items-center gap-2 text-lg font-bold text-gray-900">
                  <img src={step.icon} alt="" className="h-8 w-8 rounded-lg object-contain" />
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="relative overflow-hidden bg-brand-900 py-16">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(40rem 24rem at 15% 20%, rgba(16,185,129,0.3), transparent 60%), radial-gradient(30rem 20rem at 90% 80%, rgba(52,211,153,0.2), transparent 60%)',
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">Our impact</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-white">Growing every single day</h2>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {IMPACT.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/10 bg-white/5 p-7 text-center backdrop-blur transition duration-300 hover:bg-white/10"
              >
                <p className="font-display text-4xl font-extrabold text-brand-300">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm font-medium text-emerald-100/80">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Who we help</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-gray-900">One platform. Every side of the table.</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {ROLE_CARDS.map((card) => (
              <div
                key={card.title}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={card.image}
                    alt=""
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm backdrop-blur">
                    {card.badge}
                  </span>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{card.description}</p>
                  <Link
                    to={card.to}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition hover:gap-3 hover:text-brand-700"
                  >
                    {card.cta}
                    <span aria-hidden>&rarr;</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Testimonials</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-gray-900">Loved by donors & NGOs</h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <figure
                key={t.name}
                className="rounded-3xl border border-gray-100 bg-white p-7 shadow-card transition duration-300 hover:shadow-lift"
              >
                <div className="mb-4 flex gap-1 text-brand-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-sm leading-relaxed text-gray-600">“{t.quote}”</blockquote>
                <figcaption className="mt-5 border-t border-gray-100 pt-4">
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="community" className="relative overflow-hidden bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative order-2 lg:order-1">
            <div className="absolute -inset-4 rounded-3xl bg-brand-100/40 blur-2xl" />
            <img
              src={mascot}
              alt="ZeroWaste Meals mascot"
              className="relative mx-auto h-72 w-72 object-contain drop-shadow-xl"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-600">Join the movement</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-gray-900">
              Have surplus food? <br className="hidden sm:block" />
              Let&apos;s make it a shared meal.
            </h2>
            <p className="mt-4 max-w-xl text-gray-500">
              Whether you run a restaurant, a catering service, or a community kitchen, ZeroWaste Meals
              gives you a transparent, verified way to share food. No paperwork, no waste, no guilt.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-gray-600">
              {['Free for donors & NGOs', 'Verified partners only', 'Everything tracked on one dashboard'].map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <svg viewBox="0 0 20 20" className="h-3.5 w-3.5" fill="currentColor">
                      <path fillRule="evenodd" d="M16.704 5.29a.75.75 0 01.006 1.06l-7.5 7.75a.75.75 0 01-1.08-.01l-3.75-4a.75.75 0 111.14-1.07l3.22 3.44 6.93-7.16a.75.75 0 011.06-.01z" clipRule="evenodd" />
                    </svg>
                  </span>
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register"><Button size="lg">Create free account</Button></Link>
              <Link to="/login"><Button size="lg" variant="secondary">Partner login</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-2 font-display text-2xl font-bold text-gray-900 sm:text-3xl">What gets shared</h2>
        <p className="mb-6 text-gray-500">From today&apos;s biryani to surplus bakery stock — it all finds a home.</p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {FOOD_SAMPLES.map((item) => (
            <figure key={item.alt} className="group overflow-hidden rounded-2xl shadow-card">
              <img
                src={item.src}
                alt={item.alt}
                className="h-44 w-full object-cover transition duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <figcaption className="bg-white px-4 py-3 text-sm font-semibold text-gray-700">{item.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home