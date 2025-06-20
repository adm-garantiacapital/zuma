import apiClient from './api.js';

export const propertyService = {
    getProperties(page = 1, filters = {}) {
        const params = new URLSearchParams({
            page: page.toString(),
            ...filters
        });
        
        return apiClient.get(`/property?${params}`);
    },
    
    getProperty(id) {
        return apiClient.get(`/property/${id}`);
    },
    
    createProperty(data) {
        return apiClient.post('/property', data);
    },
    
    updateProperty(id, data) {
        return apiClient.put(`/property/${id}`, data);
    },
    
    deleteProperty(id) {
        return apiClient.delete(`/property/${id}`);
    }
};
