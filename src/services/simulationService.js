// services/admin1/simulationService.js
import { apiAdmin1 } from './api.js';

export const simulationService = {
  generate(data, params = { page: 1, per_page: 10 }) {
    return apiAdmin1.post('/simulation/generate', data, { params });
  },

  getAvailableTerms(property_id) {
    return apiAdmin1.get(`/property/${property_id}/show`);
  }
};
