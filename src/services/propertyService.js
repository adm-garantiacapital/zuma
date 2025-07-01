// services/propertyService.js (Admin 1)
import { apiAdmin1 } from './api.js';

export const propertyService = {
  getProperties(page = 1, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    return apiAdmin1.get(`/property/active/sow?${params}`);
  },

  getProperty(id) {
    return apiAdmin1.get(`/property/${id}`);
  },

  createProperty(data) {
    return apiAdmin1.post('/property', data);
  },

  updateProperty(id, data) {
    return apiAdmin1.put(`/property/${id}`, data);
  },

  deleteProperty(id) {
    return apiAdmin1.delete(`/property/${id}`);
  },

  getPropertyInvestments(property_id, page = 1) {
    const params = new URLSearchParams({
      page: page.toString()
    });
    return apiAdmin1.get(`/online/inversiones/1?${params}`);
  },

  createInvestment(property_id, data) {
    return apiAdmin1.post(`/online/inversiones/1`, data);
  },
};
