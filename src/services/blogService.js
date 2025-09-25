// src/services/blogService.js
import { apiAdmin1 } from './api.js';

export const blogService = {
    getCategorias(perPage = 100) {
        return apiAdmin1.get('/blog/listar-categoria', { params: { per_page: perPage } })
    },

    getPublicaciones({ perPage = 12, search = '', categoryId = '' } = {}) {
        const params = { per_page: perPage }
        if (search && search.trim()) params.search = search.trim()
        // El backend acepta array; mandamos la firma común category_id[]
        if (categoryId) params['category_id[]'] = categoryId
        return apiAdmin1.get('/blog/publicaciones', { params })
    },

    guardarRating(post_id, estrellas) {
        return apiAdmin1.post('/blog/guardar-rating', { post_id, estrellas })
    }
}
