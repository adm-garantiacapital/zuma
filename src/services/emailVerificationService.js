import { apiAdmin1 } from './api';

export default {
    resetPassword(data) {
        return apiAdmin1.post('/reset-password', data);
    },

    updatePassword(data) {
        return apiAdmin1.post('/reset-password/update', data);
    },

    resendVerification(id) {
        return apiAdmin1.post(`/email/verify/resend/${id}`);
    },

    // Modificar para aceptar todos los parámetros como en React
    verifyEmail(id, hash, expires = null, signature = null) {
        const data = {};
        
        // Incluir todos los parámetros necesarios
        if (expires) {
            data.expires = expires;
        }
        
        if (signature) {
            data.signature = signature;
        }
        
        return apiAdmin1.put(`/email/verify/${id}/${hash}`, data);
    }
};
