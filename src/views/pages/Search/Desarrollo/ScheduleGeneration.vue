<template>
    <Dialog v-model:visible="visible" maximizable modal header="Cronograma final de pagos"
        :style="{ width: '70rem' }"
        :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

        <div class="mb-4">
            <label for="plazo" class="block font-semibold mb-2">Plazo:</label>
            <Select v-model="form.plazo_id" :options="plazos" optionLabel="nombre" optionValue="id"
                placeholder="Selecciona el plazo" class="w-full mb-2" />
        </div>

        <div v-if="scheduleData">
            <DataTable
                v-model:selection="selectedCuotas"
                :value="scheduleData.cronograma_final.pagos"
                dataKey="cuota"
                :paginator="true"
                :rows="rows"
                :totalRecords="totalRecords"
                :lazy="true"
                :first="(currentPage - 1) * rows"
                @page="onPage"
                :filters="filters"
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReportTemplate RowsPerPageDropdown"
                :rowsPerPageOptions="[5, 10, 25]"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cuotas"
                responsiveLayout="scroll"
                class="p-datatable-sm"
                :loading="loading"
            >
                <template #header>
                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold">Cronograma de pagos</span>
                    </div>
                </template>

                <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
                <Column field="cuota" header="Cuota" sortable style="min-width: 6rem" />
                <Column field="vcmto" header="Vencimiento" sortable style="min-width: 9rem" />
                <Column field="saldo_inicial" header="Saldo Inicial" sortable style="min-width: 10rem" />
                <Column field="capital" header="Capital" sortable style="min-width: 8rem" />
                <Column field="interes" header="Interés" sortable style="min-width: 8rem" />
                <Column field="cuota_neta" header="Cuota Neta" sortable style="min-width: 9rem" />
                <Column field="igv" header="IGV" sortable style="min-width: 7rem" />
                <Column field="total_cuota" header="Total Cuota" sortable style="min-width: 10rem" />
                <Column field="saldo_final" header="Saldo Final" sortable style="min-width: 10rem" />
            </DataTable>
        </div>
    </Dialog>
</template>

<script setup>
import { ref, watch, defineExpose } from 'vue';
import { deadlinesService } from '@/services/deadlinesService.js';
import { simulationService } from '@/services/simulationService.js';

// Referencias y estados
const visible = ref(false);
const propertyId = ref(null);
const plazos = ref([]);
const form = ref({ plazo_id: null });
const scheduleData = ref(null);
const selectedCuotas = ref([]);
const rows = ref(10);
const currentPage = ref(1);
const totalRecords = ref(0);
const loading = ref(false);
const filters = ref({});

// Exponer función open para abrir el diálogo desde fuera
const open = async (id) => {
    propertyId.value = id;
    visible.value = true;
    scheduleData.value = null;
    form.value.plazo_id = null;
    currentPage.value = 1;
    await fetchPlazos();
};
defineExpose({ open });

// Obtener plazos desde el backend
const fetchPlazos = async () => {
    try {
        const response = await deadlinesService.getDeadlines();
        plazos.value = response.data.data;
    } catch (e) {
        console.error("Error cargando plazos:", e);
    }
};

// Generar cronograma paginado
const generateSchedule = async () => {
    if (!form.value.plazo_id || !propertyId.value) return;

    try {
        loading.value = true;

        const payload = {
            property_id: propertyId.value,
            deadline_id: form.value.plazo_id
        };

        console.log('Solicitando página:', currentPage.value, 'con', rows.value, 'filas');

        const response = await simulationService.generate(payload, {
            page: currentPage.value,
            per_page: rows.value
        });

        scheduleData.value = response.data.data;
        totalRecords.value = response.data.data.cronograma_final.pagination.total;
    } catch (e) {
        console.error("Error generando cronograma:", e);
    } finally {
        loading.value = false;
    }
};

const onPage = (event) => {
    currentPage.value = (event.page ?? 0) + 1;
    rows.value = event.rows;
    generateSchedule();
};

// Generar automáticamente cuando se selecciona un nuevo plazo
watch(() => form.value.plazo_id, () => {
    if (form.value.plazo_id) {
        currentPage.value = 1;
        generateSchedule();
    }
});
</script>
