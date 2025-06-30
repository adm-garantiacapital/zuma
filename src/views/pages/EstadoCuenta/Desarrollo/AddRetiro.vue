<template>
  <Dialog 
    :visible="visible" 
    @update:visible="updateVisible" 
    modal 
    :style="{ width: '450px' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
  >
    <!-- Título centrado -->
    <template #header>
      <div class="w-full text-center text-xl font-bold" style="color: #FF4929;">
        Solicitar retiro
      </div>
    </template>
    
    <div class="flex flex-col gap-6">
      <!-- Cuenta bancaria destino -->
      <div>
        <label class="block text-sm font-medium mb-2">
          ¿A qué cuenta bancaria te enviamos el dinero?
        </label>
        <Dropdown 
          v-model="selectedBank" 
          :options="bankOptions" 
          optionLabel="name" 
          optionValue="value"
          placeholder="Seleccionar cuenta" 
          class="w-full"
        />
      </div>

      <!-- Mi billetera -->
      <div>
        <label class="block text-sm font-medium mb-2">
          Mi billetera
        </label>
        <Dropdown 
          v-model="selectedWallet" 
          :options="walletOptions" 
          optionLabel="name" 
          optionValue="value"
          placeholder="Selecciona tu billetera" 
          class="w-full"
        />
      </div>

      <!-- Monto -->
      <div>
        <label class="block text-sm font-medium mb-2">
          Monto (Selecciona tu cuenta)
        </label>
        <div class="relative">
          <InputNumber 
            v-model="amount" 
            mode="decimal" 
            :minFractionDigits="2"
            :maxFractionDigits="2"
            placeholder="0.00"
            class="w-full"
            :disabled="!selectedWallet"
          />
          <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
            {{ selectedWallet ? getCurrencySymbol(selectedWallet) : 'S/.' }}
          </div>
        </div>
        <div v-if="selectedWallet" class="text-xs text-gray-500 mt-1">
          Saldo disponible: {{ getAvailableBalance(selectedWallet) }}
        </div>
      </div>

      <!-- Motivo de retiro -->
      <div>
        <label class="block text-sm font-medium mb-2">
          Motivo de retiro
        </label>
        <Dropdown 
          v-model="withdrawalReason" 
          :options="reasonOptions" 
          optionLabel="name" 
          optionValue="value"
          placeholder="Seleccionar Motivo de retiro" 
          class="w-full"
        />
      </div>

      <!-- Términos y condiciones -->
      <div class="flex items-start space-x-2">
        <Checkbox v-model="agreeTerms" inputId="terms" binary />
        <label for="terms" class="text-sm">
          Acepto Términos y Condiciones y la 
          <span class="text-red-500 cursor-pointer hover:underline" @click="openPrivacyPolicy">
            Política de Privacidad
          </span>
        </label>
      </div>

      <!-- Términos y condiciones texto -->
      <div class="text-xs text-gray-600 space-y-2">
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
      </div>
    </div>

    <!-- Footer del modal -->
    <template #footer>
      <div class="flex justify-center w-full">
        <Button 
          label="Solicitar retiro" 
          class="w-full max-w-md"
          style="background: #4A90E2; border-color: #4A90E2;"
          @click="handleSubmit"
          :disabled="!isFormValid"
        />
      </div>
    </template>

    <!-- Modal de confirmación -->
    <Dialog 
      v-model:visible="showConfirmation" 
      modal 
      :style="{ width: '400px' }"
      header="Confirmar Retiro"
    >
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
          <Button 
            label="Cancelar" 
            severity="secondary" 
            @click="showConfirmation = false"
          />
          <Button 
            label="Confirmar" 
            severity="success" 
            @click="confirmWithdrawal"
          />
        </div>
      </template>
    </Dialog>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible'])

// Opciones de bancos
const bankOptions = ref([
  { name: 'BCP - Banco de Crédito del Perú', value: 'bcp' },
  { name: 'BBVA - Banco Continental', value: 'bbva' },
  { name: 'Scotiabank Perú', value: 'scotiabank' },
  { name: 'Interbank', value: 'interbank' },
  { name: 'BanBif', value: 'banbif' },
  { name: 'Banco Pichincha', value: 'pichincha' }
])

// Opciones de billeteras (simuladas)
const walletOptions = ref([
  { name: 'Billetera Principal - S/. 1,250.00', value: 'main_pen', currency: 'PEN', balance: 1250.00 },
  { name: 'Billetera USD - $ 350.00', value: 'usd_wallet', currency: 'USD', balance: 350.00 },
  { name: 'Billetera Ahorro - S/. 500.00', value: 'savings_pen', currency: 'PEN', balance: 500.00 }
])

// Opciones de motivos de retiro
const reasonOptions = ref([
  { name: 'Gastos personales', value: 'personal' },
  { name: 'Pago de servicios', value: 'services' },
  { name: 'Inversión', value: 'investment' },
  { name: 'Emergencia médica', value: 'medical' },
  { name: 'Educación', value: 'education' },
  { name: 'Otro', value: 'other' }
])

// Formulario
const selectedBank = ref(null)
const selectedWallet = ref(null)
const amount = ref(null)
const withdrawalReason = ref(null)
const agreeTerms = ref(false)
const showConfirmation = ref(false)

// Computed
const isFormValid = computed(() => {
  return selectedBank.value && 
         selectedWallet.value && 
         amount.value && 
         amount.value > 0 && 
         withdrawalReason.value && 
         agreeTerms.value &&
         amount.value <= getMaxAmount()
})

// Métodos
const updateVisible = (value) => emit('update:visible', value)

const getCurrencySymbol = (walletValue) => {
  const wallet = walletOptions.value.find(w => w.value === walletValue)
  return wallet?.currency === 'USD' ? '$' : 'S/.'
}

const getAvailableBalance = (walletValue) => {
  const wallet = walletOptions.value.find(w => w.value === walletValue)
  if (!wallet) return '0.00'
  
  const symbol = wallet.currency === 'USD' ? '$' : 'S/.'
  return `${symbol} ${wallet.balance.toFixed(2)}`
}

const getMaxAmount = () => {
  if (!selectedWallet.value) return 0
  const wallet = walletOptions.value.find(w => w.value === selectedWallet.value)
  return wallet?.balance || 0
}

const getBankName = (bankValue) => {
  const bank = bankOptions.value.find(b => b.value === bankValue)
  return bank?.name || ''
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
  // Aquí podrías abrir un modal con la política de privacidad
  // o redirigir a una página externa
  console.log('Abrir política de privacidad')
}

const handleSubmit = () => {
  if (!isFormValid.value) {
    alert('Por favor, completa todos los campos obligatorios.')
    return
  }

  // Validar que el monto no exceda el saldo disponible
  if (amount.value > getMaxAmount()) {
    alert('El monto no puede exceder el saldo disponible en tu billetera.')
    return
  }

  showConfirmation.value = true
}

const confirmWithdrawal = () => {
  const formData = {
    selectedBank: selectedBank.value,
    selectedWallet: selectedWallet.value,
    amount: amount.value,
    withdrawalReason: withdrawalReason.value,
    agreeTerms: agreeTerms.value
  }

  console.log('Datos del retiro:', formData)
  
  // Aquí enviarías los datos al servidor
  // Por ejemplo: await submitWithdrawal(formData)
  
  showConfirmation.value = false
  alert('Solicitud de retiro enviada correctamente')
  updateVisible(false)
  
  // Limpiar formulario
  resetForm()
}

const resetForm = () => {
  selectedBank.value = null
  selectedWallet.value = null
  amount.value = null
  withdrawalReason.value = null
  agreeTerms.value = false
}
</script>