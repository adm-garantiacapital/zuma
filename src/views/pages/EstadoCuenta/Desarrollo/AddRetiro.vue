<template>
  <Dialog :visible="visible" @update:visible="updateVisible" modal :style="{ width: '450px' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <!-- Título centrado -->
    <template #header>
      <div class="w-full font-gilroy text-center !text-2xl !font-bold" style="color: #000;">
        Solicitar retiro
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <!-- Cuenta bancaria destino -->
      <div>
        <label class="block font-gilroy text-base font-medium mb-2">
          ¿A qué cuenta bancaria te enviamos el dinero?
        </label>
        <Dropdown v-model="selectedBank" :options="bankOptions" optionLabel="name" optionValue="value"
          placeholder="Seleccionar cuenta" class="w-full font-gilroy" :optionDisabled="isOptionDisabled">
          <!-- Renderizado de cada opción -->
          <template #option="slotProps">
            <div class="flex font-gilroy justify-between items-center"
              :class="{ 'opacity-50 font-gilroy cursor-not-allowed': slotProps.option.status !== 'approved' }">
              <div>
                <div class="font-medium">
                  {{ slotProps.option.bank }}
                </div>
                <div class="text-xs font-gilroy text-gray-500 space-y-1">
                  <div>Alias: {{ slotProps.option.alias }}</div>
                  <div>Moneda: {{ slotProps.option.currency }}</div>
                  <div>Tipo: {{ slotProps.option.type }}</div>
                </div>
              </div>
              <div class="flex flex-col font-gilroy items-end space-y-1">
                <Tag :value="getStatusLabel(slotProps.option.status)"
                  :severity="slotProps.option.status === 'approved' ? 'success' : 'danger'" />
                <span v-if="slotProps.option.status !== 'approved'" class="text-xs text-red-500">
                  No seleccionable
                </span>
              </div>
            </div>
          </template>

          <!-- Cómo se ve la opción seleccionada -->
          <template #value="slotProps">
            <div v-if="slotProps.value">
              {{ getSelectedBankName(slotProps.value) }}
            </div>
            <span v-else class="text-gray-400 font-gilroy">Seleccionar cuenta</span>
          </template>
        </Dropdown>
      </div>

      <!-- Mi billetera -->
      <div>
        <label class="block text-base font-gilroy font-medium mb-2">
          Mi billetera
        </label>
        <Dropdown v-model="selectedWallet" :options="walletOptions" optionLabel="name" optionValue="value"
          placeholder="Selecciona tu billetera" class="font-gilroy w-full">
          <!-- Renderizado de cada opción de billetera -->
          <template #option="slotProps">
            <div class="flex justify-between items-center">
              <div class="font-medium">
                {{ slotProps.option.name }}
              </div>
              <div class="text-sm font-semibold"
                :class="slotProps.option.currency === 'USD' ? 'text-green-600' : 'text-blue-600'">
                {{ slotProps.option.currency }}
              </div>
            </div>
          </template>

          <!-- Cómo se ve la opción seleccionada -->
          <template #value="slotProps">
            <div v-if="slotProps.value">
              {{ getSelectedWalletName(slotProps.value) }}
            </div>
            <span v-else class="text-gray-400">Selecciona tu billetera</span>
          </template>
        </Dropdown>
      </div>

      <!-- Monto -->
      <div class="font-gilroy">
        <label class="block text-base font-medium mb-2">
          Monto (Selecciona tu cuenta)
        </label>
        <div class="relative">
          <InputNumber v-model="amount" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" placeholder="0.00"
            class="w-full" :disabled="!selectedWallet" />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {{ selectedWallet ? getCurrencySymbol(selectedWallet) : 'S/.' }}
          </div>
        </div>
      </div>

      <!-- Motivo de retiro -->
      <div class="font-gilroy">
        <label class="block text-base font-medium mb-2">
          Motivo de retiro
        </label>
        <Dropdown v-model="withdrawalReason" :options="reasonOptions" optionLabel="name" optionValue="value"
          placeholder="Seleccionar Motivo de retiro" class="w-full font-gilroy" />
      </div>

      <!-- Términos y condiciones -->
      <div class="flex items-start space-x-2">
        <Checkbox v-model="agreeTerms" inputId="terms" binary />
        <label for="terms" class="text-sm font-gilroy">
          Acepto Términos y Condiciones y la
          <span class="text-red-500 cursor-pointer hover:underline" @click="openPrivacyPolicy">
            Política de Privacidad
          </span>
        </label>
      </div>

      <!-- Términos y condiciones texto -->
      <!-- <div class="text-xs text-gray-600 space-y-2">
        <p>
          Lorem ipsum dolor sit amet consectetur. Faucibus tempor porttitor 
          suspendisse suspendisse sed. Ultricies nunc dictum cursus vel tellus 
          congue sem. Amet eu at hendrerit in congue consequat lectus diam. 
          Enim nisl mattis ultrices sed.
        </p>
        <p>
          Lorem ipsum dolor sit amet consectetur. Faucibus tempor porttitor 
          suspendisse suspendisse sed. Ultricies nunc dictum cursus vel tellus 
          congue sem. Amet eu at hendrerit in congue consequat lectus diam. 
          Enim nisl mattis ultrices sed.
        </p>
      </div> -->
    </div>

    <!-- Footer del modal -->
    <template #footer>
      <div class="flex justify-center w-full">
        <Button label="Solicitar retiro"
          class="flex-1 !border-black !bg-transparent !text-black hover:!bg-slate-100 !border-2" color="#000"
          icon="pi pi-save" rounded @click="handleSubmit" :disabled="!isFormValid" />
      </div>
    </template>

    <!-- Modal de confirmación -->
    <Dialog v-model:visible="showConfirmation" modal :style="{ width: '400px' }" header="Confirmar Retiro">
      <div class="flex flex-col gap-4">
        <div class="text-center">
          <i class="pi pi-info-circle text-blue-500 text-4xl mb-3"></i>
          <h3 class="text-lg font-semibold mb-2">¿Confirmar solicitud de retiro?</h3>
          <div class="text-sm text-gray-600 space-y-1">
            <p><strong>Banco:</strong> {{ getBankName(selectedBank) }}</p>
            <p><strong>Billetera:</strong> {{ getWalletName(selectedWallet) }}</p>
            <p><strong>Monto:</strong> {{ formatAmount(amount) }}</p>
            <p><strong>Motivo:</strong> {{ getReasonName(withdrawalReason) }}</p>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <Button label="Cancelar" severity="secondary" @click="showConfirmation = false" />
          <Button label="Confirmar" severity="success" @click="confirmWithdrawal" />
        </div>
      </template>
    </Dialog>
  </Dialog>
</template>

<script setup>
import { bankAccountService } from '@/services/bankAccountService'
import { createWithdraw } from '@/services/movementsservice'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible'])

const bankOptions = ref([])

const walletOptions = ref([
  { name: 'PEN', value: 'pen_wallet', currency: 'PEN' },
  { name: 'USD', value: 'usd_wallet', currency: 'USD' }
])

const reasonOptions = ref([
  { name: 'Gastos personales', value: 'personal' },
  { name: 'Pago de servicios', value: 'services' },
  { name: 'Inversión', value: 'investment' },
  { name: 'Emergencia médica', value: 'medical' },
  { name: 'Educación', value: 'education' },
  { name: 'Otros', value: 'other' }
])

const selectedBank = ref(null)
const selectedWallet = ref(null)
const amount = ref(null)
const withdrawalReason = ref(null)
const agreeTerms = ref(false)
const showConfirmation = ref(false)

const isFormValid = computed(() => {
  const selectedBankObj = bankOptions.value.find(b => b.value === selectedBank.value)
  const selectedWalletObj = walletOptions.value.find(w => w.value === selectedWallet.value)

  return selectedBank.value &&
    selectedWallet.value &&
    amount.value &&
    amount.value > 0 &&
    withdrawalReason.value &&
    agreeTerms.value &&
    selectedBankObj?.currency === selectedWalletObj?.currency
})

const updateVisible = (value) => emit('update:visible', value)

const isOptionDisabled = (option) => {
  return option.status === 'invalid'
}

const getStatusLabel = (status) => {
  return status === 'approved' ? 'Aprobada' : 'No Aprobada'
}

const getSelectedBankName = (selectedValue) => {
  const bank = bankOptions.value.find(option => option.value === selectedValue)
  return bank ? bank.bank : ''
}

const getSelectedWalletName = (selectedValue) => {
  const wallet = walletOptions.value.find(option => option.value === selectedValue)
  return wallet ? wallet.name : ''
}

const getCurrencySymbol = (walletValue) => {
  const wallet = walletOptions.value.find(w => w.value === walletValue)
  return wallet?.currency === 'USD' ? '$' : 'S/.'
}

const getBankName = (bankValue) => {
  const bank = bankOptions.value.find(b => b.value === bankValue)
  return bank?.bank || ''
}

const getWalletName = (walletValue) => {
  const wallet = walletOptions.value.find(w => w.value === walletValue)
  return wallet?.name || ''
}

const getReasonName = (reasonValue) => {
  const reason = reasonOptions.value.find(r => r.value === reasonValue)
  return reason?.name || ''
}

const formatAmount = (amount) => {
  if (!amount || !selectedWallet.value) return '0.00'
  const symbol = getCurrencySymbol(selectedWallet.value)
  return `${symbol} ${amount.toFixed(2)}`
}

const openPrivacyPolicy = () => {
  console.log('Abrir política de privacidad')
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    alert('Por favor, completa todos los campos obligatorios o verifica que la moneda coincida entre la cuenta y la billetera.')
    return
  }

  showConfirmation.value = true
}

const confirmWithdrawal = async () => {
  const selectedWalletObj = walletOptions.value.find(w => w.value === selectedWallet.value)
  const selectedReasonObj = reasonOptions.value.find(r => r.value === withdrawalReason.value)

  const formData = {
    acceptance: agreeTerms.value,
    amount: amount.value,
    bank: selectedBank.value,
    currency: selectedWalletObj.currency,
    purpouse: selectedReasonObj.name
  }

  try {
    await createWithdraw(formData)
    alert('Solicitud de retiro enviada correctamente')
    updateVisible(false)
    resetForm()
  } catch (error) {
    console.error('Error al enviar retiro:', error)
    alert('Hubo un error al solicitar el retiro.')
  } finally {
    showConfirmation.value = false
  }
}

const resetForm = () => {
  selectedBank.value = null
  selectedWallet.value = null
  amount.value = null
  withdrawalReason.value = null
  agreeTerms.value = false
}

onMounted(async () => {
  try {
    const response = await bankAccountService.getBankAccounts()
    const accounts = response.data.data

    bankOptions.value = accounts.map(account => ({
      name: `${account.bank} - ${account.alias} (${account.currency})`,
      value: account.id,
      status: account.status,
      alias: account.alias,
      bank: account.bank,
      currency: account.currency,
      type: account.type,
      cci: account.cci
    }))
  } catch (error) {
    console.error('Error al obtener cuentas bancarias:', error)
  }
})
</script>
