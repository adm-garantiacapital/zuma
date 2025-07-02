import { apiAdmin1 } from './api';

export function fetchInvestorInversiones() {
    return apiAdmin1.get('/inversiones/usuario');
}
