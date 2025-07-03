import { apiAdmin1 } from './api'

export const ocrService = {
  extractText(imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)

    return apiAdmin1.post('/extract-text', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  extractDni(imageFile) {
    const formData = new FormData()
    formData.append('image', imageFile)

    return apiAdmin1.post('/extract-dni', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}
