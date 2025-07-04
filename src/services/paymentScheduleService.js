import { apiAdmin1 } from './api.js';

export const paymentScheduleService = {
  getByPropertyId(propertyId) {
    return apiAdmin1.get(`/propiedad/${propertyId}/cronograma`);
  },

  getByPropertyInvestorId(propertyInvestorId) {
    return apiAdmin1.get(`/propiedad/${propertyInvestorId}/cronograma`);
  }
};
