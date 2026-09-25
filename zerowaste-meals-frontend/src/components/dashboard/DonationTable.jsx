import { useState } from 'react'
import Badge from '../common/Badge'
import Button from '../common/Button'
import { ImagePreviewModal } from '../common/Modal'
import EmptyState from '../common/EmptyState'
import { CATEGORY_LABELS, LISTING_STATUS, STATUS_LABELS } from '../../utils/constants'
import { formatDateTime } from '../../utils/formatDate'
import { resolveMediaUrl } from '../../utils/media'
import defaultFoodImage from '../../assets/images/rice.jpg'
import emptyCart from '../../assets/illustrations/empty-cart.png'

const STATUS_COLORS = {
  [LISTING_STATUS.AVAILABLE]: 'green',
  [LISTING_STATUS.CLAIMED]: 'yellow',
  [LISTING_STATUS.COLLECTED]: 'blue',
  [LISTING_STATUS.EXPIRED]: 'red',
  [LISTING_STATUS.CANCELLED]: 'gray',
}

export function DonationTable({ listings, loading, role, onClaim }) {
  const [preview, setPreview] = useState(null)

  if (loading) return null

  if (!listings.length) {
    return (
      <EmptyState
        image={emptyCart}
        title="No donations yet"
        description="Recent food donations will show up here as soon as they are published."
      />
    )
  }

  const isClaimable = (listing) =>
    role === 'NGO' && listing.status === LISTING_STATUS.AVAILABLE

  return (
    <>
      <div className="hidden overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/80 text-xs uppercase tracking-wider text-gray-400">
              <th className="px-5 py-3.5 font-semibold">Food</th>
              <th className="px-5 py-3.5 font-semibold">Donor</th>
              <th className="px-5 py-3.5 font-semibold">Status</th>
              <th className="px-5 py-3.5 font-semibold">Pickup Time</th>
              <th className="px-5 py-3.5 font-semibold">Location</th>
              <th className="px-5 py-3.5 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {listings.map((listing) => (
              <tr key={listing.id} className="transition hover:bg-brand-50/40">
                <td className="px-5 py-3.5">
                  <button
                    type="button"
                    onClick={() => setPreview(listing)}
                    className="flex items-center gap-3 text-left"
                  >
                    <span className="h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200">
                      <img
                        src={resolveMediaUrl(listing.imageUrl) || defaultFoodImage}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </span>
                    <span>
                      <span className="block font-semibold text-gray-900">{listing.title}</span>
                      <span className="block text-xs text-gray-400">
                        {CATEGORY_LABELS[listing.category] || listing.category}
                      </span>
                    </span>
                  </button>
                </td>
                <td className="px-5 py-3.5 text-gray-600">
                  {listing.donor?.name || listing.donorName || '—'}
                </td>
                <td className="px-5 py-3.5">
                  <Badge color={STATUS_COLORS[listing.status] || 'gray'} dot>
                    {STATUS_LABELS[listing.status] || listing.status}
                  </Badge>
                </td>
                <td className="px-5 py-3.5 text-gray-600">
                  {listing.pickupBy ? formatDateTime(listing.pickupBy) : '—'}
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-flex items-center gap-1.5 text-gray-600">
                    <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-600" fill="currentColor">
                      <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.674-.42.46-.36.96-.86 1.475-1.494C13.883 15.6 15.5 13.674 15.5 11a5.5 5.5 0 00-11 0c0 2.674 1.617 4.6 2.637 5.873.51.634 1.015 1.134 1.475 1.494.228.18.488.324.674.42.118.06.234.107.307.14l.018.008.006.003zM10 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
                    </svg>
                    {listing.location || '—'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setPreview(listing)}>
                      View
                    </Button>
                    {isClaimable(listing) && onClaim && (
                      <Button size="sm" onClick={() => onClaim(listing)}>
                        Claim
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 md:hidden">
        {listings.map((listing) => (
          <button
            type="button"
            key={listing.id}
            onClick={() => setPreview(listing)}
            className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-4 text-left shadow-card transition hover:shadow-soft"
          >
            <span className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
              <img
                src={resolveMediaUrl(listing.imageUrl) || defaultFoodImage}
                alt={listing.title}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate font-semibold text-gray-900">{listing.title}</span>
                <Badge color={STATUS_COLORS[listing.status] || 'gray'} dot>
                  {STATUS_LABELS[listing.status] || listing.status}
                </Badge>
              </span>
              <span className="mt-1 block truncate text-xs text-gray-500">
                {listing.donor?.name || ''} · {listing.location || ''}
              </span>
              <span className="block text-xs text-gray-400">
                {listing.pickupBy ? `Pickup: ${formatDateTime(listing.pickupBy)}` : ''}
              </span>
            </span>
          </button>
        ))}
      </div>

      <ImagePreviewModal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        src={resolveMediaUrl(preview?.imageUrl) || defaultFoodImage}
        alt={preview?.title}
      />
    </>
  )
}

export default DonationTable