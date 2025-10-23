<template>
  <Dialog :visible="visible" @update:visible="updateVisible" modal :style="{ width: '480px' }"
    :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <!-- Título centrado -->
    <template #header>
      <div class="w-full text-center text-xl font-bold" style="color: #000;">
        Realizar un depósito
      </div>
    </template>

    <div class="flex flex-col gap-6 " style="color: #000;">



      <!-- Selección a cuenta bancaria (solo si es depósito personal) -->
      <div>
        <label class="block    mb-2 " style="color:#000">
          ¿A qué cuenta bancaria nos envías el dinero?
        </label>
        <Select v-model="selectedBankDestino" :options="bankDestinoOptions" optionLabel="name" optionValue="value"
          placeholder="Seleccionar cuenta" class="w-full">
          <!-- Opción del dropdown -->
          <template #option="slotProps">
            <div class="" :class="{ 'opacity-50 cursor-not-allowed': slotProps.option.status === 'approved' }">
              <!-- Fila superior: Alias + Estado -->
              <div class="flex justify-between items-center">
                <span class="  ">
                  {{ slotProps.option.alias }}
                </span>
              </div>

              <!-- Fila inferior: Banco | Moneda | Tipo -->
              <div class=" text-gray-600">
                Banco: {{ slotProps.option.bank }} | Moneda: {{ slotProps.option.currency }} | Tipo: {{
                  slotProps.option.type }}
              </div>
              <div class=" text-gray-600">
                CC: {{ slotProps.option.cc }} <br />
                CCI: {{ slotProps.option.cci }} <br />
              </div>
            </div>
          </template>

          <!-- Visualización de la cuenta seleccionada -->
          <template #value="slotProps">
            <div v-if="slotProps.value" class=" ">
              {{ getSelectedBankDestinoName(slotProps.value) }}
            </div>
            <span v-else class="text-gray-400 ">Seleccionar cuenta</span>
          </template>


          <template #empty>
            <div class="text-gray-500 text-center py-2">
              {{ isLoadingBankDestino ? 'Cargando cuentas...' : 'No hay cuentas disponibles' }}
            </div>
          </template>
        </Select>
      </div>
      <!-- Información de la cuenta destino seleccionada -->
      <div v-if="selectedBankDestino" class="bg-gray-50 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="">Cuenta seleccionada:</span>
          <Button icon="pi pi-copy" size="small" text
            @click="copyToClipboard(getBankDestinoNumber(selectedBankDestino))"
            v-tooltip.top="'Copiar número de cuenta'" />
        </div>

        <div class=" text-gray-600 mb-3">
          <span class="block">Banco: <b>{{ getBankDestinoField(selectedBankDestino, 'bank') }}</b></span>
          <span class="block">Moneda: <b>{{ getBankDestinoField(selectedBankDestino, 'currency') }}</b></span>
          <span class="block">Tipo: <b>{{ getBankDestinoField(selectedBankDestino, 'type') }}</b></span>
          <span class="block">CC: <b>{{ getBankDestinoField(selectedBankDestino, 'cc') }}</b></span>
          <span class="block">CCI: <b>{{ getBankDestinoField(selectedBankDestino, 'cci') }}</b></span>
        </div>

        <div class="flex justify-between items-center">
          <span class="font-bold text-gray-800">
            {{ getBankDestinoField(selectedBankDestino, 'alias') }}
          </span>

        </div>
      </div>

      <!-- Mensaje si no hay cuenta seleccionada -->
      <div v-else class="bg-gray-50 p-4 rounded-lg text-gray-500  text-center">
        Selecciona una cuenta destino para ver los detalles.
      </div>


      <!-- Radio buttons para seleccionar tipo de depósito -->
      <div>
        <label class="block mb-3" style="color: #000;">
          Tipo de depósito
        </label>
        <div class="flex flex-col gap-3" style="color: #000;">
          <div class="flex items-center">
            <RadioButton v-model="depositType" inputId="deposit1" name="depositType" value="personal" />
            <label for="deposit1" class="ml-2 ">Depósito a mi billetera</label>
          </div>
          <div class="flex items-center">
            <RadioButton v-model="depositType" inputId="deposit2" name="depositType" value="mortgage" />
            <label for="deposit2" class="ml-2 ">Hipotecas con depósitos pendientes</label>
          </div>
        </div>
      </div>

      <!-- Selección de cooperativa con inversiones pendientes (solo si es hipoteca) -->
      <div v-if="depositType === 'mortgage'">
        <label class="block   mb-2 text-gray-900">
          Hipotecas con depósitos pendientes
        </label>
        <Select v-model="selectedPendingInvestment" :options="pendingCooperatives" optionLabel="propiedad"
          optionValue="id" placeholder="Seleccionar cooperativa" class="w-full">
          <!-- Cómo se muestran las opciones -->
          <template #option="slotProps">
            <div class="flex items-center justify-between">
              <span class=" text-gray-800">{{ slotProps.option.propiedad }}</span>
              <Tag value="Pendiente" severity="warn" />
            </div>
          </template>

          <!-- Valor seleccionado -->
          <template #value="slotProps">
            <div class="flex items-center justify-between w-full">
              <span class="" :class="slotProps.value ? 'text-gray-800' : 'text-gray-400'">
                {{ slotProps.value ? getCooperativeName(slotProps.value) : 'Seleccionar cooperativa' }}
              </span>
              <Tag v-if="slotProps.value" value="Pendiente" severity="warn" />
            </div>
          </template>
        </Select>
      </div>




      <!-- Selección de cuenta bancaria (solo si es depósito personal) -->
      <div v-if="depositType === 'personal'">
        <label class="block  mb-2 ">
          ¿De qué cuenta bancaria nos envías el dinero?
        </label>
        <Select v-model="selectedBank" :options="bankOptions" optionLabel="name" optionValue="value"
          placeholder="Seleccionar cuenta" class="w-full" :optionDisabled="isOptionDisabled">
          <!-- Opción del dropdown -->
          <template #option="slotProps">
            <div :class="{ 'opacity-50 cursor-not-allowed': slotProps.option.status === 'invalid' }">
              <!-- Fila superior: Alias + Estado -->
              <div class="flex justify-between items-center">
                <span class="  ">
                  {{ slotProps.option.alias }}
                </span>
                <Tag :value="getStatusLabel(slotProps.option.status)"
                  :severity="slotProps.option.status === 'approved' ? 'success' : 'danger'" class="" />
              </div>

              <!-- Fila inferior: Banco | Moneda | Tipo -->
              <div class=" text-gray-600">
                Banco: {{ slotProps.option.bank }} | Moneda: {{ slotProps.option.currency }} | Tipo: {{
                  slotProps.option.type }}
              </div>

              <!-- Mensaje adicional según estado -->
              <div v-if="slotProps.option.status === 'approved'" class=" text-green-500 mt-1">

                ✅ Esta cuenta fue validada correctamente.
              </div>
              <div v-else class=" text-red-600 mt-1">
                ⚠️ Esta cuenta aún no ha sido validada.

              </div>
            </div>
          </template>

          <!-- Visualización de la cuenta seleccionada -->
          <template #value="slotProps">
            <div v-if="slotProps.value" class=" text-gray-800">
              {{ getSelectedBankName(slotProps.value) }}
            </div>
            <span v-else class="text-gray-400 ">Seleccionar cuenta</span>
          </template>

          <template #empty>
            <div class="text-gray-500 text-center py-2">
              {{ isLoadingBanks ? 'Cargando cuentas...' : 'No hay cuentas disponibles' }}
            </div>
          </template>
        </Select>
      </div>




      <!-- Selección del medio de pago (solo para hipotecas) -->
      <div v-if="depositType === 'mortgage'">
        <label class="block   mb-2 text-gray-700">
          ¿Desde qué medio realizaste el depósito?
        </label>
        <Select v-model="selectedPaymentSource" :options="paymentSources" optionLabel="name" optionValue="id"
          placeholder="Seleccionar medio" class="w-full">
          <!-- Opciones del dropdown -->
          <template #option="slotProps">
            <span class=" text-gray-800">{{ slotProps.option.name }}</span>
          </template>

          <!-- Valor seleccionado -->
          <template #value="slotProps">
            <span v-if="slotProps.value" class=" text-gray-800">
              {{ getPaymentSourceName(slotProps.value) }}
            </span>
            <span v-else class="text-gray-400 ">Seleccionar medio</span>
          </template>
        </Select>
      </div>

      <!-- Subir voucher -->
      <div>
        <label class="block  font-medium mb-2">Subir voucher</label>
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
              <span class="">{{ voucherFile.name }}</span>
              <Button icon="pi pi-eye" size="small" @click="openPdfModal" v-tooltip.top="'Ver PDF'" />
              <Button icon="pi pi-times" size="small" severity="danger" @click="removeVoucher" />
            </div>
          </div>

          <!-- Botón para subir si no hay archivo -->
          <div v-else>
            <Button icon="pi pi-cloud-upload" severity="info" rounded label="Voucher" @click="$refs.fileInput.click()"
               />
            <p class=" text-gray-500 mt-2">Formatos: JPG, PNG, PDF (Max. 5MB)</p>
          </div>
        </div>
      </div>

      <!-- Datos detectados del OCR - Solo mostrar si hay datos pendientes de confirmar -->
      <div v-if="showOcrConfirmation" class="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div class="flex items-center gap-2 mb-3">
          <i class="pi pi-eye text-blue-600"></i>
          <span class="  text-blue-800">Datos detectados automáticamente</span>
        </div>

        <div class="space-y-2 ">
          <div v-if="detectedOperationNumber">
            <span class="text-gray-600">📄 N° Operación detectado:</span>
            <span class=" ml-2">{{ detectedOperationNumber }}</span>
          </div>
          <div v-if="detectedAmount">
            <span class="text-gray-600">💰 Monto detectado:</span>
            <span class=" ml-2">S/ {{ detectedAmount.toFixed(2) }}</span>
          </div>
        </div>

        <div class="flex gap-2 mt-4">
          <Button label="Confirmar datos" icon="pi pi-check" size="small" severity="success" @click="confirmOcrData" />
          <Button label="Editar manualmente" icon="pi pi-pencil" size="small" severity="secondary" outlined
            @click="editManually" />
        </div>
      </div>

      <!-- Número de operación y monto -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block  font-medium mb-2">
            N° de operación
            <i class="pi pi-info-circle ml-1" v-tooltip.top="'Número de la operación bancaria'"></i>
          </label>
          <InputText v-model="operationNumber" placeholder="0" class="w-full" :disabled="ocrDataConfirmed"
            :class="{ 'bg-green-50 border-green-300': ocrDataConfirmed }" />
          <div v-if="ocrDataConfirmed" class=" text-green-600 mt-1 flex items-center gap-1">
            <i class="pi pi-check-circle"></i>
            Dato confirmado automáticamente
          </div>
        </div>
        <div>
          <label class="block  font-medium mb-2">Monto</label>
          <InputNumber v-model="amount" mode="currency" currency="PEN" locale="es-PE" placeholder="0.00" class="w-full"
            :disabled="ocrDataConfirmed" :class="{ 'bg-green-50': ocrDataConfirmed }" />
          <div v-if="ocrDataConfirmed" class=" text-green-600 mt-1 flex items-center gap-1">
            <i class="pi pi-check-circle"></i>
            Dato confirmado automáticamente
          </div>
        </div>
      </div>

      <!-- Botón para habilitar edición si los datos están confirmados -->
      <div v-if="ocrDataConfirmed" class="text-center">
        <Button label="Editar datos" icon="pi pi-pencil" size="small" severity="warning" outlined
          @click="enableEditing" />
      </div>

      <div class=" space-y-2">
        <p>
          Declaración jurada de origen de fondos
        </p>
        <p>
          Declaro que el origen de los fondos es legitimo, y no proviene de ninguna actividad ilícita.

        </p>
        <p>
          Asi mismo, declaro que dichos fondos serán destinados a la compra de facturas negociables

        </p>
        <p>
          Con caracter de DECLARACIÓN JURADA, manifiestoque la información consignada es exacta y verdadera y que he
          sido
          informado/a respecto a las normas y regulaciones relacionadas con la prevención del lavado de activos en el
          país


        </p>
      </div>

      <!-- Checkbox de declaración -->
      <div class="flex items-start space-x-2">
        <Checkbox v-model="agreeTerms" inputId="terms" binary />
        <label for="terms">Firmar declaración</label>
      </div>
    </div>

    <!-- Footer del modal -->
    <template #footer>
      <div class="flex w-full">
      
        <Button
      label="Registrar depósito"
      icon="pi pi-save"  
      rounded
      outlined
      @click="handleSubmit"
      
      class="flex-1 !bg-transparent !text-black !border-black hover:!bg-slate-100 transition-colors duration-200 !font-semibold !tracking-wide !border-2"
    />
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
import { bankAccountDestinoService } from '@/services/bankAccountDestinoService'
import { bankAccountService } from '@/services/bankAccountService'
import { fixedTermInvestmentService } from '@/services/fixedTermInvestmentService'
import { createDeposit, createMortgageDeposit } from '@/services/movementsservice'
import { ocrService } from '@/services/ocrService'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref, watch } from 'vue'


const isLoadingBankDestino = ref(true)
const isLoadingBanks = ref(true)


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

const bankDestinoOptions = ref([])
const selectedBankDestino = ref(null)

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
  return option.status !== 'approved'
}

const getStatusLabel = (status) => {
  return status === 'approved' ? 'Aprobada' : 'No aprobada'
}

const getSelectedBankName = (selectedValue) => {
  const bank = bankOptions.value.find(option => option.value === selectedValue)
  return bank ? bank.bank : ''
}

const getSelectedBankDestinoName = (selectedValue) => {
  const bankDestino = bankDestinoOptions.value.find(option => option.value === selectedValue)
  return bankDestino ? bankDestino.bank : ''
}

const isImage = (file) => {
  return file && file.type.startsWith('image/')
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tamaño del archivo (5MB máximo)
  if (file.size > 5 * 1024 * 1024 * 1024) {
    toast.add({
      severity: 'warn',
      summary: 'Archivo muy grande',
      detail: 'El archivo debe ser menor a 5GB',
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
    isLoadingBanks.value = true
    const response = await bankAccountService.getBankAccounts()
    const accounts = response.data.data

    bankOptions.value = accounts.map(account => ({
      name: `${account.bank} - ${account.alias} (${account.currency})`,
      value: account.id,
      status: account.status_conclusion,
      alias: account.alias,
      bank: account.bank,
      currency: account.currency,
      type: account.type,
      cci: account.cci
    }))
  } catch (error) {
    console.error('Error al obtener cuentas bancarias:', error)
  } finally {
    isLoadingBanks.value = false
  }

  try {

    isLoadingBankDestino.value = true

    const responsedestino = await bankAccountDestinoService.getBankAccountsDestinos()
    const accountsdestino = responsedestino.data.data

    bankDestinoOptions.value = accountsdestino.map(account => ({
      name: `${account.bank} - ${account.alias} (${account.currency})`,
      value: account.id,

      alias: account.alias,
      bank: account.bank,
      currency: account.currency,
      type: account.type,
      cci: account.cci,
      cc: account.cc
    }))
  } catch (error) {
    console.error('Error al obtener cuentas bancarias:', error)
  } finally {
    isLoadingBankDestino.value = false
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
      formData.append('bank_destino', selectedBankDestino.value)
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
  selectedBankDestino.value = null
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


const getBankDestinoField = (id, field) => {
  const bank = bankDestinoOptions.value.find(b => b.value === id)
  return bank ? bank[field] ?? '' : ''
}

const getBankDestinoNumber = (id) => {
  const bank = bankDestinoOptions.value.find(b => b.value === id)
  return bank ? (bank.cc || bank.cci || '') : ''
}

</script>