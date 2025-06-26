import apiClient from './api.js';

export const currencyService = {
  getCurrencies() {
    return apiClient.get('/currencies');
  }
};
