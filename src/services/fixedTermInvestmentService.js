import { apiAdmin1 } from './api.js';

export const fixedTermInvestmentService = {
  store(data) {
    return apiAdmin1.post('/panel/fixed-term-investments', data);
  },

  storeCronograma(data) {
    return apiAdmin1.post('/panel/fixed-term-investments/cronograma', data);
  },

  index(params = { page: 1, per_page: 10 }) {
    return apiAdmin1.get('/panel/fixed-term-investments', { params });
  },

  show(id) {
    return apiAdmin1.get(`/panel/fixed-term-investments/${id}`);
  },

  getLast() {
    return apiAdmin1.get('/tasas-fijas/last');
  },

  getTopInvestors() {
    return apiAdmin1.get('/tasas-fijas/top');
  }
};
