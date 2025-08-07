// services/visitaService.js
import { apiAdmin1 } from './api.js'

export const visitaService = {
  registrarVisita(productoId) {
    // Agregamos /api/ al inicio de la URL ya que la ruta está en api.php
    return apiAdmin1.post(`/producto/${productoId}/click`)
  }
}