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

const ingredient = ref('inversionista');
const showEmpresaDialog = ref(false);

const handlePerfilChange = (value) => {
  if (value === 'empresa') {
    showEmpresaDialog.value = true;
    setTimeout(() => {
      ingredient.value = 'inversionista';
    }, 100);
  }
};

const contactarEspecialista = () => {
  showEmpresaDialog.value = false;
  toast.add({
    severity: 'info',
    summary: 'Contacto',
    detail: 'Te contactaremos pronto con un especialista',
    life: 3000
  });
};

const login = async () => {
  loading.value = true;
  try {
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

    // Opción 1: Usar la ruta de redirección que viene del backend
    const redirectRoute = response.data?.redirect_route;
    if (redirectRoute) {
      await router.push(redirectRoute);
    } else {
      // Opción 2: Lógica de redirección en el frontend usando la columna 'type'
      // CORRECCIÓN: El authService retorna { user: userData }, entonces accedemos a response.user.type
      const userType = response.user?.type;
      
      if (userType === 'cliente') {
        await router.push('/cliente');
      } else if (userType === 'inversionista' || userType === 'mixto') {
        await router.push('/hipotecas');
      } else {
        await router.push('/hipotecas'); // Ruta por defecto
      }
    }
    
  } catch (error) {
    if (error.response?.data?.error_type === 'email_not_verified') {
      toast.add({
        severity: 'warn',
        summary: 'Cuenta no verificada',
        detail: error.response.data.message,
        life: 4000,
      });

      await router.push({
        path: '/verificar-cuenta',
        query: {
          email: error.response.data.user_email,
          userId: error.response.data.user_id
        }
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error de autenticación',
        detail: error.response?.data?.message || 'Credenciales inválidas',
        life: 4000,
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Toast />
    <TopbarWidget />

    <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">
      <div class="w-full max-w-md flex justify-between items-center mb-4 py-2 px-4">
      <div class="flex items-center gap-1 hover:text-[#FF4929] transition-colors">
        <RadioButton v-model="ingredient" inputId="ingredient1" name="perfil" value="inversionista" @change="handlePerfilChange('inversionista')" />
        <label for="ingredient1" class="text-xs cursor-pointer hover:text-[#FF4929]">Perfil inversionista</label>
      </div>
      <div class="flex items-center gap-1 hover:text-[#FF4929] transition-colors">
        <RadioButton v-model="ingredient" inputId="ingredient2" name="perfil" value="empresa" @change="handlePerfilChange('empresa')" />
        <label for="ingredient2" class="text-xs cursor-pointer hover:text-[#FF4929]">Perfil empresa</label>
      </div>
    </div>

      <div class="w-full max-w-xl">
        <div class="border border-gray-200 p-10 rounded-3xl shadow-sm">
          <div class="mb-6">
            <h4 class="text-[#171717] text-xl font-semibold">Bienvenido</h4>
            <h5 class="text-sm text-gray-600">Inicia sesión para continuar</h5>
          </div>

          <form class="space-y-6" @submit.prevent="login">
            <div>
              <label for="document" class="block text-sm font-medium text-gray-700 mb-2">Número de documento de identidad</label>
              <InputText id="document" type="text" placeholder="Número de documento" v-model="document" class="w-full" />
            </div>

            <div>
              <label for="password1" class="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <Password id="password1" v-model="password" placeholder="Contraseña" :toggleMask="true" fluid :feedback="false" />
            </div>

            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2" />
                <label for="rememberme1" class="text-sm text-gray-700">Recuérdame</label>
              </div>
              <button type="button" class="text-sm text-[#FF4929] hover:text-blue-800 transition-colors" @click="router.push('/recuperacion')">Recuperar contraseña</button>
            </div>

            <Button type="submit" label="Iniciar sesión" class="w-full" severity="contrast" rounded :loading="loading" />
          </form>

          <div class="mt-8 text-center">
            <p class="text-sm text-gray-600">
              ¿No tienes cuenta?
              <button type="button" class="text-[#FF4929] hover:text-blue-800 font-medium transition-colors" @click="router.push('/registrarte')">
                Regístrate
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
    <br />
    <FooterWidget />

    <Dialog v-model:visible="showEmpresaDialog" modal :closable="true" :draggable="false" class="mx-4" style="width: 90%; max-width: 500px;">
      <template #header>
        <h3 class="text-xl font-bold text-gray-800">¿Eres empresa?</h3>
      </template>

      <div class="py-4">
        <p class="text-gray-600 mb-6">Te invitamos a que te contactes con uno de nuestros especialistas</p>

        <div class="flex justify-end gap-3">
          <Button label="Cancelar" severity="secondary" @click="showEmpresaDialog = false" class="px-6" />
          <Button label="Comunicar" severity="contrast" @click="contactarEspecialista" class="px-6 bg-[#FF4929] hover:bg-[#e63e29] border-0" />
        </div>
      </div>
    </Dialog>
  </div>
</template>