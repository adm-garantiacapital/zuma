import { apiAdmin1 } from './api.js';

export const paymentScheduleService = {
  getByPropertyInvestorId(propertyInvestorId) {
    return apiAdmin1.get(`/payment-schedules/${propertyInvestorId}`);
  }
};
