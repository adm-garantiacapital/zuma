import { apiAdmin2 } from './api.js';

export const depositService = {
  createZumaDeposit(data) {
    return apiAdmin2.post('/movements/deposits/zuma', data);
  }
};
