<script setup>
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import admin2AuthService from '@/services/admin2AuthService.js';
import { dniService } from '@/services/dniService.js';
import { useToast } from 'primevue/usetoast';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const toast = useToast();
const nombre = ref('');
const nacionalidad = ref('');

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
const showErrors = ref(false);
const documentType = ref(null);
const documentTypes = ref([
  { id_tipo_documento: 1, nombre_tipo_documento: 'DNI' },
  { id_tipo_documento: 3, nombre_tipo_documento: 'Carnet de extranjería' },
]);

const ingredient = ref('inversionista');

const showEmpresaDialog = ref(false);

// Para manejar habilitación de campos
const isDni = computed(() => documentType.value === 1)          // 1 → DNI
const isCarnet = computed(() => documentType.value === 3)       // 2 → Carnet de extranjería

// Cuando cambia el tipo de documento
watch(documentType, (newVal) => {
  // Limpia documento y datos de persona
  document.value = ''
  nombre.value = ''
  apellidoPaterno.value = ''
  apellidoMaterno.value = ''
})

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_ADMIN1; // 👈 toma la URL desde .env
    const response = await fetch(`${baseUrl}/tipo-documentos`);

    if (!response.ok) throw new Error(`Error ${response.status} al obtener tipos de documento`);

    const data = await response.json();
    console.log('Tipos de documento cargados:', data);

    documentTypes.value = data;
    // .map(item => ({
    //   id_tipo_documento: item.id_tipo_documento,
    //   nombre_tipo_documento: item.nombre_tipo_documento
    // }));

  } catch (error) {
    console.error('Fetch error:', error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar los tipos de documento.',
      life: 3000
    });
  }
});

watch(document, async (newVal) => {
  if (isDni.value && newVal.length === 8) {
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
    passwordsMatch.value && numeroTelefono.value && checked.value &&
    documentType.value;
});

const fieldValidations = computed(() => {
  return {
    document: document.value.trim() !== '',  // ya no se valida la longitud
    nombre: nombre.value.trim() !== '',
    nacionalidad: nacionalidad.value.trim() !== '',
    apellidoPaterno: apellidoPaterno.value.trim() !== '',
    apellidoMaterno: apellidoMaterno.value.trim() !== '',
    alias: alias.value.trim() !== '',
    correoElectronico: correoElectronico.value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoElectronico.value),
    password: isPasswordValid.value,
    confirmarPassword: passwordsMatch.value,
    numeroTelefono: numeroTelefono.value.trim() !== '',
    checked: checked.value,
    documentType: documentType.value !== null
  };
});


const getFieldClass = (fieldName) => {
  if (!showErrors.value) return '';
  return fieldValidations.value[fieldName] ? '' : 'p-invalid';
};

const handlePerfilChange = (value) => {
  if (value === 'empresa') {
    showEmpresaDialog.value = true;
    setTimeout(() => {
      ingredient.value = 'inversionista';
    }, 100);
  }
};

const handleRegister = async () => {
  showErrors.value = true;

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
      nacionalidad: nacionalidad.value,
      alias: alias.value,
      tipo_documento_id: documentType.value,
      document: document.value,
      email: correoElectronico.value,
      password: password.value,
      telephone: numeroTelefono.value
    };

    const response = await admin2AuthService.register(payload);

    // si la API respondió éxito (status 201 o status success)
    if (response.status === 201 || response.data?.status === 'success') {
      toast.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: response.data.message || 'Te enviaremos un correo para confirmar tu cuenta.',
        life: 4000
      });

      // redirigir solo en éxito
      router.push({
        path: '/verificar-cuenta',
        query: {
          email: payload.email,
          userId: response.data.data.userId
        }
      });

    } else {
      // si vino un 200 raro sin éxito
      toast.add({
        severity: 'warn',
        summary: 'Registro no completado',
        detail: response.data.message || 'Intenta nuevamente.',
        life: 4000
      });
    }
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
    <Toast position="top-center" />
    <TopbarWidget />

    <!-- Contenido centrado -->
    <div class="flex-1 flex flex-col items-center justify-center p-4 bg-white">
    <!--
      <div class="w-full max-w-md flex justify-between items-center mb-4 py-2 px-6">
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
      -->

      <div class="w-full max-w-xl">
        <div class="border border-gray-200 p-10 rounded-3xl shadow-sm">
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">
              Regístrate
            </h2>
            <p class="text-gray-600">¡Comienza a hacer crecer tu dinero!</p>
          </div>

          <!-- Formulario -->
          <form @submit.prevent="handleRegister" class="space-y-6">

            <!-- DNI/Documento -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Tipo de Documento -->
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Tipo de Documento <span class="text-red-500">*</span>
                </label>
                <Dropdown v-model="documentType" :options="documentTypes" optionLabel="nombre_tipo_documento"
                  optionValue="id_tipo_documento" placeholder="Seleccione el tipo de documento" class="w-full"
                  appendTo="self" />
              </div>

              <!-- Documento -->
              <div>
                <label class="text-sm font-medium text-gray-700">
                  Número de documento <span class="text-red-500">*</span>
                </label>
                <InputText v-model="document" placeholder="Ingresa el número" :class="getFieldClass('document')"
                  class="w-full" />
              </div>
            </div>

            <!-- Nombre -->
            <div class="w-full flex flex-col">
              <label class="text-sm font-medium text-gray-700 mb-1">
                Nombre <span class="text-red-500">*</span>
              </label>
              <InputText v-model="nombre" placeholder="Ingresa tu nombre" :disabled="isDni"
                :class="getFieldClass('nombre') + ' w-full'" class="compact-input" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Apellido Paterno -->
              <div class="w-full">
                <label class="text-sm font-medium text-gray-700">
                  Apellido Paterno <span class="text-red-500">*</span>
                </label>
                <InputText v-model="apellidoPaterno" placeholder="Apellido paterno" :disabled="isDni"
                  :class="getFieldClass('apellidoPaterno')" class="w-full compact-input" />
              </div>

              <!-- Apellido Materno -->
              <div class="w-full">
                <label class="text-sm font-medium text-gray-700">
                  Apellido Materno <span class="text-red-500">*</span>
                </label>
                <InputText v-model="apellidoMaterno" placeholder="Apellido materno" :disabled="isDni"
                  :class="getFieldClass('apellidoMaterno')" class="w-full compact-input" />
              </div>
            </div>

            <!-- Nacionalidad -->
            <div class="space-y-2" v-if="documentType === 3">
              <label class="text-sm font-medium text-gray-700">
                Nacionalidad <span class="text-red-500">*</span>
              </label>
              <InputText v-model="nacionalidad" placeholder="Ingresa tu nacionalidad" fluid
                :class="getFieldClass('nacionalidad')" class="compact-input" />
            </div>

            <!-- Alias -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Alias <span class="text-red-500">*</span>
              </label>
              <InputText v-model="alias" placeholder="Ingresa tu alias" fluid :class="getFieldClass('alias')"
                class="compact-input" />
            </div>

            <!-- Correo electrónico -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Correo electrónico <span class="text-red-500">*</span>
              </label>
              <InputText v-model="correoElectronico" type="email" placeholder="correo@ejemplo.com" fluid
                :class="getFieldClass('correoElectronico')" class="compact-input" />
            </div>

            <!-- Contraseña -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Contraseña <span class="text-red-500">*</span>
              </label>
              <Password v-model="password" placeholder="Ingresa tu contraseña" :feedback="false" toggleMask fluid
                :class="getFieldClass('password')" class="compact-password" />

              <!-- Validaciones de contraseña -->
              <div class="text-gray-500 space-y-1 mt-1">
                <!-- Al menos una mayúscula -->
                <span class="flex items-center gap-1">
                  <i class="pi pi-check-circle text-lg"
                    :class="passwordValidations.hasUpperCase ? 'text-green-500' : 'text-red-500'">
                  </i>
                  al menos una mayúscula
                </span>

                <!-- Al menos un número -->
                <span class="flex items-center gap-1">
                  <i class="pi pi-check-circle text-lg"
                    :class="passwordValidations.hasNumber ? 'text-green-500' : 'text-red-500'">
                  </i>
                  al menos un número
                </span>

                <!-- Mínimo 8 caracteres -->
                <span class="flex items-center gap-1">
                  <i class="pi pi-check-circle text-lg"
                    :class="passwordValidations.hasMinLength ? 'text-green-500' : 'text-red-500'">
                  </i>
                  mínimo de 8 caracteres
                </span>

                <!-- Al menos un carácter especial -->
                <span class="flex items-center gap-1">
                  <i class="pi pi-check-circle text-lg"
                    :class="passwordValidations.hasSpecialChar ? 'text-green-500' : 'text-red-500'">
                  </i>
                  al menos un carácter especial
                </span>
              </div>
            </div>

            <!-- Confirmar contraseña -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-gray-700">
                Confirmar contraseña <span class="text-red-500">*</span>
              </label>
              <Password v-model="confirmarPassword" placeholder="Confirma tu contraseña" :feedback="false" toggleMask
                fluid :class="getFieldClass('confirmarPassword')" class="compact-password" />
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
              <InputText v-model="numeroTelefono" placeholder="Ingresa tu número de teléfono" fluid
                :class="getFieldClass('numeroTelefono')" class="compact-input" />
            </div>

            <!-- Términos y condiciones -->
            <div class="flex items-start gap-3">
              <Checkbox v-model="checked" inputId="terms" binary :class="getFieldClass('checked')" />
              <label for="terms" class="text-sm text-gray-600 cursor-pointer">
                Acepto los <a @click.prevent="goTerminos" class="text-[#FF4929] hover:underline">términos y
                  condiciones</a>
              </label>
            </div>

            <!-- Botón de registro -->
            <Button type="submit" :disabled="loading" :loading="loading" severity="contrast" fluid
              class="register-button">
              {{ loading ? 'Registrando...' : 'Registrarme' }}
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
/* Estilos para inputs más compactos */
.compact-input :deep(.p-inputtext) {
  height: 2.5rem;
  padding: 0.5rem 0.75rem;
}

.compact-password :deep(.p-password-input) {
  height: 2.5rem;
  padding: 0.5rem 0.75rem;
}

.compact-password :deep(.p-password) {
  width: 100%;
}

.compact-password :deep(.p-inputtext) {
  width: 100%;
  height: 2.5rem;
}

/* Botón de registro */
.register-button:deep(.p-button:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Estilos para campos inválidos */
:deep(.p-invalid) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 1px #ef4444 !important;
}

:deep(.p-invalid:focus) {
  border-color: #ef4444 !important;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2) !important;
}

/* Checkbox inválido */
:deep(.p-checkbox.p-invalid .p-checkbox-box) {
  border-color: #ef4444 !important;
}
</style>