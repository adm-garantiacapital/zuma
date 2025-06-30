import apiClient from './api.js';

export const bankAccountService = {
    getBankAccounts() {
        return apiClient.get('/bank-accounts');
    },

    createBankAccount(data) {
        return apiClient.post('/bank-accounts', data);
    },

    updateBankAccount(id, data) {
        return apiClient.put(`/bank-accounts/${id}`, data);
    },

    deleteBankAccount(id) {
        return apiClient.delete(`/bank-accounts/${id}`);
    }
};