<template>
    <div class="py-6">
        <DataTable :value="bankAccounts" :loading="loading" stripedRows class="p-datatable-sm">
            <template #header>
                <div class="flex flex-wrap gap-2 items-center justify-between">
                    <div class="flex items-center gap-2">
                        <h4 class="m-0">Mis cuentas bancaria</h4>
                    </div>
                </div>
            </template>

            <Column field="bank" header="Banco" sortable style="min-width: 15rem"></Column>
            <Column field="type" header="Tipo de cuenta" sortable style="min-width: 10rem"></Column>
            <Column field="currency" header="Moneda" sortable style="min-width: 7rem"></Column>
            <Column field="cc" header="CC" sortable style="min-width: 10rem"></Column>
            <Column field="cci" header="CCI" sortable style="min-width: 10rem"></Column>
            <Column field="status" header="Estado" sortable style="min-width: 12rem">
                <template #body="slotProps">
                    <Tag :value="slotProps.data.status"
                        :severity="slotProps.data.status === 'valid' ? 'success' : 'warn'" />
                </template>
            </Column>
            <Column header="">
                <template #body="slotProps">
                    <Button label="Ver detalles" severity="warn" variant="link" @click="viewDetail(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <!-- Componente para ver/editar detalles -->
        <VerDetalleCuentaBancaria :visible="showDetailDialog" :accountData="selectedAccount"
            @update:visible="updateDetailDialog" @account-updated="handleAccountUpdated"
            @account-deleted="handleAccountDeleted" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { bankAccountService } from '@/services/bankAccountService.js';
import VerDetalleCuentaBancaria from './VerDetalleCuentaBancaria.vue';

const loading = ref(false);
const bankAccounts = ref([]);
const showDetailDialog = ref(false);
const selectedAccount = ref(null);

const loadBankAccounts = async () => {
    loading.value = true;
    try {
        const response = await bankAccountService.getBankAccounts();
        if (response.data.success) {
            bankAccounts.value = response.data.data;
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        loading.value = false;
    }
};

const viewDetail = (account) => {
    console.log('Ver detalle:', account);
    selectedAccount.value = account;
    showDetailDialog.value = true;
};

const updateDetailDialog = (value) => {
    showDetailDialog.value = value;
    if (!value) {
        selectedAccount.value = null;
    }
};

const handleAccountUpdated = () => {
    // Recargar la lista cuando se actualiza una cuenta
    loadBankAccounts();
};

const handleAccountDeleted = () => {
    // Recargar la lista cuando se elimina una cuenta
    loadBankAccounts();
};

// Función expuesta para recargar desde el componente padre
const refreshList = () => {
    loadBankAccounts();
};

// Exponer la función para que el componente padre pueda llamarla
defineExpose({
    refreshList
});

onMounted(() => {
    loadBankAccounts();
});
</script>