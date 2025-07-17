<template>
  <div class="col-span-2 lg:col-span-1">
    <div class="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
      <h5 class="text-[#171717] font-semibold text-xl mb-4">Última inversión en cooperativas</h5>

      <!-- Sin inversión -->
      <div v-if="!lastInvestment && !loading" class="text-center my-20">
        <p class="font-bold mt-0 mb-3 fill-[#171717]">¡Ups aún no has invertido en una factura!</p>
        <svg xmlns="http://www.w3.org/2000/svg" class="fill-[#171717] mx-auto" width="169.333" height="228" viewBox="0 0 127 171">
          <!-- SVG aquí -->
        </svg>
        <p class="mt-3 mb-0 fill-[#171717]">¡Comienza a generar ganancias!</p>
      </div>

      <!-- Con inversión -->
      <div v-else-if="lastInvestment">
        <!-- Empresa -->
        <div class="flex items-center justify-between mb-4">
          <div class="font-semibold text-lg text-[#1F2937]">
            <i class="pi pi-building text-blue-500 mr-2"></i>
            {{ lastInvestment.entidad }}
          </div>
          <Tag :value="lastInvestment.status" severity="info" />
        </div>

        <!-- Detalles de inversión -->
        <div class="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
          <div class="flex items-center">
            <i class="pi pi-percentage text-green-500 mr-2"></i>
            <span><strong>Tasa:</strong> {{ lastInvestment.rate }}%</span>
          </div>
          <div class="flex items-center">
            <i class="pi pi-clock text-indigo-500 mr-2"></i>
            <span><strong>Plazo:</strong> {{ lastInvestment.term_plan }}</span>
          </div>
          <div class="flex items-center">
            <i class="pi pi-calendar text-gray-600 mr-2"></i>
            <span><strong>Fecha:</strong> {{ lastInvestment.created_at }}</span>
          </div>
          <div class="flex items-center">
            <i class="pi pi-sync text-purple-500 mr-2"></i>
            <span><strong>Frecuencia:</strong> {{ lastInvestment.frequency }}</span>
          </div>
        </div>

        <!-- Monto -->
        <div class="mb-4">
          <div class="text-sm text-gray-500">Monto invertido</div>
          <div class="text-2xl font-bold text-[#171717]">
            S/ {{ Number(lastInvestment.amount).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
          </div>
        </div>

        <!-- Progreso -->
        <div class="mb-4">
          <div class="text-sm text-gray-600 mb-2">Progreso</div>
          <ProgressBar :value="progressPercentage" class="h-3" />
        </div>

        <!-- Botón -->
        <Button label="Ver cronograma" class="w-full mt-2" rounded severity="contrast" @click="loadCronograma" />
      </div>
    </div>

    <!-- Dialog de cronograma -->
    <Dialog 
      v-model:visible="dialogVisible" 
      modal 
      header="Cronograma de Pagos" 
      :style="{ width: '80vw', maxWidth: '1000px' }"
      :breakpoints="{ '960px': '90vw', '640px': '95vw' }"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <i class="pi pi-calendar text-blue-500"></i>
          <span class="font-semibold">Cronograma de Pagos</span>
        </div>
      </template>

      <div v-if="loadingCronograma" class="text-center py-8">
        <i class="pi pi-spin pi-spinner text-blue-500 text-2xl mb-3"></i>
        <p class="text-gray-600">Cargando cronograma...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Resumen superior -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-blue-600">{{ cronogramaTotals.total }}</div>
              <div class="text-sm text-gray-600">Total de cuotas</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-green-600">{{ cronogramaTotals.pagado }}</div>
              <div class="text-sm text-gray-600">Pagadas</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-orange-600">{{ cronogramaTotals.pendiente }}</div>
              <div class="text-sm text-gray-600">Pendientes</div>
            </div>
          </div>
        </div>

        <!-- Barra de progreso -->
        <div class="bg-white rounded-lg border border-gray-200 p-4">
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm font-medium text-gray-700">Progreso del cronograma</span>
            <span class="text-sm text-gray-500">{{ progressPercentage }}%</span>
          </div>
          <ProgressBar :value="progressPercentage" class="h-3" />
        </div>

        <!-- Tabla de cronograma -->
        <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full min-w-max">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-calendar-times mr-1"></i>Mes
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-calendar mr-1"></i>Fecha Pago
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-clock mr-1"></i>Días
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-dollar mr-1"></i>Base
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-percentage mr-1"></i>Interés
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-file mr-1"></i>Impuesto
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-money-bill mr-1"></i>Int. Depósito
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-arrow-up mr-1"></i>Ret. Capital
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-wallet mr-1"></i>Saldo Capital
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-credit-card mr-1"></i>Total Depósito
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <i class="pi pi-info-circle mr-1"></i>Estado
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="(item, index) in cronogramaData" 
                  :key="item.id" 
                  class="hover:bg-gray-50 transition-colors duration-150"
                  :class="{ 'bg-green-50': item.status === 'pagado', 'bg-orange-50': item.status === 'pendiente' }"
                >
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span class="text-xs font-medium text-blue-600">{{ item.month }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ item.payment_date }}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-700">{{ item.days }}</div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      S/ {{ Number(item.base_amount).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-green-600">
                      S/ {{ Number(item.interest_amount).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-red-600">
                      S/ {{ Number(item.second_category_tax).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-blue-600">
                      S/ {{ Number(item.interest_to_deposit).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium" :class="Number(item.capital_return) > 0 ? 'text-purple-600' : 'text-gray-500'">
                      S/ {{ Number(item.capital_return).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-indigo-600">
                      S/ {{ Number(item.capital_balance).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-blue-700">
                      S/ {{ Number(item.total_to_deposit).toLocaleString('es-PE', { minimumFractionDigits: 2 }) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <Tag 
                      :value="item.status" 
                      :severity="getStatusSeverity(item.status)"
                      :icon="getStatusIcon(item.status)"
                      class="capitalize"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Resumen inferior -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h6 class="font-semibold text-gray-800 mb-3">Resumen Financiero</h6>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-3 rounded border">
              <div class="text-sm text-gray-600 mb-1">Total Intereses</div>
              <div class="text-lg font-semibold text-green-600">
                S/ {{ calculateTotalInterest() }}
              </div>
            </div>
            <div class="bg-white p-3 rounded border">
              <div class="text-sm text-gray-600 mb-1">Total Impuestos</div>
              <div class="text-lg font-semibold text-red-600">
                S/ {{ calculateTotalTax() }}
              </div>
            </div>
            <div class="bg-white p-3 rounded border">
              <div class="text-sm text-gray-600 mb-1">Total Depósitos</div>
              <div class="text-lg font-semibold text-blue-600">
                S/ {{ calculateTotalDeposit() }}
              </div>
            </div>
            <div class="bg-white p-3 rounded border">
              <div class="text-sm text-gray-600 mb-1">Capital Final</div>
              <div class="text-lg font-semibold text-indigo-600">
                S/ {{ calculateFinalCapital() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button 
            label="Cerrar" 
            severity="secondary" 
            @click="dialogVisible = false"
            outlined
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import ProgressBar from 'primevue/progressbar'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Dialog from 'primevue/dialog'
import { fixedTermInvestmentService } from '@/services/fixedTermInvestmentService'
import { fixedTermScheduleService } from '@/services/fixedTermScheduleService'

const lastInvestment = ref(null)
const loading = ref(true)
const cronogramaData = ref([])
const cronogramaTotals = ref({ total: 0, pendiente: 0, pagado: 0 })
const loadingCronograma = ref(false)
const dialogVisible = ref(false)

const progressPercentage = computed(() => {
  const total = cronogramaTotals.value.total || 1
  const pagado = cronogramaTotals.value.pagado || 0
  return Math.round((pagado / total) * 100)
})

onMounted(async () => {
  try {
    const res = await fixedTermInvestmentService.getLast()
    lastInvestment.value = res.data.data
  } catch (e) {
    lastInvestment.value = null
  } finally {
    loading.value = false
  }
})

const loadCronograma = async () => {
  if (!lastInvestment.value) return
  
  loadingCronograma.value = true
  dialogVisible.value = true
  
  try {
    const res = await fixedTermScheduleService.getCronograma(lastInvestment.value.id)
    cronogramaData.value = res.data.data
    cronogramaTotals.value = res.data.totals
  } catch (error) {
    console.error('Error cargando cronograma:', error)
  } finally {
    loadingCronograma.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusSeverity = (status) => {
  switch (status?.toLowerCase()) {
    case 'pagado':
      return 'success'
    case 'pendiente':
      return 'warning'
    case 'vencido':
      return 'danger'
    default:
      return 'info'
  }
}

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'pagado':
      return 'pi pi-check'
    case 'pendiente':
      return 'pi pi-clock'
    case 'vencido':
      return 'pi pi-times'
    default:
      return 'pi pi-info'
  }
}

const calculateTotalInterest = () => {
  const total = cronogramaData.value.reduce((sum, item) => {
    return sum + Number(item.interest_amount || 0)
  }, 0)
  return total.toLocaleString('es-PE', { minimumFractionDigits: 2 })
}

const calculateTotalTax = () => {
  const total = cronogramaData.value.reduce((sum, item) => {
    return sum + Number(item.second_category_tax || 0)
  }, 0)
  return total.toLocaleString('es-PE', { minimumFractionDigits: 2 })
}

const calculateTotalDeposit = () => {
  const total = cronogramaData.value.reduce((sum, item) => {
    return sum + Number(item.total_to_deposit || 0)
  }, 0)
  return total.toLocaleString('es-PE', { minimumFractionDigits: 2 })
}

const calculateFinalCapital = () => {
  if (cronogramaData.value.length === 0) return '0.00'
  const lastItem = cronogramaData.value[cronogramaData.value.length - 1]
  const finalCapital = Number(lastItem.capital_balance || 0)
  return finalCapital.toLocaleString('es-PE', { minimumFractionDigits: 2 })
}
</script>