<template>
    <Breadcrumb :home="home" :model="items" />

    <div class="card">
        <DataTable
            v-model:selection="selectedProducts"
            :value="products"
            dataKey="id"
            :paginator="true"
            :rows="rows"
            :totalRecords="totalRecords"
            :lazy="true"
            :first="(currentPage - 1) * rows"
            @page="onPage"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} propiedades"
            responsiveLayout="scroll"
            class="p-datatable-sm"
        >
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <h4 class="m-0">
                        Hipotecas
                        <Tag severity="success" value="Total">{{ totalRecords }}</Tag>
                    </h4>
                    <IconField>
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="filters['global'].value" placeholder="Buscar..." />
                    </IconField>
                </div>
            </template>

            <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
            <Column field="nombre" header="Nombre" sortable style="min-width: 12rem" />
            <Column field="distrito" header="Distrito" sortable style="min-width: 12rem" />

            <!-- Tag de Estado con colores -->
            <Column header="Estado" style="min-width: 10rem" sortable>
                <template #body="slotProps">
                    <Tag
                        :value="slotProps.data.estado_nombre"
                        :severity="slotProps.data.estado === 'no_subastada' ? 'danger' : 'success'"
                    />
                </template>
            </Column>

            <!-- Botón revisar -->
            <Column field="detalles" header="Detalles" sortable>
                <template #body="slotProps">
                    <Button
                        label="Revisar detalles"
                        outlined
                        class="p-button-sm"
                        @click="() => toast.add({ severity: 'info', summary: 'En desarrollo', detail: 'Esta funcionalidad está en desarrollo' })"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const products = ref([]);
const selectedProducts = ref();
const currentPage = ref(1);
const totalRecords = ref(0);
const rows = ref(10);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Subasta hipotecas' }, { label: 'Buscar' }]);

const loadProperties = async (page = 1) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/property?page=${page}`);
        products.value = response.data.data;
        totalRecords.value = response.data.meta.total;
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las propiedades',
        });
    }
};

const onPage = (event) => {
    currentPage.value = Math.floor(event.first / event.rows) + 1;
    rows.value = event.rows;
    loadProperties(currentPage.value);
};

onMounted(() => {
    loadProperties();
});
</script>
