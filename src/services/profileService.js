// services/profileService.js (Admin 2)
import { apiAdmin2 } from './api';

const profileService = {
    getProfile() {
        return apiAdmin2.get('/profile');
    },

    getAvatar() {
        return apiAdmin2.get('/profile/avatar');
    },

    updateAvatar(data) {
        return apiAdmin2.post('/profile/update-avatar', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    updateConfirmAccount(payload) {
        return apiAdmin2.post('/profile/update/confirm-account', payload);
    },

    updateProfile(payload) {
        return apiAdmin2.put('/profile/update', payload);
    },

    updatePassword(payload) {
        return apiAdmin2.put('/profile/update-password', payload);
    },

    getLastInvoiceInvested() {
        return apiAdmin2.get('/profile/last-invoice-invested');
    }
};

export default profileService;
