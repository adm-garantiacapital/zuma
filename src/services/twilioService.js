import { apiAdmin1 } from './api.js';

export const twilioService = {
  /**
   * Verifica el estado de verificación de WhatsApp de un teléfono
   * @param {string} phoneNumber - Número de teléfono (puede incluir código país)
   * @returns {Promise}
   */
  async verificarEstadoWhatsApp(phoneNumber) {
    if (!phoneNumber || phoneNumber.trim().length === 0) {
      return Promise.reject(new Error('Debe proporcionar un número de teléfono'));
    }

    try {
      const response = await apiAdmin1.get(`/twilio/check-phone/${phoneNumber}`);
      return response;
    } catch (error) {
      console.error('Error verificando estado de WhatsApp:', error);
      throw error;
    }
  }
};