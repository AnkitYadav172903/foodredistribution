import { STORAGE_KEYS } from './constants'

function parse(value) {
  try {
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

const storage = {
  get(key) {
    return parse(localStorage.getItem(key))
  },

  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },

  remove(key) {
    localStorage.removeItem(key)
  },

  clear() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
  },

  getToken() {
    return localStorage.getItem(STORAGE_KEYS.TOKEN)
  },

  setToken(token) {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  },

  getUser() {
    return parse(localStorage.getItem(STORAGE_KEYS.USER))
  },

  setUser(user) {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },
}

export default storage