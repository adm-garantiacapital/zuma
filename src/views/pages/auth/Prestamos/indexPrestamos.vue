<template>
  <div id="home" class="landing-wrapper bg-[#edeae4]">
    <TopbarWidget />
    <section class="pt-0">
      <!-- PARTE 1 -->
      <div class="max-w-7xl mx-auto lg:px-20 grid grid-cols-12 gap-0">
        <div class="col-span-8 bg-cover bg-center p-10 md:p-20 flex flex-col items-star justify-center text-left">
          <h3
            class="m-0 font-normal  text-black text-[1rem] sm:text-[1.2rem] md:text-[1.4rem] lg:text-[1.6rem]">
            Préstamo con garantía hipotecaria
          </h3>
          <h1
            class="m-0 font-normal  text-black text-[1.4rem] sm:text-[1.8rem] md:text-[2.4rem] lg:text-[2.7rem] font-noto">
            Transforma tu patrimonio
            <b>en efectivo con una </b><b class="text-[#FF4929]">súper</b>
            <b> tasa y plazos</b><b class="text-[#FF4929]"> flexibles</b>
          </h1>
          <ul class="mt-6 space-y-3 text-gray-800 text-base">
            <li class="flex items-start gap-2">
              <img src="/imagenes/landing/11.svg" alt="Advertencia" class="w-5 h-5 mt-1" />
              <span><strong>No revisamos</strong> centrales de riesgo</span>
            </li>
            <li class="flex items-start gap-2">
              <img src="/imagenes/landing/12.svg" alt="Dinero" class="w-5 h-5 mt-1" />
              <span>Montos <strong>desde S/ 20,000</strong></span>
            </li>
            <li class="flex items-start gap-2">
              <img src="/imagenes/landing/13.svg" alt="Tiempo" class="w-5 h-5 mt-1" />
              <span><strong>Dinero en 7 días</strong> luego de presentar los documentos</span>
            </li>
          </ul>
          <div class="mt-8 flex gap-4">
            <a 
              href="https://wa.me/51932575779?text=Hola,%20me%20interesa%20obtener%20información%20sobre%20préstamos%20con%20garantía%20hipotecaria" 
              target="_blank"
              rel="noopener noreferrer"
              class="bg-[#FF4929] text-white font-medium px-6 py-3 rounded-full hover:bg-[#e64022] inline-block transition-colors duration-300">
              Solicita información
            </a>
<!---            <button class="bg-white text-[#FF4929] font-bold px-6 py-3 rounded-full hover:bg-[#fff5f3]">
              Simulador de cuotas
            </button>
          -->
          </div>
        </div>

        <div class="col-span-4 flex items-center justify-center">
          <img src="/imagenes/landing/prestamos1.svg" alt="Imagen nosotros" class="w-[28rem] h-auto ps-4" />
        </div>

      </div>

      <!-- PARTE II -->
      <div class="bg-white">
        <div class="bg-gray-50 py-12">
          <!-- Título -->
          <div class="text-center mb-10">
            <h2 class="text-3xl md:text-4xl  font-bold text-black">
              Conoce los beneficios
            </h2>
          </div>

          <!-- Bloque azul -->
          <div
            class="bg-[#4285F4] rounded-full py-6 px-10 flex flex-col md:flex-row items-center justify-center text-black text-center max-w-6xl mx-auto">

            <!-- Bloque 1 -->
            <div class="flex-1 flex flex-col items-center">
              <img src="/imagenes/landing/04.svg" alt="No revisamos" class="w-8 h-8 mb-2" />
              <span class="text-lg font-semibold">No revisamos</span>
              <span class="text-lg">centrales de riesgo</span>
            </div>

            <!-- Separador -->
            <div class="hidden md:block h-16 w-px bg-black mx-6"></div>

            <!-- Bloque 2 -->
            <div class="flex-1 flex flex-col items-center">
              <img src="/imagenes/landing/03.svg" alt="Tasa competitiva" class="w-8 h-8 mb-2" />
              <span class="text-lg font-semibold">Tasa competitiva</span>
              <span class="text-lg">desde 1.3% TEM</span>
            </div>

            <!-- Separador -->
            <div class="hidden md:block h-16 w-px bg-black mx-6"></div>

            <!-- Bloque 3 -->
            <div class="flex-1 flex flex-col items-center">
              <img src="/imagenes/landing/02.svg" alt="Cronograma" class="w-8 h-8 mb-2" />
              <span class="text-lg"><b>Cronograma</b> con plazos</span>
              <span class="text-lg"> y cuotas <b>a tu medida</b></span>
            </div>
          </div>

          <!-- Grid de beneficios -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14 max-w-6xl mx-auto">
            <div class="flex items-center gap-5">
              <img src="/imagenes/landing/06.svg" alt="Dinero inmueble" class="w-20 h-20 flex-shrink-0" />
              <div class="space-y-1">
                <h3 class=" font-semibold text-lg text-black leading-snug">
                  Más dinero por tu inmueble
                </h3>
                <p class=" text-sm text-gray-700 leading-snug">
                  Te prestamos hasta el 50% del valor de realización del inmueble. Accede a una mayor cantidad de dinero
                  en comparación con otros tipos de préstamos.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-5">
              <img src="/imagenes/landing/05.svg" alt="Bono buen pagador" class="w-20 h-20 flex-shrink-0" />
              <div class="space-y-1">
                <h3 class=" font-semibold text-lg text-black leading-snug">
                  Bono de buen pagador
                </h3>
                <p class=" text-sm text-gray-700 leading-snug">
                  Premiamos a los buenos pagadores con una reducción de la tasa de interés cuando mantienen un historial
                  de pagos puntual con nosotros.
                </p>
              </div>
            </div>

            <div class="flex items-center gap-5">
              <img src="/imagenes/landing/08.svg" alt="Dinero rápido" class="w-20 h-20 flex-shrink-0" />
              <div class="space-y-1">
                <h3 class=" font-semibold text-lg text-black leading-snug">
                  Dinero rápido
                </h3>
                <p class=" text-sm text-gray-700 leading-snug">
                  Obtén tu dinero más rápido que en otras instituciones financieras. Te pre aprobamos en menos de 24
                  horas y desembolsamos tu dinero en 7 días (desde la recepción de los documentos solicitados).
                </p>
              </div>
            </div>

            <div class="flex items-center gap-5">
              <img src="/imagenes/landing/07.svg" alt="Precancela" class="w-20 h-20 flex-shrink-0" />
              <div class="space-y-1">
                <h3 class=" font-semibold text-lg text-black leading-snug">
                  Precancela desde el primer día
                </h3>
                <p class=" text-sm text-gray-700 leading-snug">
                  Liquida tu crédito desde el primer día sin penalidades ni costos adicionales, o realiza pagos
                  parciales de tu préstamo en cualquier momento.
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- Bloque rojo -->
        <div
          class="bg-[#FF4929] text-black rounded-t-full py-5 px-6 mt-0 text-center max-w-2xl mx-auto  flex items-center justify-center gap-6">
          <!-- Imagen SVG -->
          <div class="flex-shrink-0">
            <img src="/imagenes/landing/09.svg" alt="Icono" class="w-24 h-24" />
          </div>
          <!-- Texto -->
          <div class="text-center">
            <span class="block text-2xl font-semibold leading-tight">
              Cero gastos <span class="text-xl font-normal">notariales y registrales</span>
            </span>
            <p class="mt-2 text-xl leading-tight">
              <span class="font-semibold">Nosotros</span> los asumimos por ti
            </p>
          </div>
        </div>
      </div>
      <!-- PARTE III -->
      <div class="max-w-7xl mx-auto px-4 lg:px-20">
        <div class="p-8 rounded-lg font-sans text-black">
          <h2 class="text-2xl md:text-3xl  font-semibold text-black text-center mb-10">
            Pasos para obtener un préstamo<br>
            <span class="block">con garantía hipotecaria</span>
          </h2>
          <!-- Paso 1 -->
          <div class="mb-12 relative">
            <div class="bg-white rounded-full px-6 py-3 shadow-md flex-1 pl-14 flex items-center">
              <h3 class="font-semibold text-lg text-black">Contáctate con ZUMA</h3>
            </div>
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-28 h-28 z-10">
              <div class="relative w-full h-full">
                <img src="/public/imagenes/landing/triangulo_1.svg" alt="Triángulo con número"
                  class="w-full h-full object-contain block" />
                <span
                  class="absolute inset-0 flex items-center right-4 justify-center pointer-events-none z-20 text-black font-bold text-3xl">
                  1
                </span>
              </div>
            </div>
          </div>

          <!-- Paso 2 -->
          <div class="mb-12 relative">
            <div class="bg-white rounded-3xl flex items-center gap-4 px-12 py-6 shadow relative z-0">
              <div>
                <h3 class="font-semibold text-lg text-black">Envíanos la información requerida</h3>
                <p class="text-sm text-black mt-1">
                  Contar con un inmueble inscrito en SUNARP que esté ubicado en Lima Metropolitana o Callao.
                </p>
                <div class="grid md:grid-cols-2 gap-6 text-sm text-black mt-2">
                  <div>
                    <h4 class="font-semibold mb-2 text-xs text-black">Del solicitante:</h4>
                    <ul class="space-y-2">
                      <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 
                9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 
                001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                        Copia literal del inmueble (vigencia menor a 30 días calendario)
                      </li>
                      <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 
                9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 
                001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                        Hoja de resumen (HR) y Predio Urbano (PU) (del año en curso)
                      </li>
                      <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 
                9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 
                001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                        DNI de los propietarios
                      </li>
                      <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 
                9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 
                001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                        Recibo de luz (del mes anterior)
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 class="font-semibold mb-2 text-xs text-black">Del solicitante:</h4>
                    <ul class="space-y-2">
                      <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 
                9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 
                001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                        DNI
                      </li>
                      <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 
                9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 
                001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                        Sustento de ingresos de los últimos 3 meses
                      </li>
                      <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 text-sky-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 
                9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 
                001.414 0l8-8a1 1 0 000-1.414z" clip-rule="evenodd" />
                        </svg>
                        Recibo de luz de su residencia actual
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div class="absolute left-4 top-[33px] transform -translate-y-1/2 -translate-x-1/2 w-28 h-28 z-10">
              <div class="relative w-full h-full">
                <img src="/public/imagenes/landing/triangulo_1.svg" alt="Triángulo con número"
                  class="w-full h-full object-contain block" />
                <span
                  class="absolute inset-0 flex items-center right-4 justify-center pointer-events-none z-20 text-black font-bold text-3xl">
                  2
                </span>
              </div>
            </div>
          </div>
          <!-- Paso 3 -->
          <div class="mb-12 relative">
            <div class="bg-white rounded-full px-6 py-3 shadow-md flex-1 pl-14 flex items-center">
              <h3 class="font-semibold text-lg text-black">Acepta la propuesta enviada</h3>
            </div>
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-28 h-28 z-10">
              <div class="relative w-full h-full">
                <img src="/public/imagenes/landing/triangulo_1.svg" alt="Triángulo con número"
                  class="w-full h-full object-contain block" />
                <span
                  class="absolute inset-0 flex items-center right-4 justify-center pointer-events-none z-20 text-black font-bold text-3xl">
                  3
                </span>
              </div>
            </div>
          </div>
          <!-- Paso 4 -->
          <div class="mb-12 relative">
            <div class="bg-white rounded-full px-6 py-3 shadow-md flex-1 pl-14 flex items-center">
              <h3 class="font-semibold text-lg text-black">Firma el contrato</h3>
            </div>
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-28 h-28 z-10">
              <div class="relative w-full h-full">
                <img src="/public/imagenes/landing/triangulo_1.svg" alt="Triángulo con número"
                  class="w-full h-full object-contain block" />
                <span
                  class="absolute inset-0 flex items-center right-4 justify-center pointer-events-none z-20 text-black font-bold text-3xl">
                  4
                </span>
              </div>
            </div>
          </div>
          <!-- Paso 5 -->
          <div class="relative">
            <div class="bg-white rounded-full px-6 py-3 shadow-md flex-1 pl-14 flex items-center">
              <h3 class="font-semibold text-lg text-black">Obtén tu dinero</h3>
            </div>
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-28 h-28 z-10">
              <div class="relative w-full h-full">
                <img src="/public/imagenes/landing/triangulo_1.svg" alt="Triángulo con número"
                  class="w-full h-full object-contain block" />
                <span
                  class="absolute inset-0 flex items-center right-4 justify-center pointer-events-none z-20 text-black font-bold text-3xl">
                  5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- PARTE IV -->
      <div class="bg-white">
        <div class=" max-w-7xl mx-auto px-4 lg:px-20">
          <div class="grid grid-cols-12 gap-0 max-w-6xl mx-auto">
            <div class="col-span-12 md:col-span-6 px-5 mb-10 mt-10">

              <form @submit.prevent="submitContactForm" class="bg-[#edeae4] rounded-xl p-10">
                <label class="block text-sm font-medium mb-1 text-[#171717]">
                  Nombres y Apellidos
                  <span class="text-red-500">*</span>
                </label>

                <div class="rounded-xl mb-5">
                  <input v-model="form.full_name" type="text" placeholder="Ingresa tu nombre completo"
                    class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-white border border-gray-300"
                    :class="{ 'border-red-500': errors.full_name }" required />
                  <span v-if="errors.full_name" class="text-red-500 text-sm">{{ errors.full_name[0] }}</span>
                </div>

                <label class="bgwh block text-sm font-medium mb-1 text-[#171717]">Teléfono<span
                    class="text-red-500">*</span></label>
                <div class="rounded-xl mb-5">
                  <input v-model="form.phone" type="text" placeholder="Ej. +51 999 888 777"
                    class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-white border border-gray-300"
                    :class="{ 'border-red-500': errors.phone }" required />
                  <span v-if="errors.phone" class="text-red-500 text-sm">{{ errors.phone[0] }}</span>
                </div>

                <label class="block text-sm font-medium mb-1 text-[#171717]">Correo electrónico<span
                    class="text-red-500">*</span></label>
                <div class="rounded-xl mb-5">
                  <input v-model="form.email" type="email" placeholder="tu@email.com"
                    class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-white border border-gray-300"
                    :class="{ 'border-red-500': errors.email }" required />
                  <span v-if="errors.email" class="text-red-500 text-sm">{{ errors.email[0] }}</span>
                </div>

                <label class="block text-sm font-medium mb-1 text-[#171717]">Producto de Interés<span
                    class="text-red-500">*</span></label>
                <div class="rounded-xl mb-5">
                  <Select v-model="form.interested_product" :options="productOptions" optionLabel="name"
                    optionValue="value" placeholder="Selecciona un producto" class="w-full"
                    :class="{ 'p-invalid': errors.interested_product }" panelClass="!rounded-xl" :pt="{
                      root: {
                        class: 'w-full h-full rounded-xl text-[#171717] bg-white border border-gray-300 focus:border-[#6790FF] focus:ring-2 focus:ring-[#6790FF]'
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
                <label class="block text-sm font-medium mb-1 text-[#171717]">Mensaje<span
                    class="text-red-500">*</span></label>
                <div class="rounded-xl mb-5">
                  <textarea v-model="form.message" placeholder="Cuéntanos cómo podemos ayudarte" rows="4"
                    class="w-full h-full py-3 px-5 rounded-xl text-[#171717] bg-white border border-gray-300"
                    :class="{ 'border-red-500': errors.message }" />
                  <span v-if="errors.message" class="text-red-500 text-sm">{{ errors.message[0] }}</span>
                </div>
                <label class="inline-flex items-center space-x-2 cursor-pointer mb-5">
                  <input v-model="form.accepted_policy" type="checkbox"
                    class="accent-[#6790FF] w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-[#6790FF]"
                    :class="{ 'border-red-500': errors.accepted_policy }" required />
                  <span class="text-[#171717] text-xs leading-none">
                    Autorizo el uso de mis datos personales para fines comerciales y de marketing,
                    de acuerdo con la política de privacidad de Zuma.
                  </span>
                </label>
                <label class="inline-flex items-center space-x-2 cursor-pointer mb-5">
                  <span class="text-[#171717] text-xs leading-none">
                    Los campos con asteristo<span class="text-red-500">(*)</span>, son campos obligatorios.
                  </span>
                </label>
                <div v-if="errors.accepted_policy" class="mb-3">
                  <span class="text-red-500 text-sm">{{ errors.accepted_policy[0] }}</span>
                </div>
                <Button type="submit" :disabled="!isFormValid || isSubmitting" severity="warn" rounded
                  class="!border-none w-full !px-5 !py-2 !mt-7 !rounded-xl !bg-[#171717] !text-white hover:!bg-[#6790FF] transition-all duration-300 disabled:!bg-gray-400 disabled:!cursor-not-allowed">
                  <span v-if="!isSubmitting">Enviar Mensaje</span>
                  <div v-else class="flex items-center justify-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
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
                <h1 class="m-0 text-[#171717] font-normal text-center  text-medium text-6xl">¿Requieres
                  asesoría?</h1>
                <img src="/imagenes/landing/asesoria.svg" alt="Logo zuma" class="w-3/4 ps-4 mt-6 relative mx-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <FooterWidget />
  </div>
</template>

<script setup>
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import { contactRequestService } from '@/services/contactRequestService.js';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { computed, reactive, ref } from 'vue';

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