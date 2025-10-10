<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center h-96">
      <ProgressSpinner />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
      <i class="pi pi-exclamation-triangle text-red-500 text-3xl mb-2"></i>
      <p class="text-red-700">{{ error }}</p>
      <Button label="Reintentar" icon="pi pi-refresh" @click="loadSolicitud" class="mt-3" />
    </div>

    <!-- Content -->
    <div v-else-if="solicitud" class="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div class="grid grid-cols-12 gap-6">
        
        <!-- Columna IZQUIERDA (6 columnas): Carrusel + Métricas + Botones -->
        <div class="col-span-12 lg:col-span-6">
          <!-- Image Gallery Carousel -->
          <div class="rounded-xl overflow-hidden mb-4">
            <Galleria 
              v-if="allImages.length > 0"
              v-model:activeIndex="activeImageIndex"
              :value="allImages" 
              :numVisible="3" 
              :responsiveOptions="responsiveOptions"
              containerStyle="max-width: 100%"
              :showThumbnails="true"
              :showIndicators="true"
              :circular="true"
              :autoPlay="false"
              thumbnailsPosition="bottom">
              <template #item="slotProps">
                <div class="relative">
                  <img :src="slotProps.item.url" :alt="slotProps.item.descripcion" class="w-full h-[400px] object-cover" />
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 class="text-white font-bold">{{ slotProps.item.propertyName }}</h3>
                  </div>
                </div>
              </template>
              <template #thumbnail="slotProps">
                <img :src="slotProps.item.url" :alt="slotProps.item.descripcion" class="w-full h-16 object-cover" />
              </template>
            </Galleria>
            <div v-else class="flex items-center justify-center h-[400px] bg-gray-100 rounded-xl">
              <div class="text-center">
                <i class="pi pi-image text-gray-400 text-5xl mb-3"></i>
                <p class="text-gray-500">No hay imágenes</p>
              </div>
            </div>
          </div>

          <!-- Métricas debajo del carrusel -->
          <div class="grid grid-cols-2 gap-3 mb-4">
            <!-- Valor -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div class="text-xs text-blue-700 font-semibold mb-1">VALOR</div>
              <div class="text-xl font-bold text-blue-900">
                {{ formatCurrency(solicitud?.valor_general?.amount, solicitud?.valor_general?.currency) }}
              </div>
            </div>

            <!-- TEA -->
            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div class="text-xs text-purple-700 font-semibold mb-1">TEA</div>
              <div class="text-xl font-bold text-purple-900">
                {{ formatPercentage(solicitud?.configuracion_subasta?.tea) }}
              </div>
            </div>

            <!-- TEM -->
            <div class="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div class="text-xs text-orange-700 font-semibold mb-1">TEM</div>
              <div class="text-xl font-bold text-orange-900">
                {{ formatPercentage(solicitud?.configuracion_subasta?.tem) }}
              </div>
            </div>

            <!-- Riesgo -->
            <div class="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div class="text-xs text-green-700 font-semibold mb-1">RIESGO</div>
              <div class="text-xl font-bold text-green-900">
                {{ solicitud?.configuracion_subasta?.riesgo || 'N/A' }}
              </div>
            </div>
          </div>

          <!-- Botones debajo de las métricas -->
          <div class="space-y-2">
            <Button 
              label="Ver Detalle Completo" 
              icon="pi pi-info-circle" 
              outlined
              fluid
              severity="info"
              @click="mostrarDetalle"
            />
            <Button 
              label="Ver Cronograma" 
              icon="pi pi-calendar" 
              outlined 
              severity="secondary"
              fluid
              @click="mostrarCronograma"
            />
          </div>
        </div>

        <!-- Columna DERECHA (6 columnas): Valor Requerido + Inversionistas + Botón Ofertar -->
        <div class="col-span-12 lg:col-span-6">
          <div class="h-full flex flex-col justify-between">
            
            <!-- Información de Valor Requerido -->
            <div class="space-y-4 mb-6">
              <!-- Valor Requerido -->
              <div class="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 border border-red-200">
                <div class="flex items-center gap-3 mb-3">
                  <i class="pi pi-money-bill text-red-600 text-3xl"></i>
                  <div>
                    <div class="text-sm text-red-700 font-semibold">VALOR REQUERIDO</div>
                    <div class="text-3xl font-bold text-red-900">
                      {{ formatCurrency(solicitud?.valor_requerido?.amount, solicitud?.valor_requerido?.currency) }}
                    </div>
                  </div>
                </div>
                <div class="text-xs text-red-700">Monto solicitado por el deudor</div>
              </div>

              <!-- Lista de ofertas -->
              <div v-if="ofertas.length > 0" class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-semibold text-gray-700">
                    <i class="pi pi-users mr-2"></i>
                    Ofertas Registradas
                  </h3>
                  <Tag :value="ofertas.length" severity="info" />
                </div>
                <div class="space-y-2 max-h-48 overflow-y-auto">
                  <div 
                    v-for="(oferta, index) in ofertas" 
                    :key="oferta.id"
                    class="bg-white rounded-lg p-3 border border-gray-200"
                    :class="{ 'border-green-400 bg-green-50': oferta.investors_id === currentUserId }"
                  >
                    <div class="flex items-center justify-between mb-1">
                      <div class="flex items-center gap-2">
                        <!-- Medalla de posición -->
                        <div class="flex-shrink-0">
                          <div 
                            v-if="index === 0"
                            class="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-xs shadow-md"
                            title="Primer Lugar"
                          >
                            1°
                          </div>
                          <div 
                            v-else-if="index === 1"
                            class="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white font-bold text-xs shadow-md"
                            title="Segundo Lugar"
                          >
                            2°
                          </div>
                          <div 
                            v-else-if="index === 2"
                            class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xs shadow-md"
                            title="Tercer Lugar"
                          >
                            3°
                          </div>
                          <div 
                            v-else
                            class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs"
                          >
                            {{ index + 1 }}
                          </div>
                        </div>
                        
                        <i class="pi pi-user text-blue-500"></i>
                        <span class="text-sm font-medium text-gray-700">
                          {{ oferta.investor?.alias || oferta.investor?.name || 'Inversionista' }}
                        </span>
                        <Tag 
                          v-if="oferta.investors_id === currentUserId" 
                          value="Tu oferta" 
                          severity="success"
                          class="text-xs"
                        />
                      </div>
                    </div>
                    <div class="text-xs text-gray-500 pl-14">
                      {{ formatDate(oferta.created_at) }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mensaje si ya ofertó -->
              <div v-if="yaHaOfertado && miOferta" class="bg-green-50 rounded-xl p-4 border-2 border-green-300">
                <div class="flex items-start gap-3">
                  <i class="pi pi-check-circle text-green-600 text-2xl mt-1"></i>
                  <div class="flex-1">
                    <h4 class="text-sm font-bold text-green-800 mb-1">Ya has ofertado en esta solicitud</h4>
                    <p class="text-xs text-green-700 mb-2">Tu oferta fue registrada exitosamente</p>
                    <div class="bg-white rounded-lg p-2 border border-green-200">
                      <div class="text-xs text-gray-600">Fecha de oferta:</div>
                      <div class="text-sm font-semibold text-gray-800">
                        {{ formatDate(miOferta.created_at) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Botón Ofertar -->
            <div>
              <Button 
                v-if="!yaHaOfertado"
                label="Ofertar" 
                icon="pi pi-check-circle"
                rounded
                severity="contrast"
                fluid
                :loading="ofertando"
                @click="confirmarOferta"
              />
              <Button 
                v-else
                label="Ya has ofertado" 
                icon="pi pi-lock"
                rounded
                severity="success"
                fluid
                disabled
              />
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Dialog de Cronograma -->
    <ShowCronograma 
      v-model="showCronogramaDialog" 
      :solicitud="solicitud"
    />

    <!-- Dialog de Detalle Completo -->
    <Dialog 
      v-model:visible="showDetalleDialog" 
      modal 
      :style="{ width: '90vw', maxWidth: '1200px' }"
      header="Detalle Completo de la Solicitud"
      :maximizable="true"
    >
      <div v-if="solicitud" class="space-y-6">
        <!-- Información Principal -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div class="text-xs text-blue-600 font-semibold mb-1">CÓDIGO DE SOLICITUD</div>
              <div class="text-2xl font-bold text-blue-900">{{ solicitud.codigo }}</div>
            </div>
            <div>
              <div class="text-xs text-blue-600 font-semibold mb-1">ESTADO</div>
              <Tag 
                :value="solicitud.estado.toUpperCase()" 
                :severity="solicitud.estado === 'activa' ? 'success' : 'warning'"
                class="text-sm"
              />
            </div>
            <div>
              <div class="text-xs text-blue-600 font-semibold mb-1">FECHA DE CREACIÓN</div>
              <div class="text-lg font-semibold text-blue-900">{{ formatDate(solicitud.created_at) }}</div>
            </div>
          </div>
        </div>

        <!-- Datos del Deudor -->
        <div class="bg-white rounded-xl p-5 border border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-user text-purple-600"></i>
            Datos del Deudor
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="bg-purple-50 rounded-lg p-4">
              <div class="text-xs text-purple-700 font-semibold mb-1">NOMBRE COMPLETO</div>
              <div class="text-base font-bold text-purple-900">{{ solicitud.investor?.nombre || 'N/A' }}</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
              <div class="text-xs text-purple-700 font-semibold mb-1">PROFESIÓN / OCUPACIÓN</div>
              <div class="text-base font-semibold text-purple-900">{{ solicitud.profesion_ocupacion || 'N/A' }}</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
              <div class="text-xs text-purple-700 font-semibold mb-1">FUENTE DE INGRESO</div>
              <div class="text-base font-semibold text-purple-900">{{ solicitud.fuente_ingreso || 'N/A' }}</div>
            </div>
            <div class="bg-purple-50 rounded-lg p-4">
              <div class="text-xs text-purple-700 font-semibold mb-1">INGRESO PROMEDIO</div>
              <div class="text-base font-bold text-purple-900">{{ formatCurrency(solicitud.ingreso_promedio, 'PEN') }}</div>
            </div>
          </div>
        </div>

        <!-- Valores y Configuración Financiera -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Valores -->
          <div class="bg-white rounded-xl p-5 border border-gray-200">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i class="pi pi-dollar text-green-600"></i>
              Valores Financieros
            </h3>
            <div class="space-y-3">
              <div class="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <div class="text-xs text-green-700 font-semibold mb-1">VALOR GENERAL</div>
                <div class="text-xl font-bold text-green-900">
                  {{ formatCurrency(solicitud.valor_general?.amount, solicitud.valor_general?.currency) }}
                </div>
              </div>
              <div class="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <div class="text-xs text-red-700 font-semibold mb-1">VALOR REQUERIDO</div>
                <div class="text-xl font-bold text-red-900">
                  {{ formatCurrency(solicitud.valor_requerido?.amount, solicitud.valor_requerido?.currency) }}
                </div>
              </div>
              <div class="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div class="text-xs text-blue-700 font-semibold mb-1">MONEDA</div>
                <div class="text-lg font-bold text-blue-900">
                  {{ solicitud.currency?.nombre }} ({{ solicitud.currency?.simbolo }})
                </div>
              </div>
            </div>
          </div>

          <!-- Configuración de Subasta -->
          <div class="bg-white rounded-xl p-5 border border-gray-200">
            <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <i class="pi pi-cog text-orange-600"></i>
              Configuración de Subasta
            </h3>
            <div class="space-y-3">
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-xs text-orange-700 font-semibold mb-1">TEA (Tasa Efectiva Anual)</div>
                <div class="text-xl font-bold text-orange-900">{{ formatPercentage(solicitud.configuracion_subasta?.tea) }}</div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-xs text-orange-700 font-semibold mb-1">TEM (Tasa Efectiva Mensual)</div>
                <div class="text-xl font-bold text-orange-900">{{ formatPercentage(solicitud.configuracion_subasta?.tem) }}</div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-xs text-orange-700 font-semibold mb-1">TIPO DE CRONOGRAMA</div>
                <div class="text-lg font-bold text-orange-900 capitalize">{{ solicitud.configuracion_subasta?.tipo_cronograma || 'N/A' }}</div>
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-xs text-orange-700 font-semibold mb-1">NIVEL DE RIESGO</div>
                <Tag 
                  :value="solicitud.configuracion_subasta?.riesgo || 'N/A'" 
                  severity="warning"
                  class="text-base font-bold"
                />
              </div>
              <div class="bg-orange-50 rounded-lg p-4">
                <div class="text-xs text-orange-700 font-semibold mb-1">PLAZO</div>
                <div class="text-lg font-bold text-orange-900">{{ solicitud.configuracion_subasta?.plazo?.nombre || 'N/A' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Propiedades -->
        <div class="bg-white rounded-xl p-5 border border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-home text-teal-600"></i>
            Propiedades en Garantía
          </h3>
          <div v-for="property in solicitud.properties" :key="property.id" class="mb-4 last:mb-0">
            <div class="bg-teal-50 rounded-lg p-4 border border-teal-200">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <div class="text-xs text-teal-700 font-semibold mb-1">NOMBRE DE LA PROPIEDAD</div>
                  <div class="text-base font-bold text-teal-900">{{ property.nombre }}</div>
                </div>
                <div>
                  <div class="text-xs text-teal-700 font-semibold mb-1">TIPO DE INMUEBLE</div>
                  <div class="text-base font-semibold text-teal-900">{{ property.tipo_inmueble?.nombre || 'N/A' }}</div>
                </div>
                <div>
                  <div class="text-xs text-teal-700 font-semibold mb-1">UBICACIÓN</div>
                  <div class="text-sm text-teal-900">
                    {{ property.departamento }}, {{ property.provincia }}, {{ property.distrito }}
                  </div>
                  <div class="text-xs text-teal-700 mt-1">{{ property.direccion }}</div>
                </div>
                <div>
                  <div class="text-xs text-teal-700 font-semibold mb-1">VALOR ESTIMADO</div>
                  <div class="text-lg font-bold text-teal-900">
                    {{ formatCurrency(property.valor_estimado?.amount, property.valor_estimado?.currency) }}
                  </div>
                </div>
                <div>
                  <div class="text-xs text-teal-700 font-semibold mb-1">ESTADO</div>
                  <Tag 
                    :value="property.estado.toUpperCase()" 
                    :severity="property.estado === 'activo' ? 'success' : 'warning'"
                  />
                </div>
                <div>
                  <div class="text-xs text-teal-700 font-semibold mb-1">IMÁGENES</div>
                  <div class="text-base font-semibold text-teal-900">{{ property.imagenes?.length || 0 }} imágenes</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuraciones de Inversores -->
        <div v-if="solicitud.property_investors && solicitud.property_investors.length > 0" class="bg-white rounded-xl p-5 border border-gray-200">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-users text-indigo-600"></i>
            Configuraciones de Inversores
          </h3>
          <div class="space-y-4">
            <div 
              v-for="(investor, index) in solicitud.property_investors" 
              :key="investor.id"
              class="bg-indigo-50 rounded-lg p-4 border border-indigo-200"
            >
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-bold text-indigo-900">Configuración #{{ index + 1 }}</h4>
                <Tag 
                  :value="`Estado: ${investor.configuracion?.estado}`" 
                  severity="info"
                />
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div class="bg-white rounded p-3">
                  <div class="text-xs text-indigo-700 font-semibold mb-1">TEA</div>
                  <div class="text-base font-bold text-indigo-900">{{ formatPercentage(investor.configuracion?.tea) }}</div>
                </div>
                <div class="bg-white rounded p-3">
                  <div class="text-xs text-indigo-700 font-semibold mb-1">TEM</div>
                  <div class="text-base font-bold text-indigo-900">{{ formatPercentage(investor.configuracion?.tem) }}</div>
                </div>
                <div class="bg-white rounded p-3">
                  <div class="text-xs text-indigo-700 font-semibold mb-1">TOTAL CUOTAS</div>
                  <div class="text-base font-bold text-indigo-900">{{ investor.payment_schedules?.length || 0 }} cuotas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de Cuotas -->
        <div v-if="solicitud.property_investors && solicitud.property_investors.length > 0" class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-300">
          <h3 class="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <i class="pi pi-chart-line text-gray-700"></i>
            Resumen de Plan de Pagos
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg p-4 text-center shadow-sm">
              <div class="text-xs text-gray-600 font-semibold mb-1">TOTAL CUOTAS</div>
              <div class="text-2xl font-bold text-gray-900">{{ solicitud.property_investors[0]?.payment_schedules?.length || 0 }}</div>
            </div>
            <div class="bg-white rounded-lg p-4 text-center shadow-sm">
              <div class="text-xs text-gray-600 font-semibold mb-1">PRIMERA CUOTA</div>
              <div class="text-lg font-bold text-gray-900">
                {{ formatCurrency(solicitud.property_investors[0]?.payment_schedules?.[0]?.total_cuota, 'PEN') }}
              </div>
            </div>
            <div class="bg-white rounded-lg p-4 text-center shadow-sm">
              <div class="text-xs text-gray-600 font-semibold mb-1">ÚLTIMA CUOTA</div>
              <div class="text-lg font-bold text-gray-900">
                {{ formatCurrency(solicitud.property_investors[0]?.payment_schedules?.slice(-1)[0]?.total_cuota, 'PEN') }}
              </div>
            </div>
            <div class="bg-white rounded-lg p-4 text-center shadow-sm">
              <div class="text-xs text-gray-600 font-semibold mb-1">VENCIMIENTO FINAL</div>
              <div class="text-sm font-bold text-gray-900">
                {{ formatDateShort(solicitud.property_investors[0]?.payment_schedules?.slice(-1)[0]?.vencimiento) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>

    <!-- Dialog de Confirmación de Oferta -->
    <Dialog 
      v-model:visible="showConfirmDialog" 
      modal 
      :style="{ width: '450px' }"
      header="Confirmar Oferta"
    >
      <div class="flex flex-col items-center text-center gap-4">
        <i class="pi pi-exclamation-circle text-amber-500 text-5xl"></i>
        <p class="text-gray-700">
          ¿Estás seguro de que deseas ofertar en esta solicitud?
        </p>
        <div class="bg-blue-50 rounded-lg p-4 w-full border border-blue-200">
          <div class="text-sm text-blue-700 mb-1">Código de Solicitud</div>
          <div class="text-xl font-bold text-blue-900">
            {{ solicitud?.codigo }}
          </div>
        </div>
      </div>
      <template #footer>
        <Button 
          label="Cancelar" 
          icon="pi pi-times" 
          text 
          severity="secondary"
          @click="showConfirmDialog = false" 
        />
        <Button 
          label="Confirmar Oferta" 
          icon="pi pi-check" 
          severity="success"
          :loading="ofertando"
          @click="realizarOferta" 
        />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import ProgressSpinner from 'primevue/progressspinner';
import ShowCronograma from './ShowCronograma.vue';
import { solicitudService } from '@/services/solicitud.js';
import { bidService } from '@/services/bid.js';

const props = defineProps({
  solicitudId: {
    type: [String, Number],
    default: null
  }
});

const emit = defineEmits(['ver-detalle', 'ver-cronograma', 'ofertar']);

const route = useRoute();
const toast = useToast();

const solicitud = ref(null);
const ofertas = ref([]);
const loading = ref(false);
const ofertando = ref(false);
const error = ref(null);
const activeImageIndex = ref(0);
const showCronogramaDialog = ref(false);
const showDetalleDialog = ref(false);
const showConfirmDialog = ref(false);
const currentUserId = ref(null);

const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3
  },
  {
    breakpoint: '768px',
    numVisible: 2
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
]);

// Obtener el ID desde el prop o desde la ruta
const getSolicitudId = () => {
  return props.solicitudId || route.params.id;
};

// Cargar solicitud desde la API
const loadSolicitud = async () => {
  const id = getSolicitudId();
  console.log('🔍 loadSolicitud llamado con ID:', id);
  
  if (!id) {
    console.error('❌ No hay solicitudId');
    error.value = 'ID de solicitud no válido';
    return;
  }

  loading.value = true;
  error.value = null;
  
  try {
    console.log('📡 Llamando a solicitudService.getSolicitud...');
    const response = await solicitudService.getSolicitud(id);
    console.log('✅ Respuesta recibida:', response);
    
    if (response.data && response.data.success) {
      solicitud.value = response.data.data;
      console.log('✅ Solicitud cargada:', solicitud.value);
      
      if (!solicitud.value) {
        error.value = 'No se encontraron datos de la solicitud';
      } else {
        await loadOfertas();
      }
    } else {
      error.value = response.data?.message || 'Error al cargar la solicitud';
      console.error('❌ Error en respuesta:', error.value);
    }
  } catch (err) {
    console.error('❌ Error al cargar solicitud:', err);
    
    if (err.response?.status === 404) {
      error.value = 'Solicitud no encontrada';
    } else if (err.response?.status === 403) {
      error.value = 'No tiene permisos para ver esta solicitud';
    } else if (err.response?.status === 500) {
      error.value = 'Error en el servidor. Intente más tarde';
    } else {
      error.value = 'Error al conectar con el servidor';
    }

    if (toast) {
      toast.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: error.value, 
        life: 3000 
      });
    }
  } finally {
    loading.value = false;
    console.log('🏁 loadSolicitud finalizado');
  }
};

// Cargar ofertas
const loadOfertas = async () => {
  if (!solicitud.value?.id) {
    console.log('⚠️ No hay solicitud.id para cargar ofertas');
    return;
  }

  try {
    const solicitudId = solicitud.value.id;
    console.log('📡 Cargando ofertas para solicitud_id:', solicitudId);
    console.log('🔍 Solicitud completa:', solicitud.value);
    const response = await bidService.getBySolicitudBid(solicitudId);
    
    if (response.data && response.data.success) {
      ofertas.value = response.data.data || [];
      console.log('✅ Ofertas cargadas:', ofertas.value);
    }
  } catch (err) {
    console.error('❌ Error al cargar ofertas:', err);
  }
};

// Obtener ID del usuario actual desde localStorage
const getCurrentUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id || null;
  } catch {
    return null;
  }
};

// Verificar si el usuario actual ya ha ofertado
const yaHaOfertado = computed(() => {
  if (!currentUserId.value || ofertas.value.length === 0) return false;
  return ofertas.value.some(oferta => oferta.investors_id === currentUserId.value);
});

// Obtener la oferta del usuario actual
const miOferta = computed(() => {
  if (!currentUserId.value) return null;
  return ofertas.value.find(oferta => oferta.investors_id === currentUserId.value);
});

// Mostrar diálogo de confirmación
const confirmarOferta = () => {
  showConfirmDialog.value = true;
};

// Realizar oferta
const realizarOferta = async () => {
  if (!solicitud.value?.id) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se puede ofertar en esta solicitud',
      life: 3000
    });
    return;
  }

  ofertando.value = true;

  try {
    console.log('📡 Realizando oferta para solicitud_bid_id:', solicitud.value.id);
    const response = await bidService.createSubasta(solicitud.value.id);
    
    if (response.data && response.data.success) {
      toast.add({
        severity: 'success',
        summary: 'Oferta Exitosa',
        detail: response.data.message || 'Tu oferta ha sido registrada correctamente',
        life: 3000
      });
      
      showConfirmDialog.value = false;
      await loadOfertas();
      emit('ofertar', solicitud.value);
    }
  } catch (err) {
    console.error('❌ Error al realizar oferta:', err);
    
    let errorMessage = 'Error al registrar la oferta';
    
    if (err.response?.status === 409) {
      errorMessage = 'Ya has ofertado en esta solicitud';
    } else if (err.response?.status === 403) {
      errorMessage = 'No tienes permisos para ofertar';
    } else if (err.response?.data?.message) {
      errorMessage = err.response.data.message;
    }
    
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: errorMessage,
      life: 4000
    });
  } finally {
    ofertando.value = false;
  }
};

// Computed: todas las imágenes de las propiedades en un solo carrusel
const allImages = computed(() => {
  const images = [];
  solicitud.value?.properties?.forEach(property => {
    if (property.imagenes && property.imagenes.length > 0) {
      property.imagenes.forEach(imagen => {
        images.push({
          ...imagen,
          propertyName: property.nombre,
          propertyId: property.id
        });
      });
    }
  });
  return images;
});

// Formatear moneda
const formatCurrency = (value, currency = 'PEN') => {
  if (value === null || value === undefined || isNaN(value)) return '-';
  
  const currencySymbols = {
    'USD': '$',
    'PEN': 'S/',
    'EUR': '€',
    'SOL': 'S/',
    'SOLES': 'S/'
  };
  const symbol = currencySymbols[currency?.toUpperCase()] || 'S/';
  return `${symbol}${new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)}`;
};

// Formatear porcentaje
const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  
  const numValue = parseFloat(value);
  
  if (numValue <= 1) {
    return `${(numValue * 100).toFixed(2)}%`;
  } else if (numValue > 100) {
    return `${(numValue / 100).toFixed(2)}%`;
  } else {
    return `${numValue.toFixed(2)}%`;
  }
};

// Formatear fecha con hora completa, minutos, segundos y AM/PM
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(date);
};

// Formatear fecha corta (solo fecha)
const formatDateShort = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

// Función para mostrar el cronograma
const mostrarCronograma = () => {
  console.log('📅 Abriendo cronograma para solicitud:', solicitud.value);
  showCronogramaDialog.value = true;
};

// Función para mostrar el detalle completo
const mostrarDetalle = () => {
  console.log('📋 Abriendo detalle completo para solicitud:', solicitud.value);
  showDetalleDialog.value = true;
};

// Cargar datos al montar el componente
onMounted(() => {
  const id = getSolicitudId();
  console.log('🚀 Componente montado');
  console.log('📋 Props:', props);
  console.log('🔗 Route params:', route.params);
  console.log('🆔 ID a usar:', id);
  
  currentUserId.value = getCurrentUserId();
  console.log('👤 Usuario actual ID:', currentUserId.value);
  
  loadSolicitud();
});

// Watch para recargar si cambia el ID de la ruta
watch(() => route.params.id, (newId) => {
  if (newId) {
    console.log('🔄 ID de ruta cambió a:', newId);
    loadSolicitud();
  }
});
</script>