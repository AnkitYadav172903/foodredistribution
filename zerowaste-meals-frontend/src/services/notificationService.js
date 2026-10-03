import api from './api'

export const notificationService = {
  async getAll(params) {
    return api.get('/notifications', { params })
  },

  async getUnreadCount() {
    const data = await api.get('/notifications/unread-count')
    return data?.unreadCount ?? 0
  },

  async markAsRead(id) {
    return api.patch(`/notifications/read/${id}`)
  },

  async markAllAsRead() {
    return api.patch('/notifications/read-all')
  },

  async remove(id) {
    return api.delete(`/notifications/${id}`)
  },
}

export default notificationService
