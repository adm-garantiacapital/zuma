import { apiAdmin2 } from './api.js';

export const bankAccountDestinoService = {
    getBankAccountsDestinos() {
        return apiAdmin2.get('/bank-accounts-destinos');
    },


};
