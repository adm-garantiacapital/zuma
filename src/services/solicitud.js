import { apiAdmin1 } from './api.js';

export const solicitudService = {
  /**
   * Obtiene una solicitud por su ID
   * @param {string|number} id
   * @returns {Promise} Promise con la respuesta de la API
   */
  getSolicitud(id) {
    return apiAdmin1.get(`/solicitud/${id}`);
  }
};

