import { apiAdmin1 } from './api.js';

export const auctionService = {
  getAuctions(page = 1, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters
    });

    return apiAdmin1.get(`/subastadas?${params}`);
  },
  getAuction(id) {
    return apiAdmin1.get(`/subastadas/${id}`);
  },

  createAuction(data) {
    return apiAdmin1.post('/subastadas', data);
  },
  updateAuction(id, data) {
    return apiAdmin1.put(`/subastadas/${id}`, data);
  },

  deleteAuction(id) {
    return apiAdmin1.delete(`/subastadas/${id}`);
  },

  placeBid(bidData) {
    return apiAdmin1.post('/investments', bidData);
  }
};
