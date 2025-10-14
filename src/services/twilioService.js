import { apiAdmin1 } from './api.js';

export const twilioService = {
  /**
   * Envía un mensaje de verificación WhatsApp a un número
   * @param {string} phoneNumber - Número de teléfono con código país, ej: 51987654321
   * @param {string} message - Mensaje que se enviará
   * @returns {Promise}
   */
  enviarMensaje(phoneNumber, message) {
    if (!phoneNumber || !/^\d{9,15}$/.test(phoneNumber)) {
      return Promise.reject(new Error('Debe proporcionar un número de teléfono válido'));
    }
    if (!message || message.trim().length === 0) {
      return Promise.reject(new Error('El mensaje no puede estar vacío'));
    }

    // Llama a tu backend, que usa Twilio para enviar WhatsApp
    return apiAdmin1.post('/twilio/send-message', {
      phone: phoneNumber,
      message: message
    });
  }
};
