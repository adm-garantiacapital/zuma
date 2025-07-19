<template>
  <div class="p-10 rounded-3xl bg-[#F0F1F9]">
    <h3 class="text-[#171717] font-bold text-xl mb-6">Estados de cuenta</h3>

    <Tabs v-model:value="activeTab" @update:value="onTabChange">
      <!-- Encabezado -->
      <div class="flex justify-between items-center flex-wrap gap-4 mb-6">
        <TabList class="flex gap-3">
          <Tab value="0" as="div" class="flex items-center gap-2 px-4 py-2 bg-white shadow-sm cursor-pointer">
            <Avatar shape="circle" class="w-8 h-8">
              <img src="https://flagcdn.com/w80/pe.png" alt="Bandera de Perú" class="w-full h-full object-cover rounded-full" />
            </Avatar>
            <span class="font-bold whitespace-nowrap text-[#171717]">PEN</span>
          </Tab>
          <Tab value="1" as="div" class="flex items-center gap-2 px-4 py-2 bg-white shadow-sm cursor-pointer">
            <Avatar shape="circle" class="w-8 h-8">
              <img src="https://flagcdn.com/w80/us.png" alt="Bandera de Estados Unidos" class="w-full h-full object-cover rounded-full" />
            </Avatar>
            <span class="font-bold whitespace-nowrap text-[#171717]">USD</span>
          </Tab>
        </TabList>

        <div class="flex gap-2">
          <Button :icon="showAmounts ? 'pi pi-eye' : 'pi pi-eye-slash'" severity="contrast" variant="outlined"
            rounded @click="toggleAmounts" :title="showAmounts ? 'Ocultar montos' : 'Mostrar montos'" />
          <Button label="Depósito" icon="pi pi-plus" iconPos="left" severity="contrast" rounded
            @click="showDepositoDialog = true" />
          <Button label="Retiro" icon="pi pi-minus" iconPos="left" severity="contrast" variant="outlined" rounded
            @click="showRetiroDialog = true" />
        </div>
      </div>

      <!-- Panel PEN -->
      <TabPanels>
        <TabPanel value="0" as="div">
          <div v-if="wallet" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(label, key, index) in penLabels" :key="'pen-' + index">
              <div class="rounded-3xl bg-white p-8 flex items-start gap-4 h-full shadow-sm">
                <i :class="label.icon" class="text-[#171717] !text-[2.5rem] mt-1"></i>
                <div>
                  <h5 class="text-[#171717] font-semibold m-0">{{ label.title }}</h5>
                  <h3 class="text-[#171717] font-bold text-base m-0">
                    <span v-if="showAmounts">S/ {{ formatAmount(balances.pen[key]) }}</span>
                    <span v-else class="text-gray-400">****</span>
                  </h3>
                  <a class="text-[#6790FF] font-medium text-sm mt-2 inline-block">Ver más...</a>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>

        <!-- Panel USD -->
        <TabPanel value="1" as="div">
          <div v-if="wallet" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(label, key, index) in usdLabels" :key="'usd-' + index">
              <div class="rounded-3xl bg-white p-8 flex items-start gap-4 h-full shadow-sm">
                <i :class="label.icon" class="text-[#171717] !text-[2.5rem] mt-1"></i>
                <div>
                  <h5 class="text-[#171717] font-semibold m-0">{{ label.title }}</h5>
                  <h3 class="text-[#171717] font-bold text-base m-0">
                    <span v-if="showAmounts">$ {{ formatAmount(balances.usd[key]) }}</span>
                    <span v-else class="text-gray-400">****</span>
                  </h3>
                  <a class="text-[#6790FF] font-medium text-sm mt-2 inline-block">Ver más...</a>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>

  <!-- Diálogos -->
  <AddDeposito v-model:visible="showDepositoDialog" @success="handleDepositSuccess" />
  <AddRetiro v-model:visible="showRetiroDialog" @success="handleWithdrawSuccess" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AddDeposito from './AddDeposito.vue'
import AddRetiro from './AddRetiro.vue'
import reportsService from '@/services/reportsService'

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
