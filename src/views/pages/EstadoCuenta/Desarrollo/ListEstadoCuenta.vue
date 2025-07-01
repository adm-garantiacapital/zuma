<template>
  <div class="mt-6">
    <!-- Saldo disponible -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-6 border border-blue-100">
      <div class="flex justify-between items-center">
        <div>
          <h6 class="text-sm font-medium text-gray-600 mb-1">Saldo disponible</h6>
          <p class="text-2xl font-bold text-blue-600">
            {{ currentCurrency }} {{ formatAmount(availableBalance) }}
          </p>
        </div>
        <div class="text-blue-500">
          <i class="pi pi-wallet text-2xl"></i>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center items-center py-8">
      <ProgressSpinner />
    </div>

    <!-- Tabla de movimientos -->
    <div v-else class="bg-white rounded-lg shadow-sm border overflow-hidden">
      <DataTable 
        :value="movements" 
        :paginator="pagination.total > pagination.per_page"
        :rows="pagination.per_page"
        :totalRecords="pagination.total"
        :lazy="true"
        @page="onPageChange"
        stripedRows
        responsiveLayout="scroll"
        :emptyMessage="`No hay movimientos en ${currentCurrency}`"
        class="p-datatable-sm"
      >
        <!-- Fecha de solicitud -->
        <Column field="created_at" header="Fecha de solicitud" style="min-width: 140px">
          <template #body="slotProps">
            <div class="text-sm">
              <div class="font-medium text-gray-800">
                {{ formatDate(slotProps.data.created_at).date }}
              </div>
              <div class="text-gray-500 text-xs">
                {{ formatDate(slotProps.data.created_at).time }}
              </div>
            </div>
          </template>
        </Column>

        <!-- Movimiento -->
        <Column field="type" header="Movimiento" style="min-width: 150px">
          <template #body="slotProps">
            <div class="flex items-center gap-2">
              <!-- Icono con dirección -->
              <div 
                :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                  getMovementStyle(slotProps.data.type).bgClass
                ]"
              >
                <i :class="getMovementStyle(slotProps.data.type).iconClass"></i>
              </div>
              
              <!-- Tipo de movimiento -->
              <div>
                <div class="font-medium text-sm text-gray-800">
                  {{ getMovementLabel(slotProps.data.type) }}
                </div>
                <div v-if="slotProps.data.description" class="text-xs text-gray-500 truncate max-w-32">
                  {{ slotProps.data.description }}
                </div>
              </div>
            </div>
          </template>
        </Column>

        <!-- Monto -->
        <Column field="amount" header="Monto" style="min-width: 120px" class="text-right">
          <template #body="slotProps">
            <div class="text-right">
              <div 
                :class="[
                  'font-bold text-sm',
                  getAmountColor(slotProps.data.type)
                ]"
              >
                {{ getAmountPrefix(slotProps.data.type) }}{{ currentCurrency }} {{ formatAmount(slotProps.data.amount) }}
              </div>
            </div>
          </template>
        </Column>

        <!-- Estado -->
        <Column field="status" header="Estado" style="min-width: 100px">
          <template #body="slotProps">
            <div class="flex flex-col gap-1">
              <!-- Estado principal -->
              <Badge 
                :value="getStatusLabel(slotProps.data.status)" 
                :severity="getStatusSeverity(slotProps.data.status)"
                class="text-xs"
              />
              
              <!-- Estado de confirmación si es diferente -->
              <Badge 
                v-if="slotProps.data.confirm_status && slotProps.data.confirm_status !== slotProps.data.status"
                :value="getConfirmStatusLabel(slotProps.data.confirm_status)" 
                :severity="getConfirmStatusSeverity(slotProps.data.confirm_status)"
                class="text-xs"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Mensaje de error -->
    <Toast ref="toast" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import MovementService from '@/services/movementService'

// Props
const props = defineProps({
  currency: {
    type: String,
    default: 'PEN'
  }
})

// Emits
const emit = defineEmits(['balance-updated'])

// Estados reactivos
const movements = ref([])
const loading = ref(false)
const currentCurrency = ref(props.currency)
const pagination = ref({
  current_page: 1,
  total: 0,
  per_page: 10,
  last_page: 1
})

// Referencias
const toast = ref()

// Computed para saldo disponible (solo movimientos confirmados)
const availableBalance = computed(() => {
  let balance = 0
  
  movements.value.forEach(movement => {
    // Solo contar movimientos confirmados
    if (movement.confirm_status === 'confirmed' && movement.status === 'completed') {
      const amount = parseFloat(movement.amount)
      
      switch (movement.type) {
        case 'deposit':
        case 'payment': // Pagos recibidos
          balance += amount
          break
        case 'withdraw':
        case 'investment':
        case 'tax':
        case 'exchange_up': // Intercambio hacia arriba (salida)
          balance -= amount
          break
        case 'exchange_down': // Intercambio hacia abajo (entrada)
          balance += amount
          break
      }
    }
  })
  
  return balance
})

// Watch para cambios de moneda
// Watch para emitir cambios de balance
watch(availableBalance, (newBalance) => {
  emit('balance-updated', {
    currency: currentCurrency.value,
    balance: newBalance
  })
})

// Cargar movimientos
const loadMovements = async (page = 1) => {
  try {
    loading.value = true
    
    const params = {
      currency: currentCurrency.value,
      page: page
    }
    
    const response = await MovementService.getMovements(params)
    
    if (response.data.success) {
      movements.value = response.data.data.data
      pagination.value = {
        current_page: response.data.data.current_page,
        total: response.data.data.total,
        per_page: response.data.data.per_page,
        last_page: response.data.data.last_page
      }
    } else {
      throw new Error(response.data.message || 'Error al cargar movimientos')
    }
  } catch (error) {
    console.error('Error loading movements:', error)
    toast.value.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message || 'Error al cargar los movimientos',
      life: 3000
    })
    movements.value = []
  } finally {
    loading.value = false
  }
}

// Manejar cambio de página
const onPageChange = (event) => {
  const page = event.page + 1
  loadMovements(page)
}
watch(() => props.currency, (newCurrency) => {
  currentCurrency.value = newCurrency
  loadMovements()
}, { immediate: true })

// Obtener etiqueta del tipo de movimiento
const getMovementLabel = (type) => {
  const labels = {
    'deposit': 'Depósito',
    'withdraw': 'Retiro',
    'payment': 'Pago',
    'investment': 'Inversión',
    'tax': 'Impuesto',
    'exchange_up': 'Cambio ↑',
    'exchange_down': 'Cambio ↓'
  }
  return labels[type] || type
}

// Obtener estilo del movimiento (icono y color)
const getMovementStyle = (type) => {
  const styles = {
    'deposit': {
      iconClass: 'pi pi-arrow-down text-green-600',
      bgClass: 'bg-green-100'
    },
    'withdraw': {
      iconClass: 'pi pi-arrow-up text-red-600',
      bgClass: 'bg-red-100'
    },
    'payment': {
      iconClass: 'pi pi-arrow-down text-blue-600',
      bgClass: 'bg-blue-100'
    },
    'investment': {
      iconClass: 'pi pi-arrow-up text-purple-600',
      bgClass: 'bg-purple-100'
    },
    'tax': {
      iconClass: 'pi pi-arrow-up text-orange-600',
      bgClass: 'bg-orange-100'
    },
    'exchange_up': {
      iconClass: 'pi pi-arrow-up text-indigo-600',
      bgClass: 'bg-indigo-100'
    },
    'exchange_down': {
      iconClass: 'pi pi-arrow-down text-teal-600',
      bgClass: 'bg-teal-100'
    }
  }
  
  return styles[type] || {
    iconClass: 'pi pi-circle text-gray-600',
    bgClass: 'bg-gray-100'
  }
}

// Obtener prefijo del monto
const getAmountPrefix = (type) => {
  const incomingTypes = ['deposit', 'payment', 'exchange_down']
  return incomingTypes.includes(type) ? '+' : '-'
}

// Obtener color del monto
const getAmountColor = (type) => {
  const incomingTypes = ['deposit', 'payment', 'exchange_down']
  return incomingTypes.includes(type) ? 'text-green-600' : 'text-red-600'
}

// Formatear fecha
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return {
    date: date.toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }),
    time: date.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
}

// Formatear monto
const formatAmount = (amount) => {
  return parseFloat(amount).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Obtener etiqueta de estado
const getStatusLabel = (status) => {
  const statusMap = {
    'pending': 'Pendiente',
    'approved': 'Aprobado',
    'rejected': 'Rechazado',
    'completed': 'Completado'
  }
  return statusMap[status] || status
}

// Obtener severidad de estado
const getStatusSeverity = (status) => {
  const severityMap = {
    'pending': 'warning',
    'approved': 'info',
    'rejected': 'danger',
    'completed': 'success'
  }
  return severityMap[status] || 'info'
}

// Obtener etiqueta de estado de confirmación
const getConfirmStatusLabel = (confirmStatus) => {
  const statusMap = {
    'pending': 'Sin confirmar',
    'confirmed': 'Confirmado',
    'rejected': 'Rechazado'
  }
  return statusMap[confirmStatus] || confirmStatus
}

// Obtener severidad de estado de confirmación
const getConfirmStatusSeverity = (confirmStatus) => {
  const severityMap = {
    'pending': 'warning',
    'confirmed': 'success',
    'rejected': 'danger'
  }
  return severityMap[confirmStatus] || 'info'
}

// Exponer método para recargar desde componente padre
defineExpose({
  refresh: loadMovements
})
</script>

<style scoped>
:deep(.p-datatable-table) {
  font-size: 0.875rem;
}

:deep(.p-datatable-thead > tr > th) {
  background-color: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
  padding: 1rem 0.75rem;
}

:deep(.p-datatable-tbody > tr > td) {
  padding: 0.875rem 0.75rem;
  border-bottom: 1px solid #f1f5f9;
}

:deep(.p-datatable-tbody > tr:hover) {
  background-color: #f8fafc;
}

.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>