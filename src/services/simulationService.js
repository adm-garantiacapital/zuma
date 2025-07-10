import { apiAdmin1 } from './api.js';

export const simulationService = {
  generate(data, params = { page: 1, per_page: 10 }) {
    return apiAdmin1.post('/simulation/generate', data, { params });
  },
  getAvailableTerms(property_id) {
    return apiAdmin1.get(`/property/${property_id}/show`);
  },
   getSimulateByAmount(payload) {
    return apiAdmin1.post('/investments/simulate-by-amount', payload);
  },
  getPaymentFrecuencies() {
    return apiAdmin1.get('/investments/payment-frequencies');
  },
  getGenerateSchedule(payload) {
    return apiAdmin1.post('/investments/generate-schedule', payload);
  }
};
