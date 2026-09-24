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

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const MAX_IMAGE_SIZE_MB = 5