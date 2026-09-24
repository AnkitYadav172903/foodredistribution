import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { useToast } from '../../context/ToastContext'
import donationService from '../../services/donationService'
import claimService from '../../services/claimService'
import Button from '../../components/common/Button'
import StatCard from '../../components/dashboard/StatCard'
import {
  ChartCard,
  DonationAnalyticsChart,
  MonthlyImpactChart,
  SurplusTrendChart,
  WeeklyActivityChart,
} from '../../components/dashboard/ChartCard'
import DonationTable from '../../components/dashboard/DonationTable'
import { TableSkeleton } from '../../components/common/Skeleton'
import avatarIllustration from '../../assets/illustrations/donate-card.png'
import ngoIllustration from '../../assets/illustrations/ngo-card.png'
import wasteIllustration from '../../assets/illustrations/waste-card.png'
import claimIllustration from '../../assets/illustrations/claim-success.png'
import analyticsIllustration from '../../assets/illustrations/analytics.png'
import welcomeHero from '../../assets/illustrations/welcome-hero.png'
import { ROLES, LISTING_STATUS, CATEGORY_LABELS } from '../../utils/constants'

const SURPLUS_TREND = [
  { label: 'Mon', donations: 42, claims: 31 },
  { label: 'Tue', donations: 56, claims: 40 },
  { label: 'Wed', donations: 48, claims: 36 },
  { label: 'Thu', donations: 67, claims: 51 },
  { label: 'Fri', donations: 74, claims: 58 },
  { label: 'Sat', donations: 88, claims: 66 },
  { label: 'Sun', donations: 61, claims: 44 },
]

const DEFAULT_ANALYTICS = [
  { name: 'Biryani', donations: 42 },
  { name: 'Curry', donations: 35 },
  { name: 'Bakery', donations: 28 },
  { name: 'Rice', donations: 24 },
  { name: 'Sweets', donations: 12 },
]

const WEEKLY_ACTIVITY = [
  { day: 'Mon', listed: 28, claimed: 21 },
  { day: 'Tue', listed: 34, claimed: 26 },
  { day: 'Wed', listed: 30, claimed: 24 },
  { day: 'Thu', listed: 41, claimed: 33 },
  { day: 'Fri', listed: 45, claimed: 36 },
  { day: 'Sat', listed: 52, claimed: 41 },
  { day: 'Sun', listed: 38, claimed: 29 },
]

const MONTHLY_IMPACT = [
  { name: 'Donated', value: 380 },
  { name: 'Claimed', value: 310 },
  { name: 'Collected', value: 260 },
  { name: 'Pending', value: 90 },
  { name: 'Expired', value: 30 },
]

function heroCta(user) {
  if (user.role === ROLES.ADMIN) return { to: '/admin', label: 'Open Admin Panel' }
  if (user.role === ROLES.NGO) return { to: '/available-food', label: 'Find Food Nearby' }
  return { to: '/donate', label: 'Donate Food' }
}

export function Dashboard() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [listings, setListings] = useState([])
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [listingsData, claimsData] = await Promise.all([
        donationService.getListings(),
        user?.role === ROLES.NGO ? claimService.getMyClaims() : Promise.resolve([]),
      ])
      setListings(listingsData || [])
      setClaims(claimsData || [])
    } catch (err) {
      toast.info('Live data is unavailable right now — showing a preview.')
    } finally {
      setLoading(false)
    }
  }, [user?.role, toast])

  useEffect(() => {
    load()
  }, [load])

  const handleClaim = async (listing) => {
    if (claiming) return
    setClaiming(true)
    try {
      await claimService.claimListing(listing.id)
      toast.success(`"${listing.title}" claimed successfully!`)
      await load()
    } catch (err) {
      toast.error(err.message || 'Could not claim this listing.')
    } finally {
      setClaiming(false)
    }
  }

  const qty = (l) => Number(l.quantity) || 0
  const mealsDonated = listings
    .filter((l) => l.status !== LISTING_STATUS.CANCELLED)
    .reduce((sum, l) => sum + qty(l), 0)
  const ngoConnected = new Set(
    listings.map((l) => l.donor?.id || l.donorName || l.id),
  ).size
  const wasteSaved = Math.round(mealsDonated * 0.8)
  const mealsClaimed =
    user?.role === ROLES.NGO
      ? claims.length
      : listings.filter((l) => l.status === LISTING_STATUS.COLLECTED).length

  const analyticsData = useAnalytics(listings)

  const cta = heroCta(user)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-brand-900 p-6 shadow-lift sm:p-8">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(35rem 20rem at 90% 0%, rgba(16,185,129,0.4), transparent 60%), radial-gradient(24rem 16rem at 5% 100%, rgba(52,211,153,0.2), transparent 60%)',
          }}
        />
        <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:justify-between">
          <div className="max-w-xl text-center lg:text-left">
            <p className="text-sm font-medium text-emerald-300">Welcome back,</p>
            <h1 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
              {user?.name || 'Earth Hero'}! Let&apos;s reduce food waste together.
            </h1>
            <p className="mt-2 text-emerald-100/80">
              Every surplus meal you share puts food on a plate that would otherwise go to a bin.
            </p>
            <Link to={cta.to}>
              <Button size="lg" className="mt-5">
                {cta.label}
              </Button>
            </Link>
          </div>
          <img
            src={welcomeHero}
            alt=""
            className="h-44 w-44 object-contain drop-shadow-2xl sm:h-52 sm:w-52"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          image={avatarIllustration}
          label="Meals Donated"
          value={mealsDonated}
          trend="+12% this month"
        />
        <StatCard
          image={ngoIllustration}
          label="NGOs Connected"
          value={ngoConnected}
          trend="Verified partners"
        />
        <StatCard
          image={wasteIllustration}
          label="Food Waste Saved"
          value={wasteSaved}
          suffix=" kg"
          trend="Landfill avoided"
        />
        <StatCard
          image={claimIllustration}
          label="Meals Claimed"
          value={mealsClaimed}
          trend="Shared gently"
        />
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ChartCard
          title="Surplus Trend"
          subtitle="Donations vs claims this week"
          wide
        >
          <SurplusTrendChart data={SURPLUS_TREND} />
        </ChartCard>
        <ChartCard title="Donation Analytics" subtitle="Top categories donated">
          <DonationAnalyticsChart data={analyticsData} />
        </ChartCard>
        <ChartCard title="Weekly Activity" subtitle="Listed vs claimed daily">
          <WeeklyActivityChart data={WEEKLY_ACTIVITY} />
        </ChartCard>
        <ChartCard title="Monthly Impact" subtitle="Meal journey so far">
          <MonthlyImpactChart data={MONTHLY_IMPACT} />
        </ChartCard>
        <ChartCard title="Where the magic happens" subtitle="Food shared, tracked, delivered">
          <div className="flex h-full items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-white">
            <img
              src={analyticsIllustration}
              alt="Analytics illustration"
              className="h-44 w-44 object-contain"
            />
          </div>
        </ChartCard>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-gray-900">Recent Donations</h2>
            <p className="text-xs text-gray-400">Track surplus food from listing to collection</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm('Refresh donation data?')) load()
            }}
          >
            Refresh
          </Button>
        </div>
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <DonationTable
            listings={listings}
            loading={loading}
            role={user?.role}
            onClaim={handleClaim}
          />
        )}
      </section>
    </div>
  )
}

function useAnalytics(listings) {
  const counts = {}
  listings.forEach((l) => {
    const key = CATEGORY_LABELS[l.category] || l.category
    if (!key) return
    counts[key] = (counts[key] || 0) + 1
  })
  const entries = Object.entries(counts)
  if (!entries.length) return DEFAULT_ANALYTICS
  const sorted = entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, donations: count }))
  if (sorted.length < 3) return DEFAULT_ANALYTICS
  return sorted
}

export default Dashboard