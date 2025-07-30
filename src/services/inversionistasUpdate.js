import { apiAdmin2 } from './api.js';

export default {
  getInvestor(id) {
    return apiAdmin2.get(`/investors/${id}`);
  },

  updateInvestor(id, payload) {
    return apiAdmin2.put(`/investors/${id}`, payload);
  }
};
