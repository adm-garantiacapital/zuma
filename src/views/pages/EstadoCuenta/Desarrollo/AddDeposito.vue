<template>
  <Dialog :visible="visible" @update:visible="updateVisible" modal :style="{ width: '480px' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <!-- Título centrado -->
    <template #header>
      <div class="w-full text-center text-xl font-bold" style="color: #FF4929;">
        Realizar un depósito
      </div>
    </template>

    <div class="flex flex-col gap-6">
      <!-- Información de la cuenta -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">Nuestra cuenta:</span>
          <Button icon="pi pi-copy" size="small" text @click="copyToClipboard(accountNumber)"
            v-tooltip.top="'Copiar'" />
        </div>
        <div class="text-sm text-gray-600 mb-3">N°: {{ accountNumber }}</div>

        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">{{ companyName }}</span>
          <Button icon="pi pi-copy" size="small" text @click="copyToClipboard(companyName)" v-tooltip.top="'Copiar'" />
        </div>

        <div class="flex justify-between items-center">
          <span class="text-sm">RUC: {{ ruc }}</span>
          <Button icon="pi pi-copy" size="small" text @click="copyToClipboard(ruc)" v-tooltip.top="'Copiar'" />
        </div>
      </div>

      <!-- Radio buttons para seleccionar tipo de depósito -->
      <div>
        <label class="block text-sm font-semibold mb-3 text-gray-700">
          Tipo de depósito
        </label>
        <div class="flex flex-col gap-3">
          <div class="flex items-center">
            <RadioButton v-model="depositType" inputId="deposit1" name="depositType" value="personal" />
            <label for="deposit1" class="ml-2 text-sm">Depósito a mi billetera</label>
          </div>
          <div class="flex items-center">
            <RadioButton v-model="depositType" inputId="deposit2" name="depositType" value="mortgage" />
            <label for="deposit2" class="ml-2 text-sm">Hipotecas con depósitos pendientes</label>
          </div>
        </div>
      </div>

      <!-- Selección de cooperativa con inversiones pendientes (solo si es hipoteca) -->
      <div v-if="depositType === 'mortgage'">
        <label class="block text-sm font-semibold mb-2 text-gray-700">
          Hipotecas con depósitos pendientes
        </label>
        <Select v-model="selectedPendingInvestment" :options="pendingCooperatives" optionLabel="propiedad"
          optionValue="id" placeholder="Seleccionar cooperativa" class="w-full">
          <!-- Cómo se muestran las opciones -->
          <template #option="slotProps">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-800">{{ slotProps.option.propiedad }}</span>
              <Tag value="Pendiente" severity="warn" />
            </div>
          </template>

          <!-- Valor seleccionado -->
          <template #value="slotProps">
            <div class="flex items-center justify-between w-full">
              <span class="text-sm" :class="slotProps.value ? 'text-gray-800' : 'text-gray-400'">
                {{ slotProps.value ? getCooperativeName(slotProps.value) : 'Seleccionar cooperativa' }}
              </span>
              <Tag v-if="slotProps.value" value="Pendiente" severity="warn" />
            </div>
          </template>
        </Select>
      </div>

      <!-- Selección de cuenta bancaria (solo si es depósito personal) -->
      <div v-if="depositType === 'personal'">
        <label class="block text-sm font-semibold mb-2 text-gray-700">
          ¿De qué cuenta bancaria nos envías el dinero?
        </label>
        <Select v-model="selectedBank" :options="bankOptions" optionLabel="name" optionValue="value"
          placeholder="Seleccionar cuenta" class="w-full" :optionDisabled="isOptionDisabled">
          <!-- Opción del dropdown -->
          <template #option="slotProps">
            <div class=""
              :class="{ 'opacity-50 cursor-not-allowed': slotProps.option.status === 'invalid' }">
              <!-- Fila superior: Alias + Estado -->
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-800 text-sm">
                  {{ slotProps.option.alias }}
                </span>
                <Tag :value="getStatusLabel(slotProps.option.status)"
                  :severity="slotProps.option.status === 'valid' ? 'success' : 'danger'" class="text-xs" />
              </div>

              <!-- Fila inferior: Banco | Moneda | Tipo -->
              <div class="text-xs text-gray-600">
                Banco: {{ slotProps.option.bank }} | Moneda: {{ slotProps.option.currency }} | Tipo: {{ slotProps.option.type }}
              </div>

              <!-- Mensaje adicional según estado -->
              <div v-if="slotProps.option.status === 'invalid'" class="text-xs text-red-500 mt-1">
                ⚠️ Esta cuenta aún no ha sido validada.
              </div>
              <div v-else class="text-xs text-green-600 mt-1">
                ✅ Esta cuenta fue validada correctamente.
              </div>
            </div>
          </template>

          <!-- Visualización de la cuenta seleccionada -->
          <template #value="slotProps">
            <div v-if="slotProps.value" class="text-sm text-gray-800">
              {{ getSelectedBankName(slotProps.value) }}
            </div>
            <span v-else class="text-gray-400 text-sm">Seleccionar cuenta</span>
          </template>
        </Select>
      </div>

      <!-- Selección del medio de pago (solo para hipotecas) -->
      <div v-if="depositType === 'mortgage'">
        <label class="block text-sm font-semibold mb-2 text-gray-700">
          ¿Desde qué medio realizaste el depósito?
        </label>
        <Select v-model="selectedPaymentSource" :options="paymentSources" optionLabel="name" optionValue="id"
          placeholder="Seleccionar medio" class="w-full">
          <!-- Opciones del dropdown -->
          <template #option="slotProps">
            <span class="text-sm text-gray-800">{{ slotProps.option.name }}</span>
          </template>

          <!-- Valor seleccionado -->
          <template #value="slotProps">
            <span v-if="slotProps.value" class="text-sm text-gray-800">
              {{ getPaymentSourceName(slotProps.value) }}
            </span>
            <span v-else class="text-gray-400 text-sm">Seleccionar medio</span>
          </template>
        </Select>
      </div>

      <!-- Subir voucher -->
      <div>
        <label class="block text-sm font-medium mb-2">Subir voucher</label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input ref="fileInput" type="file" accept="image/*,.pdf" @change="handleFileUpload" class="hidden" />

          <!-- Mostrar voucher si existe -->
          <div v-if="voucherFile" class="space-y-3">
            <!-- Preview de imagen -->
            <div v-if="isImage(voucherFile)" class="relative">
              <img :src="voucherPreview" alt="Voucher preview"
                class="max-w-full h-32 object-contain mx-auto rounded cursor-pointer" @click="openImageModal" />
              <Button icon="pi pi-times" size="small" severity="danger" rounded class="absolute -top-2 -right-2"
                @click="removeVoucher" />
            </div>

            <!-- Preview de PDF -->
            <div v-else class="flex items-center justify-center space-x-2">
              <i class="pi pi-file-pdf text-red-500 text-2xl"></i>
              <span class="text-sm">{{ voucherFile.name }}</span>
              <Button icon="pi pi-eye" size="small" @click="openPdfModal" v-tooltip.top="'Ver PDF'" />
              <Button icon="pi pi-times" size="small" severity="danger" @click="removeVoucher" />
            </div>
          </div>

          <!-- Botón para subir si no hay archivo -->
          <div v-else>
            <Button icon="pi pi-upload" label="Voucher" @click="$refs.fileInput.click()" outlined />
            <p class="text-xs text-gray-500 mt-2">Formatos: JPG, PNG, PDF (Max. 5MB)</p>
          </div>
        </div>
      </div>

      <!-- Datos detectados del OCR - Solo mostrar si hay datos pendientes de confirmar -->
      <div v-if="showOcrConfirmation" class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="flex items-center gap-2 mb-3">
          <i class="pi pi-eye text-blue-600"></i>
          <span class="text-sm font-semibold text-blue-800">Datos detectados automáticamente</span>
        </div>
        
        <div class="space-y-2 text-sm">
          <div v-if="detectedOperationNumber">
            <span class="text-gray-600">📄 N° Operación detectado:</span>
            <span class="font-semibold ml-2">{{ detectedOperationNumber }}</span>
          </div>
          <div v-if="detectedAmount">
            <span class="text-gray-600">💰 Monto detectado:</span>
            <span class="font-semibold ml-2">S/ {{ detectedAmount.toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <Button 
            label="Confirmar datos" 
            icon="pi pi-check" 
            size="small" 
            severity="success" 
            @click="confirmOcrData" 
          />
          <Button 
            label="Editar manualmente" 
            icon="pi pi-pencil" 
            size="small" 
            severity="secondary" 
            outlined 
            @click="editManually" 
          />
        </div>
      </div>

      <!-- Número de operación y monto -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium mb-2">
            N° de operación
            <i class="pi pi-info-circle ml-1" v-tooltip.top="'Número de la operación bancaria'"></i>
          </label>
          <InputText 
            v-model="operationNumber" 
            placeholder="0" 
            class="w-full" 
            :disabled="ocrDataConfirmed"
            :class="{ 'bg-green-50 border-green-300': ocrDataConfirmed }"
          />
          <div v-if="ocrDataConfirmed" class="text-xs text-green-600 mt-1 flex items-center gap-1">
            <i class="pi pi-check-circle"></i>
            Dato confirmado automáticamente
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Monto</label>
          <InputNumber 
            v-model="amount" 
            mode="currency" 
            currency="PEN" 
            locale="es-PE" 
            placeholder="0.00"
            class="w-full" 
            :disabled="ocrDataConfirmed"
            :class="{ 'bg-green-50': ocrDataConfirmed }"
          />
          <div v-if="ocrDataConfirmed" class="text-xs text-green-600 mt-1 flex items-center gap-1">
            <i class="pi pi-check-circle"></i>
            Dato confirmado automáticamente
          </div>
        </div>
      </div>

      <!-- Botón para habilitar edición si los datos están confirmados -->
      <div v-if="ocrDataConfirmed" class="text-center">
        <Button 
          label="Editar datos" 
          icon="pi pi-pencil" 
          size="small" 
          severity="warning" 
          outlined 
          @click="enableEditing" 
        />
      </div>

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

      <!-- Checkbox de declaración -->
      <div class="flex items-start space-x-2">
        <Checkbox v-model="agreeTerms" inputId="terms" binary />
        <label for="terms" class="text-sm">Firmar declaración</label>
      </div>
    </div>

    <!-- Footer del modal -->
    <template #footer>
      <div class="flex justify-end gap-2">
        <Button label="Cancelar" severity="secondary" @click="updateVisible(false)" rounded />
        <Button label="Registrar depósito" severity="info" rounded @click="handleSubmit" :disabled="!isFormValid" />
      </div>
    </template>

    <!-- Modal para ver imagen completa -->
    <Dialog v-model:visible="showImageModal" modal :style="{ width: '80vw', maxWidth: '800px' }" header="Voucher">
      <img :src="voucherPreview" alt="Voucher completo" class="w-full h-auto" />
    </Dialog>

    <!-- Modal para ver PDF -->
    <Dialog v-model:visible="showPdfModal" modal :style="{ width: '90vw', height: '80vh' }" header="Voucher PDF">
      <iframe v-if="pdfUrl" :src="pdfUrl" class="w-full h-full border-0"></iframe>
    </Dialog>
  </Dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { bankAccountService } from '@/services/bankAccountService'
import { useToast } from 'primevue/usetoast'
import { ocrService } from '@/services/ocrService'
import { fixedTermInvestmentService } from '@/services/fixedTermInvestmentService'
import { createMortgageDeposit, createDeposit } from '@/services/movementsservice'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible'])

const toast = useToast()
const accountNumber = ref('123456789012.34')
const companyName = ref('GARANTIA CAPITAL S.A.')
const ruc = ref('12345678901234.')

// Tipo de depósito
const depositType = ref('personal') // 'personal' o 'mortgage'

// Cooperativas pendientes (para hipotecas)
const pendingCooperatives = ref([])
const selectedPendingInvestment = ref(null)

// Opciones de medios de pago (para hipotecas)
const selectedPaymentSource = ref(null)
const paymentSources = ref([
  { id: 'yape', name: 'Yape' },
  { id: 'plin', name: 'Plin' },
  { id: 'bcp', name: 'BCP' },
  { id: 'interbank', name: 'Interbank' },
  { id: 'bbva', name: 'BBVA' },
  { id: 'scotiabank', name: 'Scotiabank' },
  { id: 'pichincha', name: 'Pichincha' },
  { id: 'tunki', name: 'Tunki' },
  { id: 'otros', name: 'Otros' }
])

// Opciones de bancos (para depósito personal)
const bankOptions = ref([])
const selectedBank = ref(null)

// Formulario común
const operationNumber = ref('')
const amount = ref(null)
const agreeTerms = ref(false)

// Voucher
const voucherFile = ref(null)
const voucherPreview = ref(null)
const showImageModal = ref(false)
const showPdfModal = ref(false)
const pdfUrl = ref(null)

// Estados para OCR
const showOcrConfirmation = ref(false)
const ocrDataConfirmed = ref(false)
const detectedOperationNumber = ref('')
const detectedAmount = ref(null)

// Computed para validación del formulario
const isFormValid = computed(() => {
  const commonValid = operationNumber.value &&
    amount.value &&
    amount.value > 0 &&
    voucherFile.value &&
    agreeTerms.value

  if (depositType.value === 'personal') {
    return commonValid && selectedBank.value
  } else if (depositType.value === 'mortgage') {
    return commonValid && selectedPendingInvestment.value && selectedPaymentSource.value
  }
  
  return false
})

// Watcher para limpiar datos cuando cambia el tipo de depósito
watch(depositType, (newType) => {
  if (newType === 'personal') {
    selectedPendingInvestment.value = null
    selectedPaymentSource.value = null
  } else {
    selectedBank.value = null
  }
})

// Métodos
const updateVisible = (value) => emit('update:visible', value)

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.add({
      severity: 'success',
      summary: 'Copiado',
      detail: 'Texto copiado al portapapeles',
      life: 2000
    })
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const getCooperativeName = (id) => {
  const item = pendingCooperatives.value.find(p => p.id === id)
  return item ? item.propiedad : ''
}

const getPaymentSourceName = (id) => {
  const source = paymentSources.value.find(p => p.id === id)
  return source ? source.name : ''
}

const isOptionDisabled = (option) => {
  return option.status === 'invalid'
}

const getStatusLabel = (status) => {
  return status === 'valid' ? 'Validada' : 'No validada'
}

const getSelectedBankName = (selectedValue) => {
  const bank = bankOptions.value.find(option => option.value === selectedValue)
  return bank ? bank.bank : ''
}

const isImage = (file) => {
  return file && file.type.startsWith('image/')
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tamaño del archivo (5MB máximo)
  if (file.size > 5 * 1024 * 1024) {
    toast.add({
      severity: 'warn',
      summary: 'Archivo muy grande',
      detail: 'El archivo debe ser menor a 5MB',
      life: 4000
    })
    return
  }

  // Guardar el archivo y crear preview
  voucherFile.value = file

  if (isImage(file)) {
    // Crear preview para imagen
    const reader = new FileReader()
    reader.onload = (e) => {
      voucherPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else if (file.type === 'application/pdf') {
    // Crear URL para PDF
    pdfUrl.value = URL.createObjectURL(file)
  }

  // Procesar OCR
  try {
    toast.add({
      severity: 'info',
      summary: 'Procesando...',
      detail: 'Detectando datos automáticamente',
      life: 3000
    })

    const response = await ocrService.extractText(file)
    const ocrData = response.data.data?.[0]

    if (ocrData) {
      detectedOperationNumber.value = ocrData.codigo || ''
      detectedAmount.value = parseFloat(ocrData.monto?.replace(/[^\d.]/g, '')) || null
      
      // Solo mostrar confirmación si se detectaron datos
      if (detectedOperationNumber.value || detectedAmount.value) {
        showOcrConfirmation.value = true
        ocrDataConfirmed.value = false
      }
    }

    console.log('Texto OCR:', response.data.text)
  } catch (error) {
    console.error('Error OCR:', error)
    toast.add({
      severity: 'warn',
      summary: 'OCR no disponible',
      detail: 'Debes ingresar los datos manualmente',
      life: 4000
    })
  }
}

const confirmOcrData = () => {
  // Confirmar los datos detectados
  if (detectedOperationNumber.value) {
    operationNumber.value = detectedOperationNumber.value
  }
  if (detectedAmount.value) {
    amount.value = detectedAmount.value
  }
  
  // Ocultar el panel de confirmación y marcar como confirmado
  showOcrConfirmation.value = false
  ocrDataConfirmed.value = true

  toast.add({
    severity: 'success',
    summary: 'Datos confirmados',
    detail: 'Los datos se han aplicado correctamente',
    life: 3000
  })
}

const editManually = () => {
  // Ocultar panel de confirmación y permitir edición manual
  showOcrConfirmation.value = false
  ocrDataConfirmed.value = false
  
  toast.add({
    severity: 'info',
    summary: 'Edición manual',
    detail: 'Puedes editar los campos manualmente',
    life: 3000
  })
}

const enableEditing = () => {
  // Habilitar edición de campos confirmados
  ocrDataConfirmed.value = false
  
  toast.add({
    severity: 'info',
    summary: 'Edición habilitada',
    detail: 'Ahora puedes modificar los datos',
    life: 3000
  })
}

const removeVoucher = () => {
  voucherFile.value = null
  voucherPreview.value = null
  pdfUrl.value = null
  showOcrConfirmation.value = false
  ocrDataConfirmed.value = false
  detectedOperationNumber.value = ''
  detectedAmount.value = null
  
  // Limpiar el input file
  if (document.querySelector('input[type="file"]')) {
    document.querySelector('input[type="file"]').value = ''
  }
}

const openImageModal = () => {
  showImageModal.value = true
}

const openPdfModal = () => {
  showPdfModal.value = true
}

// Cargar datos al montar el componente
onMounted(async () => {
  // Cargar cooperativas pendientes
  try {
    const response = await fixedTermInvestmentService.getReservasPendientes()
    pendingCooperatives.value = response.data.data || []
    console.log('Cooperativas pendientes cargadas:', pendingCooperatives.value)
  } catch (error) {
    console.error('Error al obtener cooperativas pendientes:', error)
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudieron cargar las cooperativas pendientes',
      life: 4000
    })
  }

  // Cargar cuentas bancarias
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

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.add({
      severity: 'warn',
      summary: 'Formulario incompleto',
      detail: 'Por favor, completa todos los campos obligatorios.',
      life: 4000
    })
    return
  }

  const formData = new FormData()
  formData.append('nro_operation', operationNumber.value)
  formData.append('amount', amount.value)
  formData.append('voucher', voucherFile.value)

  try {
    let response

    if (depositType.value === 'personal') {
      // Depósito personal
      formData.append('bank', selectedBank.value)
      response = await createDeposit(formData)
    } else {
      // Depósito de hipoteca
      formData.append('property_reservations_id', selectedPendingInvestment.value)
      formData.append('payment_source', selectedPaymentSource.value)
      response = await createMortgageDeposit(formData)
    }

    toast.add({
      severity: 'success',
      summary: 'Depósito registrado',
      detail: response.data.message || 'El depósito se ha enviado correctamente.',
      life: 4000
    })

    updateVisible(false)
    resetForm()
  } catch (error) {
    console.error('Error al registrar depósito:', error)
    toast.add({
      severity: 'error',
      summary: 'Error al registrar depósito',
      detail: error.response?.data?.message || 'Ocurrió un error inesperado.',
      life: 5000
    })
  }
}

const resetForm = () => {
  depositType.value = 'personal'
  selectedPendingInvestment.value = null
  selectedPaymentSource.value = null
  selectedBank.value = null
  operationNumber.value = ''
  amount.value = null
  agreeTerms.value = false
  voucherFile.value = null
  voucherPreview.value = null
  pdfUrl.value = null
  showOcrConfirmation.value = false
  ocrDataConfirmed.value = false
  detectedOperationNumber.value = ''
  detectedAmount.value = null
}
</script>