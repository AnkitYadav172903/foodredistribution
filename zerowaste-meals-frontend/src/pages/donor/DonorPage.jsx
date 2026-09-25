import { useCallback, useEffect, useMemo, useState } from 'react'
import FoodForm from '../../components/forms/FoodForm'
import ListingCard from '../../components/cards/ListingCard'
import EmptyState from '../../components/common/EmptyState'
import Button from '../../components/common/Button'
import { ImagePreviewModal } from '../../components/common/Modal'
import { SkeletonCard } from '../../components/common/Skeleton'
import donationService from '../../services/donationService'
import uploadService from '../../services/uploadService'
import { useToast } from '../../context/ToastContext'
import { LISTING_STATUS } from '../../utils/constants'
import { resolveMediaUrl } from '../../utils/media'
import uploadIcon from '../../assets/icons/upload.png'
import locationIcon from '../../assets/icons/location.png'
import pickupLocationImage from '../../assets/illustrations/pickup-location.png'
import emptyDonationImage from '../../assets/illustrations/empty-cart.png'
import defaultFoodImage from '../../assets/images/rice.jpg'

export function DonorPage() {
  const { toast } = useToast()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [preview, setPreview] = useState(null)
  const [showForm, setShowForm] = useState(true)
  const [editing, setEditing] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setListings(await donationService.getMyListings())
    } catch (err) {
      toast.error(err.message || 'Could not load your listings.')
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const stats = useMemo(() => {
    return {
      total: listings.length,
      available: listings.filter((l) => l.status === LISTING_STATUS.AVAILABLE).length,
      claimed: listings.filter((l) => l.status === LISTING_STATUS.CLAIMED).length,
    }
  }, [listings])

  const handleSubmit = async (form) => {
    setSubmitting(true)
    try {
      let imageUrl = form.imageUrl || null
      if (form.image && typeof form.image !== 'string') {
        imageUrl = await uploadService.uploadImage(form.image)
      }
      const payload = {
        ...form,
        quantity: parseFloat(form.quantity),
        imageUrl,
      }
      if (editing) {
        await donationService.updateListing(editing.id, payload)
        toast.success('Listing updated successfully!')
      } else {
        await donationService.createListing(payload)
        toast.success('Listing published! Nearby NGOs have been notified.')
      }
      setEditing(null)
      setShowForm(false)
      await load()
    } catch (err) {
      toast.error(err.message || 'Could not save listing.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this listing permanently?')) return
    try {
      await donationService.deleteListing(id)
      toast.success('Listing removed.')
      await load()
    } catch (err) {
      toast.error(err.message || 'Could not delete listing.')
    }
  }

  const startEdit = (id) => {
    const listing = listings.find((l) => l.id === id)
    setEditing(listing)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-800 to-brand-900 p-6 shadow-lift sm:p-8">
        <img
          src={pickupLocationImage}
          alt=""
          className="pointer-events-none absolute -right-6 bottom-0 hidden h-56 w-56 object-contain opacity-30 lg:block"
        />
        <div className="relative max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Donor hub
          </p>
          <h1 className="mt-1 font-display text-2xl font-extrabold text-white sm:text-3xl">
            Share surplus food, save a meal.
          </h1>
          <p className="mt-2 text-emerald-100/80">
            Add your surplus food in minutes. A verified NGO near you picks it up within your chosen window.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {[
              ['Active listings', stats.total],
              ['Available now', stats.available],
              ['In pickup queue', stats.claimed],
            ].map(([label, value]) => (
              <span
                key={label}
                className="rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur"
              >
                {value} <span className="font-normal text-emerald-100/70">{label}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-gray-900">
                  {editing ? 'Edit listing' : 'Create a donation'}
                </h2>
                <p className="text-xs text-gray-400">
                  {editing ? `Editing: ${editing.title}` : 'Publish surplus food for nearby NGOs'}
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                <img src={locationIcon} alt="" className="h-5 w-5 object-contain" />
                Pickup: donor location
              </div>
            </div>

            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
              <img src={uploadIcon} alt="" className="h-10 w-10 rounded-xl object-contain" />
              <p className="text-sm text-brand-900">
                <span className="font-semibold">Tip:</span> add a clear photo of the food and set a
                realistic pickup time — listings with photos get claimed 2× faster.
              </p>
            </div>

            <FoodForm
              key={editing?.id || 'new'}
              initialValues={editing || {}}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditing(null)
              }}
              submitLabel={editing ? 'Save changes' : 'Publish listing'}
              loading={submitting}
            />

            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
              <img src={pickupLocationImage} alt="" className="h-14 w-14 rounded-xl object-cover" />
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-gray-800">How pickup works:</span> the NGO
                confirms the claim, then collects at your listed location within the pickup window.
                You&apos;re always in control.
              </p>
            </div>
          </div>
        </section>

        <section className="lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-card">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-lg font-bold text-gray-900">My Listings</h2>
                <p className="text-xs text-gray-400">{stats.total} food donations shared</p>
              </div>
              {!showForm && listings.length > 0 && (
                <Button size="sm" onClick={() => { setEditing(null); setShowForm(true) }}>
                  + New
                </Button>
              )}
            </div>

            {loading ? (
              <div className="space-y-4">
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : listings.length === 0 ? (
              <EmptyState
                image={emptyDonationImage}
                title="No donations yet"
                description="Publish your first surplus food listing — someone nearby probably needs it."
                action={
                  <Button onClick={() => { setEditing(null); setShowForm(true) }}>
                    Add your first listing
                  </Button>
                }
              />
            ) : (
              <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
                {listings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onEdit={startEdit}
                    onDelete={handleDelete}
                    actions={
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(listing)
                        }}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
                      >
                        View
                      </button>
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      <ImagePreviewModal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        src={resolveMediaUrl(preview?.imageUrl) || defaultFoodImage}
        alt={preview?.title}
      />
    </div>
  )
}

export default DonorPage