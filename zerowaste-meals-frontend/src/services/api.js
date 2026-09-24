import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import storage from '../utils/storage'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = storage.getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Something went wrong'
    if (error.response?.status === 401) {
      storage.clear()
      window.dispatchEvent(new Event('auth:unauthorized'))
    }
    return Promise.reject(new Error(message))
  },
)

export default api