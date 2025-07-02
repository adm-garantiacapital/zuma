<template>
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
            <Badge value="Subido" severity="success" class="mt-2" />
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
      <Button label="Guardar" icon="pi pi-save" class="p-button-success w-40" @click="guardarPerfil" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Select from 'primevue/select'
import InputText from 'primevue/inputtext'
import ToggleSwitch from 'primevue/inputswitch'
import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'
import Badge from 'primevue/badge'
import profileService from '@/services/profileService'
import axios from 'axios'

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

// Subida de imagen frontal
const onUploadFront = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.value.dni_front = file
    
    // Crear vista previa
    const reader = new FileReader()
    reader.onload = (e) => {
      frontImagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
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
}

// Eliminar imagen trasera
const removeBackImage = () => {
  form.value.dni_back = null
  backImagePreview.value = ''
}

// Guardar
const guardarPerfil = () => {
  if (!form.value.contractAccepted) {
    alert('Debe aceptar el contrato para continuar.')
    return
  }

  // Aquí puedes preparar los datos para enviarlos
  console.log('Formulario a enviar:', form.value)
  // Enviar con `profileService.updateProfile(...)`
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