export const ROLES = {
  DONOR: 'DONOR',
  NGO: 'NGO',
  ADMIN: 'ADMIN',
}

export const ROLE_LABELS = {
  [ROLES.DONOR]: 'Donor',
  [ROLES.NGO]: 'NGO',
  [ROLES.ADMIN]: 'Admin',
}

export const FOOD_CATEGORIES = [
  { value: 'COOKED_MEAL', label: 'Cooked Meal' },
  { value: 'BAKERY', label: 'Bakery' },
  { value: 'DAIRY', label: 'Dairy' },
  { value: 'FRESH_PRODUCE', label: 'Fresh Produce' },
  { value: 'PACKAGED', label: 'Packaged Food' },
  { value: 'BEVERAGE', label: 'Beverage' },
  { value: 'OTHER', label: 'Other' },
]

export const CATEGORY_LABELS = Object.fromEntries(
  FOOD_CATEGORIES.map((c) => [c.value, c.label]),
)

export const LISTING_STATUS = {
  AVAILABLE: 'AVAILABLE',
  CLAIMED: 'CLAIMED',
  COLLECTED: 'COLLECTED',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED',
}

export const STATUS_LABELS = {
  [LISTING_STATUS.AVAILABLE]: 'Available',
  [LISTING_STATUS.CLAIMED]: 'Claimed',
  [LISTING_STATUS.COLLECTED]: 'Collected',
  [LISTING_STATUS.EXPIRED]: 'Expired',
  [LISTING_STATUS.CANCELLED]: 'Cancelled',
}

export const STORAGE_KEYS = {
  TOKEN: 'zerowaste_meals_token',
  USER: 'zerowaste_meals_user',
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL

/**
 * Resolves the STOMP endpoint used for real-time notifications.
 *
 * VITE_WS_BASE_URL wins when present. Otherwise the socket origin is derived from the REST base by
 * stripping the trailing "/api", so `http://localhost:8080/api` becomes `http://localhost:8080/ws`
 * and the Render deployment resolves itself with no extra configuration.
 */
function resolveWebSocketUrl() {
  const explicit = import.meta.env.VITE_WS_BASE_URL
  if (explicit) return explicit.replace(/\/+$/, '')

  const fromApi = (API_BASE_URL || '').replace(/\/+$/, '').replace(/\/api$/, '')
  return `${fromApi}/ws`
}

export const WS_BASE_URL = resolveWebSocketUrl()
export const WS_NOTIFICATION_DESTINATION = '/user/queue/notifications'

export const NOTIFICATION_TYPES = {
  NEW_DONATION: 'NEW_DONATION',
  DONATION_ACCEPTED: 'DONATION_ACCEPTED',
  PICKUP_STARTED: 'PICKUP_STARTED',
  PICKUP_COMPLETED: 'PICKUP_COMPLETED',
  SYSTEM_ALERT: 'SYSTEM_ALERT',
}

export const NOTIFICATION_TYPE_META = {
  [NOTIFICATION_TYPES.NEW_DONATION]: {
    label: 'New donation',
    icon: 'donate',
    accent: 'border-emerald-200 bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  [NOTIFICATION_TYPES.DONATION_ACCEPTED]: {
    label: 'Donation accepted',
    icon: 'claim',
    accent: 'border-blue-200 bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  [NOTIFICATION_TYPES.PICKUP_STARTED]: {
    label: 'Pickup started',
    icon: 'location',
    accent: 'border-orange-200 bg-orange-50',
    iconBg: 'bg-orange-100 text-orange-700',
    dot: 'bg-orange-500',
  },
  [NOTIFICATION_TYPES.PICKUP_COMPLETED]: {
    label: 'Pickup completed',
    icon: 'upload',
    accent: 'border-purple-200 bg-purple-50',
    iconBg: 'bg-purple-100 text-purple-700',
    dot: 'bg-purple-500',
  },
  [NOTIFICATION_TYPES.SYSTEM_ALERT]: {
    label: 'System alert',
    icon: 'alert',
    accent: 'border-red-200 bg-red-50',
    iconBg: 'bg-red-100 text-red-700',
    dot: 'bg-red-500',
  },
}

export const NOTIFICATION_FILTERS = {
  ALL: 'ALL',
  UNREAD: 'UNREAD',
  READ: 'READ',
}

export const MAX_IMAGE_SIZE_MB = 5