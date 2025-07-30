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
        console.log('=== SERVICE: updateConfirmAccount called ===');
        console.log('Payload received in service:', payload);
        
        // Verificar que el payload es FormData
        if (!(payload instanceof FormData)) {
            console.error('Payload is not FormData:', payload);
            throw new Error('Payload must be FormData');
        }

        // Debug del FormData en el servicio
        console.log('=== SERVICE: FormData contents ===');
        for (let [key, value] of payload.entries()) {
            if (value instanceof File) {
                console.log(`${key}:`, {
                    name: value.name,
                    size: value.size,
                    type: value.type,
                    lastModified: value.lastModified
                });
            } else {
                console.log(`${key}:`, value);
            }
        }

        return apiAdmin2.post('/profile/update/confirm-account', payload, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            timeout: 60000, // 60 segundos para archivos grandes
        });
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