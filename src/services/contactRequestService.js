import { apiAdmin1 } from './api.js';

export const contactRequestService = {
  submitContactRequest(payload) {
    return apiAdmin1.post('/contact-request', payload);
  },
  submitInternalRequest(payload) {
    return apiAdmin1.post('/contact-request/internal', payload);
  },
  
  submitContactNewsLetter(payload){
    return apiAdmin1.post('/contact-request/newsletter', payload);
  }

};
