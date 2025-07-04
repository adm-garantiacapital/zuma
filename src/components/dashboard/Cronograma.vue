<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    header="Cronograma de Pagos"
    :style="{ width: '95vw', maxWidth: '1400px' }"
    class="payment-schedule-dialog"
  >
    <!-- Header con información resumida -->
    <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ totalCuotas }}</div>
          <div class="text-sm text-gray-600">Total Cuotas</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ cuotasPagadas }}</div>
          <div class="text-sm text-gray-600">Pagadas</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ cuotasPendientes }}</div>
          <div class="text-sm text-gray-600">Pendientes</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-red-600">{{ cuotasVencidas }}</div>
          <div class="text-sm text-gray-600">Vencidas</div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <ProgressSpinner />
      <p class="mt-4 text-gray-600">Cargando cronograma...</p>
    </div>

    <DataTable
      v-else
      :value="cronograma"
      :paginator="true"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll"
      stripedRows
      showGridlines
      :globalFilterFields="['cuota', 'estado']"
      class="payment-schedule-table"
    >
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Detalle de Cuotas</h3>
          <div class="flex gap-2">
            <Button
              icon="pi pi-download"
              label="Exportar"
              class="p-button-outlined p-button-sm"
              @click="exportToPDF"
            />
            <Button
              icon="pi pi-refresh"
              label="Actualizar"
              class="p-button-outlined p-button-sm"
              @click="refreshData"
            />
          </div>
        </div>
      </template>

      <Column field="cuota" header="N°" sortable class="text-center font-medium">
        <template #body="{ data }">
          <div class="flex items-center justify-center">
            <Badge :value="data.cuota" class="bg-blue-100 text-blue-800" />
          </div>
        </template>
      </Column>

      <Column field="vencimiento" header="Vencimiento" sortable>
        <template #body="{ data }">
          <div class="flex items-center gap-2">
            <i class="pi pi-calendar text-gray-500"></i>
            <span class="font-medium">{{ formatDate(data.vencimiento) }}</span>
          </div>
        </template>
      </Column>

      <Column field="saldo_inicial" header="Saldo Inicial" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono text-gray-700">{{ formatCurrency(data.saldo_inicial) }}</span>
        </template>
      </Column>

      <Column field="capital" header="Capital" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono font-semibold text-blue-700">{{ formatCurrency(data.capital) }}</span>
        </template>
      </Column>

      <Column field="intereses" header="Intereses" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono text-orange-700">{{ formatCurrency(data.intereses) }}</span>
        </template>
      </Column>

      <Column field="cuota_neta" header="Cuota Neta" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono text-gray-700">{{ formatCurrency(data.cuota_neta) }}</span>
        </template>
      </Column>

      <Column field="igv" header="IGV" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono text-gray-600">{{ formatCurrency(data.igv) }}</span>
        </template>
      </Column>

      <Column field="total_cuota" header="Total Cuota" sortable class="text-right">
        <template #body="{ data }">
          <div class="font-mono font-bold text-lg text-green-700 bg-green-50 px-3 py-1 rounded">
            {{ formatCurrency(data.total_cuota) }}
          </div>
        </template>
      </Column>

      <Column field="saldo_final" header="Saldo Final" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono text-gray-700">{{ formatCurrency(data.saldo_final) }}</span>
        </template>
      </Column>

      <Column header="Estado" class="text-center">
        <template #body="{ data }">
          <Tag
            :value="data.estado"
            :severity="getTagSeverity(data.estado)"
            class="capitalize font-medium"
          />
        </template>
      </Column>

      <Column header="Acciones" class="text-center" :style="{ width: '150px' }">
        <template #body="{ data }">
          <div class="flex gap-2 justify-center">
            <Button
              v-if="data.estado === 'pendiente' || data.estado === 'vencido'"
              icon="pi pi-credit-card"
              label="Pagar"
              class="p-button-success p-button-sm"
              @click="openPaymentDialog(data)"
            />
            <Button
              v-if="data.estado === 'pagado'"
              icon="pi pi-file-pdf"
              class="p-button-outlined p-button-sm"
              @click="downloadReceipt(data)"
              v-tooltip="'Descargar Recibo'"
            />
            <Button
              icon="pi pi-eye"
              class="p-button-outlined p-button-sm"
              @click="viewDetails(data)"
              v-tooltip="'Ver Detalles'"
            />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Dialog de Pago -->
    <Dialog
      v-model:visible="paymentDialogVisible"
      modal
      header="Procesar Pago"
      :style="{ width: '500px' }"
      class="payment-dialog"
    >
      <div v-if="selectedPayment" class="space-y-6">
        <!-- Información de la cuota -->
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-semibold text-gray-800 mb-3">Información de la Cuota</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Cuota N°:</span>
              <span class="font-semibold ml-2">{{ selectedPayment.cuota }}</span>
            </div>
            <div>
              <span class="text-gray-600">Vencimiento:</span>
              <span class="font-semibold ml-2">{{ formatDate(selectedPayment.vencimiento) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Capital:</span>
              <span class="font-semibold ml-2">{{ formatCurrency(selectedPayment.capital) }}</span>
            </div>
            <div>
              <span class="text-gray-600">Intereses:</span>
              <span class="font-semibold ml-2">{{ formatCurrency(selectedPayment.intereses) }}</span>
            </div>
            <div>
              <span class="text-gray-600">IGV:</span>
              <span class="font-semibold ml-2">{{ formatCurrency(selectedPayment.igv) }}</span>
            </div>
            <div class="col-span-2 pt-2 border-t">
              <span class="text-gray-600">Total a Pagar:</span>
              <span class="font-bold text-lg text-green-600 ml-2">
                {{ formatCurrency(selectedPayment.total_cuota) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Método de pago -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Método de Pago
          </label>
          <Dropdown
            v-model="paymentMethod"
            :options="paymentMethods"
            optionLabel="label"
            optionValue="value"
            placeholder="Seleccione método de pago"
            class="w-full"
          />
        </div>

        <!-- Información adicional según método -->
        <div v-if="paymentMethod === 'transferencia'" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Número de Operación
            </label>
            <InputText
              v-model="operationNumber"
              placeholder="Ingrese número de operación"
              class="w-full"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Operación
            </label>
            <Calendar
              v-model="operationDate"
              placeholder="Seleccione fecha"
              class="w-full"
            />
          </div>
        </div>

        <!-- Observaciones -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Observaciones (Opcional)
          </label>
          <Textarea
            v-model="paymentObservations"
            rows="3"
            placeholder="Ingrese observaciones adicionales"
            class="w-full"
          />
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            class="p-button-text"
            @click="paymentDialogVisible = false"
          />
          <Button
            label="Procesar Pago"
            icon="pi pi-check"
            class="p-button-success"
            @click="processPayment"
            :loading="processingPayment"
          />
        </div>
      </template>
    </Dialog>
  </Dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import ProgressSpinner from 'primevue/progressspinner'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import { paymentScheduleService } from '@/services/paymentScheduleService'
import { useToast } from 'primevue/usetoast'

const props = defineProps({
  propertyId: Number,
  visible: Boolean
})

const emit = defineEmits(['update:visible'])
const toast = useToast()

const cronograma = ref([])
const loading = ref(false)
const paymentDialogVisible = ref(false)
const selectedPayment = ref(null)
const processingPayment = ref(false)

// Datos del formulario de pago
const paymentMethod = ref('')
const operationNumber = ref('')
const operationDate = ref(null)
const paymentObservations = ref('')

// Opciones de método de pago
const paymentMethods = ref([
  { label: 'Transferencia Bancaria', value: 'transferencia' },
  { label: 'Depósito Bancario', value: 'deposito' },
  { label: 'Efectivo', value: 'efectivo' },
  { label: 'Tarjeta de Crédito', value: 'tarjeta' }
])

// Computed para estadísticas
const totalCuotas = computed(() => cronograma.value.length)
const cuotasPagadas = computed(() => cronograma.value.filter(c => c.estado === 'pagado').length)
const cuotasPendientes = computed(() => cronograma.value.filter(c => c.estado === 'pendiente').length)
const cuotasVencidas = computed(() => cronograma.value.filter(c => c.estado === 'vencido').length)

// Cargar datos cuando se abre
watch(() => props.visible, async (val) => {
  if (val && props.propertyId) {
    await loadData()
  }
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await paymentScheduleService.getByPropertyId(props.propertyId)
    cronograma.value = res.data.data
  } catch (error) {
    console.error('Error al cargar cronograma:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo cargar el cronograma de pagos',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await loadData()
  toast.add({
    severity: 'success',
    summary: 'Actualizado',
    detail: 'Cronograma actualizado correctamente',
    life: 3000
  })
}

// Tag de color según estado
const getTagSeverity = (estado) => {
  switch (estado) {
    case 'pendiente':
      return 'info'
    case 'pagado':
      return 'success'
    case 'vencido':
      return 'danger'
    default:
      return 'warning'
  }
}

// Formatear fecha
const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Formatear moneda
const formatCurrency = (amount) => {
  if (!amount) return 'S/ 0.00'
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2
  }).format(amount)
}

// Abrir dialog de pago
const openPaymentDialog = (payment) => {
  selectedPayment.value = payment
  paymentDialogVisible.value = true
  // Resetear formulario
  paymentMethod.value = ''
  operationNumber.value = ''
  operationDate.value = null
  paymentObservations.value = ''
}

// Procesar pago
const processPayment = async () => {
  if (!paymentMethod.value) {
    toast.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Debe seleccionar un método de pago',
      life: 3000
    })
    return
  }

  if (paymentMethod.value === 'transferencia' && !operationNumber.value) {
    toast.add({
      severity: 'warn',
      summary: 'Advertencia',
      detail: 'Debe ingresar el número de operación',
      life: 3000
    })
    return
  }

  processingPayment.value = true

  try {
    const paymentData = {
      cuota_id: selectedPayment.value.id,
      metodo_pago: paymentMethod.value,
      numero_operacion: operationNumber.value,
      fecha_operacion: operationDate.value,
      observaciones: paymentObservations.value,
      monto: selectedPayment.value.total_cuota
    }

    // Aquí llamarías a tu servicio para procesar el pago
    // await paymentService.processPayment(paymentData)

    // Actualizar el estado en el cronograma
    const index = cronograma.value.findIndex(c => c.id === selectedPayment.value.id)
    if (index !== -1) {
      cronograma.value[index].estado = 'pagado'
    }

    toast.add({
      severity: 'success',
      summary: 'Pago Procesado',
      detail: 'El pago se ha procesado correctamente',
      life: 5000
    })

    paymentDialogVisible.value = false
  } catch (error) {
    console.error('Error al procesar pago:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo procesar el pago',
      life: 5000
    })
  } finally {
    processingPayment.value = false
  }
}

// Descargar recibo
const downloadReceipt = (payment) => {
  // Implementar descarga de recibo
  toast.add({
    severity: 'info',
    summary: 'Descargando',
    detail: 'Preparando recibo de pago...',
    life: 3000
  })
}

// Ver detalles
const viewDetails = (payment) => {
  // Implementar vista de detalles
  toast.add({
    severity: 'info',
    summary: 'Detalles',
    detail: `Mostrando detalles de la cuota ${payment.cuota}`,
    life: 3000
  })
}

// Exportar a PDF
const exportToPDF = () => {
  // Implementar exportación a PDF
  toast.add({
    severity: 'info',
    summary: 'Exportando',
    detail: 'Preparando documento PDF...',
    life: 3000
  })
}
</script>

<style scoped>
</style>