<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import FooterWidget from '@/components/landing/FooterWidget.vue'
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
// Solo importar el servicio de verificación de email
import emailVerificationService from '@/services/emailVerificationService.js'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const loading = ref(false)
const message = ref('')
const messageType = ref('')
const investorId = ref(null)
const userEmail = ref('')

const verificationStatus = ref('pending')

onMounted(async () => {
    investorId.value = route.params.id || localStorage.getItem('temp_investor_id')
    
    if (route.params.id && route.params.hash) {
        // Capturar TODOS los parámetros necesarios como en React
        const expires = route.query.expires
        const signature = route.query.signature // Si también lo necesitas
        
        console.log('Parámetros de verificación:', {
            id: route.params.id,
            hash: route.params.hash,
            expires: expires,
            signature: signature
        })
        
        await verifyEmail(route.params.id, route.params.hash, expires, signature)
    } else {
        verificationStatus.value = 'pending'
        userEmail.value = localStorage.getItem('temp_user_email') || ''
    }
})

const verifyEmail = async (id, hash, expires = null, signature = null) => {
    loading.value = true
    verificationStatus.value = 'verifying'
    
    try {
        // Pasar todos los parámetros al servicio
        const response = await emailVerificationService.verifyEmail(id, hash, expires, signature)
        
        if (response.data && response.data.success) {
            verificationStatus.value = 'success'
            message.value = response.data.message || '¡Tu email ha sido verificado exitosamente!'
            messageType.value = 'success'
            
            toast.add({
                severity: 'success',
                summary: 'Verificado',
                detail: response.data.message || '¡Email verificado exitosamente!',
                life: 5000
            })
            
            localStorage.removeItem('temp_investor_id')
            localStorage.removeItem('temp_user_email')
            
            setTimeout(() => {
                router.push('/login')
            }, 3000)
            
        } else {
            verificationStatus.value = 'error'
            message.value = response.data?.message || 'Error al verificar tu email'
            messageType.value = 'error'
        }
        
    } catch (error) {
        verificationStatus.value = 'error'
        let errorMessage = 'Error al verificar tu email. El enlace puede haber expirado.'
        
        if (error.response && error.response.data) {
            errorMessage = error.response.data.message || errorMessage
            
            if (error.response.status === 404) {
                errorMessage = 'Usuario no encontrado'
            } else if (error.response.status === 400) {
                errorMessage = 'Enlace de verificación inválido o expirado'
            } else if (error.response.status === 409) {
                verificationStatus.value = 'already_verified'
                message.value = 'Tu email ya está verificado'
                messageType.value = 'info'
                return
            } else if (error.response.status === 422) {
                errorMessage = 'El enlace de verificación ha expirado o es inválido'
            }
        }
        
        message.value = errorMessage
        messageType.value = 'error'
        
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        })
    } finally {
        loading.value = false
    }
}

// Navegar al login
const goToLogin = () => {
    router.push('/login')
}

// Navegar al registro
const goToRegister = () => {
    router.push('/register')
}
</script>

<template>
    <div class="min-h-screen bg-white flex flex-col">
        <Toast />
        <TopbarWidget />

        <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">
            <div class="w-full max-w-xl">
                <div class="border border-gray-200 p-10 rounded-3xl shadow-sm text-center">
                    
                    <!-- Estado: Verificando automáticamente -->
                    <div v-if="verificationStatus === 'verifying'" class="space-y-6">
                        <div class="flex justify-center">
                            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                        <div>
                            <h4 class="text-[#171717] font-semibold text-xl mb-2">Verificando tu email</h4>
                            <p class="text-gray-600 text-sm">Por favor espera mientras verificamos tu correo electrónico...</p>
                        </div>
                    </div>

                    <!-- Estado: Verificación exitosa -->
                    <div v-else-if="verificationStatus === 'success'" class="space-y-6">
                        <div class="flex justify-center">
                            <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-check text-green-600 text-2xl"></i>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-[#171717] font-semibold text-xl mb-2">¡Verificación exitosa!</h4>
                            <p class="text-gray-600 text-sm mb-4">Tu correo electrónico ha sido verificado correctamente.</p>
                            <p class="text-green-600 text-sm">Serás redirigido al login en unos segundos...</p>
                        </div>
                        <Button 
                            label="Ir al Login" 
                            icon="pi pi-sign-in" 
                            severity="success" 
                            rounded 
                            @click="goToLogin"
                        />
                    </div>

                    <!-- Estado: Ya verificado -->
                    <div v-else-if="verificationStatus === 'already_verified'" class="space-y-6">
                        <div class="flex justify-center">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-info-circle text-blue-600 text-2xl"></i>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-[#171717] font-semibold text-xl mb-2">Email ya verificado</h4>
                            <p class="text-gray-600 text-sm">Tu correo electrónico ya está verificado.</p>
                        </div>
                        <div v-if="message" class="mb-4">
                            <p class="text-blue-600 text-sm">
                                <i class="pi pi-info-circle mr-1"></i>
                                {{ message }}
                            </p>
                        </div>
                        <Button 
                            label="Iniciar Sesión" 
                            icon="pi pi-sign-in" 
                            severity="contrast" 
                            rounded 
                            @click="goToLogin"
                        />
                    </div>

                    <!-- Estado: Error en verificación -->
                    <div v-else-if="verificationStatus === 'error'" class="space-y-6">
                        <div class="flex justify-center">
                            <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-times text-red-600 text-2xl"></i>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-[#171717] font-semibold text-xl mb-2">Error de verificación</h4>
                            <p class="text-gray-600 text-sm">No se pudo verificar tu correo electrónico. El enlace puede haber expirado.</p>
                        </div>
                        <div v-if="message" class="mb-4">
                            <p class="text-red-600 text-sm">
                                <i class="pi pi-exclamation-triangle mr-1"></i>
                                {{ message }}
                            </p>
                        </div>
                        <div class="space-y-3">
                            <Button 
                                label="Volver al registro" 
                                icon="pi pi-arrow-left" 
                                severity="secondary" 
                                rounded 
                                outlined
                                @click="goToRegister"
                            />
                        </div>
                    </div>

                    <!-- Estado: Pendiente -->
                    <div v-else-if="verificationStatus === 'pending'" class="space-y-6">
                        <div class="flex justify-center">
                            <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <i class="pi pi-envelope text-blue-600 text-2xl"></i>
                            </div>
                        </div>
                        <div>
                            <h4 class="text-[#171717] font-semibold text-xl mb-2">Verifica tu email</h4>
                            <p class="text-gray-600 text-sm mb-2">Te hemos enviado un correo de verificación.</p>
                            <p class="text-gray-500 text-xs">
                                Revisa tu bandeja de entrada y spam. Haz clic en el enlace del correo para verificar tu cuenta.
                            </p>
                            <p v-if="userEmail" class="text-gray-700 text-sm mt-2 font-medium">
                                Enviado a: {{ userEmail }}
                            </p>
                        </div>

                        <div class="space-y-3">
                            <Button 
                                label="Ya tengo cuenta" 
                                icon="pi pi-sign-in" 
                                severity="secondary" 
                                rounded 
                                outlined
                                @click="goToLogin"
                            />
                        </div>
                    </div>
                </div>

                <!-- Información adicional -->
                <div class="mt-6 text-center">
                    <p class="text-gray-500 text-xs">
                        ¿No recibes el correo? Revisa tu carpeta de spam.
                    </p>
                </div>
            </div>
        </div>

        <br>
        <FooterWidget />
    </div>
</template>