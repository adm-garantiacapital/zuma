// services/currencyService.js
import { apiAdmin1 } from './api.js';

export const currencyService = {
  getCurrencies() {
    return apiAdmin1.get('/currencies');
  }
};
