import apiClient from './api.js';

export const auctionService = {
  getAuctions(page = 1, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    return apiClient.get(`/subastadas?${params}`);
  },
  
  getAuction(id) {
    return apiClient.get(`/subastadas/${id}`);
  },
  
  createAuction(data) {
    return apiClient.post('/subastadas', data);
  },
  
  updateAuction(id, data) {
    return apiClient.put(`/subastadas/${id}`, data);
  },
  
  deleteAuction(id) {
    return apiClient.delete(`/subastadas/${id}`);
  },
  
  placeBid(id, bidData) {
    return apiClient.post(`/subastadas/${id}/bid`, bidData);
  }
};