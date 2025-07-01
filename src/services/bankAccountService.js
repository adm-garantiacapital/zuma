import { apiAdmin2 } from './api.js';

export const bankAccountService = {
    getBankAccounts() {
        return apiAdmin2.get('/bank-accounts');
    },

    createBankAccount(data) {
        return apiAdmin2.post('/bank-accounts', data);
    },

    updateBankAccount(id, data) {
        return apiAdmin2.put(`/bank-accounts/${id}`, data);
    },

    deleteBankAccount(id) {
        return apiAdmin2.delete(`/bank-accounts/${id}`);
    }
};
