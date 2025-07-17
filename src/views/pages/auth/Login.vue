<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { authService } from '@/services/auth.js';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';

const router = useRouter();
const toast = useToast();

const document = ref('');
const password = ref('');
const checked = ref(false);
const loading = ref(false);

// ✅ Valor por defecto para los radios
const ingredient = ref('inversionista');

const login = async () => {
  loading.value = true;
  try {
    console.log('🔄 Iniciando login...');
    const response = await authService.login('admin2', {
      document: document.value,
      password: password.value,
    });

    toast.add({
      severity: 'success',
      summary: 'Éxito',
      detail: 'Sesión iniciada correctamente',
      life: 3000
    });

    await router.push('/hipotecas');
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
  <div class="min-h-screen bg-white flex flex-col">
    <Toast />
    <TopbarWidget />

    <!-- Contenido centrado -->
    <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">

      <!-- Perfil de Inversionista -->
      <div class="w-full max-w-md flex justify-between items-center mb-6 py-8 px-6">
        <div class="flex items-center gap-2 hover:text-[#FF4929] transition-colors">
          <RadioButton v-model="ingredient" inputId="ingredient1" name="perfil" value="inversionista" />
          <label for="ingredient1" class="text-sm cursor-pointer hover:text-[#FF4929]">Perfil inversionista</label>
        </div>
        <div class="flex items-center gap-2 hover:text-[#FF4929] transition-colors">
          <RadioButton v-model="ingredient" inputId="ingredient2" name="perfil" value="empresa" />
          <label for="ingredient2" class="text-sm cursor-pointer hover:text-[#FF4929]">Perfil empresa</label>
        </div>
      </div>

      <!-- Formulario de login -->
      <div class="w-full max-w-xl">
        <div class="border border-gray-200 p-10 rounded-3xl shadow-sm">
          <!-- Header -->
          <div class="mb-6">
            <h4 class="text-[#171717] text-xl font-semibold">Bienvenido</h4>
            <h5 class="text-sm text-gray-600">Inicia sesión para continuar</h5>
          </div>

          <!-- Formulario -->
          <div class="space-y-6">
            <div>
              <label for="document" class="block text-sm font-medium text-gray-700 mb-2">
                Número de documento de identidad
              </label>
              <InputText id="document" type="text" placeholder="Número de documento" v-model="document"
                class="w-full" />
            </div>

            <div>
              <label for="password1" class="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true" fluid
                :feedback="false" />
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2" />
                <label for="rememberme1" class="text-sm text-gray-700">Recuérdame</label>
              </div>
              <button type="button" class="text-sm text-[#FF4929] hover:text-blue-800 transition-colors">
                Recuperar contraseña
              </button>
            </div>

            <Button label="Iniciar sesión" class="w-full" severity="contrast" rounded :loading="loading"
              @click="login" />
          </div>

          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes cuenta?
              <button type="button" class="text-[#FF4929] hover:text-blue-800 font-medium transition-colors"   @click="router.push('/registro')">
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <br>
    <FooterWidget />
  </div>
</template>
