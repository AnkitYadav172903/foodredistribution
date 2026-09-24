import api from './api'
import storage from '../utils/storage'

export const authService = {
  async login(credentials) {
    const data = await api.post('/auth/login', credentials)
    storage.setToken(data.token)
    storage.setUser(data.user)
    return data.user
  },

  async register(payload) {
    const data = await api.post('/auth/register', payload)
    return data
  },

  async getCurrentUser() {
    const data = await api.get('/auth/me')
    storage.setUser(data)
    return data
  },

  logout() {
    storage.clear()
  },
}

export default authService