<template>
  <div class="p-10 rounded-3xl bg-[#F0F1F9]">

    <Tabs v-model:value="activeTab" @update:value="onTabChange">
      <!-- Encabezado: Estados de cuenta + Monedas + Botones -->

      <div class="flex justify-between items-center gap-4 mb-6 flex-wrap md:flex-nowrap">
        <!-- Izquierda: Título + Monedas -->
        <div class="flex items-center gap-4 flex-shrink-0">
          <!-- Título -->
          <h3 class="text-[#171717] font-bold text-xl m-0">Estados de cuenta</h3>

          <!-- Cards de monedas -->
          <div class="flex gap-2">
            <!-- Card PEN -->
            <div
              :class="['flex items-center gap-2 px-3 py-2 rounded-3xl cursor-pointer shadow-sm', activeTab === '0' ? 'bg-white text-black' : 'bg-gray-100 text-gray-500']"
              @click="activeTab = '0'; onTabChange('0');">
              <Avatar shape="circle" class="w-6 h-6">
                <img src="https://flagcdn.com/w80/pe.png" alt="Bandera de Perú"
                  class="w-full h-full object-cover rounded-full" />
              </Avatar>
              <span class="font-semibold text-sm">PEN</span>
            </div>
            <!-- Card USD -->
            <div
              :class="['flex items-center gap-2 px-3 py-2 rounded-3xl cursor-pointer shadow-sm', activeTab === '1' ? 'bg-white text-black' : 'bg-gray-100 text-gray-500']"
              @click="activeTab = '1'; onTabChange('1');">
              <Avatar shape="circle" class="w-6 h-6">
                <img src="https://flagcdn.com/w80/us.png" alt="Bandera de Estados Unidos"
                  class="w-full h-full object-cover rounded-full" />
              </Avatar>
              <span class="font-semibold text-sm">USD</span>
            </div>
          </div>

        </div>
        <!-- Derecha: Toggle / Depósito / Retiro -->
        <div class="flex items-center gap-2 flex-shrink-0">
          <Button :icon="showAmounts ? 'pi pi-eye' : 'pi pi-eye-slash'" severity="contrast" variant="outlined" rounded
            @click="toggleAmounts" :title="showAmounts ? 'Ocultar montos' : 'Mostrar montos'" />
          <Button label="Depósito" icon="pi pi-plus" iconPos="left" severity="contrast" rounded
            @click="showDepositoDialog = true" />
          <Button label="Retiro" icon="pi pi-minus" iconPos="left" severity="contrast" variant="outlined" rounded
            @click="showRetiroDialog = true" />
        </div>
      </div>
      <!-- Panel PEN -->
      <TabPanel value="0" as="div">
        <div v-if="wallet" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Saldo disponible -->
          <div class="rounded-3xl bg-white p-8 flex items-start gap-4 h-full shadow-sm">
            <img src="/icons/amount-available.svg" alt="" class="w-10  md:w-12">
            <div>
              <h5 class="text-[#171717] font-semibold m-0">Saldo disponible</h5>
              <h3 class="text-[#171717] font-bold text-base m-0">
                <span v-if="showAmounts">S/ {{ formatAmount(balances.pen.available) }}</span>
                <span v-else class="text-gray-400">****</span>
              </h3>
              <!-- <a class="text-[#6790FF] font-medium text-sm mt-2 inline-block">Ver más...</a> -->
            </div>
          </div>
          <!-- Total invertido -->
          <div class="rounded-3xl bg-white p-8 flex items-start gap-4 h-full shadow-sm">
            <img src="/icons/investment-amount.svg" alt="" class="w-10 md:w-16">
            <div>
              <h5 class="text-[#171717] font-semibold m-0">Total invertido</h5>
              <h3 class="text-[#171717] font-bold text-base m-0">
                <span v-if="showAmounts">S/ {{ formatAmount(balances.pen.invested) }}</span>
                <span v-else class="text-gray-400">****</span>
              </h3>
              <!-- <a class="text-[#6790FF] font-medium text-sm mt-2 inline-block">Ver más...</a> -->
            </div>
          </div>
          <!-- Retorno total -->
          <div class="rounded-3xl bg-white p-8 flex items-start gap-4 h-full shadow-sm">
            <img src="/icons/money-in-hands.svg" alt="" class="w-10 md:w-16">
            <div>
              <h5 class="text-[#171717] font-semibold m-0">Retorno total</h5>
              <h3 class="text-[#171717] font-bold text-base m-0">
                <span v-if="showAmounts">S/ {{ formatAmount(balances.pen.expectedReturn) }}</span>
                <span v-else class="text-gray-400">****</span>
              </h3>
              <!-- <a class="text-[#6790FF] font-medium text-sm mt-2 inline-block">Ver más...</a> -->
            </div>
          </div>
        </div>
      </TabPanel>

      <!-- Panel USD -->
      <TabPanel value="1" as="div">
        <div v-if="wallet" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Saldo disponible -->
          <div class="rounded-3xl bg-white p-8 flex items-start gap-4 h-full shadow-sm">
            <img src="/icons/amount-available.svg" alt="" class="w-10  md:w-12">
            <div>
              <h5 class="text-[#171717] font-semibold m-0">Saldo disponible</h5>
              <h3 class="text-[#171717] font-bold text-base m-0">
                <span v-if="showAmounts">$ {{ formatAmount(balances.usd.available) }}</span>
                <span v-else class="text-gray-400">****</span>
              </h3>
              <!-- <a class="text-[#6790FF] font-medium text-sm mt-2 inline-block">Ver más...</a> -->
            </div>
          </div>

          <!-- Total invertido -->
          <div class="rounded-3xl bg-white p-8 flex items-start gap-4 h-full shadow-sm">
            <img src="/icons/investment-amount.svg" alt="" class="w-10 md:w-16">
            <div>
              <h5 class="text-[#171717] font-semibold m-0">Total invertido</h5>
              <h3 class="text-[#171717] font-bold text-base m-0">
                <span v-if="showAmounts">$ {{ formatAmount(balances.usd.invested) }}</span>
                <span v-else class="text-gray-400">****</span>
              </h3>
              <!-- <a class="text-[#6790FF] font-medium text-sm mt-2 inline-block">Ver más...</a> -->
            </div>
          </div>

          <!-- Retorno total -->
          <div class="rounded-3xl bg-white p-8 flex items-start gap-4 h-full shadow-sm">
            <img src="/icons/money-in-hands.svg" alt="" class="w-10 md:w-16">
            <div>
              <h5 class="text-[#171717] font-semibold m-0">Retorno total</h5>
              <h3 class="text-[#171717] font-bold text-base m-0">
                <span v-if="showAmounts">$ {{ formatAmount(balances.usd.expectedReturn) }}</span>
                <span v-else class="text-gray-400">****</span>
              </h3>
              <!-- <a class="text-[#6790FF] font-medium text-sm mt-2 inline-block">Ver más...</a> -->
            </div>
          </div>
        </div>
      </TabPanel>

    </Tabs>
  </div>

  <!-- Diálogos -->
  <AddDeposito v-model:visible="showDepositoDialog" @success="handleDepositSuccess" />
  <AddRetiro v-model:visible="showRetiroDialog" @success="handleWithdrawSuccess" />
</template>

<script setup>
import reportsService from '@/services/reportsService'
import { computed, onMounted, ref } from 'vue'
import AddDeposito from './AddDeposito.vue'
import AddRetiro from './AddRetiro.vue'

// Emits
const emit = defineEmits(['currency-changed', 'deposit-success', 'withdraw-success'])

// Estados
const activeTab = ref('0')
const showDepositoDialog = ref(false)
const showRetiroDialog = ref(false)
const showAmounts = ref(true)
const wallet = ref(true)

// Balances iniciales
const balances = ref({
  pen: {
    available: 0,
    invested: 0,
    expectedReturn: 0
  },
  usd: {
    available: 0,
    invested: 0,
    expectedReturn: 0
  }
})

// Etiquetas por moneda
const penLabels = {
  available: { icon: 'pi pi-wallet', title: 'Saldo disponible' },
  invested: { icon: 'pi pi-chart-line', title: 'Total invertido' },
  expectedReturn: { icon: 'pi pi-dollar', title: 'Retorno total' }
}

const usdLabels = {
  available: { icon: 'pi pi-wallet', title: 'Saldo disponible' },
  invested: { icon: 'pi pi-chart-line', title: 'Total invertido' },
  expectedReturn: { icon: 'pi pi-dollar', title: 'Retorno total' }
}

// Computed para moneda actual
const currentCurrency = computed(() => {
  return activeTab.value === '0' ? 'PEN' : 'USD'
})

// Alternar visibilidad
const toggleAmounts = () => {
  showAmounts.value = !showAmounts.value
}

// Cambio de pestaña
const onTabChange = (newTab) => {
  const currency = newTab === '0' ? 'PEN' : 'USD'
  emit('currency-changed', currency)
}

// Éxito depósito
const handleDepositSuccess = () => {
  emit('deposit-success')
  fetchBalances()
}

// Éxito retiro
const handleWithdrawSuccess = () => {
  emit('withdraw-success')
  fetchBalances()
}

// Formato de montos
const formatAmount = (amount) => {
  return parseFloat(amount || 0).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// Obtener balances de la API
const fetchBalances = async () => {
  try {
    const response = await reportsService.getBalances()

    if (response.data.success) {
      const result = {
        pen: {
          available: 0,
          invested: 0,
          expectedReturn: 0
        },
        usd: {
          available: 0,
          invested: 0,
          expectedReturn: 0
        }
      }

      response.data.data.forEach(item => {
        const key = item.currency.toLowerCase()
        if (result[key]) {
          result[key].available = parseFloat(item.amount)
          result[key].invested = parseFloat(item.invested_amount)
          result[key].expectedReturn = parseFloat(item.expected_amount)
        }
      })

      balances.value = result
    }
  } catch (error) {
    console.error('❌ Error al obtener balances:', error)
  }
}

// Métodos públicos
const updateBalance = (currency, balance) => {
  const key = currency.toLowerCase()
  if (balances.value[key]) {
    balances.value[key].available = balance
  }
}

const updateBalances = (newBalances) => {
  balances.value = { ...balances.value, ...newBalances }
}

defineExpose({
  updateBalance,
  updateBalances,
  currentCurrency
})

// Al montar
onMounted(() => {
  fetchBalances()
})
</script>
