<template>
  <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" modal header="Cronograma de Pagos"
    :style="{ width: '95vw', maxWidth: '1400px' }" class="payment-schedule-dialog">
    
    <!-- Resumen de cuotas -->
    <div class="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>
    </div>
    <!-- Tabla o loading -->
    <div v-if="loading" class="text-center py-12">
      <ProgressSpinner />
      <p class="mt-4 text-gray-600">Cargando cronograma...</p>
    </div>

    <DataTable v-else :value="cronograma" 
      :lazy="true"
      :paginator="true" 
      :rows="paginationMeta.per_page"
      :totalRecords="paginationMeta.total"
      :first="(paginationMeta.current_page - 1) * paginationMeta.per_page"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      @page="onPageChange"
      responsiveLayout="scroll" 
      stripedRows  
      :globalFilterFields="['cuota', 'estado']"
      class="p-datatable-sm">
      
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="text-lg font-semibold text-gray-800">Detalle de Cuotas</h3>
          <div class="flex gap-2">
            <Button icon="pi pi-refresh" label="Actualizar" size="small" severity="contrast" rounded variant="outlined"
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
            <span class="font-medium">{{ data.vencimiento }}</span>
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

const props = defineProps({ 
  propertyId: Number, 
  propertyInvestorId: Number, 
  visible: Boolean 
})
const emit = defineEmits(['update:visible'])

const toast = useToast()
const cronograma = ref([])
const loading = ref(false)

// Estados para paginación
const paginationMeta = ref({
  current_page: 1,
  per_page: 10,
  total: 0,
  last_page: 1,
  from: 0,
  to: 0
})

// Estados para el resumen (necesitas cargar todos los datos o tener un endpoint separado)
const summaryData = ref({
  totalCuotas: 0,
  cuotasPagadas: 0,
  cuotasPendientes: 0,
  cuotasVencidas: 0
})

const selectedPayment = ref(null)
const paymentDialogVisible = ref(false)

// Computed para el resumen (usando los datos del resumen o calculados)
const totalCuotas = computed(() => summaryData.value.totalCuotas || paginationMeta.value.total || 0)
const cuotasPagadas = computed(() => summaryData.value.cuotasPagadas || 0)
const cuotasPendientes = computed(() => summaryData.value.cuotasPendientes || 0)
const cuotasVencidas = computed(() => summaryData.value.cuotasVencidas || 0)

watch(() => props.visible, async (val) => {
  if (val && (props.propertyId || props.id)) {
    await loadData()
    await loadSummary() // Cargar resumen por separado
  }
})

const loadData = async (page = 1, perPage = 10) => {
  loading.value = true
  try {
    let res
    if (props.propertyId) {
      res = await paymentScheduleService.getByPropertyId(props.propertyId, {
        page,
        per_page: perPage
      })
    } else if (props.id) {
      res = await paymentScheduleService.getByPropertyInvestorId(props.id, {
        page,
        per_page: perPage
      })
    }
    
    cronograma.value = res.data.data
    
    // Actualizar metadatos de paginación
    paginationMeta.value = {
      current_page: res.data.meta.current_page,
      per_page: res.data.meta.per_page,
      total: res.data.meta.total,
      last_page: res.data.meta.last_page,
      from: res.data.meta.from,
      to: res.data.meta.to
    }
    
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar el cronograma', life: 5000 })
  } finally {
    loading.value = false
  }
}

// Función para cargar el resumen (puedes crear un endpoint separado para esto)
const loadSummary = async () => {
  try {
    // Opción 1: Endpoint específico para resumen (recomendado)
    let res
    
    if (res && res.data) {
      summaryData.value = res.data
      return
    }
    
    // Opción 2: Fallback - cargar todos los datos para calcular el resumen
    // Solo usa esto si no tienes el endpoint de resumen
    if (props.propertyId) {
      res = await paymentScheduleService.getAll(props.propertyId)
    } else if (props.propertyInvestorId) {
      res = await paymentScheduleService.getAll(props.propertyInvestorId)
    }
    
    const allData = res.data.data || res.data
    summaryData.value = {
      totalCuotas: allData.length,
      cuotasPagadas: allData.filter(c => c.estado === 'pagado').length,
      cuotasPendientes: allData.filter(c => c.estado === 'pendiente').length,
      cuotasVencidas: allData.filter(c => c.estado === 'vencido').length
    }
    
  } catch (error) {
    console.error('Error loading summary:', error)
    // Si falla, usar solo el total de paginación para total de cuotas
    summaryData.value = {
      totalCuotas: paginationMeta.value.total || 0,
      cuotasPagadas: 0,
      cuotasPendientes: 0,
      cuotasVencidas: 0
    }
  }
}

const onPageChange = (event) => {
  const page = event.page + 1 // PrimeVue usa índice 0, pero tu API usa 1
  const perPage = event.rows
  loadData(page, perPage)
}

const refreshData = async () => {
  await loadData(paginationMeta.value.current_page, paginationMeta.value.per_page)
  await loadSummary()
  toast.add({ severity: 'success', summary: 'Actualizado', detail: 'Cronograma actualizado', life: 3000 })
}

const getTagSeverity = (estado) => {
  return { pendiente: 'info', pagado: 'success', vencido: 'danger' }[estado] || 'warning'
}

const formatDate = (date) => new Date(date).toLocaleDateString('es-PE')
const formatCurrency = (amount) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)

const onPaymentSuccess = (id) => {
  const i = cronograma.value.findIndex(c => c.id === id)
  if (i !== -1) cronograma.value[i].estado = 'pagado'
  // Actualizar el resumen también
  loadSummary()
}

</script>