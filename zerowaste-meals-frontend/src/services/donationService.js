import api from './api'

export const donationService = {
  async createListing(payload) {
    return api.post('/donations', payload)
  },

  async getListings(params) {
    return api.get('/donations', { params })
  },

  async getListingById(id) {
    return api.get(`/donations/${id}`)
  },

  async getMyListings(params) {
    return api.get('/donations/my-listings', { params })
  },

  async updateListing(id, payload) {
    return api.put(`/donations/${id}`, payload)
  },

  async deleteListing(id) {
    return api.delete(`/donations/${id}`)
  },
}

export default donationService