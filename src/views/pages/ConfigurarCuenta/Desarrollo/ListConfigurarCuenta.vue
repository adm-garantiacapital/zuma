<template>
  <Toast />
  <br>
  <div class="card p-6 space-y-6 border  rounded-lg">
    <!-- Título con Nombre -->
    <div class="text-center">
      <h2 class="text-2xl font-bold" style="color:#000">
        {{ perfil.name }} {{ perfil.first_last_name }} {{ perfil.second_last_name }}
      </h2>
      <p class="text-gray-500">{{ perfil.email }}</p>
    </div>

    <!-- Preguntas PEP -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex justify-between items-center  border p-4 rounded-lg">
        <label class="block font-medium mb-2 mt-2">¿Eres o has sido Persona Expuesta Políticamente (PEP)?<span
            class="text-red-500">*</span></label>
        <CustomToggle v-model="form.is_pep" />
      </div>
      <div class="flex justify-between items-center border p-4 rounded-lg">
        <label class="block font-medium mb-2 mt-2">Eres pariente, conyuge o conviviente de alguna persona que califique
          como
          PEP hasta el segundo grado de consanguinidad y segundo de afinidad?

          <span class="text-red-500">*</span></label>
        <CustomToggle v-model="form.has_relationship_pep" />

      </div>
    </div>

    <!-- Ubigeo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label class="block font-medium mb-2">Departamento<span class="text-red-500">*</span></label>
        <Select v-model="form.department" :options="departamentos" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione departamento" class="w-full" @change="onDepartamentoChange" />
      </div>
      <div>
        <label class="block font-medium mb-2">Provincia<span class="text-red-500">*</span></label>
        <Select v-model="form.province" :options="provincias" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione provincia" class="w-full" :disabled="!form.department" @change="onProvinciaChange" />
      </div>
      <div>
        <label class="block font-medium mb-2">Distrito<span class="text-red-500">*</span></label>
        <Select v-model="form.district" :options="distritos" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione distrito" class="w-full" :disabled="!form.province" />
      </div>
    </div>

    <!-- Dirección -->
    <div>
      <label class="block font-medium mb-2">Dirección<span class="text-red-500">*</span></label>
      <InputText v-model="form.address" class="w-full" placeholder="Ingrese su dirección" />
    </div>

    <!-- FOTO y DNI (adelante y atrás) con upload elegante -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Foto del Inversor (Opcional) con cámara real -->
      <div>
        <label class="block font-medium mb-3 text-gray-700">
          Foto del Inversor <span class="text-gray-400">(Opcional)</span>
        </label>

        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:border-green-400 transition-colors duration-300  hover:bg-green-50">
          <!-- Sin foto -->
          <div v-if="!investorPhotoPreview">
            <i class="pi pi-camera text-3xl text-gray-400" style="font-size: 1.75rem;"></i>
            <p class="text-gray-600">Captura tu foto</p>

            <Button label="Abrir Cámara" icon="pi pi-camera" rounded
              class="!bg-[#FF4929] !border-[#FF4929] hover:!bg-[#e64324] text-white" @click="startCamera" />
          </div>

          <!-- Con foto -->
          <div v-else class="relative">
            <img :src="investorPhotoPreview" alt="Foto del Inversor"
              class="max-w-full h-40 object-cover mx-auto rounded-lg shadow-md" />
            <div class="mt-3 flex justify-center gap-2">
              <Button icon="pi pi-refresh" label="Cambiar" outlined rounded size="small" @click="startCamera" />
              <Button icon="pi pi-times" label="Eliminar" outlined rounded size="small" severity="danger"
                @click="removeInvestorPhoto" />
            </div>
          </div>
        </div>
      </div>




      <!-- DNI Parte Delantera -->
      <div>
        <label class="block font-medium mb-3 text-gray-700">DNI - Parte Delantera<span
            class="text-red-500">*</span></label>
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-300  hover:bg-green-50">
          <input type="file" ref="frontFileInput" @change="onUploadFront"
            accept="image/jpeg,image/jpg,image/png,image/svg+xml,.jpg,.jpeg,.png,.svg" class="hidden" />

          <!-- Vista cuando no hay imagen -->
          <div v-if="!frontImagePreview" @click="$refs.frontFileInput.click()" class="cursor-pointer mb-2">
            <i class="pi pi-cloud-upload text-gray-400 mb-4 block" style="font-size: 1.75rem;"></i>
            <p class="text-gray-600 mb-2">Subir imagen</p>
            <p class="text-sm text-gray-400">o arrastra y suelta aquí</p>
          </div>

          <!-- Vista previa de la imagen -->
          <div v-else class="relative">
            <img :src="frontImagePreview" alt="DNI Frontal"
              class="max-w-full h-32 object-cover mx-auto rounded-lg shadow-md" />
            <div class="mt-3 flex justify-center gap-2">
              <Button icon="pi pi-refresh" @click="$refs.frontFileInput.click()" outlined rounded size="small"
                severity="secondary" title="Cambiar imagen" />
              <Button icon="pi pi-times" @click="removeFrontImage" outlined rounded size="small" severity="danger"
                title="Eliminar imagen" />
            </div>

            
          </div>
        </div>
      </div>

      <!-- DNI Parte Trasera -->
      <div>
        <label class="block font-medium mb-3 text-gray-700">DNI - Parte Trasera<span
            class="text-red-500">*</span></label>
        <div
          class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-300  hover:bg-green-50">
          <input type="file" ref="backFileInput" @change="onUploadBack"
            accept="image/jpeg,image/jpg,image/png,image/svg+xml,.jpg,.jpeg,.png,.svg" class="hidden" />

          <!-- Vista cuando no hay imagen -->
          <div v-if="!backImagePreview" @click="$refs.backFileInput.click()" class="mb-2 cursor-pointer">
            <i class="pi pi-cloud-upload  text-gray-400 mb-4 block" style="font-size: 1.75rem;"></i>
            <p class="text-gray-600 mb-2">Subir imagen</p>
            <p class="text-sm text-gray-400">o arrastra y suelta aquí</p>
          </div>

          <!-- Vista previa de la imagen -->
          <div v-else class="relative">
            <img :src="backImagePreview" alt="DNI Trasero"
              class="max-w-full h-32 object-cover mx-auto rounded-lg shadow-md" />
            <div class="mt-3 flex justify-center gap-2">
              <Button icon="pi pi-refresh" @click="$refs.backFileInput.click()" outlined rounded size="small"
                severity="secondary" title="Cambiar imagen" />
              <Button icon="pi pi-times" @click="removeBackImage" outlined rounded size="small" severity="danger"
                title="Eliminar imagen" />
            </div>
            <Badge value="Subido" severity="success" class="mt-2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Contrato y botón -->
    <div class="flex items-center space-x-4">
      <Checkbox v-model="form.contractAccepted" :binary="true" inputId="contract" />
      <label for="contract" class="text-sm">He leído y acepto el <span class="text-[#FF4929] font-semibold">contrato de
          Inversionista</span></label>
    </div>

    <div class="text-center">
      <Button label="Guardar" icon="pi pi-save" rounded severity="contrast" variant="outlined" fluid
        @click="guardarPerfil" :disabled="!canSave" :loading="isSaving" />
    </div>
  </div>

  <!-- Modal de cámara -->
  <Dialog v-model:visible="isCameraOpen" modal header="Capturar foto del inversor" :style="{ width: '500px' }"
    @hide="stopCamera">

    <div class="space-y-4">
      <video ref="videoRef" autoplay playsinline muted class="w-full h-64 object-cover rounded-lg bg-black"
        style="transform: scaleX(-1);"></video>

      <canvas ref="canvasRef" class="hidden"></canvas>

      <div class="flex justify-center gap-3">
        <Button icon="pi pi-refresh" label="Cambiar cámara" outlined @click="switchCamera" />
        <Button icon="pi pi-camera" label="Capturar" class="bg-green-600 hover:bg-green-700 border-none"
          @click="capturePhoto" />
        <Button icon="pi pi-times" label="Cerrar" severity="danger" outlined @click="stopCamera" />
      </div>
    </div>
  </Dialog>

</template>

<script setup>
import profileService from '@/services/profileService'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, ref } from 'vue'

import CustomToggle from '@/components/CustomToggle.vue'
import { watch } from 'vue'
import { useRouter } from 'vue-router'



const toast = useToast()
const router = useRouter()

const debugMode = ref(true) // Cambia a false en producción

const perfil = ref({})

const form = ref({
  is_pep: false,
  has_relationship_pep: false,
  department: null,
  province: null,
  district: null,
  address: '',
  contractAccepted: false,

  document_front: null,
  document_back: null
})

const departamentos = ref([])
const provincias = ref([])
const distritos = ref([])
const File = window.File
const frontImagePreview = ref('')
const backImagePreview = ref('')

const frontValidation = ref(null)

const isSaving = ref(false)


const investorPhotoPreview = ref('')
const investorPhotoFile = ref(null)

const onInvestorPhotoCapture = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    investorPhotoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  investorPhotoFile.value = file
}

const removeInvestorPhoto = () => {
  investorPhotoPreview.value = ''
  investorPhotoFile.value = null
}

// --- Cámara en vivo ---
const isCameraOpen = ref(false)
const videoRef = ref(null)
const canvasRef = ref(null)
let mediaStream = null
const facingMode = ref('user')
watch(isCameraOpen, (open) => {
  if (!open) stopCamera()
})

const startCamera = async () => {
  try {
    const constraints = {
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }

    // Ensure modal is open first
    isCameraOpen.value = true

    // Wait for next DOM tick so <video> exists
    await new Promise(resolve => setTimeout(resolve, 250))

    mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream
      await videoRef.value.play() // 👈 force playback
    } else {
      console.warn('videoRef not ready')
    }
  } catch (error) {
    console.error('Camera error:', error)
    toast.add({
      severity: 'error',
      summary: 'Error de cámara',
      detail: 'No se pudo acceder a la cámara. Verifica los permisos o recarga la página.',
      life: 4000
    })
  }
}



const stopCamera = () => {
  if (mediaStream) {
    mediaStream.getTracks().forEach(track => track.stop())
    mediaStream = null
  }
  isCameraOpen.value = false
}

const switchCamera = async () => {
  stopCamera()
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
  setTimeout(() => startCamera(), 300)
}

const capturePhoto = () => {
  if (!videoRef.value || !canvasRef.value) return
  const canvas = canvasRef.value
  const video = videoRef.value
  const ctx = canvas.getContext('2d')

  const size = Math.min(video.videoWidth, video.videoHeight)
  const x = (video.videoWidth - size) / 2
  const y = (video.videoHeight - size) / 2
  canvas.width = size
  canvas.height = size
  ctx.drawImage(video, x, y, size, size, 0, 0, size, size)


  const dataUrl = canvas.toDataURL('image/jpeg')
  investorPhotoPreview.value = dataUrl

  fetch(dataUrl)
    .then(res => res.blob())
    .then(blob => {
      investorPhotoFile.value = new File([blob], `investor_photo_${Date.now()}.jpg`, { type: 'image/jpeg' })
    })

  stopCamera()
}



const canSave = computed(() => {
  return form.value.department &&
    form.value.province &&
    form.value.district &&
    form.value.address &&
    form.value.document_front &&
    form.value.document_back &&
    form.value.contractAccepted 
})

onMounted(async () => {
  try {
    const { data } = await profileService.getProfile()
    perfil.value = data.data

    const res = await axios.get('https://novalink.oswa.workers.dev/api/v1/peru/ubigeo')
    departamentos.value = res.data
  } catch (err) {
    console.error('Error al cargar datos:', err)
  }
})

const onDepartamentoChange = () => {
  form.value.province = null
  form.value.district = null
  provincias.value = form.value.department?.provinces || []
  distritos.value = []
}

const onProvinciaChange = () => {
  form.value.district = null
  distritos.value = form.value.province?.districts || []
}

// Validar tamaño de archivo
const validateFileSize = (file, maxSizeMB = 5) => {
  const maxSize = maxSizeMB * 1024 * 1024 *1024// Convertir MB a bytes
  console.log(`Validando tamaño: ${file.size} bytes vs ${maxSize} bytes máx`)

  if (file.size > maxSize) {
    toast.add({
      severity: 'warn',
      summary: 'Archivo muy grande',
      detail: `El archivo debe ser menor a ${maxSizeMB}GB. Archivo actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      life: 4000
    })
    return false
  }
  return true
}

// Validar tipo de archivo
const validateFileType = (file) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']

  if (!allowedTypes.includes(file.type)) {
    toast.add({
      severity: 'warn',
      summary: 'Archivo no válido',
      detail: 'Solo se permiten imágenes (JPG, PNG, SVG)',
      life: 4000
    })
    return false
  }
  return true
}



const onUploadFront = async (event) => {
  const file = event.target.files[0]

  if (!file) {
    console.log('No file selected')
    return
  }

  console.log('=== Front File Upload Debug ===')
  console.log('File selected:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    constructor: file.constructor.name
  })

  // Validar tipo de archivo
  if (!validateFileType(file)) {
    event.target.value = '' // Limpiar input
    return
  }

  // Validar tamaño
  if (!validateFileSize(file, 5)) {
    event.target.value = '' // Limpiar input
    return
  }

  // CRÍTICO: Asignar directamente el archivo File original
  form.value.document_front = file

  console.log('File assigned to form.document_front:', {
    file: form.value.document_front,
    isFile: form.value.document_front instanceof File,
    name: form.value.document_front?.name,
    size: form.value.document_front?.size,
    type: form.value.document_front?.type,
    constructor: form.value.document_front?.constructor.name
  })

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    frontImagePreview.value = e.target.result
    console.log('Front preview created successfully')
  }
  reader.onerror = (error) => {
    console.error('Error reading front file:', error)
    toast.add({
      severity: 'error',
      summary: 'Error al cargar imagen',
      detail: 'No se pudo procesar la imagen',
      life: 4000
    })
  }
  reader.readAsDataURL(file)

  // Validar con OCR


  // Limpiar el input
  event.target.value = ''
  console.log('=== End Front File Upload Debug ===')
}

const onUploadBack = (event) => {
  const file = event.target.files[0]

  if (!file) {
    console.log('No back file selected')
    return
  }

  console.log('=== Back File Upload Debug ===')
  console.log('File selected:', {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
    constructor: file.constructor.name
  })

  // Validar tipo de archivo
  if (!validateFileType(file)) {
    event.target.value = '' // Limpiar input
    return
  }

  // Validar tamaño
  if (!validateFileSize(file, 5)) {
    event.target.value = '' // Limpiar input
    return
  }

  // CRÍTICO: Asignar directamente el archivo File original
  form.value.document_back = file

  console.log('File assigned to form.document_back:', {
    file: form.value.document_back,
    isFile: form.value.document_back instanceof File,
    name: form.value.document_back?.name,
    size: form.value.document_back?.size,
    type: form.value.document_back?.type,
    constructor: form.value.document_back?.constructor.name
  })

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    backImagePreview.value = e.target.result
    console.log('Back preview created successfully')
  }
  reader.onerror = (error) => {
    console.error('Error reading back file:', error)
    toast.add({
      severity: 'error',
      summary: 'Error al cargar imagen',
      detail: 'No se pudo procesar la imagen',
      life: 4000
    })
  }
  reader.readAsDataURL(file)

  // Limpiar el input
  event.target.value = ''
  console.log('=== End Back File Upload Debug ===')
}

const removeFrontImage = () => {
  form.value.document_front = null
  frontImagePreview.value = ''
  frontValidation.value = { status: null, message: '' }
  console.log('Front image removed')
}

const removeBackImage = () => {
  form.value.document_back = null
  backImagePreview.value = ''
  console.log('Back image removed')
}

const guardarPerfil = async () => {
  console.log('=== INICIO VALIDACIÓN GUARDAR PERFIL ===')

  if (!canSave.value) {
    toast.add({
      severity: 'warn',
      summary: 'Campos requeridos',
      detail: 'Debes completar todos los campos obligatorios.',
      life: 4000
    })
    return
  }

  isSaving.value = true

  try {
    // 📦 Crear FormData
    const payload = new FormData()

    // ✅ Booleanos: convertir a "1"/"0"
    payload.append('is_pep', form.value.is_pep ? '1' : '0')
    payload.append('has_relationship_pep', form.value.has_relationship_pep ? '1' : '0')

    // ✅ Ubigeo: enviar últimos 2 dígitos
    const formatUbigeo = (id) => {
      if (!id) return ''
      const str = String(id)
      return str.length >= 2 ? str.slice(-2) : str.padStart(2, '0')
    }

    const department = formatUbigeo(form.value.department?.ubigeo_id)
    const province = formatUbigeo(form.value.province?.ubigeo_id)
    const district = formatUbigeo(form.value.district?.ubigeo_id)
    const address = form.value.address?.trim() || ''

    payload.append('department', department)
    payload.append('province', province)
    payload.append('district', district)
    payload.append('address', address)

    // ✅ Archivos (solo si existen)
    if (form.value.document_front instanceof File) {
      payload.append('document_front', form.value.document_front, form.value.document_front.name)
    }
    if (form.value.document_back instanceof File) {
      payload.append('document_back', form.value.document_back, form.value.document_back.name)
    }
    if (investorPhotoFile.value instanceof File) {
      payload.append('investor_photo_path', investorPhotoFile.value, investorPhotoFile.value.name)
    }

    // 🧠 Debug simple
    console.log('=== FINAL FORM DATA ===')
    for (const [key, val] of payload.entries()) {
      console.log(key, val instanceof File ? `(File: ${val.name})` : val)
    }

    // 🚀 Enviar al servidor
    const response = await profileService.updateConfirmAccount(payload)
    console.log('✅ Perfil actualizado:', response)

    toast.add({
      severity: 'success',
      summary: 'Perfil actualizado',
      detail: 'Tu información se guardó correctamente.',
      life: 1000
    })


    setTimeout(()=>{
      router.push('/hipotecas/Cuenta-Bancaria')
    },1000)
  } catch (error) {
    console.error('❌ Error al guardar:', error)

    let message = 'Ocurrió un error al enviar los datos.'
    if (error.response?.data?.message) message = error.response.data.message
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat()
      message = errors.join(', ')
    }

    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: message,
      life: 5000
    })
  } finally {
    isSaving.value = false
  }

  console.log('=== FIN VALIDACIÓN GUARDAR PERFIL ===')
}

</script>