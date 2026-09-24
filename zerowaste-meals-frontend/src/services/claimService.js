import api from './api'

export const claimService = {
  async claimListing(listingId) {
    return api.post(`/listings/${listingId}/claim`)
  },

  async cancelClaim(claimId) {
    return api.post(`/claims/${claimId}/cancel`)
  },

  async getMyClaims(params) {
    return api.get('/claims/my-claims', { params })
  },

  async confirmCollection(claimId) {
    return api.post(`/claims/${claimId}/confirm`)
  },

  async rejectClaim(claimId) {
    return api.post(`/claims/${claimId}/reject`)
  },

  async getClaimsForListing(listingId) {
    return api.get(`/listings/${listingId}/claims`)
  },
}

export default claimService