import { useEffect, useState } from 'react'
import {
  ChartCard,
  DonationAnalyticsChart,
  MonthlyImpactChart,
  SurplusTrendChart,
  WeeklyActivityChart,
} from '../../components/dashboard/ChartCard'
import DonationTable from '../../components/dashboard/DonationTable'
import { TableSkeleton } from '../../components/common/Skeleton'
import donationService from '../../services/donationService'
import { useToast } from '../../context/ToastContext'
import analyticsImage from '../../assets/illustrations/analytics.png'

const TREND = [
  { label: 'Mon', donations: 42, claims: 31 },
  { label: 'Tue', donations: 56, claims: 40 },
  { label: 'Wed', donations: 48, claims: 36 },
  { label: 'Thu', donations: 67, claims: 51 },
  { label: 'Fri', donations: 74, claims: 58 },
  { label: 'Sat', donations: 88, claims: 66 },
  { label: 'Sun', donations: 61, claims: 44 },
]

const WEEKLY = [
  { day: 'Mon', listed: 28, claimed: 21 },
  { day: 'Tue', listed: 34, claimed: 26 },
  { day: 'Wed', listed: 30, claimed: 24 },
  { day: 'Thu', listed: 41, claimed: 33 },
  { day: 'Fri', listed: 45, claimed: 36 },
  { day: 'Sat', listed: 52, claimed: 41 },
  { day: 'Sun', listed: 38, claimed: 29 },
]

const MONTHLY = [
  { name: 'Donated', value: 380 },
  { name: 'Claimed', value: 310 },
  { name: 'Collected', value: 260 },
  { name: 'Pending', value: 90 },
  { name: 'Expired', value: 30 },
]

const CATEGORY_DATA = [
  { name: 'Biryani', donations: 42 },
  { name: 'Curry', donations: 35 },
  { name: 'Bakery', donations: 28 },
  { name: 'Rice', donations: 24 },
  { name: 'Sweets', donations: 12 },
]

export function Reports() {
  const { toast } = useToast()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    donationService
      .getListings()
      .then((data) => {
        if (mounted) setListings(data || [])
      })
      .catch(() => {
        if (mounted) toast.info('Live data unavailable — showing a preview.')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [toast])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            How surplus food flows through ZeroWaste Meals
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
          <img src={analyticsImage} alt="" className="h-6 w-6 object-contain" />
          Live snapshot
        </span>
      </div>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <ChartCard title="Surplus Trend" subtitle="Donations vs claims this week" wide>
          <SurplusTrendChart data={TREND} />
        </ChartCard>
        <ChartCard title="Donation Analytics" subtitle="Top categories donated">
          <DonationAnalyticsChart data={CATEGORY_DATA} />
        </ChartCard>
        <ChartCard title="Weekly Activity" subtitle="Listed vs claimed daily" wide>
          <WeeklyActivityChart data={WEEKLY} />
        </ChartCard>
        <ChartCard title="Monthly Impact" subtitle="Meal journey so far">
          <MonthlyImpactChart data={MONTHLY} />
        </ChartCard>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
        <div className="mb-4">
          <h2 className="font-display text-lg font-bold text-gray-900">Donation Log</h2>
          <p className="text-xs text-gray-400">Full listing history used to build these reports</p>
        </div>
        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : (
          <DonationTable listings={listings} loading={loading} role="DONOR" />
        )}
      </section>
    </div>
  )
}

export default Reports