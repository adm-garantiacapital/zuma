// services/investmentService.js
import { apiAdmin1 } from './api.js';

export const investmentService = {
  invest(data) {
    return apiAdmin1.post('/xd/property', data);
  }
};
