import { useCallback, useEffect, useState } from 'react'
import FoodCard from '../../components/cards/FoodCard'
import EmptyState from '../../components/common/EmptyState'
import Input from '../../components/common/Input'
import { SkeletonCard } from '../../components/common/Skeleton'
import claimService from '../../services/claimService'
import donationService from '../../services/donationService'
import { useToast } from '../../context/ToastContext'
import { FOOD_CATEGORIES } from '../../utils/constants'
import emptyCartImage from '../../assets/illustrations/empty-cart.png'
import claimSuccessImage from '../../assets/illustrations/claim-success.png'
import ngoCardImage from '../../assets/illustrations/ngo-card.png'

export function AvailableFood() {
  const { toast } = useToast()
  const [listings, setListings] = useState([])
  const [claimedIds, setClaimedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [available, myClaims] = await Promise.all([
        donationService.getListings({ status: 'AVAILABLE' }),
        claimService.getMyClaims(),
      ])
      setListings(available || [])
      const resolved = (myClaims || []).filter((c) => c.status === 'CLAIMED')
      setClaimedIds(new Set(resolved.map((c) => c.donationId)))
    } catch (err) {
      toast.error(err.message || 'Could not load available food.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleClaim = async (listingId) => {
    setClaiming(true)
    setSuccessMsg('')
    try {
      await claimService.claimListing(listingId)
      setClaimedIds((prev) => new Set(prev).add(listingId))
      setSuccessMsg('Food claimed! The donor will arrange pickup.')
      toast.success('Food claimed! The donor will arrange pickup.')
      await loadData()
    } catch (err) {
      toast.error(err.message || 'Could not claim this listing.')
    } finally {
      setClaiming(false)
    }
  }

  const filtered = listings.filter((listing) => {
    const matchesSearch =
      !search ||
      listing.title?.toLowerCase().includes(search.toLowerCase()) ||
      listing.location?.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !category || listing.category === category
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 to-brand-900 p-6 shadow-lift sm:p-8">
        <img
          src={ngoCardImage}
          alt=""
          className="pointer-events-none absolute -bottom-4 -right-6 hidden h-56 w-56 object-contain opacity-25 lg:block"
        />
        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">NGO hub</p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-white sm:text-3xl">
            Fresh surplus food, ready to claim.
          </h1>
          <p className="mt-2 text-emerald-100/80">
            Nearby donors publish surplus meals every day. Claim before the pickup window closes.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="search"
              type="search"
              placeholder="Search by food or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="[&_input]:border-white/20 [&_input]:bg-white/10 [&_input]:text-white [&_input]:placeholder-emerald-100/60"
            />
            <div>
              <label htmlFor="category" className="sr-only">Filter by category</label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                <option value="" className="text-gray-900">All categories</option>
                {FOOD_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value} className="text-gray-900">{c.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {successMsg && (
        <div className="flex items-center gap-4 rounded-3xl border border-green-200 bg-green-50 px-5 py-4 animate-fade-in-up">
          <img src={claimSuccessImage} alt="" className="h-16 w-16 shrink-0 rounded-2xl object-cover" />
          <div>
            <p className="text-sm font-bold text-green-800">Claim confirmed</p>
            <p className="text-sm text-green-700">{successMsg}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          image={emptyCartImage}
          title={search || category ? 'No matching listings' : 'No food available right now'}
          description="New donations appear when businesses publish surplus food. Check back soon."
        />
      ) : (
        <>
          <p className="text-sm text-gray-500">
            Showing <span className="font-semibold text-gray-800">{filtered.length}</span> available listing{filtered.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((listing) => (
              <FoodCard
                key={listing.id}
                listing={listing}
                onClaim={handleClaim}
                claimed={claimedIds.has(listing.id) || claiming}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default AvailableFood