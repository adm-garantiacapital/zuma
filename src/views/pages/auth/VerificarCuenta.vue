<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import emailVerificationService from '@/services/emailVerificationService.js';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const userEmail = ref('');
const userId = ref(null);
const loading = ref(false);
const resendLoading = ref(false);

onMounted(() => {
  // Obtener datos del usuario desde los parámetros de la ruta o estado
  userEmail.value = route.query.email || '';
  userId.value = route.query.userId || null;
  
  if (!userEmail.value) {
    // Si no hay email, redirigir al login
    router.push('/login');
  }
});

const reenviarVerificacion = async () => {
  if (!userId.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo identificar el usuario',
      life: 3000
    });
    return;
  }

  resendLoading.value = true;
  try {
    // Llamada al servicio para reenviar verificación
    const response = await emailVerificationService.resendVerification(userId.value);
    
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: response.data?.message || 'Correo de verificación reenviado correctamente',
      life: 4000
    });
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'No se pudo reenviar el correo',
      life: 4000
    });
  } finally {
    resendLoading.value = false;
  }
};

const volverAlLogin = () => {
  router.push('/login');
};
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Toast />
    <TopbarWidget />

    <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">
      <div class="w-full max-w-xl">
        <div class="border border-gray-200 p-10 rounded-3xl shadow-sm text-center">
          <!-- Icono de email -->
          <div class="mb-6">
            <div class="w-20 h-20 bg-[#FF4929] bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="pi pi-envelope text-3xl text-[#FF4929]"></i>
            </div>
            <h4 class="text-[#171717] text-2xl font-semibold mb-2">Verifica tu cuenta</h4>
            <p class="text-gray-600 text-sm">
              Tu cuenta no ha sido verificada. Revisa tu correo electrónico y haz clic en el enlace de verificación.
            </p>
          </div>

          <!-- Email del usuario -->
          <div class="mb-8">
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <p class="text-sm text-gray-600 mb-1">Correo enviado a:</p>
              <p class="font-medium text-gray-800">{{ userEmail }}</p>
            </div>
            
            <div class="text-sm text-gray-600 space-y-2">
              <p>• Revisa tu bandeja de entrada</p>
              <p>• No olvides verificar la carpeta de spam</p>
              <p>• El enlace de verificación expira en 24 horas</p>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="space-y-4">
            <!--<Button 
              @click="reenviarVerificacion" 
              label="Reenviar correo de verificación" 
              class="w-full" 
              severity="contrast" 
              rounded 
              :loading="resendLoading"
              icon="pi pi-refresh"
            />-->
            
            <Button 
              @click="volverAlLogin" 
              label="Volver al inicio de sesión" 
              class="w-full" 
              severity="secondary" 
              rounded 
              outlined
              icon="pi pi-arrow-left"
            />
          </div>

          <!-- Información adicional -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <p class="text-xs text-gray-500">
              ¿Problemas con la verificación? 
              <a href="mailto:soporte@tuempresa.com" class="text-[#FF4929] hover:underline">
                Contacta con soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>

    <FooterWidget />
  </div>
</template>

<style scoped>
.pi-envelope {
  font-size: 2rem;
}
</style>