// services/movementService.js (admin 2)
import { apiAdmin2 } from './api.js';

const MovementService = {
    getMovements(params = {}) {
        const queryParams = new URLSearchParams();

        if (params.currency) queryParams.append('currency', params.currency);
        if (params.page) queryParams.append('page', params.page);
        if (params.pageName) queryParams.append('pageName', params.pageName);

        const queryString = queryParams.toString();
        const url = queryString ? `/movements?${queryString}` : '/movements';

        return apiAdmin2.get(url);
    },

    createDeposit(payload) {
        return apiAdmin2.post('/movements/deposits/create', payload);
    },

    createWithdraw(payload) {
        return apiAdmin2.post('/movements/withdraw/create', payload);
    }
};

export default MovementService;
