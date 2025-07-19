// services/movementsService.js (admin 2)
import { apiAdmin2 } from './api.js';

export const getMovements = () => {
    return apiAdmin2.get('/movements');
};

export const createDeposit = (formData) => {
    return apiAdmin2.post('/movements/deposits/create', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const createWithdraw = (data) => {
    return apiAdmin2.post('/movements/withdraw/create', data);
};

export const createFixedRateDeposit = (formData) => {
    return apiAdmin2.post('/movements/deposits/tasas-fijas', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const createMortgageDeposit = (formData) => {
    return apiAdmin2.post('/movements/deposits/hipotecas', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

export const createZumaDeposit = (formData) => {
    return apiAdmin2.post('/movements/deposits/zuma', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};
