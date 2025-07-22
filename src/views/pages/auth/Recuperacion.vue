<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import FooterWidget from '@/components/landing/FooterWidget.vue'
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
// Importar tu servicio de autenticación
import admin2AuthService from '@/services/admin2AuthService.js'

const email = ref('')
const loading = ref(false)
const toast = useToast()
const message = ref('')
const messageType = ref('') // 'success', 'error', 'warn'

const submit = async () => {
    if (!email.value) {
        const warningMessage = 'Ingresa tu correo electrónico'
        message.value = warningMessage
        messageType.value = 'warn'
        toast.add({ 
            severity: 'warn', 
            summary: 'Advertencia', 
            detail: warningMessage, 
            life: 3000 
        })
        return
    }

    loading.value = true
    message.value = '' // Limpiar mensaje anterior

    try {
        // Llamar al servicio real
        const response = await admin2AuthService.resetPassword({ email: email.value })
        
        // Verificar la respuesta del servidor
        if (response.data && response.data.success) {
            const successMessage = response.data.message || 'Se ha enviado el enlace a tu correo'
            message.value = successMessage
            messageType.value = 'success'
            toast.add({ 
                severity: 'success', 
                summary: 'Éxito', 
                detail: successMessage, 
                life: 5000 
            })
            email.value = ''
        } else {
            // Manejar respuesta no exitosa
            const errorMessage = response.data?.message || 'No se pudo enviar el enlace'
            message.value = errorMessage
            messageType.value = 'error'
            toast.add({ 
                severity: 'error', 
                summary: 'Error', 
                detail: errorMessage, 
                life: 3000 
            })
        }
    } catch (error) {
        // Manejar diferentes tipos de errores del servidor
        let errorMessage = 'No se pudo enviar el enlace'
        
        if (error.response && error.response.data) {
            errorMessage = error.response.data.message || errorMessage
        }
        
        message.value = errorMessage
        messageType.value = 'error'
        toast.add({ 
            severity: 'error', 
            summary: 'Error', 
            detail: errorMessage, 
            life: 3000 
        })
    } finally {
        loading.value = false
    }
}

// Función para manejar el evento keydown
const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !loading.value) {
        event.preventDefault()
        submit()
    }
}

// Limpiar mensaje cuando el usuario empiece a escribir de nuevo
const clearMessage = () => {
    if (message.value) {
        message.value = ''
        messageType.value = ''
    }
}
</script>

<template>
    <div class="min-h-screen bg-white flex flex-col">
        <Toast />
        <TopbarWidget />

        <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">
            <div class="w-full max-w-xl">
                <div class="border border-gray-200 p-10 rounded-3xl shadow-sm">
                    <div class="mb-6">
                        <h4 class="text-[#171717] font-semibold text-xl">Recuperar contraseña</h4>
                        <p class="text-gray-600 text-sm mt-2">
                            Ingresa tu correo electrónico para recibir un enlace para restablecer tu contraseña
                        </p>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <label for="email" class="block mb-2 text-sm text-gray-700">
                                Correo electrónico
                            </label>
                            <InputText 
                                id="email" 
                                v-model="email" 
                                type="email" 
                                class="w-full"
                                placeholder="tucorreo@ejemplo.com"
                                @keydown="handleKeyPress"
                                @input="clearMessage"
                                :disabled="loading"
                            />
                            <!-- Mensaje de respuesta del servidor -->
                            <div v-if="message" class="mt-2">
                                <p :class="{
                                    'text-green-600 text-sm': messageType === 'success',
                                    'text-red-600 text-sm': messageType === 'error',
                                    'text-orange-600 text-sm': messageType === 'warn'
                                }">
                                    <i :class="{
                                        'pi pi-check-circle': messageType === 'success',
                                        'pi pi-times-circle': messageType === 'error',
                                        'pi pi-exclamation-triangle': messageType === 'warn'
                                    }" class="mr-1"></i>
                                    {{ message }}
                                </p>
                            </div>
                        </div>

                        <div>
                            <Button 
                                label="Obtener enlace" 
                                icon="pi pi-envelope" 
                                fluid 
                                severity="contrast" 
                                rounded 
                                :loading="loading"
                                @click="submit" 
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <br>
        <FooterWidget />
    </div>
</template>