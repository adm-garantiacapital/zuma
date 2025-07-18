import { apiAdmin2 } from './api.js';

export const bankService = {
    getBanks() {
        return apiAdmin2.get('/banks');
    }
};
