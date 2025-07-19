<template>
  <div class="">
    <br>
    <DataTable ref="dt" :value="bankAccounts" :loading="loading" stripedRows responsiveLayout="scroll" dataKey="id"
      :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 25, 50]" :filters="filters" filterDisplay="menu"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cuentas"
      emptyMessage="No se encontraron cuentas bancarias" class="p-datatable-sm">

      <!-- CABECERA -->
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <h4 class="m-0 font-bold text-[#171717]">Listado de cuentas bancarias</h4>
          <IconField>
            <InputIcon>
              <i class="pi pi-search" />
            </InputIcon>
            <InputText v-model="filters['global'].value" placeholder="Buscar..." />
          </IconField>
        </div>
      </template>

      <!-- SELECCIÓN -->
      <Column selectionMode="multiple" headerStyle="width: 3rem" />

      <!-- COLUMNAS -->
      <Column field="bank" header="Banco" sortable filter filterPlaceholder="Buscar banco" style="min-width: 15rem" />
      <Column field="type" header="Tipo de cuenta" sortable filter filterPlaceholder="Buscar tipo" style="min-width: 10rem" />
      <Column field="currency" header="Moneda" sortable filter filterPlaceholder="Buscar moneda" style="min-width: 7rem" />
      <Column field="cc" header="CC" sortable filter filterPlaceholder="Buscar CC" style="min-width: 10rem" />
      <Column field="cci" header="CCI" sortable filter filterPlaceholder="Buscar CCI" style="min-width: 10rem" />

      <!-- ESTADO -->
      <Column field="status" header="Estado" sortable filter style="min-width: 12rem">
        <template #body="slotProps">
          <Tag :value="getStatusLabel(slotProps.data.status)"
               :severity="slotProps.data.status === 'valid' ? 'success' : (slotProps.data.status === 'pending' ? 'info' : 'danger')" />
        </template>
        <template #filter>
          <Select v-model="filters['status'].value"
                  :options="statusOptions"
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Selecciona estado"
                  class="p-column-filter"
                  showClear />
        </template>
      </Column>

      <!-- ACCIONES -->
      <Column header="">
        <template #body="slotProps">
          <Button label="Ver detalles" severity="warn" variant="link" class="" @click="viewDetail(slotProps.data)" />
        </template>
      </Column>
    </DataTable>

    <!-- DIALOG DETALLE -->
    <VerDetalleCuentaBancaria
      :visible="showDetailDialog"
      :accountData="selectedAccount"
      @update:visible="updateDetailDialog"
      @account-updated="handleAccountUpdated"
      @account-deleted="handleAccountDeleted"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import InputIcon from 'primevue/inputicon';
import IconField from 'primevue/iconfield';
import Select from 'primevue/select';
import { FilterMatchMode } from '@primevue/core/api';

import { bankAccountService } from '@/services/bankAccountService.js';
import VerDetalleCuentaBancaria from './VerDetalleCuentaBancaria.vue';

const loading = ref(false);
const bankAccounts = ref([]);
const showDetailDialog = ref(false);
const selectedAccount = ref(null);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  status: { value: null, matchMode: FilterMatchMode.EQUALS },
});

const statusOptions = [
  { label: 'Válido', value: 'valid' },
  { label: 'Pendiente', value: 'pending' },
  { label: 'Inválido', value: 'invalid' },
];

const getStatusLabel = (status) => {
  switch (status) {
    case 'valid': return 'Válido';
    case 'pending': return 'Pendiente';
    case 'invalid': return 'Inválido';
    default: return 'Desconocido';
  }
};

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
  selectedAccount.value = account;
  showDetailDialog.value = true;
};

const updateDetailDialog = (visible) => {
  showDetailDialog.value = visible;
  if (!visible) selectedAccount.value = null;
};

const handleAccountUpdated = () => {
  loadBankAccounts();
};

const handleAccountDeleted = () => {
  loadBankAccounts();
};

const refreshList = () => {
  loadBankAccounts();
};

defineExpose({ refreshList });

onMounted(() => {
  loadBankAccounts();
});
</script>
