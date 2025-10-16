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
const checkedP = ref(false)
const loading = ref(false);
const showErrors = ref(false);
const documentType = ref(null);
const aceptaTerminos = ref(false);
const documentTypes = ref([
  { id_tipo_documento: 1, nombre_tipo_documento: 'DNI' },
  { id_tipo_documento: 2, nombre_tipo_documento: 'CARNET DE EXTRANJERIA' },
]);

const scrolledToBottom = ref(false);
const scrolledToBottomP = ref(false)
const showPoliticasDialog = ref(false);

const ingredient = ref('inversionista');
const showEmpresaDialog = ref(false);
const showTerminosDialog = ref(false);
const showPoliticasDialogP = ref(false);

// Para manejar habilitación de campos
const isDni = computed(() => documentType.value === 1);
const isCarnet = computed(() => documentType.value === 3);

// Cuando cambia el tipo de documento
watch(documentType, (newVal) => {
  document.value = '';
  nombre.value = '';
  apellidoPaterno.value = '';
  apellidoMaterno.value = '';
});

onMounted(async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_ADMIN1;
    const response = await fetch(`${baseUrl}/tipo-documentos`);

    if (!response.ok) throw new Error(`Error ${response.status} al obtener tipos de documento`);

    const data = await response.json();
    console.log('Tipos de documento cargados:', data);

    documentTypes.value = data;

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
  const baseValidation = document.value && apellidoMaterno.value && apellidoPaterno.value &&
    alias.value && correoElectronico.value && isPasswordValid.value &&
    passwordsMatch.value && numeroTelefono.value && checked.value &&
    documentType.value && nombre.value;

  // Si es carnet de extranjería, también validar nacionalidad
  if (isCarnet.value) {
    return baseValidation && nacionalidad.value.trim() !== '';
  }

  return baseValidation;
});

const fieldValidations = computed(() => {
  return {
    document: document.value.trim() !== '',
    nombre: nombre.value.trim() !== '',
    nacionalidad: isCarnet.value ? nacionalidad.value.trim() !== '' : true,
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
      nacionalidad: nacionalidad.value || null,
      alias: alias.value,
      tipo_documento_id: documentType.value,
      document: document.value,
      email: correoElectronico.value,
      password: password.value,
      telephone: numeroTelefono.value
    };

    const response = await admin2AuthService.register(payload);

    // Si la API respondió éxito (status 201 o success)
    if (response.status === 201 || response.data?.success) {
      const userId = response.data.data?.userId || response.data.data?.id;
      
      toast.add({
        severity: 'success',
        summary: 'Registro exitoso',
        detail: response.data.message || 'Te hemos enviado un correo y un mensaje de WhatsApp para verificar tu cuenta.',
        life: 5000
      });

      // Redirigir a la página de verificación
      router.push({
        path: '/verificar-cuenta',
        query: {
          email: payload.email,
          userId: userId,
          phone: payload.telephone
        }
      });

    } else {
      toast.add({
        severity: 'warn',
        summary: 'Registro no completado',
        detail: response.data.message || 'Intenta nuevamente.',
        life: 4000
      });
    }
  } catch (error) {
    console.error('Error en registro:', error);
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
  showTerminosDialog.value=true;
  scrolledToBottom.value = false;
};

const goPoliticas = () => {
  showPoliticasDialog.value=true;
  scrolledToBottomP.value = false;
}

const checkedTerminos = () => {
  showTerminosDialog.value=false;
  checked.value = true
}

const checkedPoliticas = ()=>{
  showPoliticasDialog.value=false;
  checkedP.value = true
}



const scrollContainer = ref(null)
const scrollContainerP = ref(null)

const checkScroll = () => {
  const el = scrollContainer.value
  if (!el) return

  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5
  scrolledToBottom.value = atBottom
}

const checkScrollP = () => {
  const el = scrollContainerP.value
  if (!el) return

  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 5
  scrolledToBottomP.value = atBottom
}

const scrollToBottom = () => {
  const el = scrollContainer.value
  if (!el) return
  el.scrollTo({
    top: el.scrollHeight,
    behavior: 'smooth'
  })
}

const scrollToBottomP = () => {
  const el = scrollContainerP.value
  if (!el) return
  el.scrollTo({
    top: el.scrollHeight,
    behavior: 'smooth'
  })
}



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
              <div class="text-xs text-gray-500 space-y-1 mt-2">
                <div class="flex items-center gap-2">
                  <i class="pi pi-check-circle"
                    :class="passwordValidations.hasUpperCase ? 'text-green-500' : 'text-red-500'">
                  </i>
                  <span>al menos una mayúscula</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-check-circle"
                    :class="passwordValidations.hasNumber ? 'text-green-500' : 'text-red-500'">
                  </i>
                  <span>al menos un número</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-check-circle"
                    :class="passwordValidations.hasMinLength ? 'text-green-500' : 'text-red-500'">
                  </i>
                  <span>mínimo de 8 caracteres</span>
                </div>
                <div class="flex items-center gap-2">
                  <i class="pi pi-check-circle"
                    :class="passwordValidations.hasSpecialChar ? 'text-green-500' : 'text-red-500'">
                  </i>
                  <span>al menos un carácter especial</span>
                </div>
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
            <div class="flex items-start gap-3">
              <Checkbox v-model="checkedP" inputId="terms" binary :class="getFieldClass('checked')" />
              <label for="terms" class="text-sm text-gray-600 cursor-pointer">
                He leido las <a @click.prevent="goPoliticas" class="text-[#FF4929] hover:underline"> políticas de privacidad</a>
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




  <Dialog
    v-model:visible="showTerminosDialog"
    modal
    :closable="true"
    :draggable="false"
    class="mx-4 mx-4 w-[95vw] md:w-[80vw] max-w-[95vh]"
    style=""
  >
    <Button label="Ir al final" class="!absolute top-4 right-20 animate-float" severity="secondary" @click="scrollToBottom" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M12.75 4a.75.75 0 0 0-1.5 0zm-1.5 0v16h1.5V4z" opacity="0.5"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 14l-6 6l-6-6"/></g></svg>
    </Button>
    <template #header>
      <h3 class="text-xl font-bold text-gray-800">TÉRMINOS Y CONDICIONES</h3>
    </template>

    <!-- Contenido scrollable -->
    <div
      ref="scrollContainer"
      @scroll="checkScroll"
      style="max-height: 60vh; overflow-y: auto; padding-right: 1rem;"
    >
      <div class="mb-20"> <!-- margen inferior para que no tape el footer -->
        <div class="mb-20">
          <img src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma" class="w-28 mb-5">
          <p>
            Estos Términos y Condiciones (el “Acuerdo”) regulan la relación entre Zuma Inversiones
            S.A.C. (en adelante “Zuma”), con RUC 20614508192 y domicilio en Av. Pershing Nro. 419
            (Piso 7), Magdalena del Mar, Lima, Perú, y toda persona natural o jurídica que se registre
            como inversionista (el “Usuario” o “Inversionista”) en la plataforma www.zuma.com.pe (La
            “Plataforma”).
          </p>
          <p>
            Al registrarse, el Usuario acepta expresa y electrónicamente este Acuerdo y la Política de
            Privacidad de Zuma. Toda acción realizada en la Plataforma constituye una manifestación
            válida de voluntad conforme al Código Civil peruano.

          </p>
          <h6>
            1. Objeto del Acuerdo
          </h6>
          <p>
            Zuma ofrece una Plataforma digital que facilita inversiones en operaciones de factoring.
            Zuma no es una empresa del sistema financiero supervisada por la SBS ni por la SMV, no
            capta ahorro del público y no ofrece productos cubiertos por el Fondo de Seguro de
            Depósitos ni por el Fondo de Garantía de Inversiones.
            Zuma pone a disposición de los inversionistas oportunidades de inversión en facturas
            previamente adquiridas o por adquirir, sin que ellos constituya asesoría financiera ni
            recomendación de inversión.
            La decisión de invertir es exclusiva y voluntaria del Usuario, quien asume los riesgos de
            mora o impago.
          </p>
          <h6>2. Registro y Cuentas de Usuario</h6>
          <p>
            Para usar la Plataforma, el Usuario debe ser mayor de edad y tener capacidad legal para
            contratar.
            Se debe crear una Cuenta de Usuario única, vinculada a un correo electrónico y contraseña
            personal e intransferible.
            El Usuario se compromete a proporcionar información veraz, completa y actualizada, y
            autoriza a Zuma a verificarla en fuentes públicas, burós de crédito o listas de prevención de
            lavado de activos.
            Zuma se reserva el derecho de rechazar, suspender o cerrar cuentas sin expresión de
            causa, cuando lo considere necesario para el cumplimiento normativo o la seguridad de la
            Plataforma.
          </p>
          <h6>3. Servicios y Funcionamiento de la Plataforma</h6>
          <p>
            La Plataforma permite:
            <ul>
              <li>Visualizar oportunidades de inversión en factoring</li>
              <li>Realizar órdenes de inversión, totales o parciales, con fondos previamente</li>
              <li>Realizar órdenes de inversión, totales o parciales, con fondos previamente
            acreditados en la cuenta bancaria designada por Zuma (“Cuenta Escrow” o
            equivalente).
              </li>
              <li>
                  Realizar órdenes de inversión, totales o parciales, con fondos previamente
            acreditados en la cuenta bancaria designada por Zuma (“Cuenta Escrow” o
            equivalente).
              </li>
              <li>
                Consultar saldo disponible, movimientos de inversión, retornos y estado de pagos.
            Toda orden de inversión es vinculante e irrevocable mientras se encuentra en proceso de
            fondeo. Zuma procesará los pagos de capital y rendimiento solo cuando la empresa
            deudora haya pagado la factura subyacente, descontando los impuestos y comisiones
            aplicables
              </li>
            </ul>
            <h6>4. Obligaciones del Inversionista</h6>
            <p>
              El Inversionista declara y garantiza que:
            </p>
            <ul>
              <li>
                Los fondos provienen de actividades lícitas, asumiendo responsabilidad civil,
                administrativa y penal en caso contrario.
              </li>
              <li>
                Usará la Plataforma solo para fines permitidos y no la empleará para actividades
                fraudulentas, de lavado de activos o financiamiento del terrorismo.
              </li>
              <li>
                Mantendrá la confidencialidad de su contraseña y notificará a Zuma cualquier
                acceso no autorizado.
              </li>
            </ul>
            <p>
              Está prohibido:
            </p>
            <ul>
              <li>
                Suplantar identidades, abrir cuentas con datos o utilizar cuentas de terceros.
              </li>
              <li>
                Publicar contenido ofensivo, ilegal o que infrinja derechos de propiedad intelectual.
              </li>
              <li>
                Transmitir virus o realizar actos que puedan dañar la Plataforma.
              </li>
              <li>
                Promover actitudes contrarias al porvenir de la plataforma y su comunidad de
                inversionistas dentro o fuera del ámbito de la plataforma
              </li>
              
            </ul>
            <h6>5. Comisiones, impuestos y pagos</h6>
            <p>
              Zuma cobrará las comisiones y tarifas establecidas en las oportunidades de inversión o en
              las proformas específicas.
              Los impuestos aplicables (por ejemplo, la retención de segunda categoría cuando
              corresponda) serán descontados automáticamente según la normativa vigente.
              Los tiempos de abono pueden variar en función de los procesos bancarios, especialmente
              en transferencias interbancarias. Zuma no se responsabiliza por retrasos ajenos a su
              control.
            </p>
            <h6>6. Limitación de responsabilidad</h6>
            <p>
              El Usuario acepta que invierte bajo su propio riesgo.
              Zuma no garantiza el pago de las facturas, ni la exactitud absoluta de la información
              proporcionada por las empresas deudoras o sus proveedores, ni se responsabiliza por:
              
            </p>
            <ul>
              <li>
                Moras, impagos o incumplimientos de terceros.
              </li>
              <li>
                Fallas técnicas, interrupciones del servicio, virus o eventos de fuerza mayor
            
              </li>
              <li>
                Pérdidas económicas derivadas de decisiones de inversión del Usuario.              
              </li>
            </ul>
            <p>Zuma solo responde en caso de dolo o fraude debidamente probado.</p>
            <h6>7. Propiedad intelectual</h6>
            <p>
              Todo el contenido, software, marcas y diseños de la Plataforma son propiedad de Zuma.
              El Usuario recibe una licencia limitada y no exclusiva para utilizar la Plataforma solo para
              fines de inversión.
              Está prohibida su reproducción, modificación, ingeniería inversa o distribución sin
              autorización escrita.
            </p>
            <h6>8. Comunicaciones</h6>
            <p>
              Zuma podrá comunicarse con el Usuario mediante correo electrónico, WhatsApp, mensajes
              de texto, llamadas telefónicas o notificaciones en la Plataforma.
              El Usuario podrá gestionar su suscripción a comunicaciones comerciales según la Política
              de Privacidad.
            </p>
            <h6>9. Confidencialidad</h6>
            <p>
              El Usuario se compromete a mantener en reserva toda información confidencial obtenida a
              través de la Plataforma, incluso después del cierre de su cuenta, por un plazo mínimo de
              diez (10) años.
            </p>
            <h6>10. Modificaciones</h6>
            <p>
              Zuma podrá modificar los Términos y Condiciones, informándolo con al menos diez (10)
            días calendario de anticipación a través de la Plataforma o correo electrónico.
            El uso continuado de la Plataforma después de la fecha de vigencia implica la aceptación de
            las nuevas condiciones.
            </p>
            <h6>11. Legislación y jurisdicción</h6>
            <p>

              Este Acuerdo se rige por las leyes de la República del Perú.
              Cualquier controversia será resuelta por los juzgados y tribunales de Lima.
            </p>
            <h6>12. Definiciones principales</h6>
            <p>
              Inversionista: Persona natural o jurídica registrada en la Plataforma para invertir en
              oportunidades de factoring.
              Cuenta de Usuario: Espacio privado en la Plataforma para gestionar datos, inversiones y
              retiros.
              Orden de inversión: Oferta vinculante de un Inversionista para participar en una oportunidad
              específica de factoring.
              Saldo disponible: Fondos transferidos a la cuenta bancaria designada por Zuma y no
              comprometidos en una orden vigente.
              Oportundad de inversión: Descripción de una factura o paquete de facturas disponible para fondeo.
            </p>            
          </p>
        </div>
      </div>
    </div>

    <!-- Footer fijo -->
    <div class="flex justify-end gap-3 sticky bottom-0 bg-white pt-3 mt-3">
      <Button
        label="Cancelar"
        severity="secondary"
        @click="showTerminosDialog = false"
        class="px-6"
      />
      <Button
        label="Aceptar"
        severity="contrast"
        @click="checkedTerminos"
        :disabled="!scrolledToBottom"
        class="px-6 bg-[#FF4929] hover:bg-[#e63e29] border-0"
      />
    </div>
  </Dialog>

  <Dialog
    v-model:visible="showPoliticasDialog"
    modal
    :closable="true"
    :draggable="false"
    class="mx-4 w-[95vw] md:w-[80vw] max-w-[95vh]"
    style=""
  >
    <Button label="Ir al final" class="!absolute top-4 right-20 animate-float" severity="secondary" @click="scrollToBottomP" >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path fill="currentColor" d="M12.75 4a.75.75 0 0 0-1.5 0zm-1.5 0v16h1.5V4z" opacity="0.5"/><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m18 14l-6 6l-6-6"/></g></svg>
    </Button>
    <template #header>
      <h3 class="text-xl font-bold text-gray-800">POLÍTICA DE PRIVACIDAD</h3>
    </template>

    <!-- Contenido scrollable -->
    <div
      ref="scrollContainerP"
      @scroll="checkScrollP"
      style="max-height: 60vh; overflow-y: auto; padding-right: 1rem;"
    >
      <div class="mb-20"> <!-- margen inferior para que no tape el footer -->
        <div class="mb-20">
          <img src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma" class="w-28 mb-5">
          <p>
            La presente Política de Privacidad (la “Política”) tiene como finalidad informarle la manera
            en que Zuma Inversiones S.A.C. (en adelante, “Zuma”), con RUC 20614508192 y domicilio
            en Av. Pershing Nro. 419 (Piso 7), Magdalena del Mar, Lima, Perú, trata su información
            personal cuando usted utiliza la plataforma www.zuma.com.pe (La “Plataforma”).
            

          </p>
          <p>
            Al registrarse, el Usuario declara haber leído y aceptado de manera previa y expresa esta
            Política, sujetándose a sus disposiciones.

          </p>
          <h6>1. Obtención de la información</h6>
          <p>
            Para registrarse como inversionista y operar la Plataforma, recopilamos la siguiente información personal:
          </p>
          <ul>
            <li><strong>Identificación:</strong> nombre y apellidos, tipo y número de documento de identidad.</li>
            <li><strong>Contacto:</strong> dirección, distrito, provincia, departamento, correo electrónico y teléfono.</li>
            <li><strong>Datos financieros:</strong> cuentas bancarias para depósitos, retiros y validación de operaciones.</li>
            <li><strong>Información de perfil de inversión y riesgo:</strong> cuestionarios de conocimiento del producto, perfil de riesgo, experiencia de inversión.</li>
            <li><strong>Datos de navegación y uso:</strong> dirección IP, tipo de dispositivo y navegador, páginas visitadas, operaciones realizadas y comportamiento dentro de la Plataforma.</li>
          </ul>
          <p>
            Estos datos pueden complementarse con información de fuentes públicas, burós de crédito o listas de prevención de lavado de activos y financiamiento del terrorismo.
          </p>

          <h6>2. Veracidad y actualización</h6>
          <p>
            El inversionista declara que toda la información proporcionada es veraz, completa y actualizada, y se compromete a mantenerla así.
            Zuma podrá verificarla, pero no asume responsabilidad por datos inexactos proporcionados por el Usuario.
          </p>

          <h6>3. Conservación y almacenamiento</h6>
          <p>
            Conforme a la Ley N.° 29733 de Protección de Datos Personales, sus datos se incorporan a un banco de datos de titularidad de Zuma, inscrito ante la Autoridad Nacional de Protección de Datos Personales.
          </p>
          <p>Al registrarse, usted autoriza:</p>
          <ul>
            <li>
              La conservación de su información mientras mantenga relación contractual con Zuma y por los plazos de prescripción legal.
            </li>
            <li>
              El flujo transfronterizo de datos, en caso de que la Plataforma utilice servicios de almacenamiento en la nube fuera del país, garantizando niveles adecuados de protección.
            </li>
          </ul>

          <h6>4. Finalidad del tratamiento</h6>
          <p>Zuma tratará sus datos personales exclusivamente para:</p>
          <ul>
            <li>Registrar y administrar su cuenta de inversionista.</li>
            <li>Evaluar su perfil de riesgo y cumplimiento normativo (PLD/FT).</li>
            <li>Procesar sus operaciones de inversión, depósito, pagos y retiros.</li>
            <li>Contactarlo para informar sobre operaciones, vencimientos, actualizaciones de plataforma o cambios de términos y condiciones.</li>
            <li>Mejorar la experiencia de usuario, a través de análisis de navegación y uso de la Plataforma.</li>
            <li>Enviar, si usted lo autoriza, información de productos, novedades o promociones vinculadas a oportunidades de inversión de Zuma.</li>
          </ul>

          <h6>5. Seguridad</h6>
          <p>
            Zuma adopta medidas técnicas, organizativas y legales para proteger sus datos personales frente a accesos no autorizados, pérdida o uso indebido, de acuerdo con la Ley 29733 y estándares internacionales.
            No obstante, ninguna transmisión por Internet es 100% segura; por ello, Zuma no se responsabiliza por accesos ilícitos fuera de su control razonable.
          </p>

          <h6>6. Compartición de información</h6>
          <p>Zuma no venderá ni cederá sus datos personales. Podremos compartir su información únicamente:</p>
          <ul>
            <li>Con proveedores de servicios tecnológicos o de procesamiento de pagos bajo acuerdos de confidencialidad.</li>
            <li>Con entidades financieras o de cobranzas en caso de ser necesario para ejecutar operaciones de inversión.</li>
            <li>Con autoridades administrativas o judiciales que lo requieran dentro de sus competencias legales.</li>
          </ul>

          <h6>7. Cookies</h6>
          <p>
            La Plataforma utiliza cookies para su correcto funcionamiento, análisis estadístico y mejora de la experiencia de usuario.
            Usted puede desactivarlas o borrarlas desde su navegador sin afectar el acceso básico a la Plataforma.
          </p>

          <h6>8. Derechos del inversionista</h6>
          <p>
            En cualquier momento, usted puede ejercer sus derechos de acceso, rectificación, cancelación y oposición (ARCO) o revocar su consentimiento,
            enviando una solicitud a <a href="mailto:oficialdecumplimiento@zuma.com.pe">oficialdecumplimiento@zuma.com.pe</a>
            o a través de los formularios disponibles en la Plataforma.
          </p>
          <p>
            Zuma podrá conservar información por plazos legales para atender eventuales responsabilidades.
          </p>

          <h6>9. Modificaciones</h6>
          <p>
            Zuma podrá modificar, actualizar o complementar la presente Política.
            Las modificaciones serán publicadas en <a href="https://www.zuma.com.pe" target="_blank">www.zuma.com.pe</a>,
            recomendándose su revisión periódica, especialmente antes de facilitar nuevos datos personales.
          </p>
        </div>
      </div>
    </div>

    <!-- Footer fijo -->
    <div class="flex justify-end gap-3 sticky bottom-0 bg-white pt-3 mt-3">
      <Button
        label="Cancelar"
        severity="secondary"
        @click="showTerminosDialogP = false"
        class="px-6"
      />
      <Button
        label="Aceptar"
        severity="contrast"
        @click="checkedPoliticas"
        :disabled="!scrolledToBottomP"
        class="px-6 bg-[#FF4929] hover:bg-[#e63e29] border-0"
      />
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

@keyframes floatDown {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(8px);
  }
}

.animate-float {
  animation: floatDown 1.5s ease-in-out infinite;
}
</style>