import apiClient from './api.js';

export const deadlinesService = {
  getDeadlines() {
    return apiClient.get('/deadlines');
  }
};
