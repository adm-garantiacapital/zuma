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
          <!-- Selector de Propiedades -->
          <div class="flex gap-2 mb-4 overflow-x-auto pb-2">
            <Button 
              v-for="property in solicitud.properties" 
              :key="property.id"
              :label="property.nombre" 
              :severity="selectedPropertyId === property.id ? 'primary' : 'secondary'"
              size="small"
              outlined
              @click="selectProperty(property.id)"
              class="whitespace-nowrap"
            />
          </div>

          <!-- Image Gallery Carousel para propiedad seleccionada -->
          <div class="rounded-xl overflow-hidden mb-4">
            <Galleria 
              v-if="getSelectedPropertyImages().length > 0"
              :value="getSelectedPropertyImages()" 
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
                  <img :src="slotProps.item.url" :alt="slotProps.item.descripcion" 
                       class="w-full h-[400px] object-cover" />
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h3 class="text-white font-bold">{{ slotProps.item.propertyName }}</h3>
                  </div>
                </div>
              </template>
              <template #thumbnail="slotProps">
                <img :src="slotProps.item.url" :alt="slotProps.item.descripcion" 
                     class="w-full h-16 object-cover" />
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
            <!-- Valor General -->
            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div class="text-xs text-blue-700 font-semibold mb-1">VALOR GENERAL</div>
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
              label="Ver Detalle" 
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
              <!-- Código de Solicitud -->
              <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
                <div class="text-sm text-indigo-700 font-semibold mb-1">CÓDIGO</div>
                <div class="text-2xl font-bold text-indigo-900">
                  {{ solicitud?.codigo }}
                </div>
                <div class="text-xs text-indigo-600 mt-1">
                  Estado: <span class="capitalize font-medium">{{ solicitud?.estado }}</span>
                </div>
              </div>

              <!-- Valor Requerido -->
              <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                <div class="flex items-center gap-3 mb-3">
                  <i class="pi pi-money-bill text-emerald-600 text-3xl"></i>
                  <div>
                    <div class="text-sm text-emerald-700 font-semibold">VALOR REQUERIDO</div>
                    <div class="text-3xl font-bold text-emerald-900">
                      {{ formatCurrency(solicitud?.valor_requerido?.amount, solicitud?.valor_requerido?.currency) }}
                    </div>
                  </div>
                </div>
                <div class="text-xs text-emerald-700">Monto solicitado por el deudor</div>
              </div>

              <!-- Lista de ofertas -->
              <div v-if="ofertas.length > 0" class="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-sm font-semibold text-yellow-700">
                    <i class="pi pi-users mr-2"></i>
                    Inversionistas Participando
                  </h3>
                  <Tag :value="ofertas.length" severity="warning" />
                </div>
                <div class="space-y-2 max-h-60 overflow-y-auto">
                  <div 
                    v-for="(oferta, index) in ofertas" 
                    :key="oferta.id"
                    class="bg-white rounded-lg p-3 border border-yellow-100"
                    :class="{ 'border-green-400 bg-green-50': oferta.investors_id === currentUserId }"
                  >
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <Tag :value="`#${index + 1}`" severity="info" class="text-xs" />
                        <span class="text-sm font-medium text-gray-700">
                          {{ oferta.investor?.alias || oferta.investor?.name || 'Sin alias' }}
                        </span>
                        <Tag 
                          v-if="oferta.investors_id === currentUserId" 
                          value="Tu oferta" 
                          severity="success"
                          class="text-xs"
                        />
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ formatDateTime(oferta.created_at) }}
                      </div>
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
                        {{ formatDateTime(miOferta.created_at) }}
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

    <!-- Diálogo de Detalles -->
    <Dialog v-model:visible="showDetalleDialog" modal header="Detalles de la Solicitud" :style="{ width: '900px' }"
        :closable="true">
        <div v-if="solicitud" class="space-y-6">
            <!-- Selector de Propiedades en el diálogo -->
            <div class="flex gap-2 overflow-x-auto pb-2">
              <Button 
                v-for="property in solicitud.properties" 
                :key="property.id"
                :label="property.nombre" 
                :severity="selectedPropertyId === property.id ? 'primary' : 'secondary'"
                size="small"
                outlined
                @click="selectProperty(property.id)"
                class="whitespace-nowrap"
              />
            </div>

            <!-- Carrusel de imágenes en el diálogo -->
            <div class="text-center">
                <Carousel :value="getSelectedPropertyImages()" :numVisible="1" :numScroll="1"
                    :showIndicators="true" :showNavigators="true" class="auction-carousel">
                    <template #item="carouselSlot">
                        <div class="relative h-80">
                            <img :src="carouselSlot.data.url" 
                                 :alt="carouselSlot.data.descripcion"
                                class="w-full h-full object-cover rounded-lg" />
                        </div>
                    </template>
                </Carousel>
            </div>

            <!-- Información básica -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <template #title>Información General</template>
                    <template #content>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="font-medium">Código:</span>
                                <span>{{ solicitud.codigo }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Estado:</span>
                                <Tag :value="solicitud.estado" 
                                     :severity="solicitud.estado === 'en_subasta' ? 'success' : 'secondary'" />
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Tipo Cronograma:</span>
                                <span class="capitalize">{{ solicitud.configuracion_subasta?.tipo_cronograma == 'frances' ? 'Cuota Fija' : 'Libre amortización' }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Riesgo:</span>
                                <Tag :value="solicitud.configuracion_subasta?.riesgo" severity="success" 
                                   v-tooltip="{
                                  value: tooltipLabel,
                                  pt: {
                                    root: { class: tooltipColorClass }
                                  }
                                }"
                                />
                            </div>
                        </div>
                    </template>
                </Card>

                <Card>
                    <template #title>Información Financiera</template>
                    <template #content>
                        <div class="space-y-3 text-sm">
                            <div class="flex justify-between">
                                <span class="font-medium">Valor del inmueble:</span>
                                <span class="font-bold text-blue-600">{{ formatCurrency(solicitud.valor_general?.amount, solicitud.valor_general?.currency) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">Monto de inversión:</span>
                                <span class="font-bold text-purple-600">{{ formatCurrency(solicitud.valor_requerido?.amount, solicitud.valor_requerido?.currency) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">TEA:</span>
                                <span class="font-bold text-purple-600">{{ formatPercentage(solicitud.configuracion_subasta?.tea) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">TEM:</span>
                                <span class="font-bold text-orange-600">{{ formatPercentage(solicitud.configuracion_subasta?.tem) }}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="font-medium">LTV:</span>
                                <span class="font-bold text-orange-600">{{ formatPercentage(solicitud.property_loan_details?.[0].porcentaje_prestamo) }}</span>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>

            <!-- Propiedades asociadas -->
            <Card v-if="solicitud.properties && solicitud.properties.length > 0">
                <template #title>Propiedades Asociadas</template>
                <template #content>
                    <div class="space-y-4">
                        <div v-for="property in solicitud.properties" :key="property.id"
                             class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div class="hidden flex items-center justify-between mb-2">
                                <h4 class="font-semibold text-gray-800">{{ property.nombre }}</h4>
                                <Tag :value="property.estado" 
                                     :severity="property.estado === 'activo' ? 'success' : 'secondary'" />
                            </div>
                            <div class="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span class="text-gray-600">Ubicación:</span>
                                    <p class="font-medium">{{ property.distrito }}, {{ property.provincia }}, {{ property.departamento }}</p>
                                </div>
                                <div>
                                    <span class="text-gray-600">Valor Estimado:</span>
                                    <p class="font-bold text-green-600">{{ formatCurrency(property.valor_estimado?.amount, property.valor_estimado?.currency) }}</p>
                                </div>
                            </div>
                            <div class="mt-2">
                                <span class="text-gray-600">Dirección:</span>
                                <p class="font-medium">{{ property.direccion }}</p>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <template #footer>
            <div class="flex gap-2 justify-end">
                <Button label="Cerrar" icon="pi pi-times" severity="secondary" class="p-button-text"
                    @click="showDetalleDialog = false" />
                <Button v-if="!yaHaOfertado && solicitud?.estado === 'en_subasta'" 
                        label="Participar en Subasta" 
                        icon="pi pi-money-bill" 
                        severity="contrast" 
                        rounded
                        :loading="ofertando"
                        @click="showDetalleDialog = false; confirmarOferta()" />
            </div>
        </template>
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

    <!-- Dialog de Ya Ofertaste -->
    <Dialog 
      v-model:visible="showYaOfertasteDialog" 
      modal 
      :style="{ width: '500px' }"
      header="Ya has ofertado"
    >
      <div class="flex flex-col items-center text-center gap-4">
        <i class="pi pi-check-circle text-green-500 text-5xl"></i>
        <div class="space-y-2">
          <h3 class="text-lg font-bold text-green-800">¡Ya has participado en esta subasta!</h3>
          <p class="text-gray-600">
            Tu oferta ha sido registrada exitosamente. Puedes seguir el progreso de la subasta desde tu panel de control.
          </p>
        </div>
        
        <div v-if="miOferta" class="bg-gray-50 rounded-lg p-4 w-full border border-gray-200">
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-gray-600">Fecha de oferta:</div>
              <div class="font-semibold">{{ formatDateTime(miOferta.created_at) }}</div>
            </div>
            <div>
              <div class="text-gray-600">Código:</div>
              <div class="font-semibold">{{ solicitud?.codigo }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <div class="flex justify-center w-full">
          <Button 
            label="Entendido" 
            icon="pi pi-check" 
            severity="success"
            @click="showYaOfertasteDialog = false" 
          />
        </div>
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
import Carousel from 'primevue/carousel';
import Card from 'primevue/card';
import ProgressSpinner from 'primevue/progressspinner';
import ShowCronograma from './ShowCronograma.vue';
import { solicitudService } from '@/services/solicitud.js';
import { bidService } from '@/services/bid.js';
import Tooltip from 'primevue/tooltip'

defineExpose({ directives: { tooltip: Tooltip } })

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
const showYaOfertasteDialog = ref(false);
const currentUserId = ref(null);
const selectedPropertyId = ref(null);

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

// Seleccionar propiedad
const selectProperty = (propertyId) => {
  selectedPropertyId.value = propertyId;
};

// Obtener imágenes de la propiedad seleccionada
const getSelectedPropertyImages = () => {
  if (!solicitud.value || !solicitud.value.properties) return [];
  
  const targetPropertyId = selectedPropertyId.value || (solicitud.value.properties[0]?.id || null);
  
  const property = solicitud.value.properties.find(p => p.id === targetPropertyId);
  if (!property) return [];
  
  const images = [];
  if (property.imagenes && Array.isArray(property.imagenes) && property.imagenes.length > 0) {
    property.imagenes.forEach(imagen => {
      images.push({
        url: imagen.url || '/Propiedades/no-image.png',
        descripcion: imagen.descripcion || 'Imagen de la propiedad',
        propertyName: property.nombre || 'Propiedad',
        propertyId: property.id
      });
    });
  }
  
  if (images.length === 0) {
    images.push({
      url: '/Propiedades/no-image.png',
      descripcion: 'Sin imagen disponible',
      propertyName: property.nombre || 'Propiedad',
      propertyId: property.id
    });
  }
  
  return images;
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
        // Inicializar la propiedad seleccionada
        if (solicitud.value.properties && solicitud.value.properties.length > 0) {
          selectedPropertyId.value = solicitud.value.properties[0].id;
        }
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
    const solicitudId = solicitud.value.solicitud_bids[0].id;

    console.log('📡 Cargando ofertas para solicitud_id:', solicitudId);
    console.log('🔍 Solicitud completa:', solicitud.value);
    const response = await bidService.getBySolicitudBid(solicitudId);
    
    if (response.data && response.data.success) {
      ofertas.value = response.data.data || [];
      console.log('✅ Ofertas cargadas:', ofertas.value);
      
      // Mostrar diálogo si ya ofertó
      if (yaHaOfertado.value) {
        setTimeout(() => {
          showYaOfertasteDialog.value = true;
        }, 500);
      }
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
  // Si ya ofertó, mostrar el diálogo de "Ya ofertaste"
  if (yaHaOfertado.value) {
    showYaOfertasteDialog.value = true;
    return;
  }
  
  // Si no ha ofertado, mostrar el diálogo de confirmación normal
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
    console.log('📡 Realizando oferta para solicitud_bid_id:', solicitud.value.solicitud_bids[0].id);

    const response = await bidService.create(solicitud.value.solicitud_bids[0].id);
    
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
      // Si ya ofertó, mostrar el diálogo correspondiente
      showYaOfertasteDialog.value = true;
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

// Formatear fecha con hora completa
const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    }).format(date);
  } catch (error) {
    return '-';
  }
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



const riesgos = ref([
  {
    value:'A+',
    label:'Bajo'
  },
  {
    value:'A',
    label:'Bajo-Medio'
  },
  {
    value:'B',
    label:'Moderado'
  },
  {
    value:'C',
    label:'Moderado-Medio'
  },
  {
    value:'D',
    label:'Medio'
  },
  {
    value:'E',
    label:'Alto'
  }

])

const tooltipLabel = computed(() => {
  const riesgoActual = solicitud.value?.configuracion_subasta?.riesgo
  if (!riesgoActual) return 'Sin riesgo definido'

  const match = riesgos.value.find(r => r.value === riesgoActual)
  return match ? match.label : 'Sin riesgo definido ' + riesgoActual
})

const tooltipColorClass = computed(() => {
  const riesgo = solicitud.value?.configuracion_subasta?.riesgo
  if (!riesgo) return ''

  switch (riesgo) {
    case 'A+': return 'tooltip-bajo'
    case 'A': return 'tooltip-bajo-medio'
    case 'B': return 'tooltip-moderado'
    case 'C': return 'tooltip-moderado-medio'
    case 'D': return 'tooltip-medio'
    case 'E': return 'tooltip-alto'
    default: return ''
  }
})




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
<style>
.tooltip-bajo .p-tooltip-text { background-color: #22c55e !important; color: white; }
.tooltip-bajo-medio .p-tooltip-text { background-color: #86efac; color: black; }
.tooltip-moderado .p-tooltip-text { background-color: #facc15; color: black; }
.tooltip-moderado-medio .p-tooltip-text { background-color: #fcd34d; color: black; }
.tooltip-medio .p-tooltip-text { background-color: #f97316; color: white; }
.tooltip-alto .p-tooltip-text { background-color: #ef4444; color: white; }

.p-tooltip-text {
  font-weight: 600;
  border-radius: 6px;
}
</style>

