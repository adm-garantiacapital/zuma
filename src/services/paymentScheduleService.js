import { apiAdmin1 } from './api.js';

export const paymentScheduleService = {
  
  getByPropertyId(id, params = {}) {
    const queryParams = new URLSearchParams()
    
    // Parámetros de paginación
    if (params.page) queryParams.append('page', params.page)
    if (params.per_page) queryParams.append('per_page', params.per_page)
    
    // Otros parámetros opcionales
    if (params.estado) queryParams.append('estado', params.estado)
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.order) queryParams.append('order', params.order)
    
    const url = `/propiedad/${id}/cronograma${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    
    return apiAdmin1.get(url)
  },

  getByPropertyInvestorId(id, params = {}) {
    const queryParams = new URLSearchParams()
    
    // Parámetros de paginación
    if (params.page) queryParams.append('page', params.page)
    if (params.per_page) queryParams.append('per_page', params.per_page)
    
    // Otros parámetros opcionales
    if (params.estado) queryParams.append('estado', params.estado)
    if (params.sort) queryParams.append('sort', params.sort)
    if (params.order) queryParams.append('order', params.order)
    
    const url = `/propiedad/${id}/cronograma${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    
    return apiAdmin1.get(url)
  },

  // Método para obtener todos los datos sin paginación (si tu API lo permite)
  getAll(propertyId) {
    return apiAdmin1.get(`/propiedad/${propertyId}/cronograma?all=true`)
  },

  // Método para procesar pago
  processPayment(paymentId, paymentData) {
    return apiAdmin1.post(`/pagos/${paymentId}/procesar`, paymentData)
  }
}