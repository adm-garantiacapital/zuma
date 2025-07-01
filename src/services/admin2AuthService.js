import { apiAdmin2 } from './api';

export default {
    register(data) {
        return apiAdmin2.post('/register', data);
    },

    login(credentials) {
        return apiAdmin2.post('/login', credentials);
    },

    logout() {
        return apiAdmin2.post('/logout');
    },

    resetPassword(data) {
        return apiAdmin2.post('/reset-password', data);
    },

    updatePassword(data) {
        return apiAdmin2.post('/reset-password/update', data);
    },

    resendVerification(id) {
        return apiAdmin2.post(`/email/verify/resend/${id}`);
    },

    verifyEmail(id, hash) {
        return apiAdmin2.put(`/email/verify/${id}/${hash}`);
    }
};
