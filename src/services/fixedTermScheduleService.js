// src/services/fixedTermScheduleService.js
import { apiAdmin1 } from './api.js'

export const fixedTermScheduleService = {
  getCronograma(id) {
    return apiAdmin1.get(`/fixed-term-schedules/${id}/cronograma`)
  }
}
