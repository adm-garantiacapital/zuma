<template>
  <br>
  <br>
  <div class="border rounded-3xl py-6">
    <div class="p-6">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-8">
        <ProgressSpinner />
      </div>

      <!-- Tabla de movimientos -->
      <div v-else>
        <DataTable ref="dt" :value="movements" dataKey="id" :paginator="true" :rows="10" :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 25]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} movements"
          :emptyMessage="`No hay movimientos en ${currentCurrency}`" stripedRows responsiveLayout="scroll">
          <template #header>
            <div class="flex flex-wrap gap-2 items-center justify-between">
              <h4 class="m-0">Movimientos ({{ currentCurrency }})</h4>
              <IconField>
                <InputIcon>
                  <i class="pi pi-search" />
                </InputIcon>
                <InputText v-model="filters['global'].value" placeholder="Buscar..." />
              </IconField>
            </div>
          </template>
          <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
          <Column field="created_at" header="Fecha de solicitud" sortable style="min-width: 200px">
            <template #body="slotProps">
              <div class="flex items-center gap-2 text-sm">
                <span class="font-medium text-gray-800">
                  {{ formatDate(slotProps.data.created_at).date }}
                </span>
                <span class="text-gray-500 text-xs">
                  {{ formatDate(slotProps.data.created_at).time }}
                </span>
              </div>
            </template>
          </Column>

          <Column field="type" header="Movimiento" sortable style="min-width: 150px">
            <template #body="slotProps">
              <div class="flex items-center gap-2">
                <div :class="[
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm',
                  getMovementStyle(slotProps.data.type).bgClass
                ]">
                  <i :class="getMovementStyle(slotProps.data.type).iconClass"></i>
                </div>

                <div>
                  <div class="font-medium">
                    {{ getMovementLabel(slotProps.data.type) }}
                  </div>
                  <div v-if="slotProps.data.description" class="text-xs text-gray-500 truncate max-w-32">
                    {{ slotProps.data.description }}
                  </div>
                </div>
              </div>
            </template>
          </Column>

          <Column field="amount" header="Monto" sortable style="min-width: 120px" dataType="numeric">
            <template #body="slotProps">
              <div>
                <div :class="[
                  'font-bold',
                  getAmountColor(slotProps.data.type)
                ]">
                  {{ getAmountPrefix(slotProps.data.type) }}{{ currentCurrency }} {{ formatAmount(slotProps.data.amount)
                  }}
                </div>
              </div>
            </template>
          </Column>
<Column field="status" header="Estado" sortable>
  <template #body="slotProps">
    <div>
      <!-- Mostrar solo uno: status o confirm_status -->
      <Tag
        v-if="slotProps.data.confirm_status && slotProps.data.confirm_status !== slotProps.data.status"
        :value="getConfirmStatusLabel(slotProps.data.confirm_status)"
        :severity="getConfirmStatusSeverity(slotProps.data.confirm_status)"
      />
      <Tag
        v-else
        :value="getStatusLabel(slotProps.data.status)"
        :severity="getStatusSeverity(slotProps.data.status)"
      />
    </div>
  </template>
</Column>
  
        </DataTable>
      </div>

      <!-- Mensaje de error -->
      <Toast ref="toast" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { FilterMatchMode } from '@primevue/core/api';

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
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
})

// Referencias
const toast = ref()
const dt = ref()

// Computed para saldo disponible (solo movimientos confirmados)
const availableBalance = computed(() => {
  let balance = 0

  movements.value.forEach(movement => {
    if (movement.confirm_status === 'confirmed' && movement.status === 'completed') {
      const amount = parseFloat(movement.amount)

      switch (movement.type) {
        case 'deposit':
        case 'payment':
        case 'fixed_rate_interest_payment':
        case 'fixed_rate_disbursement':
        case 'mortgage_disbursement':
          balance += amount
          break
        case 'withdraw':
        case 'investment':
        case 'tax':
        case 'exchange_up':
        case 'fixed_rate_capital_return':
        case 'mortgage_installment_payment':
        case 'mortgage_early_payment':
          balance -= amount
          break
        case 'exchange_down':
          balance += amount
          break
      }
    }
  })

  return balance
})

// Watch para emitir cambios de balance
watch(availableBalance, (newBalance) => {
  emit('balance-updated', {
    currency: currentCurrency.value,
    balance: newBalance
  })
})

// Cargar movimientos
const loadMovements = async () => {
  try {
    loading.value = true

    const params = {
      currency: currentCurrency.value,
      per_page: 1000
    }

    const response = await MovementService.getMovements(params)

    if (response.data.success) {
      movements.value = response.data.data.data || response.data.data
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

// Watch para cambios de moneda
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
    'exchange_down': 'Cambio ↓',
    'fixed_rate_disbursement': 'Desembolso Tasa Fija',
    'fixed_rate_interest_payment': 'Pago Intereses T.F.',
    'fixed_rate_capital_return': 'Devolución Capital T.F.',
    'mortgage_disbursement': 'Desembolso Hipoteca',
    'mortgage_installment_payment': 'Cuota Hipoteca',
    'mortgage_early_payment': 'Pago Adelantado Hipoteca'
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
      iconClass: 'pi pi-minus text-orange-600',
      bgClass: 'bg-orange-100'
    },
    'exchange_up': {
      iconClass: 'pi pi-arrow-up text-indigo-600',
      bgClass: 'bg-indigo-100'
    },
    'exchange_down': {
      iconClass: 'pi pi-arrow-down text-teal-600',
      bgClass: 'bg-teal-100'
    },
    'fixed_rate_disbursement': {
      iconClass: 'pi pi-dollar text-green-600',
      bgClass: 'bg-green-100'
    },
    'fixed_rate_interest_payment': {
      iconClass: 'pi pi-percentage text-emerald-600',
      bgClass: 'bg-emerald-100'
    },
    'fixed_rate_capital_return': {
      iconClass: 'pi pi-undo text-amber-600',
      bgClass: 'bg-amber-100'
    },
    'mortgage_disbursement': {
      iconClass: 'pi pi-home text-blue-600',
      bgClass: 'bg-blue-100'
    },
    'mortgage_installment_payment': {
      iconClass: 'pi pi-calendar text-violet-600',
      bgClass: 'bg-violet-100'
    },
    'mortgage_early_payment': {
      iconClass: 'pi pi-fast-forward text-pink-600',
      bgClass: 'bg-pink-100'
    }
  }

  return styles[type] || {
    iconClass: 'pi pi-circle text-gray-600',
    bgClass: 'bg-gray-100'
  }
}

// Obtener prefijo del monto
const getAmountPrefix = (type) => {
  const incomingTypes = [
    'deposit', 
    'payment', 
    'exchange_down', 
    'fixed_rate_interest_payment', 
    'fixed_rate_disbursement', 
    'mortgage_disbursement'
  ]
  return incomingTypes.includes(type) ? '+' : '-'
}

// Obtener color del monto
const getAmountColor = (type) => {
  const incomingTypes = [
    'deposit', 
    'payment', 
    'exchange_down', 
    'fixed_rate_interest_payment', 
    'fixed_rate_disbursement', 
    'mortgage_disbursement'
  ]
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
    'valid': 'Aprobado',
    'confirmed': 'Confirmado',
    'rejected': 'Rechazado',
    'completed': 'Completado'
  }
  return statusMap[status] || status
}

// Obtener severidad de estado
const getStatusSeverity = (status) => {
  const severityMap = {
    'pending': 'warn',
    'valid': 'info',
    'confirmed': 'success',
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
    'pending': 'warn',
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

<style scoped></style>