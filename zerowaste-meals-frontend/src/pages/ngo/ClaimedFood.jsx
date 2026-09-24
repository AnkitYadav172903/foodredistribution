import { useCallback, useEffect, useMemo, useState } from 'react'
import ListingCard from '../../components/cards/ListingCard'
import Badge from '../../components/common/Badge'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { SkeletonCard } from '../../components/common/Skeleton'
import claimService from '../../services/claimService'
import { useToast } from '../../context/ToastContext'
import emptyCartImage from '../../assets/illustrations/empty-cart.png'

const FILTERS = [
  { value: 'ALL', label: 'All claims' },
  { value: 'CLAIMED', label: 'Pending pickup' },
  { value: 'COLLECTED', label: 'Collected' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

const STATUS_COLORS = {
  CLAIMED: 'yellow',
  COLLECTED: 'blue',
  CANCELLED: 'red',
}

export function ClaimedFood() {
  const { toast } = useToast()
  const [claims, setClaims] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const loadClaims = useCallback(async () => {
    setLoading(true)
    try {
      setClaims(await claimService.getMyClaims())
    } catch (err) {
      toast.error(err.message || 'Could not load your claims.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadClaims()
  }, [loadClaims])

  const handleCancel = async (claimId) => {
    if (!window.confirm('Cancel this claim?')) return
    try {
      await claimService.cancelClaim(claimId)
      toast.success('Claim cancelled.')
      await loadClaims()
    } catch (err) {
      toast.error(err.message || 'Could not cancel claim.')
    }
  }

  const counts = useMemo(() => {
    return {
      ALL: claims.length,
      CLAIMED: claims.filter((c) => c.status === 'CLAIMED').length,
      COLLECTED: claims.filter((c) => c.status === 'COLLECTED').length,
      CANCELLED: claims.filter((c) => c.status === 'CANCELLED').length,
    }
  }, [claims])

  const filtered = claims.filter((claim) => filter === 'ALL' || claim.status === filter)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">My Claims</h1>
        <p className="mt-1 text-sm text-gray-500">Food your community has claimed across the network</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
              filter === f.value
                ? 'bg-brand-600 text-white shadow-glow'
                : 'bg-white text-gray-600 ring-1 ring-gray-200 hover:bg-gray-50'
            }`}
          >
            {f.label}
            <Badge color={filter === f.value ? 'gray' : STATUS_COLORS[f.value] || 'gray'}>
              {counts[f.value] || 0}
            </Badge>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          image={emptyCartImage}
          title={
            filter === 'ALL'
              ? "You haven't claimed any food yet"
              : `No ${filter.toLowerCase()} claims`
          }
          description="Browse available food and claim listings to feed your community."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((claim) => {
            const listing = {
              id: claim.donationId,
              title: claim.donationTitle,
              imageUrl: claim.imageUrl,
              location: claim.location,
              donorName: claim.donorName,
              status: claim.status,
              claimedBy: { name: claim.ngoName || 'You' },
            }
            return (
              <ListingCard
                key={claim.id}
                listing={listing}
                actions={
                  claim.status === 'CLAIMED' ? (
                    <Button variant="danger" size="sm" onClick={() => handleCancel(claim.id)}>
                      Cancel claim
                    </Button>
                  ) : null
                }
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ClaimedFood