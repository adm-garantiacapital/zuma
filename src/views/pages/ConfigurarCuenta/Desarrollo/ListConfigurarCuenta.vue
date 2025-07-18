<template>
  <Toast />
  <div class="card p-6 space-y-6">
    <!-- Título con Nombre -->
    <div class="text-center">
      <h2 class="text-2xl font-bold text-gray-800">
        {{ perfil.name }} {{ perfil.first_last_name }} {{ perfil.second_last_name }}
      </h2>
      <p class="text-gray-500">{{ perfil.email }}</p>
    </div>

    <!-- Preguntas PEP -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label class="block font-medium mb-2">¿Eres o has sido Persona Expuesta Políticamente (PEP)?</label>
        <ToggleSwitch v-model="form.is_pep" />
      </div>
      <div>
        <label class="block font-medium mb-2">¿Eres pariente, cónyuge o conviviente de alguna persona PEP?</label>
        <ToggleSwitch v-model="form.has_relationship_pep" />
      </div>
    </div>

    <!-- Ubigeo -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label class="block font-medium mb-2">Departamento</label>
        <Select v-model="form.department" :options="departamentos" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione departamento" class="w-full" @change="onDepartamentoChange" />
      </div>
      <div>
        <label class="block font-medium mb-2">Provincia</label>
        <Select v-model="form.province" :options="provincias" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione provincia" class="w-full" :disabled="!form.department"
          @change="onProvinciaChange" />
      </div>
      <div>
        <label class="block font-medium mb-2">Distrito</label>
        <Select v-model="form.district" :options="distritos" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione distrito" class="w-full" :disabled="!form.province" />
      </div>
    </div>

    <!-- Dirección -->
    <div>
      <label class="block font-medium mb-2">Dirección</label>
      <InputText v-model="form.address" class="w-full" placeholder="Ingrese su dirección" />
    </div>

    <!-- DNI (adelante y atrás) con upload elegante -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- DNI Parte Delantera -->
      <div>
        <label class="block font-medium mb-3 text-gray-700">DNI - Parte Delantera</label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-300 bg-gray-50 hover:bg-green-50">
          <input 
            type="file" 
            ref="frontFileInput"
            @change="onUploadFront" 
            accept="image/*,.jpg,.jpeg,.png,.webp" 
            class="hidden"
          />
          
          <!-- Vista cuando no hay imagen -->
          <div v-if="!frontImagePreview" @click="$refs.frontFileInput.click()" class="cursor-pointer">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4 block"></i>
            <p class="text-gray-600 mb-2">Haz clic para subir imagen</p>
            <p class="text-sm text-gray-400">o arrastra y suelta aquí</p>
            <p class="text-xs text-gray-400 mt-2">Formatos: JPG, PNG, WEBP (máx. 5MB)</p>
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
        <label class="block font-medium mb-3 text-gray-700">DNI - Parte Trasera</label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors duration-300 bg-gray-50 hover:bg-green-50">
          <input 
            type="file" 
            ref="backFileInput"
            @change="onUploadBack" 
            accept="image/*,.jpg,.jpeg,.png,.webp" 
            class="hidden"
          />
          
          <!-- Vista cuando no hay imagen -->
          <div v-if="!backImagePreview" @click="$refs.backFileInput.click()" class="cursor-pointer">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4 block"></i>
            <p class="text-gray-600 mb-2">Haz clic para subir imagen</p>
            <p class="text-sm text-gray-400">o arrastra y suelta aquí</p>
            <p class="text-xs text-gray-400 mt-2">Formatos: JPG, PNG, WEBP (máx. 5MB)</p>
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

    <!-- Debug info (remover en producción) -->
    <div v-if="debugMode" class="bg-gray-100 p-4 rounded text-sm">
      <p><strong>Debug Info:</strong></p>
      <p>Front file: {{ form.document_front ? `${form.document_front.name} (${form.document_front.size} bytes)` : 'No file' }}</p>
      <p>Back file: {{ form.document_back ? `${form.document_back.name} (${form.document_back.size} bytes)` : 'No file' }}</p>
      <p>Front validation: {{ frontValidation.status }}</p>
    </div>

    <!-- Contrato y botón -->
    <div class="flex items-center space-x-4">
      <Checkbox v-model="form.contractAccepted" :binary="true" inputId="contract" />
      <label for="contract" class="text-sm">He leído y acepto el contrato de Inversionista</label>
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
const debugMode = ref(false) // Cambia a true para ver info de debug

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
  const maxSize = maxSizeMB * 1024 * 1024 // Convertir MB a bytes
  if (file.size > maxSize) {
    toast.add({
      severity: 'warn',
      summary: 'Archivo muy grande',
      detail: `El archivo debe ser menor a ${maxSizeMB}MB`,
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

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    toast.add({
      severity: 'warn',
      summary: 'Archivo no válido',
      detail: 'Solo se permiten imágenes (JPG, PNG, WEBP)',
      life: 4000
    })
    return
  }

  // Validar tamaño
  if (!validateFileSize(file)) {
    return
  }

  console.log('Front file selected:', file.name, file.size, file.type)

  // Guardar el archivo original
  form.value.document_front = file

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    frontImagePreview.value = e.target.result
    console.log('Front preview created')
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
  
  // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  event.target.value = ''
}

const onUploadBack = (event) => {
  const file = event.target.files[0]
  
  if (!file) {
    console.log('No back file selected')
    return
  }

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    toast.add({
      severity: 'warn',
      summary: 'Archivo no válido',
      detail: 'Solo se permiten imágenes (JPG, PNG, WEBP)',
      life: 4000
    })
    return
  }

  // Validar tamaño
  if (!validateFileSize(file)) {
    return
  }

  console.log('Back file selected:', file.name, file.size, file.type)

  // Guardar el archivo original
  form.value.document_back = file

  // Crear preview
  const reader = new FileReader()
  reader.onload = (e) => {
    backImagePreview.value = e.target.result
    console.log('Back preview created')
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
  
  // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
  event.target.value = ''
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
  if (!canSave.value) {
    toast.add({
      severity: 'warn',
      summary: 'Validación requerida',
      detail: 'Debes completar todos los campos y validar el DNI.',
      life: 5000
    })
    return
  }

  // Validar específicamente las imágenes
  if (!form.value.document_front || !form.value.document_back) {
    toast.add({
      severity: 'warn',
      summary: 'Imágenes requeridas',
      detail: 'Debes subir ambas fotos del DNI (delantera y trasera).',
      life: 5000
    })
    return
  }

  // Verificar que son archivos File válidos
  if (!(form.value.document_front instanceof File) || !(form.value.document_back instanceof File)) {
    toast.add({
      severity: 'error',
      summary: 'Error en archivos',
      detail: 'Los archivos no son válidos. Por favor, vuelve a subirlos.',
      life: 5000
    })
    return
  }

  console.log('Starting to save profile...')
  console.log('Front file:', form.value.document_front)
  console.log('Back file:', form.value.document_back)

  isSaving.value = true

  try {
    const payload = new FormData()
    
    // Enviar como boolean (0 o 1) NO como string
    payload.append('is_pep', form.value.is_pep ? '1' : '0')
    payload.append('has_relationship_pep', form.value.has_relationship_pep ? '1' : '0')
    
    // Formatear los IDs del ubigeo para que sean exactamente 2 dígitos
    const formatUbigeoId = (id) => {
      if (!id) return ''
      const idStr = String(id)
      // Si el ID tiene más de 2 dígitos, tomar los últimos 2
      // Si tiene menos de 2 dígitos, rellenar con ceros a la izquierda
      return idStr.length >= 2 ? idStr.slice(-2) : idStr.padStart(2, '0')
    }
    
    payload.append('department', formatUbigeoId(form.value.department?.ubigeo_id))
    payload.append('province', formatUbigeoId(form.value.province?.ubigeo_id))
    payload.append('district', formatUbigeoId(form.value.district?.ubigeo_id))
    payload.append('address', form.value.address || '')

    // Asegurar que las imágenes se envíen correctamente con nombres únicos
    const frontFile = form.value.document_front
    const backFile = form.value.document_back
    
    // Generar nombres únicos para evitar conflictos
    const timestamp = Date.now()
    const frontFileName = `dni_front_${timestamp}.${frontFile.name.split('.').pop()}`
    const backFileName = `dni_back_${timestamp}.${backFile.name.split('.').pop()}`
    
    payload.append('document_front', frontFile, frontFileName)
    payload.append('document_back', backFile, backFileName)

    // Debug: verificar el contenido del FormData
    console.log('FormData contents:')
    for (let [key, value] of payload.entries()) {
      if (value instanceof File) {
        console.log(key, `File: ${value.name}, Size: ${value.size}, Type: ${value.type}`)
      } else {
        console.log(key, value)
      }
    }

    const response = await profileService.updateConfirmAccount(payload)
    console.log('Profile updated successfully:', response)
    
    toast.add({
      severity: 'success',
      summary: 'Perfil actualizado',
      detail: 'Tu información se guardó correctamente.',
      life: 4000
    })
  } catch (error) {
    console.error('Error al guardar:', error)
    console.error('Error response:', error.response?.data)
    
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors || 
                        'Ocurrió un error al enviar los datos.'
    
    toast.add({
      severity: 'error',
      summary: 'Error al guardar',
      detail: typeof errorMessage === 'string' ? errorMessage : 'Error en validación de campos',
      life: 5000
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* Estilos adicionales para hover effects */
.border-dashed:hover {
  border-style: dashed;
}

/* Animación suave para las transiciones */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
</style>