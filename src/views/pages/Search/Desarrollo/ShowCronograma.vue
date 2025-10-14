<template>
  <Dialog 
    v-model:visible="visible" 
    modal 
    :header="dialogTitle"
    :style="{ width: '90vw', maxWidth: '1200px' }" 
    :breakpoints="{ '960px': '95vw' }"
    :dismissableMask="true"
    @hide="onHide">
    
    <div v-if="solicitud" class="space-y-6">
      
      <!-- Información General -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div class="text-xs text-gray-600 font-semibold mb-1">CÓDIGO</div>
            <div class="text-lg font-bold text-gray-900">{{ solicitud.codigo }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-600 font-semibold mb-1">PLAZO</div>
            <div class="text-lg font-bold text-gray-900">
              {{ solicitud.configuracion_subasta?.plazo?.nombre || 'N/A' }}
            </div>
          </div>
          <div>
            <div class="text-xs text-gray-600 font-semibold mb-1">TIPO CRONOGRAMA</div>
            <div class="text-lg font-bold text-gray-900 capitalize">
              {{ solicitud.configuracion_subasta?.tipo_cronograma || 'N/A' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs para Inversionistas -->
      <TabView v-if="property_investors.length > 0">
        
        <!-- Tab para cada Property Investor -->
        <TabPanel 
          v-for="(pi, index) in property_investors" 
          :key="pi.id"
          :header="getTabHeader(pi, index)">
          
          <!-- Información del Cronograma -->
          <div class="mb-4 p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <div class="text-xs text-gray-600 font-semibold mb-1">TIPO</div>
                <Tag 
                  :value="pi.configuracion.estado === 1 ? 'INVERSIONISTA' : 'CLIENTE'" 
                  :severity="pi.configuracion.estado === 1 ? 'info' : 'success'"
                  class="font-bold"
                />
              </div>
              <div>
                <div class="text-xs text-gray-600 font-semibold mb-1">TEA</div>
                <div class="text-lg font-bold text-blue-600">
                  {{ formatPercentage(pi.configuracion.tea) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-600 font-semibold mb-1">TEM</div>
                <div class="text-lg font-bold text-purple-600">
                  {{ formatPercentage(pi.configuracion.tem) }}
                </div>
              </div>
              <div>
                <div class="text-xs text-gray-600 font-semibold mb-1">TOTAL A PAGAR</div>
                <div class="text-lg font-bold text-green-600">
                  {{ formatCurrency(calcularTotalAPagar(pi.payment_schedules)) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Tabla de Cronograma -->
          <DataTable 
            :value="pi.payment_schedules" 
            :paginator="pi.payment_schedules.length > 10"
            :rows="10"
            :rowsPerPageOptions="[5, 10, 20, 50]"
            stripedRows
            showGridlines
            responsiveLayout="scroll"
            class="p-datatable-sm">
            
            <Column field="cuota" header="Cuota" :sortable="true" class="font-semibold">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <i class="pi pi-hashtag text-gray-500 text-xs"></i>
                  <span class="font-bold">{{ slotProps.data.cuota }}</span>
                </div>
              </template>
            </Column>

            <Column field="vencimiento" header="Vencimiento" :sortable="true">
              <template #body="slotProps">
                <div class="flex items-center gap-2">
                  <i class="pi pi-calendar text-blue-500 text-xs"></i>
                  <span>{{ formatDate(slotProps.data.vencimiento) }}</span>
                </div>
              </template>
            </Column>

            <Column field="capital" header="Capital" :sortable="true" alignHeader="right" class="text-right">
              <template #body="slotProps">
                <span class="font-semibold text-blue-700">
                  {{ formatCurrency(slotProps.data.capital) }}
                </span>
              </template>
            </Column>

            <Column field="intereses" header="Intereses" :sortable="true" alignHeader="right" class="text-right">
              <template #body="slotProps">
                <span class="font-semibold text-purple-700">
                  {{ formatCurrency(slotProps.data.intereses) }}
                </span>
              </template>
            </Column>

            <Column field="total_cuota" header="Total Cuota" :sortable="true" alignHeader="right" class="text-right">
              <template #body="slotProps">
                <span class="font-bold text-green-700">
                  {{ formatCurrency(slotProps.data.total_cuota) }}
                </span>
              </template>
            </Column>

            <Column field="estado" header="Estado" :sortable="true">
              <template #body="slotProps">
                <Tag 
                  :value="getEstadoLabel(slotProps.data.estado)" 
                  :severity="getEstadoSeverity(slotProps.data.estado)"
                  class="text-xs"
                />
              </template>
            </Column>

            <!-- Resumen en el footer -->
            <template #footer>
              <div class="flex justify-end gap-8 p-3 bg-gray-50 rounded-lg">
                <div>
                  <span class="text-xs text-gray-600 mr-2">Total Capital:</span>
                  <span class="font-bold text-blue-700">
                    {{ formatCurrency(calcularTotalCapital(pi.payment_schedules)) }}
                  </span>
                </div>
                <div>
                  <span class="text-xs text-gray-600 mr-2">Total Intereses:</span>
                  <span class="font-bold text-purple-700">
                    {{ formatCurrency(calcularTotalIntereses(pi.payment_schedules)) }}
                  </span>
                </div>
                <div>
                  <span class="text-xs text-gray-600 mr-2">Total General:</span>
                  <span class="font-bold text-green-700 text-lg">
                    {{ formatCurrency(calcularTotalAPagar(pi.payment_schedules)) }}
                  </span>
                </div>
              </div>
            </template>
          </DataTable>

          <!-- Botón de Descarga -->
          <div class="mt-4 flex justify-end">
            <Button 
              label="Descargar Cronograma" 
              icon="pi pi-download" 
              severity="secondary"
              outlined
              @click="descargarCronograma(pi, index)"
            />
          </div>

        </TabPanel>
      </TabView>

      <!-- Mensaje si no hay cronogramas -->
      <div v-else class="text-center py-8">
        <i class="pi pi-info-circle text-gray-400 text-5xl mb-3"></i>
        <p class="text-gray-600">No hay cronogramas de pago disponibles</p>
      </div>

    </div>

    <!-- Footer del Dialog -->
    <template #footer>
      <Button 
        label="Cerrar" 
        icon="pi pi-times" 
        @click="visible = false" 
        text
        severity="secondary"
      />
    </template>

  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import Dialog from 'primevue/dialog';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  solicitud: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['update:modelValue']);

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

const dialogTitle = computed(() => {
  return props.solicitud 
    ? `Cronograma de Pagos - ${props.solicitud.codigo}` 
    : 'Cronograma de Pagos';
});

const property_investors = computed(() => {
  return props.solicitud?.property_investors || [];
});

const getTabHeader = (pi, index) => {
  const tipo = pi.configuracion.estado === 1 ? 'Inversionista' : 'Cliente';
  return `${tipo} ${index + 1}`;
};

const formatCurrency = (value, currency = 'PEN') => {
  if (value === null || value === undefined || isNaN(value)) return 'S/0.00';
  
  const currencySymbols = {
    'USD': '$',
    'PEN': 'S/',
    'EUR': '€',
    'SOL': 'S/',
    'SOLES': 'S/'
  };
  const symbol = currencySymbols[currency?.toUpperCase()] || 'S/';
  return `${symbol}${new Intl.NumberFormat('es-PE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  }).format(value)}`;
};

const formatPercentage = (value) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  
  const numValue = parseFloat(value);
  
  // Si el valor es mayor a 100, probablemente ya está en formato porcentaje multiplicado por 100
  // Por ejemplo: 3137.00 significa 3137.00% que es 31.37 en decimal
  if (numValue > 100) {
    return `${(numValue / 100).toFixed(2)}%`;
  } 
  // Si el valor es mayor a 1 pero menor o igual a 100, está en formato porcentaje normal
  // Por ejemplo: 15.5 significa 15.5%
  else if (numValue > 1) {
    return `${numValue.toFixed(2)}%`;
  }
  // Si el valor es menor o igual a 1, está en formato decimal
  // Por ejemplo: 0.155 significa 15.5%
  else {
    return `${(numValue * 100).toFixed(2)}%`;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-PE', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

const getEstadoLabel = (estado) => {
  const estados = {
    'pendiente': 'Pendiente',
    'pagado': 'Pagado',
    'vencido': 'Vencido',
    'en_proceso': 'En Proceso'
  };
  return estados[estado] || estado;
};

const getEstadoSeverity = (estado) => {
  const severities = {
    'pendiente': 'warn',
    'pagado': 'success',
    'vencido': 'danger',
    'en_proceso': 'info'
  };
  return severities[estado] || 'secondary';
};

const calcularTotalCapital = (schedules) => {
  return schedules.reduce((sum, s) => sum + parseFloat(s.capital || 0), 0);
};

const calcularTotalIntereses = (schedules) => {
  return schedules.reduce((sum, s) => sum + parseFloat(s.intereses || 0), 0);
};

const calcularTotalAPagar = (schedules) => {
  return schedules.reduce((sum, s) => sum + parseFloat(s.total_cuota || 0), 0);
};

const descargarCronograma = (pi, index) => {
  const tipo = pi.configuracion.estado === 1 ? 'Inversionista' : 'Cliente';
  
  let csv = 'Cuota,Vencimiento,Capital,Intereses,Total Cuota,Estado\n';
  
  pi.payment_schedules.forEach(schedule => {
    csv += `${schedule.cuota},`;
    csv += `${formatDate(schedule.vencimiento)},`;
    csv += `${schedule.capital},`;
    csv += `${schedule.intereses},`;
    csv += `${schedule.total_cuota},`;
    csv += `${schedule.estado}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `cronograma_${tipo}_${props.solicitud.codigo}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const onHide = () => {
  emit('update:modelValue', false);
};
</script>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8fafc;
  font-weight: 600;
  font-size: 0.875rem;
}

:deep(.p-tabview .p-tabview-nav) {
  background: #f8fafc;
  border-radius: 0.5rem;
}

:deep(.p-tabview .p-tabview-panels) {
  background: white;
  padding: 1.5rem;
}
</style>