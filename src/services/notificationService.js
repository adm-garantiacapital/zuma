// services/notificationService.js
import { apiAdmin1 } from './api.js';

export const notificationService = {
  /**
   * Obtiene la lista de notificaciones pendientes para el usuario autenticado
   * @returns {Promise} - Promise con las notificaciones
   */
  getNotifications() {
    return apiAdmin1.get('/notifications');
  },

  /**
   * Obtiene detalles específicos de datos faltantes
   * @returns {Promise} - Promise con los datos faltantes
   */
  getMissingData() {
    return apiAdmin1.get('/notifications/missing-data');
  },

  /**
   * Marca una notificación como completada
   * @param {string} notificationId - ID de la notificación
   * @returns {Promise} - Promise con la respuesta
   */
  markAsCompleted(notificationId) {
    return apiAdmin1.post('/notifications/mark-completed', {
      notification_id: notificationId
    });
  },

  /**
   * Obtiene el porcentaje de completitud del perfil
   * @returns {Promise} - Promise con el porcentaje de completitud
   */
  getProfileCompletionPercentage() {
    return apiAdmin1.get('/notifications/missing-data').then(response => {
      if (response.data.success) {
        return response.data.completion_percentage || 0;
      }
      return 0;
    });
  },

  /**
   * Verifica si hay notificaciones pendientes
   * @returns {Promise<boolean>} - Promise que retorna true si hay notificaciones pendientes
   */
  hasNotifications() {
    return this.getNotifications().then(response => {
      if (response.data.success) {
        return response.data.count > 0;
      }
      return false;
    }).catch(() => false);
  },

  /**
   * Obtiene solo el conteo de notificaciones
   * @returns {Promise<number>} - Promise con el número de notificaciones
   */
  getNotificationsCount() {
    return this.getNotifications().then(response => {
      if (response.data.success) {
        return response.data.count || 0;
      }
      return 0;
    }).catch(() => 0);
  }
};