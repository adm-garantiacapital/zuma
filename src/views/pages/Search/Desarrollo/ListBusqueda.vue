<template>
  <br />
  <Breadcrumb :home="home" :model="items" />
  <Billetera />
  <br>
  <br>
  
  <!-- Siempre muestra la tabla -->
  <div class="py-4">
    <div class="border rounded-2xl shadow-sm overflow-hidden">
      <div class="p-10">
        <DataTable 
          v-model:selection="selectedProducts" 
          :value="products" 
          dataKey="id" 
          :paginator="products.length > 0" 
          :rows="rows"
          :totalRecords="totalRecords" 
          :lazy="true" 
          :first="(currentPage - 1) * rows" 
          @page="onPage" 
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReportTemplate RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} propiedades" 
          responsiveLayout="scroll"
          class="p-datatable-sm" 
          :loading="loading">
          
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <div class="flex items-center gap-2">
                <h4 class="m-0">Hipotecas
                  <Tag severity="success" :value="totalRecords" />
                </h4>
              </div>
              <div class="flex flex-wrap gap-2">
                <IconField>
                  <InputIcon>
                    <i class="pi pi-search" />
                  </InputIcon>
                  <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                </IconField>
                <Select 
                  v-model="selectedCurrency" 
                  :options="currencyOptions" 
                  optionLabel="codigo" 
                  placeholder="Moneda"
                  class="w-full md:w-auto" 
                  showClear 
                  @change="loadProperties" 
                />
                <Button icon="pi pi-refresh" outlined rounded aria-label="Refresh" @click="loadProperties" />
              </div>
            </div>
          </template>

          <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
          <Column field="codigo" header="Codigo" sortable style="min-width: 10rem" />
          <Column field="propiedades_count" header="Nº" sortable style="min-width: 5rem" />
          
          <Column field="currency" header="Moneda" sortable style="min-width: 5rem">
            <template #body="slotProps">
              <Tag :value="slotProps.data.currency" severity="info" />
            </template>
          </Column>
          
          <Column field="valor_general" header="Valor" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <span class="font-semibold">{{ formatCurrency(slotProps.data.valor_general, slotProps.data.currency) }}</span>
            </template>
          </Column>
          
          <Column field="valor_requerido" header="Requiere" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <span class="font-semibold text-green-600">{{ formatCurrency(slotProps.data.valor_requerido, slotProps.data.currency) }}</span>
            </template>
          </Column>
          
          <Column field="configuracion_subasta.tem" header="TEM" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <Tag :value="formatPercentage(slotProps.data.configuracion_subasta?.tem)" severity="success" />
            </template>
          </Column>       
           
          <Column field="configuracion_subasta.tipo_cronograma" header="Tipo Cronograma" sortable style="min-width: 12rem">
            <template #body="slotProps">
              <Tag :value="slotProps.data.configuracion_subasta?.tipo_cronograma || '-'" severity="info" />
            </template>
          </Column>       
           
          <Column field="configuracion_subasta.riesgo" header="Riesgo" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <Tag :value="slotProps.data.configuracion_subasta?.riesgo || '-'" severity="warning" />
            </template>
          </Column>       
           
          <Column field="configuracion_subasta.meses" header="Meses" sortable style="min-width: 8rem">
            <template #body="slotProps">
              <Tag :value="slotProps.data.configuracion_subasta?.meses || '-'" severity="secondary" />
            </template>
          </Column>         
          
          <Column field="detalles" header="" style="min-width: 12rem">
            <template #body="slotProps">
              <Button 
                label="Revisar detalles" 
                outlined 
                severity="contrast" 
                size="small"
                @click="goToDetails(slotProps.data)" 
              />
            </template>
          </Column>
        </DataTable>

        <!-- Estado vacío dentro de la tabla cuando no hay resultados -->
        <div v-if="products.length === 0 && !loading" class="text-center py-12">
          <div class="mb-6">
            <svg xmlns='http://www.w3.org/2000/svg' class="fill-gray-400 mx-auto mb-4" width='80' height='80' viewBox='0 0 127 171'>
              <path d="M106.5 2.3c-3.3.5-6.1 1.1-6.3 1.2-.4.4 9.8 53.8 10.4 54.4.2.2 2.8 0 5.9-.4l5.6-.7-.6-3.1c-.7-3.9-6.5-50.2-6.5-51.6 0-1.2-.2-1.2-8.5.2zM44 16.1C25.6 18.8 10.1 31.7 4 49.4c-8.1 23.5 2.9 50.3 24.8 60.8l6.9 3.3-2.6 4.9c-2.5 4.9-2.6 5.5-2.9 27.8l-.3 22.8H51v-3c0-2.2-.5-3-1.8-3-1 0-2.8-.7-4-1.6-2.1-1.5-2.2-2.1-2.2-18.6 0-19.2.5-21 7-24.7 6.5-3.6 13.6-2.4 18.9 3.2 2 2.2 2.8 5.6 5.8 23.3 1.9 11.5 3.6 21 3.9 21.3.4.4 15.3-1.5 18.5-2.5 1.1-.3 1.4-1.3 1.1-3.4-.4-2.5-.9-3-3.1-3-5.5 0-6.2-1.5-9.1-19.1-2.7-16.3-4.3-21.2-8.4-25.8l-2.1-2.3 2.5-1.6c7.2-4.7 14.3-12.9 18.3-21.1 3.7-7.8 4.1-9.2 4.5-18.7.4-8.4.1-11.4-1.6-17.1-5.7-18.6-21.5-32.2-40.9-35.2-3.9-.6-7.5-1-8-1-.4.1-3.3.5-6.3 1zm23.2 14.1c8 3.7 15.2 10.7 19.1 18.7 2.9 6.1 3.2 7.4 3.2 16.6 0 8.8-.3 10.7-2.7 15.7C75.2 106 43.1 112 24 93 3.3 72.2 12.1 37.7 40.5 28.3c6.6-2.1 19.9-1.2 26.7 1.9z" />
              <path d="M43.7 35.6c-.3.3-.3 2-.1 3.7.5 2.9.2 3.4-3.2 5.2-5.3 2.8-7.9 6.8-7.9 11.9 0 8.9 4.3 12.3 17 13.6 9.3 1 10 1.2 11.5 4.1 1.8 3.2-2.8 6.9-8.4 6.9-3.7 0-4.8-.5-7-3.1-2.5-2.9-3-3.1-7.2-2.4-4.3.6-4.5.8-4 3.3 1 4 6.8 9 12.1 10.3 4 1 4.5 1.4 4.5 4 0 3.4.5 3.7 5.3 3.1 3.8-.4 3.9-.5 3.3-3.8-.6-3.1-.4-3.5 3.3-5.3 7.4-3.8 10.6-11.5 7.8-18.3-2.2-5.3-5.4-6.9-15.9-8-10-1-11.8-1.8-11.8-5.4 0-6.6 12.7-7.2 15.1-.7.7 1.7 9.3 0 9.7-1.8.7-3.5-8-10.9-12.6-10.9-2.1 0-3.2-1.8-3.2-5.1 0-1.5-.7-1.9-3.8-1.9-2.1 0-4.1.3-4.5.6zM115.4 63c-2.9 1.1-5.4 4.9-5.4 7.8 0 3.2 5.2 8.2 8.5 8.2 3.4 0 8.5-5 8.5-8.4 0-5.2-6.8-9.6-11.6-7.6z" />
            </svg>
            <h5 class="text-gray-600 text-lg font-medium mb-2">
              {{ filters.global.value ? 'No se encontraron resultados' : 'No hay hipotecas disponibles' }}
            </h5>
            <p class="text-gray-500 text-sm">
              {{ filters.global.value ? `No hay propiedades que coincidan con "${filters.global.value}"` : 'Las nuevas oportunidades aparecerán aquí cuando estén disponibles.' }}
            </p>
          </div>
          <Button 
            v-if="filters.global.value || selectedCurrency" 
            label="Limpiar filtros" 
            icon="pi pi-times" 
            severity="secondary" 
            outlined 
            size="small"
            @click="clearFilters"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { propertyService } from '@/services/propertyService.js';
import { currencyService } from '@/services/currencyService.js';
import Tag from 'primevue/tag';
import Billetera from './Billetera.vue';

const router = useRouter();
const toast = useToast();

const products = ref([]);
const selectedProducts = ref();
const currentPage = ref(1);
const totalRecords = ref(0);
const rows = ref(10);
const loading = ref(false);
let searchTimeout = null;

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Subastas de hipotecas' }, { label: 'Buscar hipotecas' }]);

const selectedCurrency = ref(null);
const currencyOptions = ref([]);

// Método para navegar a los detalles de la hipoteca
const goToDetails = (property) => {
  console.log('Navegando a detalles de hipoteca:', property);
  
  router.push({
    name: 'hipoteca-detalle',
    params: { 
      id: property.id 
    }
  });
};

const formatCurrency = (value, currency = 'USD') => {
  if (!value && value !== 0) return '-';
  
  const currencySymbols = {
    'USD': '$',
    'PEN': 'S/',
    'EUR': '€',
    'SOL': 'S/',
    'SOLES': 'S/',
    'Dólares': '$',
    'DOLARES': '$'
  };
  
  const symbol = currencySymbols[currency?.toUpperCase()] || currencySymbols[currency] || '$';
  
  return `${symbol}${new Intl.NumberFormat('es-PE').format(value)}`;
};

const formatPercentage = (value) => {
  if (!value && value !== 0) return '0%';
  const numValue = parseFloat(value);
  return `${(numValue / 100).toFixed(3)}%`;
};

const clearFilters = () => {
  filters.value.global.value = null;
  selectedCurrency.value = null;
  currentPage.value = 1;
  loadProperties(1);
};

const loadCurrencies = async () => {
  try {
    const response = await currencyService.getCurrencies();
    currencyOptions.value = response.data.data;
  } catch (error) {
    console.error('Error cargando monedas', error);
  }
};

const loadProperties = async (page = currentPage.value) => {
  loading.value = true;
  try {
    const filtersToSend = {};
    if (filters.value.global.value) filtersToSend.search = filters.value.global.value;
    if (selectedCurrency.value) filtersToSend.currency_id = selectedCurrency.value.id;

    const response = await propertyService.getProperties(page, filtersToSend);
    products.value = response.data.data;
    totalRecords.value = response.data.meta.total;
  } catch (error) {
    console.error('Error loading properties:', error);
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar las propiedades', life: 3000 });
    products.value = [];
    totalRecords.value = 0;
  } finally {
    loading.value = false;
  }
};

const onPage = (event) => {
  currentPage.value = Math.floor(event.first / event.rows) + 1;
  rows.value = event.rows;
  loadProperties(currentPage.value);
};

onMounted(() => {
  loadCurrencies();
  loadProperties();
});

watch(() => filters.value.global.value, (newValue, oldValue) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  if (newValue !== oldValue) {
    searchTimeout = setTimeout(() => {
      currentPage.value = 1;
      loadProperties(1);
    }, 800);
  }
});
</script>