<template>
  <div id="home" class="landing-wrapper bg-[#edeae4]">
    <TopbarWidget />

    <h1 class="pt-4 px-20 text-center text-[#171717] font-normal font-noto"><b>Contáctanos</b></h1>
    <h3 class="font-medium text-xl text-center max-w-xl mx-auto">
      Completa el formulario y uno de nuestros asesores se pondrá en contacto contigo.
    </h3>

    <div class="max-w-7xl mx-auto px-4 mt-12 lg:px-20">
      <div class="grid grid-cols-12 gap-0 max-w-6xl mx-auto">
        <!-- Formulario principal -->
        <div class="col-span-12 md:col-span-6 px-5 mb-10">
          <form @submit.prevent="submitForm" class="bg-white rounded-xl p-10">
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
              <Dropdown
                v-model="form.interested_product"
                :options="productOptions"
                optionLabel="name"
                optionValue="value"
                placeholder="Selecciona un producto"
                class="w-full"
                panelClass="!rounded-xl"
                :pt="{
                  root: {
                    class: 'w-full h-full rounded-xl text-[#171717] bg-gray-100 border border-gray-300 focus:border-[#6790FF] focus:ring-2 focus:ring-[#6790FF]'
                  },
                  input: {
                    class: 'py-3 px-5 rounded-xl text-[#171717] bg-transparent'
                  },
                  trigger: {
                    class: 'px-5'
                  }
                }"
              />
              <span v-if="errors.interested_product" class="text-red-500 text-sm">{{ errors.interested_product[0] }}</span>
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

        <!-- Lado derecho: sección extra + newsletter -->
        <div class="col-span-12 md:col-span-6 px-5 mb-10 relative">
          <div class="bg-white rounded-xl p-5">
            <h3 class="font-medium text-xl text-center max-w-xl mx-auto m-0">Recibe atención personalizada</h3>
            <div class="bg-[#23c347] rounded-xl py-3 px-5 text-center mt-6 relative">
              <h4 class="m-0 text-white font-normal text-center text-medium text-2xl leading-none ps-16">
                <a href="https://wa.me/51986351267">
                  <i class="pi pi-whatsapp !text-5xl absolute left-16 top-3"></i>
                  Chatea con<br />nosotros
                </a>                
              </h4>
            </div>
          </div>

          <div class="p-2 text-center">
            <img src="/imagenes/landing/ayuda.svg" alt="Ayuda" class="h-[85px] ps-4 mt-0 mx-auto" />
            <div class="relative inline-block">
              <h4 class="m-0 ps-5 text-[#171717] font-normal text-center text-medium text-3xl top-8">
                Estamos aquí<br />para <b class="text-[#6790FF]">ayudarte.</b>
              </h4>
            </div>
          </div>

          <!-- Newsletter con Dropdown -->
          <div class="bg-white rounded-xl p-5 mt-1">
            <form @submit.prevent="submitFormN" class="bg-white rounded-xl p-1">
                <h3 class="font-medium text-xl text-center max-w-xl mx-auto m-0 leading-none">
                ¡Sé el primero en enterarte de las subastas!
              </h3>
              <p class="font-normal text-sm text-center max-w-xl mx-auto m-0 leading-none pt-3">
                Déjanos tu correo electrónico y recibe notificaciones sobre
                <b>nuevas oportunidades de inversión</b>
              </p>

              <div class="rounded-xl mb-5 mt-[15px]">
                <Dropdown
                  v-model="formNewsletter.interested_product"
                  :options="productOptionsN"
                  optionLabel="name"
                  optionValue="value"
                  placeholder="Selecciona un producto"
                  class="w-full"
                  panelClass="!rounded-xl"
                  :pt="{
                    root: {
                      class: 'w-full h-full rounded-xl text-[#171717] bg-gray-100 border border-gray-300 focus:border-[#6790FF] focus:ring-2 focus:ring-[#6790FF]'
                    },
                    input: {
                      class: 'py-3 px-5 rounded-xl text-[#171717] bg-transparent'
                    },
                    trigger: {
                      class: 'px-5'
                    }
                  }"
                />
              </div>
              <div class="rounded-xl mb-5 mt-[15px]">
                <input v-model="formNewsletter.email" type="email" placeholder="tu@email.com"
                  class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-gray-100 border border-gray-300"
                  :class="{ 'border-red-500': errors.email }" required />
              </div>

              <label class="inline-flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  class="accent-[#6790FF] w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-[#6790FF]"
                  v-model="formNewsletter.accepted_policy"
                />
                <span class="text-[#171717] text-base text-xs leading-none">
                  Autorizo el uso de mis datos personales para fines comerciales y de marketing,
                  de acuerdo con la política de privacidad de Zuma
                </span>
              </label>
              <Button type="submit" :disabled="!isFormValidN || isSubmittingN" severity="warn" rounded
                class="!border-none w-full !px-5 !py-2 !mt-7 !rounded-xl !bg-[#171717] !text-white hover:!bg-[#6790FF] transition-all duration-300 disabled:!bg-gray-400 disabled:!cursor-not-allowed">
                <span v-if="!isSubmittingN">Enviar Mensaje</span>
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
        </div>
      </div>
    </div>

    <FooterWidget />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import FooterWidget from '@/components/landing/FooterWidget.vue';
import { contactRequestService } from '@/services/contactRequestService.js';

const toast = useToast();

// Formulario principal
const form = reactive({
  full_name: '',
  phone: '',
  email: '',
  interested_product: '',
  message: '',
  accepted_policy: false
});

const formNewsletter = reactive({
  email: '',
  interested_product: '',
  accepted_policy: false
});

const errors = ref({});
const errorsN = ref({});
const isSubmitting = ref(false);
const isSubmittingN = ref(false);

// Opciones para select
const productOptions = ref([
  { name: 'Facturas', value: 'Facturas' },
  { name: 'Préstamos con Garantía', value: 'Prestamos' }
]);

const productOptionsN = ref([
  { name: 'Facturas', value: 'Facturas' },
  { name: 'Préstamos con Garantía', value: 'Prestamos' }
]);



const isFormValid = computed(() => {
  return (
    form.full_name.trim() &&
    form.phone.trim() &&
    form.email.trim() &&
    form.interested_product &&
    form.accepted_policy
  );
});

const isFormValidN = computed(() => {
  return (
    formNewsletter.email.trim() &&
    formNewsletter.interested_product &&
    formNewsletter.accepted_policy
  );
});


const resetForm = () => {
  form.full_name = '';
  form.phone = '';
  form.email = '';
  form.interested_product = '';
  form.message = '';
  form.accepted_policy = false;
};

const resetFormN = () => {
  formNewsletter.email = '';
  formNewsletter.interested_product = '';
  formNewsletter.accepted_policy = false;
};

const submitForm = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  errors.value = {};

  try {
    const payload = {
      full_name: form.full_name,
      phone: form.phone,
      email: form.email,
      interested_product: form.interested_product,
      message: form.message,
      accepted_policy: form.accepted_policy ? 1 : 0
    };

    await contactRequestService.submitContactRequest(payload);

    toast.add({
      severity: 'success',
      summary: 'Mensaje enviado',
      detail: 'Tu solicitud ha sido enviada correctamente. Te contactaremos pronto.',
      life: 5000
    });

    resetForm();
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
      toast.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor corrige los campos con error.',
        life: 5000
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error al enviar',
        detail: 'Ocurrió un problema. Intenta de nuevo más tarde.',
        life: 5000
      });
    }
  } finally {
    isSubmitting.value = false;
  }
};

const submitFormN = async () => {
  if (!isFormValidN.value) return;

  isSubmittingN.value = true;
  errorsN.value = {};

  try {
    const payload = {      
      email: formNewsletter.email,
      interested_product: formNewsletter.interested_product,
      accepted_policy: formNewsletter.accepted_policy ? 1 : 0
    };

    await contactRequestService.submitContactNewsLetter(payload);

    toast.add({
      severity: 'success',
      summary: 'Mensaje enviado',
      detail: 'Tu solicitud ha sido enviada correctamente. Te contactaremos pronto.',
      life: 5000
    });

    resetFormN();
  } catch (error) {
    if (error.response?.status === 422) {
      errors.value = error.response.data.errors || {};
      toast.add({
        severity: 'error',
        summary: 'Error de validación',
        detail: 'Por favor corrige los campos con error.',
        life: 5000
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error al enviar',
        detail: 'Ocurrió un problema. Intenta de nuevo más tarde.',
        life: 5000
      });
    }
  } finally {
    isSubmittingN.value = false;
  }
};

</script>
