import Badge from '../common/Badge'
import { CATEGORY_LABELS, LISTING_STATUS, STATUS_LABELS } from '../../utils/constants'
import { formatDateTime } from '../../utils/formatDate'
import defaultFoodImage from '../../assets/images/pizza.jpg'

const STATUS_COLORS = {
  [LISTING_STATUS.AVAILABLE]: 'green',
  [LISTING_STATUS.CLAIMED]: 'yellow',
  [LISTING_STATUS.COLLECTED]: 'blue',
  [LISTING_STATUS.EXPIRED]: 'red',
  [LISTING_STATUS.CANCELLED]: 'gray',
}

export function ListingCard({ listing, onEdit, onDelete, actions }) {
  const { id, title, category, quantity, description, imageUrl, location, pickupBy, status, claimedBy, claimedByName } = listing

  const claimedLabel =
    claimedBy?.name || claimedByName || (claimedBy && typeof claimedBy === 'string' ? claimedBy : null)

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={imageUrl || defaultFoodImage}
            alt={title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            <Badge color={STATUS_COLORS[status] || 'gray'}>{STATUS_LABELS[status] || status}</Badge>
            <Badge color="brand">{CATEGORY_LABELS[category] || category}</Badge>
          </div>

          {description && <p className="mt-1 line-clamp-2 text-sm text-gray-500">{description}</p>}

          <dl className="mt-3 grid grid-cols-1 gap-1 text-sm text-gray-600 sm:grid-cols-2">
            <div><dt className="sr-only">Quantity</dt><dd><span className="font-medium text-gray-900">{quantity || 'N/A'}</span> qty</dd></div>
            {location && <div><dt className="sr-only">Location</dt><dd>📍 {location}</dd></div>}
            {pickupBy && <div><dt className="sr-only">Pickup by</dt><dd>Pickup by: {formatDateTime(pickupBy)}</dd></div>}
            {claimedLabel && <div><dt className="sr-only">Claimed by</dt><dd>Claimed by: {claimedLabel}</dd></div>}
          </dl>
        </div>

        {(actions || onEdit || onDelete) && (
          <div className="flex shrink-0 items-center gap-2">
            {actions}
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(id)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 transition hover:bg-gray-50"
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(id)}
                className="rounded-lg border border-red-300 px-3 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

export default ListingCard