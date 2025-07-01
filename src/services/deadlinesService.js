// services/deadlinesService.js
import { apiAdmin1 } from './api.js';

export const deadlinesService = {
  getDeadlines() {
    return apiAdmin1.get('/deadlines');
  }
};
