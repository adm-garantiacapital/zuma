// services/reportsService.js (Admin 2)
import { apiAdmin2 } from './api';

const reportsService = {
    getBalances() {
        return apiAdmin2.get('/reports/balances');
    },

    getInvestmentsTimeline() {
        return apiAdmin2.get('/reports/investments');
    },

    getInvestmentsByCompany() {
        return apiAdmin2.get('/reports/investments/group-by-company');
    },

    getInvestmentsBySector() {
        return apiAdmin2.get('/reports/investments/group-by-sector');
    },

    getCumulativeReturns() {
        return apiAdmin2.get('/reports/cumulative-returns');
    },

    getCumulativeReturnsByCompany() {
        return apiAdmin2.get('/reports/cumulative-returns/group-by-company');
    },

    getCumulativeReturnsBySector() {
        return apiAdmin2.get('/reports/cumulative-returns/group-by-sector');
    }
};

export default reportsService;
