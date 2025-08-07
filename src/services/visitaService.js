// services/visitaService.js
import { apiAdmin1 } from './api.js'

export const visitaService = {
  registrarVisita(productoId) {
    return apiAdmin1.post(`/producto/${productoId}/click`)
  }
}
