import { API_BASE_URL } from './constants'

export const API_ORIGIN = (() => {
  if (!API_BASE_URL) return ''
  try {
    return new URL(API_BASE_URL).origin
  } catch {
    return ''
  }
})()

export function resolveMediaUrl(url) {
  if (!url) return ''
  if (/^(https?:)?\/\//i.test(url) || url.startsWith('data:')) return url
  if (url.startsWith('/') && API_ORIGIN) return `${API_ORIGIN}${url}`
  return url
}