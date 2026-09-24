import { useEffect, useState } from 'react'
import StatCard from '../../components/dashboard/StatCard'
import {
  ChartCard,
  DonationAnalyticsChart,
  MonthlyImpactChart,
  SurplusTrendChart,
} from '../../components/dashboard/ChartCard'
import DonationTable from '../../components/dashboard/DonationTable'
import { TableSkeleton } from '../../components/common/Skeleton'
import donationService from '../../services/donationService'
import { useToast } from '../../context/ToastContext'
import { LISTING_STATUS } from '../../utils/constants'
import analyticsImage from '../../assets/illustrations/analytics.png'
import mascotImage from '../../assets/illustrations/mascot-sidebar.png'
import donateCardImage from '../../assets/illustrations/donate-card.png'
import wasteCardImage from '../../assets/illustrations/waste-card.png'
import claimSuccessImage from '../../assets/illustrations/claim-success.png'

const TREND = [
  { label: 'Mon', donations: 42, claims: 31 },
  { label: 'Tue', donations: 56, claims: 40 },
  { label: 'Wed', donations: 48, claims: 36 },
  { label: 'Thu', donations: 67, claims: 51 },
  { label: 'Fri', donations: 74, claims: 58 },
  { label: 'Sat', donations: 88, claims: 66 },
  { label: 'Sun', donations: 61, claims: 44 },
]

const MONTHLY = [
  { name: 'Donated', value: 380 },
  { name: 'Claimed', value: 310 },
  { name: 'Collected', value: 260 },
  { name: 'Pending', value: 90 },
  { name: 'Expired', value: 30 },
]

export function AdminDashboard() {
  const { toast } = useToast()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await donationService.getListings()
        if (mounted) setListings(data || [])
      } catch (err) {
        if (mounted) toast.info('Live admin data unavailable right now — showing a preview.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [toast])

  const qty = (l) => Number(l.quantity) || 0
  const totalListings = listings.length
  const mealsDonated = listings
    .filter((l) => l.status !== LISTING_STATUS.CANCELLED)
    .reduce((sum, l) => sum + qty(l), 0)
  const collected = listings.filter((l) => l.status === LISTING_STATUS.COLLECTED).length
  const ngoConnected = new Set(listings.map((l) => l.donor?.id || l.donorName || l.id)).size

  const analytics = useAdminAnalytics(listings)

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 to-brand-900 p-6 shadow-lift sm:p-8">
        <div className="relative flex flex-col items-center justify-between gap-6 lg:flex-row">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
              Platform overview
            </p>
            <h1 className="mt-1 font-display text-2xl font-extrabold text-white sm:text-3xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-emerald-100/80">
              Real-time snapshot of every meal list that helps reduce food waste and feed communities.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {['Platform-wide', 'Live listings', 'Verified partners'].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <img
            src={analyticsImage}
            alt="Analytics illustration"
            className="h-44 w-44 object-contain drop-shadow-2xl"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard image={donateCardImage} label="Total Listings" value={totalListings} trend="All time" />
        <StatCard image={wasteCardImage} label="Meals Donated" value={mealsDonated} trend="+9% this week" />
        <StatCard image={claimSuccessImage} label="Collected" value={collected} trend="Completed pickups" />
        <StatCard image={mascotImage} label="Partners" value={ngoConnected} trend="Active today" />
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <ChartCard title="Donation Analytics" subtitle="Top categories donated" wide>
          <DonationAnalyticsChart data={analytics} />
        </ChartCard>
        <ChartCard title="Donor Activity" subtitle="Listings vs claims this week">
          <SurplusTrendChart data={TREND} />
        </ChartCard>
        <ChartCard title="Meal Journey" subtitle="Where every meal goes">
          <MonthlyImpactChart data={MONTHLY} />
        </ChartCard>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold text-gray-900">All Donations</h2>
          <p className="text-xs text-gray-400">Manage and monitor every listing on the platform</p>
        </div>
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <DonationTable listings={listings} loading={loading} role="ADMIN" />
        )}
      </section>
    </div>
  )
}

function useAdminAnalytics(listings) {
  const counts = {}
  listings.forEach((l) => {
    if (!l.category) return
    counts[l.category] = (counts[l.category] || 0) + 1
  })
  const entries = Object.entries(counts)
  const fallback = [
    { name: 'Biryani', donations: 42 },
    { name: 'Curry', donations: 35 },
    { name: 'Bakery', donations: 28 },
    { name: 'Rice', donations: 24 },
    { name: 'Sweets', donations: 12 },
  ]
  if (!entries.length) return fallback
  const sorted = entries
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name, donations: count }))
  return sorted.length < 3 ? fallback : sorted
}

export default AdminDashboard