<template>
  <Toast />
  <br>
  <div class="card p-6 space-y-6 border p-3 rounded-lg">
    <!-- Título con Nombre -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ perfil.name }} {{ perfil.first_last_name }} {{ perfil.second_last_name }}
      </h2>
      <p class="text-gray-500">{{ perfil.email }}</p>
    </div>

    <!-- Preguntas PEP -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="border p-3 rounded-lg">
        <label class="block font-medium mb-2">¿Eres o has sido Persona Expuesta Políticamente (PEP)?<span class="text-red-500">*</span></label>
        <ToggleSwitch v-model="form.is_pep" />
      </div>
      <div class="border p-3 rounded-lg">
        <label class="block font-medium mb-2">¿Eres pariente, cónyuge o conviviente de alguna persona PEP?<span class="text-red-500">*</span></label>
        <ToggleSwitch v-model="form.has_relationship_pep" />
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
          placeholder="Seleccione provincia" class="w-full" :disabled="!form.department"
          @change="onProvinciaChange" />
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

    <!-- DNI (adelante y atrás) con upload elegante -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- DNI Parte Delantera -->
      <div>
        <label class="block font-medium mb-3 text-gray-700">DNI - Parte Delantera<span class="text-red-500">*</span></label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-300 bg-gray-50 hover:bg-green-50">
          <input 
            type="file" 
            ref="frontFileInput"
            @change="onUploadFront" 
            accept="image/jpeg,image/jpg,image/png,image/svg+xml,.jpg,.jpeg,.png,.svg" 
            class="hidden"
          />
          
          <!-- Vista cuando no hay imagen -->
          <div v-if="!frontImagePreview" @click="$refs.frontFileInput.click()" class="cursor-pointer">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4 block"></i>
            <p class="text-gray-600 mb-2">Haz clic para subir imagen</p>
            <p class="text-sm text-gray-400">o arrastra y suelta aquí</p>
            <p class="text-xs text-gray-400 mt-2">Formatos: JPG, PNG, SVG (máx. 5MB)</p>
          </div>
          
          <!-- Vista previa de la imagen -->
          <div v-else class="relative">
            <img 
              :src="frontImagePreview" 
              alt="DNI Frontal" 
              class="max-w-full h-32 object-cover mx-auto rounded-lg shadow-md"
            />
            <div class="mt-3 flex justify-center gap-2">
              <Button 
                icon="pi pi-refresh" 
                @click="$refs.frontFileInput.click()" 
                outlined 
                rounded 
                size="small"
                severity="secondary"
                title="Cambiar imagen"
              />
              <Button 
                icon="pi pi-times" 
                @click="removeFrontImage" 
                outlined 
                rounded 
                size="small"
                severity="danger"
                title="Eliminar imagen"
              />
            </div>
            
            <!-- Estado de validación -->
            <div class="mt-2">
              <Badge 
                v-if="frontValidation.status === 'valid'" 
                value="DNI Validado" 
                severity="success" 
              />
              <Badge 
                v-else-if="frontValidation.status === 'invalid'" 
                value="DNI Inválido" 
                severity="danger" 
              />
              <Badge 
                v-else-if="frontValidation.status === 'processing'" 
                value="Validando..." 
                severity="secondary" 
              />
              <Badge 
                v-else 
                value="Subida - Sin validar" 
                severity="warning" 
              />
            </div>
            
            <!-- Mensaje de error -->
            <div v-if="frontValidation.message && frontValidation.status === 'invalid'" 
                 class="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
              {{ frontValidation.message }}
            </div>
          </div>
        </div>
      </div>

      <!-- DNI Parte Trasera -->
      <div>
        <label class="block font-medium mb-3 text-gray-700">DNI - Parte Trasera<span class="text-red-500">*</span></label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-300 bg-gray-50 hover:bg-green-50">
          <input 
            type="file" 
            ref="backFileInput"
            @change="onUploadBack" 
            accept="image/jpeg,image/jpg,image/png,image/svg+xml,.jpg,.jpeg,.png,.svg" 
            class="hidden"
          />
          
          <!-- Vista cuando no hay imagen -->
          <div v-if="!backImagePreview" @click="$refs.backFileInput.click()" class="cursor-pointer">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4 block"></i>
            <p class="text-gray-600 mb-2">Haz clic para subir imagen</p>
            <p class="text-sm text-gray-400">o arrastra y suelta aquí</p>
            <p class="text-xs text-gray-400 mt-2">Formatos: JPG, PNG, SVG (máx. 5MB)</p>
          </div>
          
          <!-- Vista previa de la imagen -->
          <div v-else class="relative">
            <img 
              :src="backImagePreview" 
              alt="DNI Trasero" 
              class="max-w-full h-32 object-cover mx-auto rounded-lg shadow-md"
            />
            <div class="mt-3 flex justify-center gap-2">
              <Button 
                icon="pi pi-refresh" 
                @click="$refs.backFileInput.click()" 
                outlined 
                rounded 
                size="small"
                severity="secondary"
                title="Cambiar imagen"
              />
              <Button 
                icon="pi pi-times" 
                @click="removeBackImage" 
                outlined 
                rounded 
                size="small"
                severity="danger"
                title="Eliminar imagen"
              />
            </div>
            <Badge value="Subido" severity="success" class="mt-2" />
          </div>
        </div>
      </div>
    </div>

    <!-- Contrato y botón -->
    <div class="flex items-center space-x-4">
      <Checkbox v-model="form.contractAccepted" :binary="true" inputId="contract" />
      <label for="contract" class="text-sm">He leído y acepto el <span class="text-[#FF4929] font-semibold">contrato de Inversionista</span></label>
    </div>

    <div class="text-center">
      <Button 
        label="Guardar" 
        icon="pi pi-save" 
        rounded  
        severity="contrast" 
        variant="outlined" 
        fluid 
        @click="guardarPerfil"
        :disabled="!canSave"
        :loading="isSaving"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import profileService from '@/services/profileService'
import { ocrService } from '@/services/ocrService'

const toast = useToast()
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

const frontValidation = ref({
  status: null,
  message: ''
})

const isSaving = ref(false)

const canSave = computed(() => {
  return form.value.department &&
         form.value.province &&
         form.value.district &&
         form.value.address &&
         form.value.document_front &&
         form.value.document_back &&
         form.value.contractAccepted &&
         frontValidation.value.status === 'valid'
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
  const maxSize = maxSizeMB * 1024 * 1024 * 1024 // Convertir MB a bytes
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

const validateDniWithOCR = async (file) => {
  try {
    frontValidation.value = { status: 'processing', message: 'Validando DNI...' }
    
    const response = await ocrService.extractDni(file)
    const { validation } = response.data

    if (validation.is_valid) {
      frontValidation.value = { status: 'valid', message: validation.message }
    } else {
      frontValidation.value = { status: 'invalid', message: validation.message }
    }
  } catch (error) {
    console.error('Error en OCR:', error)
    frontValidation.value = {
      status: 'invalid',
      message: 'Error al validar el DNI. Intenta con una imagen más clara.'
    }
  }
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
  await validateDniWithOCR(file)
  
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
  
  // Validación básica de canSave
  if (!canSave.value) {
    console.log('canSave validation failed:', {
      department: !!form.value.department,
      province: !!form.value.province,
      district: !!form.value.district,
      address: !!form.value.address,
      document_front: !!form.value.document_front,
      document_back: !!form.value.document_back,
      contractAccepted: form.value.contractAccepted,
      frontValidationStatus: frontValidation.value.status
    })
    
    toast.add({
      severity: 'warn',
      summary: 'Validación requerida',
      detail: 'Debes completar todos los campos y validar el DNI.',
      life: 5000
    })
    return
  }

  // Validación específica de archivos
  console.log('Validando archivos antes del envío:')
  console.log('document_front:', {
    exists: !!form.value.document_front,
    isFile: form.value.document_front instanceof File,
    name: form.value.document_front?.name,
    size: form.value.document_front?.size,
    type: form.value.document_front?.type
  })
  console.log('document_back:', {
    exists: !!form.value.document_back,
    isFile: form.value.document_back instanceof File,
    name: form.value.document_back?.name,
    size: form.value.document_back?.size,
    type: form.value.document_back?.type
  })

  // Verificación robusta de archivos
  if (!form.value.document_front || !form.value.document_back) {
    toast.add({
      severity: 'warn',
      summary: 'Imágenes requeridas',
      detail: 'Debes subir ambas fotos del DNI (delantera y trasera).',
      life: 5000
    })
    return
  }

  if (!(form.value.document_front instanceof File) || !(form.value.document_back instanceof File)) {
    console.error('Los archivos no son instancias válidas de File:', {
      front: form.value.document_front,
      back: form.value.document_back,
      frontType: typeof form.value.document_front,
      backType: typeof form.value.document_back
    })
    
    toast.add({
      severity: 'error',
      summary: 'Error en archivos',
      detail: 'Los archivos no son válidos. Por favor, vuelve a subirlos.',
      life: 5000
    })
    return
  }

  isSaving.value = true

  try {
    // Crear FormData con validación paso a paso
    const payload = new FormData()
    
    console.log('=== CONSTRUYENDO FORM DATA ===')
    
    // Datos booleanos (convertir exactamente como espera Laravel)
    const isPep = form.value.is_pep ? '1' : '0'
    const hasRelationshipPep = form.value.has_relationship_pep ? '1' : '0'
    
    payload.append('is_pep', isPep)
    payload.append('has_relationship_pep', hasRelationshipPep)
    
    console.log('Booleanos agregados:', { isPep, hasRelationshipPep })
    
    // Ubigeo - formatear correctamente
    const formatUbigeoId = (id) => {
      if (!id) return ''
      const idStr = String(id)
      return idStr.length >= 2 ? idStr.slice(-2) : idStr.padStart(2, '0')
    }
    
    const department = formatUbigeoId(form.value.department?.ubigeo_id)
    const province = formatUbigeoId(form.value.province?.ubigeo_id)
    const district = formatUbigeoId(form.value.district?.ubigeo_id)
    const address = form.value.address || ''
    
    payload.append('department', department)
    payload.append('province', province)
    payload.append('district', district)
    payload.append('address', address)
    
    console.log('Ubigeo agregado:', { department, province, district, address })

    // CRÍTICO: Agregar archivos - VALIDAR ANTES DE AGREGAR
    console.log('Agregando archivo frontal...')
    console.log('Archivo frontal antes de append:', {
      file: form.value.document_front,
      name: form.value.document_front.name,
      size: form.value.document_front.size,
      type: form.value.document_front.type,
      constructor: form.value.document_front.constructor.name
    })
    
    // Usar exactamente los nombres que espera el servidor
    payload.append('document_front', form.value.document_front, form.value.document_front.name)
    
    console.log('Agregando archivo trasero...')
    console.log('Archivo trasero antes de append:', {
      file: form.value.document_back,
      name: form.value.document_back.name,
      size: form.value.document_back.size,
      type: form.value.document_back.type,
      constructor: form.value.document_back.constructor.name
    })
    
    payload.append('document_back', form.value.document_back, form.value.document_back.name)

    // Verificación final del FormData
    console.log('=== VERIFICACIÓN FINAL FORMDATA ===')
    for (let [key, value] of payload.entries()) {
      if (value instanceof File) {
        console.log(`${key}:`, {
          name: value.name,
          size: value.size,
          type: value.type,
          lastModified: value.lastModified,
          constructor: value.constructor.name
        })
      } else {
        console.log(`${key}:`, value)
      }
    }

    // Verificar que los archivos están realmente en el FormData
    const frontFileFromFormData = payload.get('document_front')
    const backFileFromFormData = payload.get('document_back')
    
    console.log('=== VERIFICACIÓN ARCHIVOS EN FORMDATA ===')
    console.log('Front file from FormData:', {
      exists: !!frontFileFromFormData,
      isFile: frontFileFromFormData instanceof File,
      name: frontFileFromFormData?.name,
      size: frontFileFromFormData?.size
    })
    console.log('Back file from FormData:', {
      exists: !!backFileFromFormData,
      isFile: backFileFromFormData instanceof File,
      name: backFileFromFormData?.name,
      size: backFileFromFormData?.size
    })
    
    if (!frontFileFromFormData || !backFileFromFormData || 
        !(frontFileFromFormData instanceof File) || !(backFileFromFormData instanceof File)) {
      throw new Error('Los archivos no se agregaron correctamente al FormData')
    }

    console.log('=== ENVIANDO REQUEST ===')
    const response = await profileService.updateConfirmAccount(payload)
    console.log('Profile updated successfully:', response)
    
    toast.add({
      severity: 'success',
      summary: 'Perfil actualizado',
      detail: 'Tu información se guardó correctamente.',
      life: 4000
    })
    
  } catch (error) {
    console.error('=== ERROR AL GUARDAR ===')
    console.error('Error completo:', error)
    console.error('Error response:', error.response?.data)
    console.error('Error status:', error.response?.status)
    console.error('Error headers:', error.response?.headers)
    
    let errorMessage = 'Ocurrió un error al enviar los datos.'
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorList = Object.values(errors).flat()
      errorMessage = errorList.join(', ')
    }
    
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: errorMessage,
      life: 5000
    })
  } finally {
    isSaving.value = false
  }
  
  console.log('=== FIN VALIDACIÓN GUARDAR PERFIL ===')
}
</script>