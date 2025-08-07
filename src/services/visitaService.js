import { apiAdmin1 } from './api.js'

export const visitaService = {
  registrarVisita(productoId, ip) {
    return apiAdmin1.post(`/producto/${productoId}/click`, {
      ip: ip // Enviamos la IP real como parte del cuerpo
    })
  }
}
