<template>
  <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" modal header="Cronograma de Pagos"
    :style="{ width: '95vw', maxWidth: '1400px' }" class="payment-schedule-dialog">
    <!-- Resumen de cuotas -->
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

    <!-- Tabla o loading -->
    <div v-if="loading" class="text-center py-12">
      <ProgressSpinner />
      <p class="mt-4 text-gray-600">Cargando cronograma...</p>
    </div>

    <DataTable v-else :value="cronograma" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20, 50]"
      responsiveLayout="scroll" stripedRows  :globalFilterFields="['cuota', 'estado']"
      class="p-datatable-sm">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Detalle de Cuotas</h3>
          <div class="flex gap-2">
            <Button icon="pi pi-refresh" label="Actualizar" size="small" severity="contrast" rounde variant="outlined"
              @click="refreshData" />
          </div>
        </div>
      </template>

      <!-- Columnas -->
      <Column field="cuota" header="N°" sortable>
        <template #body="{ data }">
          <div class="flex justify-center">
            <Badge :value="data.cuota" class="bg-blue-100 text-blue-800"/>
          </div>
        </template>
      </Column>

      <Column field="vencimiento" header="Vencimiento" sortable>
        <template #body="{ data }">
          <div class="flex gap-2 items-center">
            <i class="pi pi-calendar text-gray-500"></i>
            <span class="font-medium">{{ formatDate(data.vencimiento) }}</span>
          </div>
        </template>
      </Column>

      <Column field="capital" header="Capital" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono text-blue-700">{{ formatCurrency(data.capital) }}</span>
        </template>
      </Column>

      <Column field="intereses" header="Intereses" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono text-orange-700">{{ formatCurrency(data.intereses) }}</span>
        </template>
      </Column>

      <Column field="cuota_neta" header="Cuota Neta" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono">{{ formatCurrency(data.cuota_neta) }}</span>
        </template>
      </Column>

      <Column field="igv" header="IGV" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono text-gray-600">{{ formatCurrency(data.igv) }}</span>
        </template>
      </Column>

      <Column field="total_cuota" header="Total Cuota" sortable class="text-right">
        <template #body="{ data }">
          <div class="font-bold text-green-700 bg-green-50 px-3 py-1 rounded">
            {{ formatCurrency(data.total_cuota) }}
          </div>
        </template>
      </Column>

      <Column field="saldo_final" header="Saldo Final" sortable class="text-right">
        <template #body="{ data }">
          <span class="font-mono">{{ formatCurrency(data.saldo_final) }}</span>
        </template>
      </Column>

      <Column header="Estado" class="text-center">
        <template #body="{ data }">
          <Tag :value="data.estado" :severity="getTagSeverity(data.estado)" class="capitalize" />
        </template>
      </Column>

      <Column header="" >
        <template #body="{ data }">
          <div class="flex gap-2 justify-center">
            <Button v-if="['pendiente', 'vencido'].includes(data.estado)" icon="pi pi-credit-card" label="Pagar"
              size="small" severity="contrast" rounded @click="openPaymentDialog(data)" />
            <Button v-if="data.estado === 'pagado'" icon="pi pi-file-pdf" class="p-button-outlined p-button-sm"
              @click="downloadReceipt(data)" />
          </div>
        </template>
      </Column>
    </DataTable>

    <!-- Componente de Pago -->
    <Pagos v-model:visible="paymentDialogVisible" :payment="selectedPayment" @payment-success="onPaymentSuccess" />
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
import Pagos from './Pagos.vue'
import { paymentScheduleService } from '@/services/paymentScheduleService'
import { useToast } from 'primevue/usetoast'

const props = defineProps({ propertyId: Number, visible: Boolean })
const emit = defineEmits(['update:visible'])

const toast = useToast()
const cronograma = ref([])
const loading = ref(false)

const selectedPayment = ref(null)
const paymentDialogVisible = ref(false)

const totalCuotas = computed(() => cronograma.value.length)
const cuotasPagadas = computed(() => cronograma.value.filter(c => c.estado === 'pagado').length)
const cuotasPendientes = computed(() => cronograma.value.filter(c => c.estado === 'pendiente').length)
const cuotasVencidas = computed(() => cronograma.value.filter(c => c.estado === 'vencido').length)

watch(() => props.visible, async (val) => {
  if (val && props.propertyId) await loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const res = await paymentScheduleService.getByPropertyId(props.propertyId)
    cronograma.value = res.data.data
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el cronograma', life: 5000 })
  } finally {
    loading.value = false
  }
}

const refreshData = async () => {
  await loadData()
  toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Cronograma actualizado', life: 3000 })
}

const getTagSeverity = (estado) => {
  return { pendiente: 'info', pagado: 'success', vencido: 'danger' }[estado] || 'warning'
}

const formatDate = (date) => new Date(date).toLocaleDateString('es-PE')
const formatCurrency = (amount) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)

const openPaymentDialog = (payment) => {
  selectedPayment.value = payment
  paymentDialogVisible.value = true
}

const onPaymentSuccess = (id) => {
  const i = cronograma.value.findIndex(c => c.id === id)
  if (i !== -1) cronograma.value[i].estado = 'pagado'
}

const downloadReceipt = (payment) => {
  toast.add({ severity: 'info', summary: 'Descargando', detail: 'Recibo en proceso...', life: 3000 })
}
</script>
