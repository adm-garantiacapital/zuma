<template>
  <h5>Estados de cuenta</h5>
  <Tabs v-model:value="activeTab" @update:value="onTabChange">
    <div class="flex justify-between items-center">
      <TabList>
        <Tab value="0" as="div" class="flex items-center gap-2">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png" shape="circle" />
          <span class="font-bold whitespace-nowrap">PEN</span>
        </Tab>
        <Tab value="1" as="div" class="flex items-center gap-2">
          <Avatar image="https://primefaces.org/cdn/primevue/images/avatar/onyamalimba.png" shape="circle" />
          <span class="font-bold whitespace-nowrap">USD</span>
        </Tab>
      </TabList>
      <div class="flex gap-2">
        <Button
          :icon="showAmounts ? 'pi pi-eye' : 'pi pi-eye-slash'"
          severity="secondary"
          variant="text"
          rounded
          @click="toggleAmounts"
          v-tooltip.top="showAmounts ? 'Ocultar montos' : 'Mostrar montos'"
        />
        <Button
          label="Depósito"
          icon="pi pi-plus"
          iconPos="left"
          severity="contrast"
          rounded
          @click="showDepositoDialog = true"
        />
        <Button
          label="Retiro"
          icon="pi pi-minus"
          iconPos="left"
          severity="contrast"
          variant="outlined"
          rounded
          @click="showRetiroDialog = true"
        />
      </div>
    </div>
    <TabPanels>
      <TabPanel value="0" as="div" class="m-0 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Saldo disponible</h6>
            <p v-if="showAmounts" class="text-xl font-bold text-green-600">
              PEN {{ formatAmount(balances.pen.available) }}
            </p>
            <p v-else class="text-xl font-bold text-gray-400">
              PEN ****
            </p>
          </div>
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Total invertido</h6>
            <p v-if="showAmounts" class="text-xl font-bold text-blue-600">
              PEN {{ formatAmount(balances.pen.invested) }}
            </p>
            <p v-else class="text-xl font-bold text-gray-400">
              PEN ****
            </p>
          </div>
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Retorno esperado</h6>
            <p v-if="showAmounts" class="text-xl font-bold text-orange-500">
              PEN {{ formatAmount(balances.pen.expectedReturn) }}
            </p>
            <p v-else class="text-xl font-bold text-gray-400">
              PEN ****
            </p>
          </div>
        </div>
      </TabPanel>
      <TabPanel value="1" as="div" class="m-0 mt-4">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Saldo disponible</h6>
            <p v-if="showAmounts" class="text-xl font-bold text-green-600">
              USD {{ formatAmount(balances.usd.available) }}
            </p>
            <p v-else class="text-xl font-bold text-gray-400">
              USD ****
            </p>
          </div>
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Total invertido</h6>
            <p v-if="showAmounts" class="text-xl font-bold text-blue-600">
              USD {{ formatAmount(balances.usd.invested) }}
            </p>
            <p v-else class="text-xl font-bold text-gray-400">
              USD ****
            </p>
          </div>
          <div class="rounded-2xl shadow-md p-4 bg-white">
            <h6 class="text-gray-500">Retorno esperado</h6>
            <p v-if="showAmounts" class="text-xl font-bold text-orange-500">
              USD {{ formatAmount(balances.usd.expectedReturn) }}
            </p>
            <p v-else class="text-xl font-bold text-gray-400">
              USD ****
            </p>
          </div>
        </div>
      </TabPanel>
    </TabPanels>
  </Tabs>

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

// Estado reactivo
const activeTab = ref('0')
const showDepositoDialog = ref(false)
const showRetiroDialog = ref(false)
const showAmounts = ref(true)

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

// Computed para la moneda seleccionada
const currentCurrency = computed(() => {
  return activeTab.value === '0' ? 'PEN' : 'USD'
})

// Alternar visibilidad de montos
const toggleAmounts = () => {
  showAmounts.value = !showAmounts.value
}

// Cambio de tab
const onTabChange = (newTab) => {
  const currency = newTab === '0' ? 'PEN' : 'USD'
  emit('currency-changed', currency)
}

// Éxito en depósito
const handleDepositSuccess = () => {
  emit('deposit-success')
  fetchBalances()
}

// Éxito en retiro
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

// Cargar balances desde API
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

// Exponer métodos al padre
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

// Al montar, obtener balances
onMounted(() => {
  fetchBalances()
})
</script>
