<template>
  <div id="home" class="landing-wrapper bg-[#edeae4]">
    <TopbarWidget />
    <section class="pt-0 pb-10">

      <div class="max-w-7xl mx-auto lg:px-20 grid grid-cols-12 gap-0">
        <div class="col-span-4 flex items-center justify-center">
          <img src="/imagenes/landing/nosotros.svg" alt="Imagen nosotros"
            class="w-[20rem] md:w-[20.3rem] lg:w-[20.7rem] ps-4" />
        </div>
        <div
          class="col-span-8 bg-[url(/imagenes/landing/cuadrado-girado.svg)] bg-cover bg-center p-10 md:p-20 flex items-center justify-center">
          <h1
            class="m-0 text-center text-white font-normal font-noto text-[1.4rem] sm:text-[1.8rem] md:text-[2.4rem] lg:text-[2.7rem]">
            Nuestro
            <b>propósito</b> es
            <b class="text-[#FF4929]">democratizar</b> el acceso a instrumentos de <b>inversión</b>
          </h1>
        </div>
      </div>

      <div class="bg-white">
        <div class="max-w-5xl mx-auto px-4 lg:px-20">
          <p class="mb-0 py-10 text-center text-[#171717] text-lg leading-relaxed">Buscamos ofrecer una
            <b>diversidad</b> de herramientas de <b>inversión</b> que estén al alcance del común de los bolsillos. En
            las sociedades donde operamos, la mayoría de las personas <b>aún no rentabilizan</b> adecuadamente sus
            excedentes. En muchos casos por desconocimiento o temor. Las alternativas de inversión disponibles en el
            mercado están orientadas a personas de alto patrimonio. Aquellos que cuentan con pequeños excedentes,
            <b>no son tomados en cuenta</b>. Es así que nace <img src="/imagenes/landing/logo-zuma.svg" alt="Logo zuma"
              class="w-12 inline-block" />, una plataforma creada para <b>conectar, educar y crear
              riqueza,</b> dirigida para aquellos que recién se inician en el mundo de las inversiones o que buscan
            algo diferente
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 lg:px-20">
        <div class="text-center py-10">
          <h2 class="inline-block text-[#171717] me-2 my-0 font-noto">Invertir no solo es para unos pocos.</h2>
          <h1 class="inline-block text-[#6790FF] my-0 font-noto">Es para ti.</h1>
          <p class="text-center text-[#171717] text-lg leading-relaxed">En <img src="/imagenes/landing/logo-zuma.svg"
              alt="Logo zuma" class="w-12 inline-block" /> construimos una comunidad de inversionistas.
            <b>Oportunidades
              claras, sin letra pequeña.</b>
          </p>
        </div>

        <div class="grid grid-cols-12 gap-[3rem]">
          <div class="col-span-12 md:col-span-6 relative">
            <div class="bg-[#171717] rounded-[30px] py-1 px-10 text-white absolute top-3 -left-8">
              <h3 class="m-0 text-white font-normal text-center">Misión
              </h3>
            </div>
            <div class="bg-[#FF4929] rounded-[70px] py-10 px-2 lg:px-10">
              <h3
                class="m-0 text-[#171717] font-normal text-center font-noto text-[1.4rem] sm:text-[1.8rem] md:text-[1.8rem]  leading-snug">
                Brindar el acceso<br>a alternativas
                de<br>
                forma <b>ágil, fácil y<br> confiable</b>.</h3>
            </div>
          </div>
          <div class="col-span-12 md:col-span-6 relative">
            <div class="bg-[#171717] rounded-[30px] py-1 px-10 text-white absolute top-3 -left-8">
              <h3 class="m-0 text-white font-normal text-center">Visión
              </h3>
            </div>
            <div class="bg-[#FF4929] rounded-[70px] py-10 px-2 lg:px-10">
              <h3
                class="m-0 text-[#171717] font-normal text-center font-noto text-[1.4rem] sm:text-[1.8rem] md:text-[1.8rem]  leading-snug">
                Convertirnos en el<br> Marketplace
                <b>líder</b> de<br> <b>inversiones</b> alternativas<br> en Latinoamérica.
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div class="max-w-[91rem] mx-auto px-4 lg:px-20">
        <div class="bg-[url(/imagenes/landing/logo-zuma-blanco-m.svg)] bg-center bg-repeat-x w-full h-[100px]"
          style="background-size: 30px;">
        </div>
      </div>
      <div class="max-w-7xl mx-auto px-4 lg:px-20">
        <div class="grid grid-cols-12 gap-0 max-w-6xl mx-auto">
          <div class="col-span-12 md:col-span-6 px-5 mb-10">

            <form @submit.prevent="submitContactForm" class="bg-white rounded-xl p-10">
              <label class="block text-sm font-medium mb-1 text-[#171717]">Nombre y Apellido</label>
              <div class="rounded-xl mb-5">
                <input v-model="form.full_name" type="text" placeholder="Ingresa tu nombre completo"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300"
                  :class="{ 'border-red-500': errors.full_name }" required />
                <span v-if="errors.full_name" class="text-red-500 text-sm">{{ errors.full_name[0] }}</span>
              </div>

              <label class="block text-sm font-medium mb-1 text-[#171717]">Teléfono</label>
              <div class="rounded-xl mb-5">
                <input v-model="form.phone" type="text" placeholder="Ej. +51 999 888 777"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300"
                  :class="{ 'border-red-500': errors.phone }" required />
                <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone[0] }}</span>
              </div>

              <label class="block text-sm font-medium mb-1 text-[#171717]">Correo electrónico</label>
              <div class="rounded-xl mb-5">
                <input v-model="form.email" type="email" placeholder="tu@email.com"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300"
                  :class="{ 'border-red-500': errors.email }" required />
                <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email[0] }}</span>
              </div>

              <label class="block text-sm font-medium mb-1 text-[#171717]">Producto de Interés</label>
              <div class="rounded-xl mb-5">
                <Select v-model="form.interested_product" :options="productOptions" optionLabel="name"
                  optionValue="value" placeholder="Selecciona un producto" class="w-full"
                  :class="{ 'p-invalid': errors.interested_product }" panelClass="!rounded-xl" :pt="{
                    root: {
                      class: 'w-full h-full rounded-xl text-[#171717] bg-gray-100 border border-gray-300 focus:border-[#6790FF] focus:ring-2 focus:ring-[#6790FF]'
                    },
                    input: {
                      class: 'py-3 px-5 rounded-xl text-[#171717] bg-transparent'
                    },
                    trigger: {
                      class: 'px-5'
                    }
                  }" />
                <span v-if="errors.interested_product" class="text-red-500 text-sm">{{ errors.interested_product[0]
                  }}</span>
              </div>

              <label class="block text-sm font-medium mb-1 text-[#171717]">Mensaje</label>
              <div class="rounded-xl mb-5">
                <textarea v-model="form.message" placeholder="Cuéntanos cómo podemos ayudarte" rows="4"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300"
                  :class="{ 'border-red-500': errors.message }" />
                <span v-if="errors.message" class="text-red-500 text-sm">{{ errors.message[0] }}</span>
              </div>

              <label class="inline-flex items-center space-x-2 cursor-pointer mb-5">
                <input v-model="form.accepted_policy" type="checkbox"
                  class="accent-[#6790FF] w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-[#6790FF]"
                  :class="{ 'border-red-500': errors.accepted_policy }" required />
                <span class="text-[#171717] text-base text-xs leading-none">
                  Autorizo el uso de mis datos personales para fines comerciales y de marketing,
                  de acuerdo con la política de privacidad de Zuma
                </span>
              </label>
              <div v-if="errors.accepted_policy" class="mb-3">
                <span class="text-red-500 text-sm">{{ errors.accepted_policy[0] }}</span>
              </div>

              <Button type="submit" :disabled="!isFormValid || isSubmitting" severity="warn" rounded
                class="!border-none w-full !px-5 !py-2 !mt-7 !rounded-xl !bg-[#171717] !text-white hover:!bg-[#6790FF] transition-all duration-300 disabled:!bg-gray-400 disabled:!cursor-not-allowed">
                <span v-if="!isSubmitting">Enviar Mensaje</span>
                <div v-else class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  Enviando...
                </div>
              </Button>
            </form>
          </div>

          <div class="col-span-12 md:col-span-6 px-5 mb-10">
            <div class="py-[10rem]">
              <h1 class="m-0 text-[#171717] font-normal text-center font-noto text-medium text-6xl">¿Requieres
                asesoría?</h1>
              <img src="/imagenes/landing/asesoria.svg" alt="Logo zuma" class="w-3/4 ps-4 mt-6 relative mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterWidget />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import { contactRequestService } from '@/services/contactRequestService.js';

const toast = useToast();

// Opciones para el select de productos
const productOptions = ref([
  { name: 'Facturas', value: 'Facturas' },
  { name: 'Préstamos con Garantía', value: 'Prestamos' },
  { name: 'Depósito a plazo fijo', value: 'tasas' }
]);

// Estado reactivo del formulario
const form = reactive({
  full_name: '',
  phone: '',
  email: '',
  interested_product: '',
  message: '',
  accepted_policy: false
});

// Estados para manejar la UI
const isSubmitting = ref(false);
const errors = ref({});

// Computed para verificar si el formulario es válido
const isFormValid = computed(() => {
  return form.full_name.trim() !== '' &&
    form.phone.trim() !== '' &&
    form.email.trim() !== '' &&
    form.interested_product !== '' &&
    form.accepted_policy === true;
});

// Función para limpiar mensajes
const clearMessages = () => {
  errors.value = {};
};

// Función para resetear el formulario
const resetForm = () => {
  form.full_name = '';
  form.phone = '';
  form.email = '';
  form.interested_product = '';
  form.message = '';
  form.accepted_policy = false;
};

// Función principal para enviar el formulario
const submitContactForm = async () => {
  if (!isFormValid.value) return;

  clearMessages();
  isSubmitting.value = true;

  try {
    // Preparar los datos para enviar
    const payload = {
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      interested_product: form.interested_product,
      message: form.message,
      accepted_policy: form.accepted_policy ? 1 : 0 // Convertir boolean a 1/0
    };

    // Usar el servicio contactRequestService
    const response = await contactRequestService.submitInternalRequest(payload);

    // Mostrar toast de éxito
    toast.add({
      severity: 'success',
      summary: 'Mensaje enviado',
      detail: 'Tu solicitud ha sido enviada correctamente. Te contactaremos pronto.',
      life: 5000
    });

    // Resetear el formulario
    resetForm();

  } catch (error) {
    console.error('Error al enviar formulario:', error);

    if (error.response && error.response.status === 422) {
      // Errores de validación
      errors.value = error.response.data.errors || {};
      toast.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor, corrige los errores en el formulario.',
        life: 5000
      });
    } else if (error.response && error.response.data && error.response.data.message) {
      // Error del servidor con mensaje
      toast.add({
        severity: 'error',
        summary: 'Error del servidor',
        detail: error.response.data.message,
        life: 5000
      });
    } else {
      // Error genérico
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Ocurrió un error al enviar el mensaje. Por favor, inténtalo nuevamente.',
        life: 5000
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};
</script>