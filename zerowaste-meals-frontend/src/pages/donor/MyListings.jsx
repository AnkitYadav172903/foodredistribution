import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingCard from '../../components/cards/ListingCard'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { ImagePreviewModal } from '../../components/common/Modal'
import { SkeletonCard } from '../../components/common/Skeleton'
import donationService from '../../services/donationService'
import { useToast } from '../../context/ToastContext'
import emptyDonationImage from '../../assets/illustrations/empty-cart.png'
import defaultFoodImage from '../../assets/images/rice.jpg'

export function MyListings() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(null)

  const openDonate = useCallback(() => navigate('/donate'), [navigate])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setListings(await donationService.getMyListings())
    } catch (err) {
      toast.error(err.message || 'Could not load listings.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return
    try {
      await donationService.deleteListing(id)
      setListings((prev) => prev.filter((l) => l.id !== id))
      toast.success('Listing removed.')
    } catch (err) {
      toast.error(err.message || 'Could not delete listing.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="mt-1 text-sm text-gray-500">All the surplus food you have shared so far</p>
        </div>
        <Button onClick={openDonate}>New listing</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          image={emptyDonationImage}
          title="You have no listings"
          description="Share surplus food once you have it — it takes less than two minutes."
          action={<Button onClick={openDonate}>Add a listing</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onEdit={openDonate}
              onDelete={handleDelete}
              actions={
                <button
                  type="button"
                  onClick={() => setPreview(listing)}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
                >
                  View
                </button>
              }
            />
          ))}
        </div>
      )}

      <ImagePreviewModal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        src={preview?.imageUrl || defaultFoodImage}
        alt={preview?.title}
      />
    </div>
  )
}

export default MyListings