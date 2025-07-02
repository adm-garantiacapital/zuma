<template>
  <div>
    <!-- Carrusel principal -->
    <div class="carousel-wrapper" v-if="hipotecas.length">
      <Carousel 
        :value="hipotecas" 
        :numVisible="3" 
        :numScroll="1" 
        :responsiveOptions="responsiveOptions"
        :showNavigators="true"
        :showIndicators="true"
        :autoplayInterval="4000"
        :circular="true"
        class="custom-carousel"
      >
        <template #item="{ data }">
          <div class="carousel-item-wrapper p-3">
            <Card class="hipoteca-card shadow-lg border-round-xl overflow-hidden">
              <template #header>
                <div class="card-header-wrapper relative">
                  <img
                    :src="data.foto"
                    alt="Imagen propiedad"
                    class="card-image w-full h-48 object-cover"
                  />
                  <Tag severity="info" class="absolute top-2 right-2" rounded>{{ formatCurrency(data.valor_estimado, data.Moneda) }}</Tag>
                </div>
              </template>

              <template #title>
                <div class="card-title text-lg font-bold">
                  {{ data.nombre }}
                </div>
              </template>

              <template #subtitle>
                <div class="card-subtitle text-gray-600 text-sm">
                  {{ data.departamento }} - {{ data.provincia }} - {{ data.distrito }}
                </div>
              </template>

              <template #content>
                <div class="card-content">
                  <p class="text-sm text-gray-700 mb-2">{{ data.descripcion }}</p>
                  <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div><strong>TEA:</strong> {{ data.tea }}%</div>
                  </div>
                </div>
              </template>

              <template #footer>
                <div class="card-footer mt-4 flex flex-col gap-2">
                  <div class="flex gap-2">
                    <Button 
                      label="Cronograma"  rounded
                      class="flex-1 bg-green-600 text-white border-none hover:bg-green-700"
                      @click="verCronograma(data.id)"
                      severity="warn" variant="outlined"
                    />
                    <Button 
                      label="Interesado"  rounded
                      class="flex-1 bg-yellow-500 text-white border-none hover:bg-yellow-600"
                      @click="mostrarInteres(data.id)"
                      severity="contrast" variant="outlined"
                    />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </template>
      </Carousel>

      <!-- Botón central fuera del carrusel -->
      <div class="mt-6 text-center">
        <Button
          label="Conocer más oportunidades" rounded
          class="bg-indigo-600 text-white px-6 py-2 text-base rounded-xl hover:bg-indigo-700 transition"
          @click="router.push('/Search')" 
          severity="help" variant="outlined"
        />
      </div>
    </div>

    <!-- Sin propiedades o cargando -->
    <div v-else class="text-center mt-8 text-gray-500">Cargando propiedades...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Carousel from 'primevue/carousel'
import { propertyService } from '@/services/propertyService'

const router = useRouter()
const hipotecas = ref([])

const responsiveOptions = [
  {
    breakpoint: '1024px',
    numVisible: 2,
    numScroll: 1
  },
  {
    breakpoint: '768px',
    numVisible: 1,
    numScroll: 1
  }
]

const verDetalles = (id) => {
  router.push({ name: 'search', query: { id } })
}

const verCronograma = (id) => {
  console.log('Ver cronograma para propiedad ID:', id)
  // Aquí podrías abrir un modal o redirigir a otra vista
}

const mostrarInteres = (id) => {
  console.log('Mostrar interés en propiedad ID:', id)
  // Aquí podrías emitir un evento o guardar en backend
}

const formatCurrency = (valor, moneda) => {
  if (!valor) return '-'
  const num = Number(valor)
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: moneda || 'PEN'
  }).format(num)
}

onMounted(async () => {
  try {
    const response = await propertyService.getProperties()
    const unique = {}
    hipotecas.value = response.data.data.filter(prop => {
      if (!unique[prop.id]) {
        unique[prop.id] = true
        return true
      }
      return false
    })
  } catch (error) {
    console.error('Error cargando propiedades:', error)
  }
})
</script>
