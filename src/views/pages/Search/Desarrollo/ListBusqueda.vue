<template>
  <br />
  <Breadcrumb :home="home" :model="items" />
  <Billetera />
  <br>
  <br>
  <!-- Si hay propiedades, muestra la tabla -->
  <div class="py-4" v-if="products.length > 0">
    <div class="border rounded-2xl shadow-sm overflow-hidden">
      <div class="p-10">
        <DataTable v-model:selection="selectedProducts" :value="products" dataKey="id" :paginator="true" :rows="rows"
        :totalRecords="totalRecords" :lazy="true" :first="(currentPage - 1) * rows" @page="onPage" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReportTemplate RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} propiedades" responsiveLayout="scroll"
        class="p-datatable-sm" :loading="loading">
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
              <Select v-model="selectedCurrency" :options="currencyOptions" optionLabel="codigo" placeholder="Moneda"
                class="w-full md:w-auto" showClear @change="loadProperties" />
              <Button icon="pi pi-refresh" outlined rounded aria-label="Refresh" @click="loadProperties" />
            </div>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
        <Column field="nombre" header="Nombre de la propiedad" sortable style="min-width: 15rem" />
        <Column field="descripcion" header="Descripcion de la propiedad" sortable style="min-width: 20rem" />
        <Column field="Moneda" header="Moneda" sortable style="min-width: 5rem" />
        <Column field="valor_estimado" header="Valor" sortable style="min-width: 8rem" />
        <Column field="requerido" header="Requiere" sortable style="min-width: 8rem" />
        <Column field="tea" header="TEM" sortable style="min-width: 8rem" />
        <Column field="foto" header="Imagen">
          <template #body="slotProps">
            <div class="flex justify-center">
              <Image v-if="slotProps.data.foto && slotProps.data.foto.length > 0" :src="slotProps.data.foto[0]"
                class="rounded" :alt="slotProps.data.nombre || 'Imagen de propiedad'" preview width="50"
                style="width: 64px" />

              <div v-else
                class="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                <i class="pi pi-image text-gray-400 text-xl"></i>
              </div>
            </div>
          </template>
        </Column>
        <Column field="detalles" header="">
          <template #body="slotProps">
            <Button label="Revisar detalles" outlined severity="contrast" size="small"
              @click="scheduleRef?.open(slotProps.data.id)" />
          </template>
        </Column>
      </DataTable>
      </div>
    </div>
  </div>

  <!-- Si NO hay propiedades, muestra este bloque -->
  <div class="py-4" v-else>
    <div class="border-gray-200 rounded-3xl bg-white p-10 text-center max-w-xl mx-auto">
      <h5 class="text-[#171717] text-lg font-semibold mb-4">Hipotecas disponibles</h5>
      <p class="font-bold text-[#171717] mb-3">¡Ups! No hay hipotecas disponibles por el momento.</p>

      <!-- SVG ilustrativo -->
      <svg xmlns='http://www.w3.org/2000/svg' class="fill-[#171717] mx-auto my-8" width='169.333' height='228'
        viewBox='0 0 127 171'>
        <path
          d="M106.5 2.3c-3.3.5-6.1 1.1-6.3 1.2-.4.4 9.8 53.8 10.4 54.4.2.2 2.8 0 5.9-.4l5.6-.7-.6-3.1c-.7-3.9-6.5-50.2-6.5-51.6 0-1.2-.2-1.2-8.5.2zM44 16.1C25.6 18.8 10.1 31.7 4 49.4c-8.1 23.5 2.9 50.3 24.8 60.8l6.9 3.3-2.6 4.9c-2.5 4.9-2.6 5.5-2.9 27.8l-.3 22.8H51v-3c0-2.2-.5-3-1.8-3-1 0-2.8-.7-4-1.6-2.1-1.5-2.2-2.1-2.2-18.6 0-19.2.5-21 7-24.7 6.5-3.6 13.6-2.4 18.9 3.2 2 2.2 2.8 5.6 5.8 23.3 1.9 11.5 3.6 21 3.9 21.3.4.4 15.3-1.5 18.5-2.5 1.1-.3 1.4-1.3 1.1-3.4-.4-2.5-.9-3-3.1-3-5.5 0-6.2-1.5-9.1-19.1-2.7-16.3-4.3-21.2-8.4-25.8l-2.1-2.3 2.5-1.6c7.2-4.7 14.3-12.9 18.3-21.1 3.7-7.8 4.1-9.2 4.5-18.7.4-8.4.1-11.4-1.6-17.1-5.7-18.6-21.5-32.2-40.9-35.2-3.9-.6-7.5-1-8-1-.4.1-3.3.5-6.3 1zm23.2 14.1c8 3.7 15.2 10.7 19.1 18.7 2.9 6.1 3.2 7.4 3.2 16.6 0 8.8-.3 10.7-2.7 15.7C75.2 106 43.1 112 24 93 3.3 72.2 12.1 37.7 40.5 28.3c6.6-2.1 19.9-1.2 26.7 1.9z" />
        <path
          d="M43.7 35.6c-.3.3-.3 2-.1 3.7.5 2.9.2 3.4-3.2 5.2-5.3 2.8-7.9 6.8-7.9 11.9 0 8.9 4.3 12.3 17 13.6 9.3 1 10 1.2 11.5 4.1 1.8 3.2-2.8 6.9-8.4 6.9-3.7 0-4.8-.5-7-3.1-2.5-2.9-3-3.1-7.2-2.4-4.3.6-4.5.8-4 3.3 1 4 6.8 9 12.1 10.3 4 1 4.5 1.4 4.5 4 0 3.4.5 3.7 5.3 3.1 3.8-.4 3.9-.5 3.3-3.8-.6-3.1-.4-3.5 3.3-5.3 7.4-3.8 10.6-11.5 7.8-18.3-2.2-5.3-5.4-6.9-15.9-8-10-1-11.8-1.8-11.8-5.4 0-6.6 12.7-7.2 15.1-.7.7 1.7 9.3 0 9.7-1.8.7-3.5-8-10.9-12.6-10.9-2.1 0-3.2-1.8-3.2-5.1 0-1.5-.7-1.9-3.8-1.9-2.1 0-4.1.3-4.5.6zM115.4 63c-2.9 1.1-5.4 4.9-5.4 7.8 0 3.2 5.2 8.2 8.5 8.2 3.4 0 8.5-5 8.5-8.4 0-5.2-6.8-9.6-11.6-7.6z" />
      </svg>
      <p class="text-[#171717] mb-6">Aquí verás las hipotecas disponibles para que puedas invertir cuando se publiquen.
      </p>
    </div>
  </div>
  <ScheduleGeneration ref="scheduleRef" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { propertyService } from '@/services/propertyService.js';
import { currencyService } from '@/services/currencyService.js';
import Image from 'primevue/image';
import ScheduleGeneration from './ScheduleGeneration.vue';
import Billetera from './Billetera.vue';

const toast = useToast();
const scheduleRef = ref(null);

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