<template>
  <Dialog v-model:visible="visible" maximizable modal header="Cronograma final de pagos" :style="{ width: '70rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <!-- Tabla de selección de plazos -->
    <div v-if="!scheduleData" class="mb-5">
      <DataTable :value="scheduleDataPreview" responsiveLayout="scroll" class="p-datatable-sm" dataKey="deadline_id"
        selectionMode="single"  :selection="{ deadline_id: form.plazo_id }">
            <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="plazo_meses" header="Plazo (meses)" sortable style="min-width: 12rem"/>
        <Column field="cuota_mensual" header="Cuota mensual (S/)" sortable style="min-width: 12rem"/>
        <Column field="total_pagado" header="Total a pagar (S/)" sortable style="min-width: 12rem"/>
        <Column header="">
          <template #body="slotProps">
            <Button label="Ver cronograma" icon="pi pi-eye" size="small"
              :severity="form.plazo_id === slotProps.data.deadline_id ? 'primary' : 'secondary'"
              @click="selectPlazo(slotProps.data.deadline_id)" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Tabla de cuotas del cronograma -->
    <div v-else>
      <div class="flex justify-between items-center mb-3">
        <span class="text-lg font-semibold">Cronograma de pagos</span>
        <Button label="Cambiar plazo" icon="pi pi-arrow-left" severity="secondary" size="small"
          @click="volverASeleccion" />
      </div>

      <DataTable v-model:selection="selectedCuotas" :value="scheduleData.cronograma_final.pagos" dataKey="cuota"
        :paginator="true" :rows="rows" :totalRecords="totalRecords" :lazy="true" :first="(currentPage - 1) * rows"
        @page="onPage" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReportTemplate RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cuotas" responsiveLayout="scroll"
        class="p-datatable-sm" :loading="loading">
        <Column field="cuota" header="Cuota" sortable />
        <Column field="vcmto" header="Vencimiento" sortable />
        <Column field="saldo_inicial" header="Saldo Inicial" sortable />
        <Column field="capital" header="Capital" sortable />
        <Column field="interes" header="Interés" sortable />
        <Column field="cuota_neta" header="Cuota Neta" sortable />
        <Column field="igv" header="IGV" sortable />
        <Column field="total_cuota" header="Total Cuota" sortable />
        <Column field="saldo_final" header="Saldo Final" sortable />
      </DataTable>
    </div>
  </Dialog>
</template>
<script setup>
import { ref, watch, defineExpose } from 'vue'
import { simulationService } from '@/services/simulationService.js'

const visible = ref(false)
const propertyId = ref(null)

const form = ref({ plazo_id: null })
const scheduleDataPreview = ref([]) // Opciones de plazo
const scheduleData = ref(null) // Cronograma final con pagos
const selectedCuotas = ref([])
const rows = ref(10)
const currentPage = ref(1)
const totalRecords = ref(0)
const loading = ref(false)
const filters = ref({})

// Abrir el modal y cargar plazos
const open = async (id) => {
  propertyId.value = id
  visible.value = true
  scheduleData.value = null
  form.value.plazo_id = null
  currentPage.value = 1

  try {
    const response = await simulationService.getAvailableTerms(id)
    scheduleDataPreview.value = response.data.data.cuadro_amortizacion
  } catch (e) {
    console.error("Error obteniendo cuadro de amortización:", e)
  }
}

// Selección de plazo y generación de cronograma
const selectPlazo = (id) => {
  form.value.plazo_id = id
  currentPage.value = 1
  generateSchedule()
}

const generateSchedule = async () => {
  if (!form.value.plazo_id || !propertyId.value) return

  try {
    loading.value = true

    const payload = {
      property_id: propertyId.value,
      deadline_id: form.value.plazo_id
    }

    const response = await simulationService.generate(payload, {
      page: currentPage.value,
      per_page: rows.value
    })

    scheduleData.value = response.data.data
    totalRecords.value = response.data.data.cronograma_final.pagination.total
  } catch (e) {
    console.error("Error generando cronograma:", e)
  } finally {
    loading.value = false
  }
}

// Volver a vista de selección de plazo
const volverASeleccion = () => {
  scheduleData.value = null
  form.value.plazo_id = null
}

// Paginación
const onPage = (event) => {
  currentPage.value = (event.page ?? 0) + 1
  rows.value = event.rows
  generateSchedule()
}

defineExpose({ open })
</script>
