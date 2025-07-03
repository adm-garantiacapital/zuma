import { apiAdmin1 } from './api.js';

export const propertyInvestorService = {
  invest(propertyId, deadlineId) {
    return apiAdmin1.post('/invest-property', {
      property_id: propertyId,
      deadline_id: deadlineId
    });
  }
};