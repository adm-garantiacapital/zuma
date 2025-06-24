// services/auctionService.js
import apiClient from './api.js';

export const auctionService = {
  // Obtener subastas con filtros y paginación
  getAuctions(page = 1, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    return apiClient.get(`/subastadas?${params}`);
  },

  // Obtener subasta individual
  getAuction(id) {
    return apiClient.get(`/subastadas/${id}`);
  },

  // Crear una nueva subasta
  createAuction(data) {
    return apiClient.post('/subastadas', data);
  },

  // Actualizar una subasta
  updateAuction(id, data) {
    return apiClient.put(`/subastadas/${id}`, data);
  },

  // Eliminar subasta
  deleteAuction(id) {
    return apiClient.delete(`/subastadas/${id}`);
  },

  // Enviar una inversión (oferta) para una subasta
  placeBid(bidData) {
    // ✅ Esta es la ruta real esperada por tu backend
    return apiClient.post('/investments', bidData);
  }
};
