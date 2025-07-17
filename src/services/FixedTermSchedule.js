import { apiAdmin1 } from './api.js';

export const fixedTermScheduleService = {
  getByInvestmentId(id) {
    return apiAdmin1.get(`/fixed-term-schedules/${id}/cronograma`);
  }
};
