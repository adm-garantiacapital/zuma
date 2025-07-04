<template>
    <Dialog :visible="visible" modal header="Cronograma de Pagos" :style="{ width: '100rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        @update:visible="emit('update:visible', $event)" :maximizable="true">
        <!-- Tabla de cronograma -->
        <DataTable :value="tableData" stripedRows responsiveLayout="scroll" class="p-datatable-sm" :paginator="true"
            :rows="10" :rowsPerPageOptions="[5, 10, 20]"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} registros"
            :globalFilterFields="['cuota', 'vencimiento', 'estado']" :sortMode="single" :loading="loading">
            <template #header>
                <div class="flex justify-content-between align-items-center">
                    <h5 class="m-0">Detalle del Cronograma</h5>
                </div>
            </template>

            <Column field="cuota" header="Cuota" sortable style="min-width: 80px">
                <template #body="slotProps">
                    <Badge :value="slotProps.data.cuota" severity="info" />
                </template>
            </Column>

            <Column field="vencimiento" header="Vencimiento" sortable style="min-width: 120px">
                <template #body="slotProps">
                    <div class="flex align-items-center">
                        <i class="pi pi-calendar mr-2 text-500"></i>
                        {{ formatDate(slotProps.data.vencimiento) }}
                    </div>
                </template>
            </Column>

            <Column field="saldo_inicial" header="Saldo Inicial" sortable style="min-width: 140px">
                <template #body="slotProps">
                    <div class="text-right font-medium">
                        {{ formatCurrencyValue(slotProps.data.saldo_inicial) }}
                    </div>
                </template>
            </Column>

            <Column field="capital" header="Capital" sortable style="min-width: 120px">
                <template #body="slotProps">
                    <div class="text-right font-medium text-blue-600">
                        {{ formatCurrencyValue(slotProps.data.capital) }}
                    </div>
                </template>
            </Column>

            <Column field="intereses" header="Interés" sortable style="min-width: 120px">
                <template #body="slotProps">
                    <div class="text-right font-medium text-orange-600">
                        {{ formatCurrencyValue(slotProps.data.intereses) }}
                    </div>
                </template>
            </Column>

            <Column field="cuota_neta" header="Cuota Neta" sortable style="min-width: 130px">
                <template #body="slotProps">
                    <div class="text-right font-bold text-primary">
                        {{ formatCurrencyValue(slotProps.data.cuota_neta) }}
                    </div>
                </template>
            </Column>

            <Column field="igv" header="IGV" sortable style="min-width: 100px">
                <template #body="slotProps">
                    <div class="text-right font-medium text-purple-600">
                        {{ formatCurrencyValue(slotProps.data.igv) }}
                    </div>
                </template>
            </Column>

            <Column field="total_cuota" header="Total Cuota" sortable style="min-width: 140px">
                <template #body="slotProps">
                    <div class="text-right font-bold text-green-600">
                        {{ formatCurrencyValue(slotProps.data.total_cuota) }}
                    </div>
                </template>
            </Column>

            <Column field="saldo_final" header="Saldo Final" sortable style="min-width: 140px">
                <template #body="slotProps">
                    <div class="text-right font-medium">
                        {{ formatCurrencyValue(slotProps.data.saldo_final) }}
                    </div>
                </template>
            </Column>

            <Column field="estado" header="Estado" sortable style="min-width: 100px">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.estado" :severity="getStatusSeverity(slotProps.data.estado)"
                        :icon="getStatusIcon(slotProps.data.estado)" />
                </template>
            </Column>

            <template #empty>
                <div class="text-center p-4">
                    <i class="pi pi-info-circle text-4xl text-400 mb-3"></i>
                    <div class="text-500">No hay datos disponibles</div>
                </div>
            </template>
        </DataTable>

        <template #footer>
            <div class="flex justify-content-between align-items-center">
                <div class="flex align-items-center">
                    <i class="pi pi-info-circle mr-2 text-500"></i>
                    <span class="text-sm text-500">
                        Cronograma generado automáticamente
                    </span>
                </div>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue';
import { FilterMatchMode} from '@primevue/core/api';

const props = defineProps({
    visible: Boolean,
    data: {
        type: [Array, Object],
        default: () => []
    }
});

const emit = defineEmits(['update:visible']);

const loading = ref(false);
const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

// Computed para manejar los datos
const tableData = computed(() => {
    if (Array.isArray(props.data)) {
        return props.data;
    }
    return props.data?.data || [];
});

const formatCurrencyValue = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'S/ 0.00';
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(numValue);
};

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getStatusSeverity = (status) => {
    switch (status?.toLowerCase()) {
        case 'pendiente':
            return 'warning';
        case 'pagado':
            return 'success';
        case 'vencido':
            return 'danger';
        default:
            return 'info';
    }
};

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'pendiente':
            return 'pi pi-clock';
        case 'pagado':
            return 'pi pi-check-circle';
        case 'vencido':
            return 'pi pi-exclamation-triangle';
        default:
            return 'pi pi-info-circle';
    }
};

</script>

<style scoped>
.custom-dialog :deep(.p-dialog) {
    border-radius: 12px;
}

.custom-dialog :deep(.p-dialog-header) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 12px 12px 0 0;
}

.custom-dialog :deep(.p-dialog-content) {
    padding: 0;
}

.custom-dialog :deep(.p-dialog-footer) {
    background-color: #f8f9fa;
    border-radius: 0 0 12px 12px;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
    background-color: #f1f3f4;
    border-bottom: 1px solid #e9ecef;
    font-weight: 600;
    color: #495057;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
    background-color: #f8f9fa;
}

:deep(.p-card) {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

:deep(.p-card .p-card-content) {
    padding: 1rem;
}

:deep(.p-badge) {
    font-weight: 600;
}

:deep(.p-tag) {
    font-weight: 500;
}
</style>