<template>
  <Dialog v-model:visible="visible" maximizable modal header="Cronograma final de pagos"
    :style="{ width: '70rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

    <!-- Botones de selección de plazo -->
    <div class="mb-4">
      <label class="block font-semibold mb-2">Selecciona un plazo:</label>
      <div class="flex flex-wrap gap-3">
        <Button
          v-for="plazo in scheduleDataPreview"
          :key="plazo.deadline_id"
          :label="`${plazo.plazo_meses} meses - S/ ${plazo.cuota_mensual}`"
          :outlined="form.plazo_id !== plazo.deadline_id"
          :severity="form.plazo_id === plazo.deadline_id ? 'primary' : 'secondary'"
          @click="selectPlazo(plazo.deadline_id)"
          class="w-full md:w-auto"
        />
      </div>
    </div>

    <!-- Tabla de cuotas -->
    <div v-if="scheduleData">
      <DataTable v-model:selection="selectedCuotas" :value="scheduleData.cronograma_final.pagos" dataKey="cuota"
        :paginator="true" :rows="rows" :totalRecords="totalRecords" :lazy="true"
        :first="(currentPage - 1) * rows" @page="onPage" :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReportTemplate RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cuotas"
        responsiveLayout="scroll" class="p-datatable-sm" :loading="loading">

        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold">Cronograma de pagos</span>
          </div>
        </template>

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

const scheduleDataPreview = ref([]) // Cuadro de amortización (opciones de plazo)
const scheduleData = ref(null) // Resultado completo con pagos
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

// Seleccionar un plazo (cuando se hace clic en un botón)
const selectPlazo = (id) => {
  form.value.plazo_id = id
}

// Observar el cambio de plazo seleccionado
watch(() => form.value.plazo_id, () => {
  if (form.value.plazo_id) {
    currentPage.value = 1
    generateSchedule()
  }
})

// Llamar API para generar cronograma
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

// Paginación
const onPage = (event) => {
  currentPage.value = (event.page ?? 0) + 1
  rows.value = event.rows
  generateSchedule()
}

defineExpose({ open })
</script>