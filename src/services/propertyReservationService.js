import { apiAdmin1 } from './api.js';

export const propertyReservationService = {
  async createReservation(payload) {
    try {
      // Validar payload antes de enviar
      if (!payload.property_id || !payload.amount) {
        throw new Error('Datos incompletos: property_id y amount son requeridos');
      }

      const response = await apiAdmin1.post('/reservas', payload);
      
      // Verificar que la respuesta sea exitosa
      if (response.data && response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data?.message || 'Error desconocido en la respuesta');
      }
    } catch (error) {
      console.error('Error al crear la reserva:', error);
      
      // Mejorar el manejo de errores
      if (error.response) {
        // Error HTTP del servidor
        const serverError = error.response.data;
        throw new Error(serverError.message || `Error del servidor: ${error.response.status}`);
      } else if (error.request) {
        // Error de red
        throw new Error('Error de conexión. Verifica tu internet e intenta nuevamente.');
      } else {
        // Error en la configuración de la petición
        throw new Error(error.message || 'Error inesperado');
      }
    }
  },

  // Método adicional para obtener reservas del usuario
  async getUserReservations(page = 1, filters = {}) {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...filters
      });

      const response = await apiAdmin1.get(`/reservas?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      throw error;
    }
  }
};