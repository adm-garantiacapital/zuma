<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Toast from 'primevue/toast'
import FooterWidget from '@/components/landing/FooterWidget.vue'
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
// importa tu servicio de recuperación si lo tienes
// import { authService } from '@/services/authService.js'

const email = ref('')
const loading = ref(false)
const toast = useToast()

const submit = async () => {
    if (!email.value) {
        toast.add({ severity: 'warn', summary: 'Advertencia', detail: 'Ingresa tu correo electrónico', life: 3000 })
        return
    }

    loading.value = true

    try {
        // simular petición
        // await authService.sendResetLink(email.value)

        // mensaje de éxito
        toast.add({ severity: 'success', summary: 'Éxito', detail: 'Se ha enviado el enlace a tu correo', life: 3000 })
        email.value = ''
    } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo enviar el enlace', life: 3000 })
    } finally {
        loading.value = false
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
                        <p class="text-gray-600 text-sm mt-2">Ingresa tu correo electrónico para recibir un enlace para
                            restablecer tu contraseña</p>
                    </div>

                    <div class="space-y-6">
                        <div>
                            <label for="email" class="block mb-2 text-sm text-gray-700">Correo electrónico</label>
                            <InputText id="email" v-model="email" type="email" class="w-full"
                                placeholder="tucorreo@ejemplo.com" />
                        </div>

                        <div>
                            <Button label="Obtener enlace" icon="pi pi-envelope" fluid severity="contrast" rounded :loading="loading"
                                @click="submit" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <br>
        <FooterWidget />
    </div>
</template>
