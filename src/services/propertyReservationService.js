import { apiAdmin1 } from './api.js';

export const propertyReservationService = {
  async createReservation(payload) {
    try {
      const response = await apiAdmin1.post('/reservas', payload);
      return response.data;
    } catch (error) {
      console.error('Error al crear la reserva:', error.response?.data || error.message);
      throw error;
    }
  },
};
