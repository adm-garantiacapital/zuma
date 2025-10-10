import { apiAdmin1 } from './api.js';

export const bidService = {
  /**
   * 🔹 Registrar una oferta (bid)
   * @param {number|string} solicitudBidId - ID del solicitud_bid
   * @returns {Promise} Promise con la respuesta de la API
   */
  create(solicitudBidId) {
    return apiAdmin1.post('/bids', { 
      solicitud_bid_id: solicitudBidId 
    });
  },

  createSubasta(solicitudBidId) {
    return apiAdmin1.post('/bids', { 
      solicitud_bid_id: solicitudBidId 
    });
  },
  /**
   * 🔹 Obtener todas las ofertas de un solicitud_bid
   * @param {number|string} solicitudBidId - ID del solicitud_bid
   * @returns {Promise} Promise con la lista de bids
   */
  getBySolicitudBid(solicitudBidId) {
    return apiAdmin1.get(`/bids/solicitud-bid/${solicitudBidId}`);
  }
};