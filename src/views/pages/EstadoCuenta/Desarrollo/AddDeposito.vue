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
        Realizar un depósito
      </div>
    </template>
    
    <div class="flex flex-col gap-6">
      <!-- Información de la cuenta -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">Nuestra cuenta:</span>
          <Button 
            icon="pi pi-copy" 
            size="small" 
            text 
            @click="copyToClipboard(accountNumber)"
            v-tooltip.top="'Copiar'"
          />
        </div>
        <div class="text-sm text-gray-600 mb-3">N°: {{ accountNumber }}</div>
        
        <div class="flex justify-between items-center mb-2">
          <span class="font-bold">{{ companyName }}</span>
          <Button 
            icon="pi pi-copy" 
            size="small" 
            text 
            @click="copyToClipboard(companyName)"
            v-tooltip.top="'Copiar'"
          />
        </div>
        
        <div class="flex justify-between items-center">
          <span class="text-sm">RUC: {{ ruc }}</span>
          <Button 
            icon="pi pi-copy" 
            size="small" 
            text 
            @click="copyToClipboard(ruc)"
            v-tooltip.top="'Copiar'"
          />
        </div>
      </div>

      <!-- Selección de cuenta bancaria -->
      <div>
        <label class="block text-sm font-medium mb-2">
          ¿De qué cuenta bancaria nos envías el dinero?
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
          />
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
          />
        </div>
      </div>

      <!-- Subir voucher -->
      <div>
        <label class="block text-sm font-medium mb-2">Subir voucher</label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
          <input
            ref="fileInput"
            type="file"
            accept="image/*,.pdf"
            @change="handleFileUpload"
            class="hidden"
          />
          
          <!-- Mostrar voucher si existe -->
          <div v-if="voucherFile" class="space-y-3">
            <!-- Preview de imagen -->
            <div v-if="isImage(voucherFile)" class="relative">
              <img 
                :src="voucherPreview" 
                alt="Voucher preview" 
                class="max-w-full h-32 object-contain mx-auto rounded cursor-pointer"
                @click="openImageModal"
              />
              <Button 
                icon="pi pi-times" 
                size="small" 
                severity="danger"
                rounded
                class="absolute -top-2 -right-2"
                @click="removeVoucher"
              />
            </div>
            
            <!-- Preview de PDF -->
            <div v-else class="flex items-center justify-center space-x-2">
              <i class="pi pi-file-pdf text-red-500 text-2xl"></i>
              <span class="text-sm">{{ voucherFile.name }}</span>
              <Button 
                icon="pi pi-eye" 
                size="small" 
                @click="openPdfModal"
                v-tooltip.top="'Ver PDF'"
              />
              <Button 
                icon="pi pi-times" 
                size="small" 
                severity="danger"
                @click="removeVoucher"
              />
            </div>
          </div>
          
          <!-- Botón para subir si no hay archivo -->
          <div v-else>
            <Button 
              icon="pi pi-upload" 
              label="Voucher" 
              @click="$refs.fileInput.click()"
              outlined
            />
            <p class="text-xs text-gray-500 mt-2">Formatos: JPG, PNG, PDF (Max. 5MB)</p>
          </div>
        </div>
      </div>

      <!-- Términos y condiciones -->
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
        <Button 
          label="Cancelar" 
          severity="secondary" 
          @click="updateVisible(false)" 
          rounded
        />
        <Button 
          label="Registrar depósito" 
          severity="info" 
          rounded 
          @click="handleSubmit"
          :disabled="!isFormValid"
        />
      </div>
    </template>

    <!-- Modal para ver imagen completa -->
    <Dialog 
      v-model:visible="showImageModal" 
      modal 
      :style="{ width: '80vw', maxWidth: '800px' }"
      header="Voucher"
    >
      <img 
        :src="voucherPreview" 
        alt="Voucher completo" 
        class="w-full h-auto"
      />
    </Dialog>

    <!-- Modal para ver PDF -->
    <Dialog 
      v-model:visible="showPdfModal" 
      modal 
      :style="{ width: '90vw', height: '80vh' }"
      header="Voucher PDF"
    >
      <iframe 
        v-if="pdfUrl" 
        :src="pdfUrl" 
        class="w-full h-full border-0"
      ></iframe>
    </Dialog>
  </Dialog>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['update:visible'])

// Datos de la cuenta
const accountNumber = ref('123456789012.34')
const companyName = ref('GARANTIA CAPITAL S.A.')
const ruc = ref('12345678901234.')

// Opciones de bancos
const bankOptions = ref([
  { name: 'BCP - Banco de Crédito del Perú', value: 'bcp' },
  { name: 'BBVA - Banco Continental', value: 'bbva' },
  { name: 'Scotiabank Perú', value: 'scotiabank' },
  { name: 'Interbank', value: 'interbank' },
  { name: 'BanBif', value: 'banbif' },
  { name: 'Banco Pichincha', value: 'pichincha' }
])

// Formulario
const selectedBank = ref(null)
const operationNumber = ref('')
const amount = ref(null)
const agreeTerms = ref(false)

// Voucher
const voucherFile = ref(null)
const voucherPreview = ref(null)
const showImageModal = ref(false)
const showPdfModal = ref(false)
const pdfUrl = ref(null)

// Computed
const isFormValid = computed(() => {
  return selectedBank.value && 
         operationNumber.value && 
         amount.value && 
         amount.value > 0 && 
         voucherFile.value && 
         agreeTerms.value
})

// Métodos
const updateVisible = (value) => emit('update:visible', value)

const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    // Aquí podrías mostrar un toast de confirmación
    console.log('Copiado al portapapeles:', text)
  } catch (err) {
    console.error('Error al copiar:', err)
  }
}

const isImage = (file) => {
  return file && file.type.startsWith('image/')
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validar tamaño (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert('El archivo es demasiado grande. Máximo 5MB.')
    return
  }

  // Validar tipo
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
  if (!validTypes.includes(file.type)) {
    alert('Formato no válido. Solo se permiten JPG, PNG y PDF.')
    return
  }

  voucherFile.value = file

  // Crear preview
  if (isImage(file)) {
    const reader = new FileReader()
    reader.onload = (e) => {
      voucherPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  } else if (file.type === 'application/pdf') {
    pdfUrl.value = URL.createObjectURL(file)
  }
}

const removeVoucher = () => {
  voucherFile.value = null
  voucherPreview.value = null
  pdfUrl.value = null
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

const handleSubmit = () => {
  if (!isFormValid.value) {
    alert('Por favor, completa todos los campos obligatorios.')
    return
  }

  const formData = {
    selectedBank: selectedBank.value,
    operationNumber: operationNumber.value,
    amount: amount.value,
    voucherFile: voucherFile.value,
    agreeTerms: agreeTerms.value
  }

  console.log('Datos del depósito:', formData)
  
  // Aquí enviarías los datos al servidor
  // Por ejemplo: await submitDeposit(formData)
  
  alert('Depósito registrado correctamente')
  updateVisible(false)
}
</script>