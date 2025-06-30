<template>
  <div>
    <!-- Carrusel principal -->
    <div class="carousel-wrapper">
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
        <template #item="slotProps">
          <div class="carousel-item-wrapper p-3">
            <Card class="hipoteca-card shadow-lg border-round-xl overflow-hidden">
              <template #header>
                <div class="card-header-wrapper">
                  <img
                    src="https://primefaces.org/cdn/primevue/images/usercard.png"
                    alt="Imagen hipoteca"
                    class="card-image"
                  />
                  <div class="card-overlay">
                    <div class="price-badge">
                      {{ slotProps.data.precio }}
                    </div>
                  </div>
                </div>
              </template>
              
              <template #title>
                <div class="card-title">
                  <i class="pi pi-home text-primary mr-2"></i>
                  {{ slotProps.data.titulo }}
                </div>
              </template>
              
              <template #subtitle>
                <div class="card-subtitle">
                  {{ slotProps.data.subtitulo }}
                </div>
              </template>
              
              <template #content>
                <div class="card-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <i class="pi pi-percentage text-green-500"></i>
                      <div>
                        <span class="info-label">Tasa</span>
                        <span class="info-value">{{ slotProps.data.tasa }}</span>
                      </div>
                    </div>
                    
                    <div class="info-item">
                      <i class="pi pi-calendar text-blue-500"></i>
                      <div>
                        <span class="info-label">Plazo</span>
                        <span class="info-value">{{ slotProps.data.plazo }}</span>
                      </div>
                    </div>
                    
                    <div class="info-item">
                      <i class="pi pi-wallet text-orange-500"></i>
                      <div>
                        <span class="info-label">Inicial</span>
                        <span class="info-value">{{ slotProps.data.inicial }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="description mt-4">
                    <p class="text-gray-600 leading-relaxed">{{ slotProps.data.descripcion }}</p>
                  </div>
                </div>
              </template>
              
              <template #footer>
                <div class="card-footer">
                  <Button 
                    label="Ver Detalles" 
                    icon="pi pi-search" 
                    severity="secondary" 
                    outlined 
                    class="flex-1 mr-2"
                    @click="verDetalles(slotProps.data)"
                  />
                  <Button 
                    label="Solicitar" 
                    icon="pi pi-check" 
                    class="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 border-none"
                    @click="solicitar(slotProps.data)"
                  />
                </div>
              </template>
            </Card>
          </div>
        </template>
      </Carousel>
    </div>

    <!-- Botón inferior -->
    <div class="text-center mt-8">
      <Button 
        label="Explorar Todas las Opciones" 
        icon="pi pi-angle-double-down" 
        severity="info"
        size="large"
        class="p-button-rounded p-button-outlined px-6 py-3 text-lg font-semibold"
        @click="explorarTodas"
      />
    </div>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
import Button from 'primevue/button'
import Carousel from 'primevue/carousel'

const hipotecas = [
  {
    titulo: 'Hipoteca Familiar',
    subtitulo: 'Estabilidad y respaldo',
    precio: '$150,000',
    tasa: '6.5% anual',
    plazo: '20 años',
    inicial: '10%',
    descripcion: 'Ideal para familias que buscan una vivienda con pagos cómodos y tasa fija.'
  },
  {
    titulo: 'Hipoteca Joven',
    subtitulo: 'Tu primera casa',
    precio: '$120,000',
    tasa: '5.9% anual',
    plazo: '25 años',
    inicial: '5%',
    descripcion: 'Especial para jóvenes profesionales con bajo ingreso inicial y trámites simples.'
  },
  {
    titulo: 'Hipoteca Verde',
    subtitulo: 'Eco y ahorro',
    precio: '$135,000',
    tasa: '5.5% anual',
    plazo: '15 años',
    inicial: '8%',
    descripcion: 'Para viviendas sostenibles con eficiencia energética y beneficios fiscales.'
  },
  {
    titulo: 'Hipoteca Premium',
    subtitulo: 'Máximo confort',
    precio: '$200,000',
    tasa: '7.2% anual',
    plazo: '30 años',
    inicial: '15%',
    descripcion: 'Para propiedades de lujo con servicios exclusivos y asesoría personalizada.'
  }
]

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

const verDetalles = (hipoteca) => {
  console.log('Ver detalles de:', hipoteca.titulo)
  // Aquí implementarías la lógica para mostrar detalles
}

const solicitar = (hipoteca) => {
  console.log('Solicitar:', hipoteca.titulo)
  // Aquí implementarías la lógica para solicitar
}

const explorarTodas = () => {
  console.log('Explorar todas las opciones')
  // Aquí implementarías la navegación a todas las hipotecas
}
</script>
