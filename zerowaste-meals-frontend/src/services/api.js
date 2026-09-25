import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import storage from '../utils/storage'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
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
    if (error.response) {
      const message =
        error.response?.data?.message || error.message || 'Something went wrong'
      if (error.response?.status === 401) {
        storage.clear()
        window.dispatchEvent(new Event('auth:unauthorized'))
      }
      return Promise.reject(new Error(message))
    }

    if (error.code === 'ECONNABORTED') {
      return Promise.reject(
        new Error('The server took too long to respond. Please try again.'),
      )
    }

    return Promise.reject(
      new Error(
        'Cannot reach the server. It may still be starting up — please try again in a moment.',
      ),
    )
  },
)

export default api