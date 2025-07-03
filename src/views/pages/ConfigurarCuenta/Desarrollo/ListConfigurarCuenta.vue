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
        <Select v-model="form.departamento" :options="departamentos" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione departamento" class="w-full" @change="onDepartamentoChange" />
      </div>
      <div>
        <label class="block font-medium mb-2">Provincia</label>
        <Select v-model="form.provincia" :options="provincias" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione provincia" class="w-full" :disabled="!form.departamento"
          @change="onProvinciaChange" />
      </div>
      <div>
        <label class="block font-medium mb-2">Distrito</label>
        <Select v-model="form.distrito" :options="distritos" optionLabel="ubigeo_name" dataKey="ubigeo_id"
          placeholder="Seleccione distrito" class="w-full" :disabled="!form.provincia" />
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
            accept="image/*" 
            class="hidden"
          />
          
          <!-- Vista cuando no hay imagen -->
          <div v-if="!form.dni_front" @click="$refs.frontFileInput.click()" class="cursor-pointer">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4 block"></i>
            <p class="text-gray-600 mb-2">Haz clic para subir imagen</p>
            <p class="text-sm text-gray-400">o arrastra y suelta aquí</p>
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
            accept="image/*" 
            class="hidden"
          />
          
          <!-- Vista cuando no hay imagen -->
          <div v-if="!form.dni_back" @click="$refs.backFileInput.click()" class="cursor-pointer">
            <i class="pi pi-cloud-upload text-4xl text-gray-400 mb-4 block"></i>
            <p class="text-gray-600 mb-2">Haz clic para subir imagen</p>
            <p class="text-sm text-gray-400">o arrastra y suelta aquí</p>
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

const perfil = ref({})
const form = ref({
  is_pep: false,
  has_relationship_pep: false,
  departamento: null,
  provincia: null,
  distrito: null,
  address: '',
  contractAccepted: false,
  dni_front: null,
  dni_back: null
})

const departamentos = ref([])
const provincias = ref([])
const distritos = ref([])

// Para las vistas previas de las imágenes
const frontImagePreview = ref('')
const backImagePreview = ref('')

// Estados de validación
const frontValidation = ref({
  status: null, // null, 'processing', 'valid', 'invalid'
  message: ''
})

const isSaving = ref(false)

// Computed para habilitar/deshabilitar el botón guardar
const canSave = computed(() => {
  return form.value.departamento && 
         form.value.provincia && 
         form.value.distrito && 
         form.value.address && 
         form.value.dni_front && 
         form.value.dni_back &&
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
  form.value.provincia = null
  form.value.distrito = null
  provincias.value = form.value.departamento?.provinces || []
  distritos.value = []
}

const onProvinciaChange = () => {
  form.value.distrito = null
  distritos.value = form.value.provincia?.districts || []
}

// Validar DNI con OCR
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
    console.error('Error en validación OCR:', error)
    frontValidation.value = { 
      status: 'invalid', 
      message: 'Error al validar el DNI. Intenta con una imagen más clara.' 
    }
  }
}

// Subida de imagen frontal
const onUploadFront = async (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.dni_front = file
    
    // Crear vista previa
    const reader = new FileReader()
    reader.onload = (e) => {
      frontImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
    
    // Validar con OCR
    await validateDniWithOCR(file)
  }
}

// Subida de imagen trasera
const onUploadBack = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.dni_back = file
    
    // Crear vista previa
    const reader = new FileReader()
    reader.onload = (e) => {
      backImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// Eliminar imagen frontal
const removeFrontImage = () => {
  form.value.dni_front = null
  frontImagePreview.value = ''
  frontValidation.value = { status: null, message: '' }
}

// Eliminar imagen trasera
const removeBackImage = () => {
  form.value.dni_back = null
  backImagePreview.value = ''
}

// Función guardarPerfil corregida
const guardarPerfil = async () => {
  if (!canSave.value) {
    toast.add({
      severity: 'warn',
      summary: 'Validación requerida',
      detail: 'Debes completar todos los campos y validar el DNI correctamente.',
      life: 5000
    });
    return;
  }

  isSaving.value = true;

  const payload = new FormData();
  
  // Enviar valores PEP como números (1 o 0)
  payload.append('is_pep', form.value.is_pep ? 1 : 0);
  payload.append('has_relationship_pep', form.value.has_relationship_pep ? 1 : 0);
  
  // AQUÍ ESTÁ EL PROBLEMA PRINCIPAL: necesitas extraer el código correcto del ubigeo
  // Opción 1: Si el backend espera códigos cortos (2 dígitos para departamento, etc.)
  // Necesitas mapear o extraer el código correcto del ubigeo_id
  
  // Temporal: enviar los IDs directamente pero como números
  payload.append('department', parseInt(form.value.departamento?.ubigeo_id) || 0);
  payload.append('province', parseInt(form.value.provincia?.ubigeo_id) || 0);
  payload.append('district', parseInt(form.value.distrito?.ubigeo_id) || 0);
  
  // Dirección
  payload.append('address', form.value.address || '');

  // ARCHIVOS: Verificar que existan antes de añadirlos
  if (form.value.dni_front && form.value.dni_front instanceof File) {
    payload.append('document_front', form.value.dni_front);
  }

  if (form.value.dni_back && form.value.dni_back instanceof File) {
    payload.append('document_back', form.value.dni_back);
  }

  // Debug mejorado
  console.log('=== PAYLOAD DEBUG ===');
  for (let pair of payload.entries()) {
    if (pair[1] instanceof File) {
      console.log(pair[0] + ':', `File: ${pair[1].name} (${pair[1].size} bytes)`);
    } else {
      console.log(pair[0] + ':', pair[1], typeof pair[1]);
    }
  }

  try {
    await profileService.updateConfirmAccount(payload);
    toast.add({
      severity: 'success',
      summary: 'Perfil actualizado',
      detail: 'Se ha enviado tu información correctamente.',
      life: 4000
    });
  } catch (error) {
    console.error('Error al guardar datos:', error.response?.data || error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error.response?.data?.message || 'Ocurrió un error al guardar los datos.',
      life: 4000
    });
  } finally {
    isSaving.value = false;
  }
};

// SOLUCIÓN ALTERNATIVA: Si necesitas códigos específicos para ubigeo
// Necesitarías una función que extraiga el código correcto:
const extractUbigeoCode = (ubigeoId) => {
  // Ejemplo: si ubigeo_id es "2534" pero necesitas "10" para Lima
  // Necesitarías un mapeo o lógica específica
  
  // Mapeo temporal (debes ajustar según tu API):
  const departmentMap = {
    '2534': '10', // Lima
    // Agregar más mapeos según necesites
  };
  
  return departmentMap[ubigeoId] || ubigeoId;
};

// Función guardarPerfil con mapeo de códigos ubigeo
const guardarPerfilConMapeo = async () => {
  if (!canSave.value) {
    toast.add({
      severity: 'warn',
      summary: 'Validación requerida', 
      detail: 'Debes completar todos los campos y validar el DNI correctamente.',
      life: 5000
    });
    return;
  }

  isSaving.value = true;

  const payload = new FormData();
  
  // Valores PEP como números
  payload.append('is_pep', form.value.is_pep ? 1 : 0);
  payload.append('has_relationship_pep', form.value.has_relationship_pep ? 1 : 0);
  
  // Ubigeo con mapeo de códigos
  payload.append('department', extractUbigeoCode(form.value.departamento?.ubigeo_id));
  payload.append('province', extractUbigeoCode(form.value.provincia?.ubigeo_id));
  payload.append('district', extractUbigeoCode(form.value.distrito?.ubigeo_id));
  
  payload.append('address', form.value.address || '');

  // Archivos con validación
  if (form.value.dni_front && form.value.dni_front instanceof File) {
    payload.append('document_front', form.value.dni_front);
  }

  if (form.value.dni_back && form.value.dni_back instanceof File) {
    payload.append('document_back', form.value.dni_back);
  }

  // Resto del código igual...
};
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