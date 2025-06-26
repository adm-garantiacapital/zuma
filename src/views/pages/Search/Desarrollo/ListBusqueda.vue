<template>
    <Breadcrumb :home="home" :model="items" />
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
                    <Select v-model="selectedCurrency" :options="currencyOptions" optionLabel="codigo"
                        placeholder="Moneda" class="w-full md:w-auto" showClear @change="loadProperties" />

                    <Button icon="pi pi-refresh" outlined rounded aria-label="Refresh" @click="loadProperties" />
                </div>
            </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
        <Column field="nombre" header="Nombre de la propiedad" sortable style="min-width: 15rem" />
        <Column field="descripcion" header="Descripcion de la propiedad" sortable style="min-width: 20rem" />
        <Column field="Moneda" header="Moneda" sortable style="min-width: 5rem" />
        <Column field="valor_estimado" header="Valor de la propiedad" sortable style="min-width: 12rem" />
        <Column field="financiado" header="Financiamiento" sortable style="min-width: 8rem" />
        <Column field="tea" header="TEM" sortable style="min-width: 8rem" />
        <Column field="foto" header="Imagen">
            <template #body="slotProps">
                <div class="flex justify-center">
                    <Image v-if="slotProps.data.foto" :src="slotProps.data.foto" class="rounded"
                        :alt="slotProps.data.nombre || 'Imagen de propiedad'" preview width="50" style="width: 64px" />
                    <div v-else class="w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                        <i class="pi pi-image text-gray-400 text-xl"></i>
                    </div>
                </div>
            </template>
        </Column>
        <Column field="detalles" header="">
            <template #body="slotProps">
                <Button label="Cronograma" outlined class="p-button-sm"
                    @click="() => scheduleRef.open(slotProps.data.id)" />
            </template>
        </Column>
    </DataTable>
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
const items = ref([{ label: 'Subasta hipotecas' }, { label: 'Buscar' }]);

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