<template>
  <Dialog v-model:visible="visible" maximizable modal header="Cronograma de Pagos" :style="{ width: '79rem' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">

    <div v-if="scheduleData && scheduleData.length > 0">
      <DataTable v-model:selection="selectedCuotas" :value="formattedScheduleData" dataKey="id" :paginator="true"
        :rows="rows" :totalRecords="totalRecords" :lazy="true" :first="(currentPage - 1) * rows" @page="onPage"
        :filters="filters"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReportTemplate RowsPerPageDropdown"
        :rowsPerPageOptions="[5, 10, 25]" responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} cuotas" class="p-datatable-sm"
        :loading="loading" selectionMode="multiple">

        <!-- Encabezado con botones -->
        <template #header>
          <div class="flex justify-between items-center mb-3">
            <span class="text-lg font-semibold">Cronograma detallado de pagos</span>
            <div class="flex gap-2">
              <Button label="Exportar a Excel" icon="pi pi-file-excel" severity="success" rounded
                @click="handleExportToExcel" :loading="exportLoading" />

              <Button label="Exportar a PDF" icon="pi pi-file-pdf" severity="danger" rounded
                @click="handleExportToPDF" />

              <Button label="Invertir" severity="contrast" variant="outlined" rounded
                @click="mostrarMensajeInversion" />
            </div>
          </div>
        </template>

        <!-- Columnas -->
        <Column selectionMode="multiple" style="width: 3rem" :exportable="false" />
        <Column field="cuota" header="Cuota" sortable style="width: 3rem" />
        <Column field="vencimiento" header="Vencimiento" sortable style="width: 5rem" />
        <Column field="saldo_inicial" header="Saldo Inicial" sortable style="width: 10rem" />
        <Column field="capital" header="Capital" sortable style="width: 8rem" />
        <Column field="intereses" header="Interés" sortable style="width: 8rem" />
        <Column field="cuota_neta" header="Cuota Neta" sortable style="width: 10rem" />
        <Column field="total_cuota" header="Total Cuota" sortable style="width: 10rem" />
        <Column field="saldo_final" header="Saldo Final" sortable style="width: 13rem" />

        <!-- Columna Estado con tag -->
        <Column field="estado" header="Estado" sortable style="width: 8rem">
          <template #body="slotProps">
            <Tag :value="slotProps.data.estado" :severity="getEstadoSeverity(slotProps.data.estado)"
              class="uppercase font-semibold text-xs" />
          </template>
        </Column>

      </DataTable>
    </div>

    <!-- Dialog de información de inversión -->
    <Dialog v-model:visible="showInvestmentInfo" modal header="Información de Inversión" :style="{ width: '450px' }"
      :breakpoints="{ '960px': '75vw' }">
      <div class="flex flex-column gap-4">
        <div class="flex align-items-center gap-3 mb-3">
          <i class="pi pi-clock text-3xl text-orange-500"></i>
          <div>
            <h4 class="mb-2 text-orange-600">Plazo de 24 horas</h4>
            <p class="text-gray-700 mb-0">
              Tienes un plazo de 24 horas para realizar el pago. Si no se completa el pago en este tiempo,
              la propiedad pasará a estado activo.
            </p>
          </div>
        </div>

        <div class="border-top-1 border-gray-200 pt-4">
          <div class="flex align-items-center gap-3">
            <i class="pi pi-whatsapp text-2xl text-green-500"></i>
            <div>
              <h5 class="mb-1">¿Tienes alguna duda?</h5>
              <p class="text-gray-600 mb-2">
                Si tienes alguna pregunta sobre el trámite, puedes consultar al número de WhatsApp:
              </p>
              <div class="flex align-items-center gap-2">
                <span class="font-semibold text-green-600">+51 999 123 456</span>
                <Button icon="pi pi-whatsapp" size="small" severity="success" rounded @click="abrirWhatsApp"
                  v-tooltip="'Abrir WhatsApp'" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Entendido" icon="pi pi-check" severity="contrast" rounded @click="showInvestmentInfo = false"
          autofocus />
      </template>
    </Dialog>
    <Dialog v-model:visible="showInvestmentInfo" modal header="Información de Inversión" :style="{ width: '450px' }"
      :breakpoints="{ '960px': '75vw' }">

      <div class="flex flex-col gap-6">
        <!-- Sección 1: Información de plazo -->
        <div>
          <h4 class="mb-2 text-orange-600">Plazo de 24 horas</h4>
          <p class="text-gray-700 mb-0">
            Tienes un plazo de 24 horas para realizar el pago. Si no se completa el pago en este tiempo,
            la propiedad pasará a estado activo.
          </p>
        </div>

        <!-- Sección 2: WhatsApp -->
        <div>
          <h5 class="mb-1">¿Tienes alguna duda?</h5>
          <p class="text-gray-600 mb-2">
            Si tienes alguna pregunta sobre el trámite, puedes consultar al número de WhatsApp:
          </p>
          <div class="flex justify-end align-items-center gap-2">
            <span class="font-semibold text-green-600">+51 999 123 456</span>
            <Button icon="pi pi-whatsapp" size="small" severity="success" rounded @click="abrirWhatsApp"
              v-tooltip="'Abrir WhatsApp'" />
          </div>
        </div>
      </div>

      <!-- Footer del diálogo -->
      <template #footer>
        <Button label="Entendido" icon="pi pi-check" severity="contrast" rounded @click="showInvestmentInfo = false"
          autofocus />
      </template>
    </Dialog>



  </Dialog>
</template>

<script setup>
import { ref, computed, defineExpose } from 'vue'
import { simulationService } from '@/services/simulationService.js'
import { useExport } from '@/composables/useExport.js'
import { useToast } from 'primevue/usetoast'
import Tag from 'primevue/tag'

const toast = useToast()
const visible = ref(false)
const propertyId = ref(null)

const scheduleData = ref(null)
const selectedCuotas = ref([])
const rows = ref(10)
const currentPage = ref(1)
const totalRecords = ref(0)
const loading = ref(false)
const filters = ref({})

const showInvestmentInfo = ref(false)

const { exportLoading, exportCronogramaToExcel } = useExport()

const formattedScheduleData = computed(() => {
  return scheduleData.value?.map(item => ({
    ...item,
    vencimiento: new Date(item.vencimiento).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  })) || []
})

const getEstadoSeverity = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'pendiente':
      return 'warn'
    case 'pagado':
      return 'success'
    case 'vencido':
      return 'danger'
    default:
      return 'info'
  }
}

const open = async (id) => {
  propertyId.value = id
  visible.value = true
  scheduleData.value = null
  currentPage.value = 1

  try {
    const response = await simulationService.getSchedules(id)
    const responseData = response.data

    if (responseData.data && Array.isArray(responseData.data) && responseData.data.length > 0) {
      scheduleData.value = responseData.data
      totalRecords.value = responseData.total
      currentPage.value = responseData.current_page
      rows.value = responseData.per_page
    }
  } catch (e) {
    console.error("Error obteniendo cronograma:", e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la información del cronograma',
      life: 3000
    })
  }
}

const onPage = async (event) => {
  currentPage.value = (event.page ?? 0) + 1
  rows.value = event.rows

  try {
    loading.value = true

    const response = await simulationService.getSchedules(propertyId.value, {
      page: currentPage.value,
      per_page: rows.value
    })

    const responseData = response.data
    scheduleData.value = responseData.data
    totalRecords.value = responseData.total
  } catch (e) {
    console.error("Error en paginación:", e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar la página',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const mostrarMensajeInversion = () => {
  showInvestmentInfo.value = true
}

const abrirWhatsApp = () => {
  const phoneNumber = '51999123456' 
  const message = 'Hola, tengo una consulta sobre el trámite de inversión en una propiedad.'
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank')
}

const handleExportToExcel = async () => {
  if (!scheduleData.value) return

  try {
    exportLoading.value = true

    const response = await simulationService.getSchedules(propertyId.value, {
      page: 1,
      per_page: totalRecords.value
    })

    const allData = response.data.data
    const result = await exportCronogramaToExcel(allData)

    if (result.success) {
      toast.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Cronograma exportado correctamente',
        life: 3000
      })
    } else {
      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo exportar el cronograma',
        life: 3000
      })
    }

  } catch (e) {
    console.error("Error exportando:", e)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Error al exportar el cronograma',
      life: 3000
    })
  } finally {
    exportLoading.value = false
  }
}

const handleExportToPDF = () => {
  toast.add({
    severity: 'info',
    summary: 'PDF',
    detail: 'Función de exportar a PDF pendiente de implementar',
    life: 3000
  })
}

defineExpose({ open })
</script>