import api from './api'
import { MAX_IMAGE_SIZE_MB } from '../utils/constants'

export const uploadService = {
  async uploadImage(file) {
    if (!file) return null
    if (!file.type?.startsWith('image/')) {
      throw new Error('Please select a valid image file.')
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      throw new Error(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB.`)
    }
    const formData = new FormData()
    formData.append('file', file)
    const data = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data?.url || null
  },
}

export default uploadService