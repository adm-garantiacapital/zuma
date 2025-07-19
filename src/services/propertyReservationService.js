import { apiAdmin1 } from './api.js';

export const propertyReservationService = {
  reserva(data) {
    return apiAdmin1.post('/reservas', data);
  },
  createReservation(data) {
    return apiAdmin1.post('/reservas', data);
  }
};