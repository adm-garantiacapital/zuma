<template>
  <div class="min-h-screen bg-white flex flex-col">
    <Toast />
    <TopbarWidget />

    <!-- Contenido centrado -->
    <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">

      <div class="w-full max-w-md flex justify-between items-center mb-6 py-8 px-6">
        <div class="flex items-center gap-2 hover:text-[#FF4929] transition-colors">
          <RadioButton v-model="ingredient" inputId="ingredient1" name="perfil" value="inversionista"
            @change="handlePerfilChange('inversionista')" />
          <label for="ingredient1" class="text-sm cursor-pointer hover:text-[#FF4929]">
            Perfil inversionista
          </label>
        </div>
        <div class="flex items-center gap-2 hover:text-[#FF4929] transition-colors">
          <RadioButton v-model="ingredient" inputId="ingredient2" name="perfil" value="empresa"
            @change="handlePerfilChange('empresa')" />
          <label for="ingredient2" class="text-sm cursor-pointer hover:text-[#FF4929]">
            Perfil empresa
          </label>
        </div>
      </div>

      <div class="w-full max-w-xl">
        <div class="border border-gray-200 p-10 rounded-3xl shadow-sm">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              Comienza a hacer crecer tu dinero
            </h2>
            <p class="text-gray-600">Completa los campos para registrarte</p>
          </div>

          <!-- Formulario -->
            <form @submit.prevent="handleUpdate" class="space-y-6">

            <!-- DNI/Documento -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Documento (DNI) <span class="text-red-500">*</span>
              </label>
              <InputText v-model="document" fluid placeholder="Ingresa tu DNI"
                :class="{ 'p-invalid': document && document.length < 8 }" />
            </div>

            <!-- Nombre -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">Nombre <span class="text-red-500">*</span></label>
              <InputText v-model="nombre" fluid disabled placeholder="Ingresa tu nombre" />
            </div>


            <!-- Apellidos -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                  Apellido Paterno <span class="text-red-500">*</span>
                </label>
                <InputText v-model="apellidoPaterno" placeholder="Apellido paterno" disabled fluid />
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700">
                  Apellido Materno <span class="text-red-500">*</span>
                </label>
                <InputText v-model="apellidoMaterno" placeholder="Apellido materno" fluid disabled />
              </div>
            </div>

            <!-- Alias -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Alias <span class="text-red-500">*</span>
              </label>
              <InputText v-model="alias" placeholder="Ingresa tu alias" fluid />
            </div>

            <!-- Correo electrónico -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Correo electrónico <span class="text-red-500">*</span>
              </label>
              <InputText v-model="correoElectronico" type="email" placeholder="correo@ejemplo.com" fluid />
            </div>

            <!-- Contraseña -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Contraseña <span class="text-red-500">*</span>
              </label>
              <Password v-model="password" placeholder="Ingresa tu contraseña" :feedback="false" toggleMask fluid />

              <!-- Validaciones de contraseña -->
              <div class="mt-2 space-y-1">
                <div class="flex items-center gap-2 text-xs">
                  <i
                    :class="passwordValidations.hasUpperCase ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                  <span :class="passwordValidations.hasUpperCase ? 'text-green-600' : 'text-red-600'">
                    Al menos una mayúscula
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <i
                    :class="passwordValidations.hasNumber ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                  <span :class="passwordValidations.hasNumber ? 'text-green-600' : 'text-red-600'">
                    Al menos un número
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <i
                    :class="passwordValidations.hasMinLength ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                  <span :class="passwordValidations.hasMinLength ? 'text-green-600' : 'text-red-600'">
                    Mínimo 8 caracteres
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs">
                  <i
                    :class="passwordValidations.hasSpecialChar ? 'pi pi-check text-green-500' : 'pi pi-times text-red-500'"></i>
                  <span :class="passwordValidations.hasSpecialChar ? 'text-green-600' : 'text-red-600'">
                    Al menos un carácter especial
                  </span>
                </div>
              </div>
            </div>

            <!-- Confirmar contraseña -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Confirmar contraseña <span class="text-red-500">*</span>
              </label>
              <Password v-model="confirmarPassword" placeholder="Confirma tu contraseña" :feedback="false" toggleMask
                fluid :class="{ 'p-invalid': confirmarPassword && !passwordsMatch }" />
              <div v-if="confirmarPassword && passwordsMatch" class="flex items-center gap-2 text-xs text-green-600">
                <i class="pi pi-check text-green-500"></i>
                <span>Las contraseñas coinciden</span>
              </div>
              <div v-if="confirmarPassword && !passwordsMatch" class="flex items-center gap-2 text-xs text-red-600">
                <i class="pi pi-times text-red-500"></i>
                <span>Las contraseñas no coinciden</span>
              </div>
            </div>

            <!-- Número de teléfono -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Número de teléfono <span class="text-red-500">*</span>
              </label>
              <InputText v-model="numeroTelefono" placeholder="Ingresa tu número de teléfono" fluid />
            </div>

            <!-- Términos y condiciones -->
            <div class="flex items-start gap-3">
              <Checkbox v-model="checked" inputId="terms" binary />
              <label for="terms" class="text-sm text-gray-600 cursor-pointer">
                Acepto los <a @click.prevent="goTerminos" class="text-[#FF4929] hover:underline">términos y condiciones</a>
              </label>
            </div>

            <!-- Botón de registro -->
            <Button type="submit" :disabled="!isFormValid || loading" :loading="loading" severity="contrast" fluid>
              {{ loading ? 'Registrando...' : 'Registrar' }}
            </Button>

            <!-- Enlace a login -->
            <div class="text-center pt-4">
              <p class="text-sm text-gray-600">
                ¿Ya tienes cuenta?
                <button type="button" @click="goToLogin" class="text-[#FF4929] hover:underline font-medium">
                  Iniciar sesión
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>

    <br>
    <FooterWidget />

    <!-- Dialog para empresas -->
    <Dialog v-model:visible="showEmpresaDialog" modal :closable="true" :draggable="false" class="mx-4"
      style="width: 90%; max-width: 500px;">
      <template #header>
        <h3 class="text-xl font-bold text-gray-800">
          ¿Eres empresa?
        </h3>
      </template>

      <div class="py-4">
        <p class="text-gray-600 mb-6">
          Te invitamos a que te contactes con uno de nuestros especialistas
        </p>

        <div class="flex justify-end gap-3">
          <Button label="Cancelar" severity="secondary" @click="showEmpresaDialog = false" class="px-6" />
          <Button label="Comunicar" severity="contrast" @click="contactarEspecialista"
            class="px-6 bg-[#FF4929] hover:bg-[#e63e29] border-0" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import inversionistasService from '@/services/inversionistasUpdate.js';

const route = useRoute();
const router = useRouter();
const toast = useToast();
const ingredient = ref(null);
const checked = ref(false);
const showEmpresaDialog = ref(false);
const id = route.params.id;

const nombre = ref('');
const document = ref('');
const apellidoPaterno = ref('');
const apellidoMaterno = ref('');
const alias = ref('');
const correoElectronico = ref('');
const password = ref('');
const confirmarPassword = ref('');
const numeroTelefono = ref('');
const loading = ref(false);

// Validaciones y estado del formulario
const passwordValidations = computed(() => {
  const pwd = password.value;
  return {
    hasUpperCase: /[A-Z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasMinLength: pwd.length >= 8,
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)
  };
});

const isPasswordValid = computed(() => {
  const validations = passwordValidations.value;
  return validations.hasUpperCase && validations.hasNumber &&
    validations.hasMinLength && validations.hasSpecialChar;
});

const passwordsMatch = computed(() => {
  return password.value === confirmarPassword.value && confirmarPassword.value !== '';
});

const isFormValid = computed(() => {
  return alias.value && correoElectronico.value && numeroTelefono.value &&
    (!password.value || (isPasswordValid.value && passwordsMatch.value));
});

// 🚀 Cargar datos del inversionista al montar
onMounted(async () => {
  try {
    const { data } = await inversionistasService.getInvestor(id);
    const inv = data.data;
    nombre.value = inv.name;
    apellidoPaterno.value = inv.first_last_name;
    apellidoMaterno.value = inv.second_last_name;
    document.value = inv.document;
    alias.value = inv.alias || '';
    correoElectronico.value = inv.email || '';
    numeroTelefono.value = inv.telephone || '';
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar el inversionista.',
      life: 3000
    });
  }
});

// ✅ Enviar actualización
const handleUpdate = async () => {
  if (!isFormValid.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Revisa los campos antes de guardar.',
      life: 3000
    });
    return;
  }

  loading.value = true;

  try {
    const payload = {
      alias: alias.value,
      email: correoElectronico.value,
      telephone: numeroTelefono.value,
    };

    if (password.value) {
      payload.password = password.value;
      payload.password_confirmation = confirmarPassword.value;
    }

    const res = await inversionistasService.updateInvestor(id, payload);

    toast.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: res.data.message || 'Datos actualizados correctamente.',
      life: 4000
    });

    // 🎯 Redirigir al login después del registro exitoso
    setTimeout(() => {
      router.push('/login');
    }, 2000); // Espera 2 segundos para que el usuario vea el mensaje de éxito

  } catch (err) {
    const msg = err?.response?.data?.message || 'Error al actualizar.';
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: msg,
      life: 4000
    });
  } finally {
    loading.value = false;
  }
};

// Función para ir al login (si necesitas usarla en otros lugares)
const goToLogin = () => {
  router.push('/login');
};

// Función para manejar términos (agregar si no existe)
const goTerminos = () => {
  router.push('/terminos');
};

// Función para manejar cambio de perfil (agregar si no existe)
const handlePerfilChange = (perfil) => {
  if (perfil === 'empresa') {
    showEmpresaDialog.value = true;
  }
};

// Función para contactar especialista (agregar si no existe)
const contactarEspecialista = () => {
  showEmpresaDialog.value = false;
  // Aquí puedes agregar la lógica para contactar al especialista
  toast.add({
    severity: 'info',
    summary: 'Contacto',
    detail: 'Te contactaremos pronto.',
    life: 3000
  });
};
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
.p-password {
  width: 100%;
}

.p-password .p-inputtext {
  width: 100%;
}
</style>