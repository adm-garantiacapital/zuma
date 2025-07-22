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

    verifyEmail(id, hash) {
        return apiAdmin1.put(`/email/verify/${id}/${hash}`);
    }
};
