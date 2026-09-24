import { Badge } from '../common/Badge'
import { CATEGORY_LABELS, LISTING_STATUS, STATUS_LABELS } from '../../utils/constants'
import { timeAgo, formatDateTime, timeUntil } from '../../utils/formatDate'
import defaultFoodImage from '../../assets/images/rice.jpg'

const STATUS_COLORS = {
  [LISTING_STATUS.AVAILABLE]: 'green',
  [LISTING_STATUS.CLAIMED]: 'yellow',
  [LISTING_STATUS.COLLECTED]: 'blue',
  [LISTING_STATUS.EXPIRED]: 'red',
  [LISTING_STATUS.CANCELLED]: 'gray',
}

export function FoodCard({ listing, onClaim, claimed }) {
  const { id, title, category, quantity, unit, imageUrl, location, createdAt, status, pickupBy } = listing

  const expires = (() => {
    if (!pickupBy) return null
    const diff = new Date(pickupBy).getTime() - Date.now()
    if (diff <= 0) return { label: 'Expiring soon', urgent: true }
    const hours = Math.ceil(diff / 3600000)
    return {
      label: hours <= 12 ? `Pickup in ~${hours}h` : `Pickup by ${formatDateTime(pickupBy)}`,
      urgent: hours <= 6,
    }
  })()

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative h-44 w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl || defaultFoodImage}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {status && (
            <Badge color={STATUS_COLORS[status] || 'gray'} dot>
              {STATUS_LABELS[status] || status}
            </Badge>
          )}
          {category && <Badge color="brand">{CATEGORY_LABELS[category] || category}</Badge>}
        </div>
        {(quantity || unit) && (
          <Badge color="gray" className="absolute bottom-3 left-3 bg-white/90 backdrop-blur">
            {quantity} {unit}
          </Badge>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>

        <div className="mt-2.5 space-y-1.5 text-sm text-gray-500">
          {listing.donorName && (
            <p className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold uppercase text-brand-700">
                {listing.donorName.charAt(0)}
              </span>
              <span className="font-medium text-gray-700">{listing.donorName}</span>
              <span className="text-xs text-gray-400">· {timeAgo(createdAt)}</span>
            </p>
          )}
          {location && (
            <p className="flex items-center gap-2">
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-brand-600" fill="currentColor">
                <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.674-.42.46-.36.96-.86 1.475-1.494C13.883 15.6 15.5 13.674 15.5 11a5.5 5.5 0 00-11 0c0 2.674 1.617 4.6 2.637 5.873.51.634 1.015 1.134 1.475 1.494.228.18.488.324.674.42.118.06.234.107.307.14l.018.008.006.003zM10 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" clipRule="evenodd" />
              </svg>
              {location}
            </p>
          )}
          {expires && (
            <p className={`flex items-center gap-2 font-medium ${expires.urgent ? 'text-red-600' : 'text-gray-600'}`}>
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
              </svg>
              {expires.label}
            </p>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <span className="text-xs text-gray-400">
            {listing.pickupBy ? `Expires ${timeUntil(pickupBy)}` : 'Flexible pickup'}
          </span>
          {onClaim && (
            <button
              type="button"
              onClick={() => onClaim(id)}
              disabled={claimed || status !== LISTING_STATUS.AVAILABLE}
              className="btn-ripple rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {claimed ? 'Claimed ✓' : 'Claim this food'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default FoodCard