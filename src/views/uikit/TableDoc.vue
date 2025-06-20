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
            :loading="loading"
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
import { ref, onMounted, watch } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { propertyService } from '@/services/propertyService.js';

const toast = useToast();

// Estados reactivos
const products = ref([]);
const selectedProducts = ref();
const currentPage = ref(1);
const totalRecords = ref(0);
const rows = ref(10);
const loading = ref(false);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Subasta hipotecas' }, { label: 'Buscar' }]);

// Función para cargar propiedades
const loadProperties = async (page = 1) => {
    loading.value = true;
    try {
        const response = await propertyService.getProperties(page);
        
        products.value = response.data.data;
        totalRecords.value = response.data.meta.total;
        
        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: `Se cargaron ${response.data.data.length} propiedades`,
            life: 3000
        });
        
    } catch (error) {
        console.error('Error loading properties:', error);
        
        // Manejo específico de errores
        let errorMessage = 'No se pudieron cargar las propiedades';
        
        if (error.response?.status === 401) {
            errorMessage = 'Su sesión ha expirado. Será redirigido al login.';
        } else if (error.response?.status === 403) {
            errorMessage = 'No tiene permisos para ver esta información';
        } else if (error.response?.status >= 500) {
            errorMessage = 'Error en el servidor. Intente más tarde.';
        } else if (error.code === 'ECONNABORTED') {
            errorMessage = 'La petición tardó demasiado. Verifique su conexión.';
        }
        
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: errorMessage,
            life: 5000
        });
        
        // Limpiar datos en caso de error
        products.value = [];
        totalRecords.value = 0;
        
    } finally {
        loading.value = false;
    }
};

// Manejar cambio de página
const onPage = (event) => {
    currentPage.value = Math.floor(event.first / event.rows) + 1;
    rows.value = event.rows;
    loadProperties(currentPage.value);
};

// Cargar datos al montar el componente
onMounted(() => {
    // Verificar que hay token antes de cargar
    const token = localStorage.getItem('api_token');
    if (!token) {
        toast.add({
            severity: 'warn',
            summary: 'Advertencia',
            detail: 'No se encontró token de autenticación',
            life: 5000
        });
        return;
    }
    
    loadProperties();
});

// Opcional: Watch para buscar en tiempo real
watch(() => filters.value.global.value, (newValue) => {
    if (newValue !== null && newValue !== undefined) {
        // Implementar búsqueda si es necesario
        // loadProperties(1, { search: newValue });
    }
}, { debounce: 500 });
</script>