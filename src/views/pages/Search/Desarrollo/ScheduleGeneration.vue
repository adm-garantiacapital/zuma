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
                {{ formatCurrency(totalValorSubasta, solicitud?.currency?.codigo) }}
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
              @click="$emit('ver-detalle', solicitud)"
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
            
            <!-- Información de Valor Requerido e Inversionistas -->
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
            </div>

            <!-- Botón Ofertar -->
            <div>
              <Button 
                label="Ofertar" 
                rounded
                severity="contrast"
                fluid
                @click="$emit('ofertar', solicitud)"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Galleria from 'primevue/galleria';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import ProgressSpinner from 'primevue/progressspinner';
import ShowCronograma from './ShowCronograma.vue';
import { solicitudService } from '@/services/solicitud.js';

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
const loading = ref(false);
const error = ref(null);
const activeImageIndex = ref(0);
const showCronogramaDialog = ref(false);

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

// Computed: total valor subasta
const totalValorSubasta = computed(() => {
  if (!solicitud.value?.properties || solicitud.value.properties.length === 0) return 0;
  return solicitud.value.properties.reduce((sum, property) => {
    return sum + (parseFloat(property.valor_subasta?.amount) || 0);
  }, 0);
});

// Computed: inversionistas únicos
const inversionistas = computed(() => {
  if (!solicitud.value?.property_investors) return [];
  
  const uniqueInvestors = [];
  const investorIds = new Set();
  
  solicitud.value.property_investors.forEach(pi => {
    if (pi.inversor_id && !investorIds.has(pi.inversor_id)) {
      investorIds.add(pi.inversor_id);
      uniqueInvestors.push(pi);
    }
  });
  
  return uniqueInvestors;
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
  if (!value && value !== 0) return '0%';
  const numValue = parseFloat(value);
  return `${numValue.toFixed(2)}%`;
};

// Función para mostrar el cronograma
const mostrarCronograma = () => {
  console.log('📅 Abriendo cronograma para solicitud:', solicitud.value);
  showCronogramaDialog.value = true;
};

// Cargar datos al montar el componente
onMounted(() => {
  const id = getSolicitudId();
  console.log('🚀 Componente montado');
  console.log('📋 Props:', props);
  console.log('🔗 Route params:', route.params);
  console.log('🆔 ID a usar:', id);
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