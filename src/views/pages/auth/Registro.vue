<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import { dniService } from '@/services/dniService.js';
import admin2AuthService from '@/services/admin2AuthService.js';

const router = useRouter();
const toast = useToast();
const nombre = ref('');

const document = ref('');
const apellidoMaterno = ref('');
const apellidoPaterno = ref('');
const alias = ref('');
const correoElectronico = ref('');
const password = ref('');
const confirmarPassword = ref('');
const numeroTelefono = ref('');
const checked = ref(false);
const loading = ref(false);

const ingredient = ref('inversionista');

const showEmpresaDialog = ref(false);


watch(document, async (newVal) => {
  if (newVal.length === 8) {
    try {
      const { data } = await dniService.consultarDni(newVal);
      if (data.success) {
        apellidoPaterno.value = data.data.apellido_paterno;
        apellidoMaterno.value = data.data.apellido_materno;
        nombre.value = data.data.nombres;
      } else {
        toast.add({
          severity: 'warn',
          summary: 'DNI no encontrado',
          detail: 'No se encontraron datos para el DNI ingresado.',
          life: 3000
        });
      }
    } catch (error) {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo consultar el DNI. Verifica e intenta nuevamente.',
        life: 3000
      });
    }
  } else {
    apellidoPaterno.value = '';
    apellidoMaterno.value = '';
    nombre.value = '';
  }
});

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
  return document.value && apellidoMaterno.value && apellidoPaterno.value &&
    alias.value && correoElectronico.value && isPasswordValid.value &&
    passwordsMatch.value && numeroTelefono.value && checked.value;
});

const handlePerfilChange = (value) => {
  if (value === 'empresa') {
    showEmpresaDialog.value = true;
    setTimeout(() => {
      ingredient.value = 'inversionista';
    }, 100);
  }
};

const handleRegister = async () => {
  if (!isFormValid.value) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Por favor completa todos los campos correctamente',
      life: 3000
    });
    return;
  }

  loading.value = true;

  try {
    const payload = {
      name: nombre.value,
      first_last_name: apellidoPaterno.value,
      second_last_name: apellidoMaterno.value,
      alias: alias.value,
      document: document.value,
      email: correoElectronico.value,
      password: password.value,
      telephone: numeroTelefono.value
    };

    const response = await admin2AuthService.register(payload);

    toast.add({
      severity: 'success',
      summary: 'Registro exitoso',
      detail: response.data.message || 'Te enviaremos un correo para confirmar tu cuenta.',
      life: 4000
    });

    router.push('/login');
  } catch (error) {
    const msg = error?.response?.data?.message || 'Ocurrió un error al registrarte.';
    toast.add({
      severity: 'error',
      summary: 'Error de registro',
      detail: msg,
      life: 4000
    });
  } finally {
    loading.value = false;
  }
};

const goToLogin = () => {
  router.push('/login');
};

const goTerminos = () => {
  router.push('/terminos-y-condiciones');
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
</script>

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
          <form @submit.prevent="handleRegister" class="space-y-6">

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

<style scoped>
/* Estilos adicionales si son necesarios */
.p-password {
  width: 100%;
}

.p-password .p-inputtext {
  width: 100%;
}
</style>