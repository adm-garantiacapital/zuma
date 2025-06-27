import apiClient from './api.js';

export const propertyService = {
  getProperties(page = 1, filters = {}) {
    const params = new URLSearchParams({
      page: page.toString(),
      ...filters
    });
    return apiClient.get(`/property/active/sow?${params}`);
  },

  getProperty(id) {
    return apiClient.get(`/property/${id}`);
  },

  createProperty(data) {
    return apiClient.post('/property', data);
  },

  updateProperty(id, data) {
    return apiClient.put(`/property/${id}`, data);
  },

  deleteProperty(id) {
    return apiClient.delete(`/property/${id}`);
  },

  getPropertyInvestments(property_id, page = 1) {
    const params = new URLSearchParams({
      page: page.toString()
    });
    return apiClient.get(`/online/inversiones/1?${params}`);
  },

  createInvestment(property_id, data) {
    return apiClient.post(`/online/inversiones/1`, data);
  },
};
