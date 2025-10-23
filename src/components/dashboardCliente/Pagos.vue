<template>
    <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" modal header="Procesar Pago"
        :style="{ width: '500px' }" class="payment-dialog">

        <div v-if="payment" class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div><span class="text-gray-600">Cuota N°:</span><span class="font-semibold ml-2">{{ payment.cuota
                    }}</span></div>
                    <div><span class="text-gray-600">Vencimiento:</span><span class="font-semibold ml-2">{{
                        formatDate(payment.vencimiento) }}</span></div>
                    <div><span class="text-gray-600">Capital:</span><span class="font-semibold ml-2">{{
                        formatCurrency(payment.capital) }}</span></div>
                    <div><span class="text-gray-600">Intereses:</span><span class="font-semibold ml-2">{{
                        formatCurrency(payment.intereses) }}</span></div>
                    <div class="col-span-2 pt-2 border-t">
                        <span class="text-gray-600">Total:</span>
                        <span class="font-bold text-lg text-green-600 ml-2">{{ formatCurrency(payment.total_cuota)
                        }}</span>
                    </div>
                </div>
                <div class="flex flex-col gap-6 py-12">
                    <div>
                        <label class="block text-sm font-semibold mb-2 text-gray-700">
                            ¿Desde qué medio realizaste el depósito?
                        </label>
                        <Select v-model="selectedPaymentSource" :options="paymentSources" optionLabel="name"
                            optionValue="id" placeholder="Seleccionar medio" class="w-full">
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
                            <input ref="fileInput" type="file" accept="image/*,.pdf" @change="handleFileUpload"
                                class="hidden" />

                            <!-- Mostrar voucher si existe -->
                            <div v-if="voucherFile" class="space-y-3">
                                <!-- Preview de imagen -->
                                <div v-if="isImage(voucherFile)" class="relative">
                                    <img :src="voucherPreview" alt="Voucher preview"
                                        class="max-w-full h-32 object-contain mx-auto rounded cursor-pointer"
                                        @click="openImageModal" />
                                    <Button icon="pi pi-times" size="small" severity="danger" rounded
                                        class="absolute -top-2 -right-2" @click="removeVoucher" />
                                </div>

                                <!-- Preview de PDF -->
                                <div v-else class="flex items-center justify-center space-x-2">
                                    <i class="pi pi-file-pdf text-red-500 text-2xl"></i>
                                    <span class="text-sm">{{ voucherFile.name }}</span>
                                    <Button icon="pi pi-eye" size="small" @click="openPdfModal"
                                        v-tooltip.top="'Ver PDF'" />
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
                            <Button label="Confirmar datos" icon="pi pi-check" size="small" severity="success"
                                @click="confirmOcrData" />
                            <Button label="Editar manualmente" icon="pi pi-pencil" size="small" severity="secondary"
                                outlined @click="editManually" />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">
                                N° de operación
                                <i class="pi pi-info-circle ml-1" v-tooltip.top="'Número de la operación bancaria'"></i>
                            </label>
                            <InputText v-model="operationNumber" placeholder="0" class="w-full"
                                :disabled="ocrDataConfirmed"
                                :class="{ 'bg-green-50 border-green-300': ocrDataConfirmed }" />
                            <div v-if="ocrDataConfirmed" class="text-xs text-green-600 mt-1 flex items-center gap-1">
                                <i class="pi pi-check-circle"></i>
                                Dato confirmado automáticamente
                            </div>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Monto</label>
                            <InputNumber v-model="amount" mode="currency" currency="PEN" locale="es-PE"
                                placeholder="0.00" class="w-full" :disabled="ocrDataConfirmed"
                                :class="{ 'bg-green-50': ocrDataConfirmed }" />
                            <div v-if="ocrDataConfirmed" class="text-xs text-green-600 mt-1 flex items-center gap-1">
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
            </div>
        </div>
        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" severity="secondary"
                    @click="emit('update:visible', false)" />
                <Button label="Procesar Pago" severity="info" icon="pi pi-check" rounded @click="handleSubmit" :disabled="!isFormValid" />    
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Checkbox from 'primevue/checkbox'
import { useToast } from 'primevue/usetoast'
import { ocrService } from '@/services/ocrService'
import { createZumaDeposit } from '@/services/movementsservice'

const props = defineProps({ visible: Boolean, payment: Object })
const emit = defineEmits(['update:visible', 'payment-success'])

const toast = useToast()
const paymentMethod = ref('')
const operationNumber = ref('')
const loading = ref(false)
const selectedPaymentSource = ref(null)

const voucherFile = ref(null)
const voucherPreview = ref(null)
const showImageModal = ref(false)
const showPdfModal = ref(false)
const pdfUrl = ref(null)

const showOcrConfirmation = ref(false)
const ocrDataConfirmed = ref(false)
const detectedOperationNumber = ref('')
const detectedAmount = ref(null)
const payment_schedules_id = ref(null)
const amount = ref(null)
const agreeTerms = ref(false)

// 🔥 CAMBIO PRINCIPAL: Watcher para asignar el payment_schedules_id cuando cambie payment
watch(() => props.payment, (newPayment) => {
  if (newPayment && newPayment.id) {
    payment_schedules_id.value = newPayment.id
    console.log('Payment Schedule ID asignado:', payment_schedules_id.value)
  }
}, { immediate: true })

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

const getPaymentSourceName = (id) => {
  const source = paymentSources.value.find(p => p.id === id)
  return source ? source.name : ''
}

const submitPayment = async () => {
    if (!paymentMethod.value) {
        return toast.add({ severity: 'warn', summary: 'Falta Método', detail: 'Seleccione un método de pago', life: 3000 })
    }

    if (paymentMethod.value === 'transferencia' && !operationNumber.value) {
        return toast.add({ severity: 'warn', summary: 'Falta Número', detail: 'Ingrese número de operación', life: 3000 })
    }

    loading.value = true
    try {
        // Aquí iría el llamado real a tu API
        toast.add({ severity: 'success', summary: 'Pago Realizado', detail: 'El pago fue exitoso', life: 5000 })
        emit('payment-success', props.payment.id)
        emit('update:visible', false)
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al procesar el pago', life: 5000 })
    } finally {
        loading.value = false
    }
}

const isImage = (file) => {
  return file && file.type.startsWith('image/')
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tamaño del archivo (5MB máximo)
  if (file.size > 5 * 1024 * 1024 *1024) {
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

const isFormValid = computed(() => {
  return selectedPaymentSource.value &&
    operationNumber.value &&
    amount.value &&
    amount.value > 0 &&
    voucherFile.value &&
    agreeTerms.value &&
    payment_schedules_id.value  // 🔥 AÑADIDO: Validar que tenemos el ID
})

// 🔥 FUNCIÓN PARA RESETEAR EL FORMULARIO
const resetForm = () => {
  selectedPaymentSource.value = null
  operationNumber.value = ''
  amount.value = null
  voucherFile.value = null
  voucherPreview.value = null
  pdfUrl.value = null
  agreeTerms.value = false
  showOcrConfirmation.value = false
  ocrDataConfirmed.value = false
  detectedOperationNumber.value = ''
  detectedAmount.value = null
  
  // Limpiar el input file
  if (document.querySelector('input[type="file"]')) {
    document.querySelector('input[type="file"]').value = ''
  }
}

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

  // 🔥 VALIDACIÓN ADICIONAL
  if (!payment_schedules_id.value) {
    toast.add({
      severity: 'error',
      summary: 'Error de datos',
      detail: 'No se pudo obtener el ID del cronograma de pago.',
      life: 4000
    })
    return
  }

  loading.value = true

  const formData = new FormData()
  formData.append('payment_schedules_id', payment_schedules_id.value) // 🔥 YA ESTÁ ASIGNADO
  formData.append('payment_source', selectedPaymentSource.value)
  formData.append('nro_operation', operationNumber.value)
  formData.append('amount', amount.value)
  formData.append('voucher', voucherFile.value)

  try {
    console.log('Enviando datos:', {
      payment_schedules_id: payment_schedules_id.value,
      payment_source: selectedPaymentSource.value,
      nro_operation: operationNumber.value,
      amount: amount.value,
      voucher_name: voucherFile.value?.name
    })

    const response = await createZumaDeposit(formData)

    toast.add({
      severity: 'success',
      summary: 'Depósito registrado',
      detail: response.data.message || 'El depósito se ha enviado correctamente.',
      life: 4000
    })

    // Emitir evento de éxito y cerrar diálogo
    emit('payment-success', props.payment.id)
    emit('update:visible', false)
    resetForm()
  } catch (error) {
    console.error('Error al registrar depósito:', error)
    toast.add({
      severity: 'error',
      summary: 'Error al registrar depósito',
      detail: error.response?.data?.message || 'Ocurrió un error inesperado.',
      life: 5000
    })
  } finally {
    loading.value = false
  }
}

const formatDate = (date) => new Date(date).toLocaleDateString('es-PE')
const formatCurrency = (amount) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
</script>