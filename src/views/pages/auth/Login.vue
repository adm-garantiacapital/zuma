<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { authService } from '@/services/auth.js'; // Asegúrate que la ruta es correcta

const router = useRouter();
const toast = useToast();

const document = ref('');
const password = ref('');
const checked = ref(false);
const loading = ref(false);

const login = async () => {
  loading.value = true;
  try {
    console.log('🔄 Iniciando login...');
    
    const response = await authService.login('admin2', {
      document: document.value,
      password: password.value,
    });
    
    console.log('✅ Login exitoso:', response);
    console.log('🔍 Token guardado:', authService.getToken());
    console.log('🔍 Customer guardado:', authService.getCustomer());
    console.log('🔍 ¿Está autenticado?:', authService.isAuthenticated());
    
    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Sesión iniciada correctamente',
      life: 3000
    });
    
    console.log('🚀 Intentando redirigir a /hipotecas...');
    
    // Probar diferentes métodos de redirección
    const result = await router.push('/hipotecas');
    console.log('🔍 Resultado de router.push:', result);
    
  } catch (error) {
    console.error('❌ Login error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error de autenticación',
      detail: error.response?.data?.message || 'Credenciales inválidas',
      life: 4000,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <FloatingConfigurator />
  <Toast />

  <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
    <div class="flex flex-col items-center justify-center">
      <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
        <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
          <div class="text-center mb-8">
            <!-- Logo -->
            
            <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenido a PrimeLand!</div>
            <span class="text-muted-color font-medium">Inicia sesión para continuar</span>
          </div>

          <div>
            <label for="document" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Documento</label>
            <InputText id="document" type="text" placeholder="Número de documento" class="w-full md:w-[30rem] mb-8" v-model="document" />

            <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Contraseña</label>
            <Password
              id="password1"
              v-model="password"
              placeholder="Contraseña"
              :toggleMask="true"
              class="mb-4"
              fluid
              :feedback="false"
            ></Password>

            <div class="flex items-center justify-between mt-2 mb-8 gap-8">
              <div class="flex items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                <label for="rememberme1">Recuérdame</label>
              </div>
              <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">¿Olvidaste tu contraseña?</span>
            </div>

            <Button
              label="Iniciar Sesión"
              class="w-full"
              :loading="loading"
              @click="login"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}
.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
