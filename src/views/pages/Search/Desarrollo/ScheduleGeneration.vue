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
                @click="confirmarInversion" />
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

    <!-- Dialog de confirmación de inversión -->
    <Dialog v-model:visible="showConfirmInvestment" modal header="Confirmar Inversión" 
      :style="{ width: '450px' }" :breakpoints="{ '960px': '75vw' }">
      <div class="flex align-items-center gap-3 mb-3">
        <i class="pi pi-exclamation-triangle text-3xl text-orange-500"></i>
        <span>¿Estás seguro que deseas invertir en esta propiedad?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" @click="showConfirmInvestment = false" 
          class="p-button-text" />
        <Button label="Sí" icon="pi pi-check" @click="confirmarSi" autofocus />
      </template>
    </Dialog>

    <!-- Dialog de método de pago -->
    <Dialog v-model:visible="showPaymentMethod" modal header="Método de Pago" 
      :style="{ width: '500px' }" :breakpoints="{ '960px': '75vw' }">
      <div class="mb-4">
        <p class="mb-3">¿Cómo quieres que se realice el cobro?</p>
        <div class="flex flex-column gap-3">
          <div class="flex align-items-center">
            <RadioButton v-model="paymentMethod" inputId="automatic" value="automatic" />
            <label for="automatic" class="ml-2">Automático desde tu cuenta</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton v-model="paymentMethod" inputId="deposit" value="deposit" />
            <label for="deposit" class="ml-2">Depositar y subir voucher en depósitos</label>
          </div>
          <div class="flex align-items-center">
            <RadioButton v-model="paymentMethod" inputId="guarantee" value="guarantee" />
            <label for="guarantee" class="ml-2">Selección cuenta de garantía</label>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="showPaymentMethod = false" 
          class="p-button-text" />
        <Button label="Continuar" icon="pi pi-check" @click="procesarMetodoPago" 
          :disabled="!paymentMethod" />
      </template>
    </Dialog>

    <!-- Dialog de cuenta de garantía -->
    <Dialog v-model:visible="showGuaranteeAccount" modal header="Cuenta de Garantía" 
      :style="{ width: '600px' }" :breakpoints="{ '960px': '75vw' }">
      <div class="mb-4">
        <h4 class="mb-3">Selecciona tu cuenta de garantía:</h4>
        
        <div class="grid">
          <div class="col-12 md:col-6 mb-3">
            <Card>
              <template #content>
                <div class="flex align-items-center gap-3">
                  <i class="pi pi-credit-card text-2xl text-blue-500"></i>
                  <div>
                    <h5 class="mb-1">Cuenta Principal</h5>
                    <p class="text-sm text-gray-600 mb-0">**** **** **** 1234</p>
                    <p class="text-sm text-gray-600 mb-0">Saldo: S/ 15,000.00</p>
                  </div>
                </div>
              </template>
            </Card>
          </div>
          
          <div class="col-12 md:col-6 mb-3">
            <Card>
              <template #content>
                <div class="flex align-items-center gap-3">
                  <i class="pi pi-wallet text-2xl text-green-500"></i>
                  <div>
                    <h5 class="mb-1">Cuenta de Ahorros</h5>
                    <p class="text-sm text-gray-600 mb-0">**** **** **** 5678</p>
                    <p class="text-sm text-gray-600 mb-0">Saldo: S/ 8,500.00</p>
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>

        <div class="mt-4">
          <label for="guaranteeAmount" class="block text-sm font-medium mb-2">
            Monto de garantía:
          </label>
          <InputNumber 
            v-model="guaranteeAmount" 
            inputId="guaranteeAmount"
            mode="currency" 
            currency="PEN" 
            locale="es-PE"
            :min="0"
            :max="50000"
            placeholder="Ingresa el monto"
            class="w-full"
          />
        </div>

        <div class="mt-4">
          <label for="guaranteeDescription" class="block text-sm font-medium mb-2">
            Descripción (opcional):
          </label>
          <Textarea 
            v-model="guaranteeDescription" 
            inputId="guaranteeDescription"
            rows="3" 
            placeholder="Ingresa una descripción para la garantía..."
            class="w-full"
          />
        </div>
      </div>
      
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" @click="showGuaranteeAccount = false" 
          class="p-button-text" />
        <Button label="Procesar Garantía" icon="pi pi-check" @click="procesarGarantia" 
          :disabled="!guaranteeAmount || guaranteeAmount <= 0" />
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
import RadioButton from 'primevue/radiobutton'
import Card from 'primevue/card'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'

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

// Variables para los diálogos de inversión
const showConfirmInvestment = ref(false)
const showPaymentMethod = ref(false)
const showGuaranteeAccount = ref(false)
const paymentMethod = ref(null)
const guaranteeAmount = ref(null)
const guaranteeDescription = ref('')

const { exportLoading, exportCronogramaToExcel } = useExport()

// Formateo de fechas a dd-mm-yyyy
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

// Función para mostrar el estado con color dinámico
const getEstadoSeverity = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'pendiente':
      return 'warning'
    case 'pagado':
      return 'success'
    case 'vencido':
      return 'danger'
    default:
      return 'info'
  }
}

// Abrir modal y cargar data
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

// Manejo de paginación
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

// Funciones para el flujo de inversión
const confirmarInversion = () => {
  showConfirmInvestment.value = true
}

const confirmarSi = () => {
  showConfirmInvestment.value = false
  showPaymentMethod.value = true
  paymentMethod.value = null
}

const procesarMetodoPago = () => {
  if (paymentMethod.value === 'guarantee') {
    showPaymentMethod.value = false
    showGuaranteeAccount.value = true
    guaranteeAmount.value = null
    guaranteeDescription.value = ''
  } else if (paymentMethod.value === 'automatic') {
    showPaymentMethod.value = false
    procesarPagoAutomatico()
  } else if (paymentMethod.value === 'deposit') {
    showPaymentMethod.value = false
    procesarDeposito()
  }
}

const procesarGarantia = () => {
  // Aquí implementarías la lógica para procesar la garantía
  console.log('Procesando garantía:', {
    amount: guaranteeAmount.value,
    description: guaranteeDescription.value,
    propertyId: propertyId.value
  })
  
  toast.add({
    severity: 'success',
    summary: 'Garantía Procesada',
    detail: `Se ha procesado la garantía por S/ ${guaranteeAmount.value?.toFixed(2)}`,
    life: 5000
  })
  
  showGuaranteeAccount.value = false
  resetInvestmentFlow()
}

const procesarPagoAutomatico = () => {
  // Aquí implementarías la lógica para pago automático
  console.log('Procesando pago automático para propiedad:', propertyId.value)
  
  toast.add({
    severity: 'success',
    summary: 'Pago Automático Configurado',
    detail: 'Se ha configurado el pago automático desde tu cuenta',
    life: 5000
  })
  
  resetInvestmentFlow()
}

const procesarDeposito = () => {
  // Aquí implementarías la lógica para depósito manual
  console.log('Procesando depósito manual para propiedad:', propertyId.value)
  
  toast.add({
    severity: 'info',
    summary: 'Depósito Manual',
    detail: 'Redirigiendo a la sección de depósitos para subir tu voucher',
    life: 5000
  })
  
  resetInvestmentFlow()
}

const resetInvestmentFlow = () => {
  paymentMethod.value = null
  guaranteeAmount.value = null
  guaranteeDescription.value = ''
}

// Botón: invertir orden (función original)
const invertirOrden = () => {
  if (scheduleData.value && scheduleData.value.length > 0) {
    scheduleData.value = [...scheduleData.value].reverse()
  }
}

// Botón: exportar a Excel
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

// Botón: exportar a PDF (placeholder)
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