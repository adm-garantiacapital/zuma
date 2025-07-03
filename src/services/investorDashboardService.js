import { apiAdmin1 } from './api.js';

export const investorDashboardService = {
  // Obtener la última inversión del inversor autenticado
  getLastInvestment() {
    return apiAdmin1.get('/investor/inversion');
  },

  // Obtener el ranking de inversores (top 10 por monto invertido)
  getInvestorRanking() {
    return apiAdmin1.get('/investor/ranking');
  }
};
