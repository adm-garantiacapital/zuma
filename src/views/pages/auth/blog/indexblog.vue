<template>
  <div class="bg-surface-0 dark:bg-surface-900">
    <div id="home" class="landing-wrapper">
      <TopbarWidget />

      <!-- Sección de Blog -->
      <section class="flex flex-col gap-14 py-20 px-6 lg:px-24 bg-gradient-to-br from-[#EDEAE4] to-[#F5F2EC]">
        <div class="max-w-7xl mx-auto w-full">
          <!-- Encabezado del Blog -->
          <div class="text-center mb-16">
            <h1 class="text-4xl lg:text-6xl font-bold text-gray-800 mb-6">
              Blog
            </h1>
            <p class="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              Descubre las últimas tendencias en inversión, fintech y oportunidades de crecimiento financiero. 
              Mantente al día con análisis expertos y consejos prácticos para maximizar tu patrimonio.
            </p>
          </div>

          <!-- Filtros y Búsqueda -->
          <div class="mb-12">
            <Card class="shadow-lg">
              <template #content>
                <div class="flex flex-col md:flex-row gap-4 items-center">
                  <div class="flex-1">
                    <InputGroup>
                      <InputText
                        v-model="searchQuery"
                        placeholder="Buscar artículos..."
                        class="w-full"
                      />
                      <Button
                        icon="pi pi-search"
                        severity="secondary"
                        @click="searchArticles"
                      />
                    </InputGroup>
                  </div>
                  
                  <div>
                    <Dropdown
                      v-model="selectedCategory"
                      :options="categories"
                      optionLabel="name"
                      optionValue="value"
                      placeholder="Todas las categorías"
                      class="w-full md:w-64"
                      @change="filterByCategory"
                    />
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Artículos Destacados -->
          <div class="grid lg:grid-cols-3 gap-8 mb-16">
            <!-- Artículo 1: Factoring -->
            <Card class="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <template #header>
                <div class="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop&crop=center" 
                    alt="Factoring Investment" 
                    class="w-full h-64 object-cover"
                  />
                  <div class="absolute top-4 left-4">
                    <Tag value="Inversión" severity="success" class="font-semibold"></Tag>
                  </div>
                  <div class="absolute top-4 right-4">
                    <Tag value="Trending" icon="pi pi-fire" severity="danger" class="font-semibold"></Tag>
                  </div>
                </div>
              </template>
              
              <template #title>
                <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  ¿Por qué el Factoring es una Oportunidad de Inversión Inteligente en 2025?
                </h3>
              </template>
              
              <template #subtitle>
                <div class="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <i class="pi pi-calendar"></i>
                  <span>15 Enero 2025</span>
                  <i class="pi pi-user ml-4"></i>
                  <span>Equipo Zuma</span>
                </div>
              </template>
              
              <template #content>
                <p class="text-gray-600 leading-relaxed mb-6">
                  Descubre por qué el factoring se ha convertido en una de las alternativas de inversión más 
                  atractivas del mercado. Analizamos rentabilidad, riesgos y oportunidades para 2025.
                </p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  <Chip label="Factoring" class="bg-blue-100 text-blue-700" />
                  <Chip label="ROI 12-18%" class="bg-green-100 text-green-700" />
                  <Chip label="Riesgo Medio" class="bg-yellow-100 text-yellow-700" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Rating :modelValue="5" readonly :cancel="false" class="text-sm" />
                    <span class="text-sm text-gray-500">(4.8/5)</span>
                  </div>
                  <Button
                    label="Leer más"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="p-button-outlined"
                    @click="readArticle(1)"
                  />
                </div>
              </template>
            </Card>

            <!-- Artículo 2: Hipotecas -->
            <Card class="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <template #header>
                <div class="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=300&fit=crop&crop=center" 
                    alt="Real Estate Investment" 
                    class="w-full h-64 object-cover"
                  />
                  <div class="absolute top-4 left-4">
                    <Tag value="Inmobiliario" severity="info" class="font-semibold"></Tag>
                  </div>
                  <div class="absolute top-4 right-4">
                    <Tag value="Popular" icon="pi pi-star-fill" severity="warning" class="font-semibold"></Tag>
                  </div>
                </div>
              </template>
              
              <template #title>
                <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  Hipotecas como Alternativa de Inversión: Rentabilidad con Respaldo Inmobiliario
                </h3>
              </template>
              
              <template #subtitle>
                <div class="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <i class="pi pi-calendar"></i>
                  <span>12 Enero 2025</span>
                  <i class="pi pi-user ml-4"></i>
                  <span>Ana Martínez</span>
                </div>
              </template>
              
              <template #content>
                <p class="text-gray-600 leading-relaxed mb-6">
                  Explora cómo las inversiones respaldadas por hipotecas ofrecen seguridad y rentabilidad. 
                  Una guía completa sobre esta alternativa de inversión con garantía inmobiliaria.
                </p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  <Chip label="Hipotecash" class="bg-purple-100 text-purple-700" />
                  <Chip label="ROI 8-14%" class="bg-green-100 text-green-700" />
                  <Chip label="Riesgo Bajo" class="bg-blue-100 text-blue-700" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Rating :modelValue="4" readonly :cancel="false" class="text-sm" />
                    <span class="text-sm text-gray-500">(4.6/5)</span>
                  </div>
                  <Button
                    label="Leer más"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="p-button-outlined"
                    @click="readArticle(2)"
                  />
                </div>
              </template>
            </Card>

            <!-- Artículo 3: Inversión Digital -->
            <Card class="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <template #header>
                <div class="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop&crop=center" 
                    alt="Digital Investment" 
                    class="w-full h-64 object-cover"
                  />
                  <div class="absolute top-4 left-4">
                    <Tag value="Digital" severity="help" class="font-semibold"></Tag>
                  </div>
                  <div class="absolute top-4 right-4">
                    <Tag value="Nuevo" icon="pi pi-sparkles" severity="success" class="font-semibold"></Tag>
                  </div>
                </div>
              </template>
              
              <template #title>
                <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  Inversión Digital: Cómo Diversificar tu Portafolio desde una App
                </h3>
              </template>
              
              <template #subtitle>
                <div class="flex items-center gap-2 text-gray-500 text-sm mb-4">
                  <i class="pi pi-calendar"></i>
                  <span>10 Enero 2025</span>
                  <i class="pi pi-user ml-4"></i>
                  <span>Carlos Rodriguez</span>
                </div>
              </template>
              
              <template #content>
                <p class="text-gray-600 leading-relaxed mb-6">
                  La revolución fintech ha llegado. Descubre cómo diversificar tu portafolio de inversiones 
                  de manera inteligente y accesible desde tu smartphone con las últimas tecnologías.
                </p>
                
                <div class="flex flex-wrap gap-2 mb-6">
                  <Chip label="Fintech" class="bg-indigo-100 text-indigo-700" />
                  <Chip label="Diversificación" class="bg-orange-100 text-orange-700" />
                  <Chip label="App Móvil" class="bg-pink-100 text-pink-700" />
                </div>
                
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <Rating :modelValue="5" readonly :cancel="false" class="text-sm" />
                    <span class="text-sm text-gray-500">(4.9/5)</span>
                  </div>
                  <Button
                    label="Leer más"
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="p-button-outlined"
                    @click="readArticle(3)"
                  />
                </div>
              </template>
            </Card>
          </div>

          <!-- Newsletter Subscription -->
          <div class="mb-16">
            <Card class="shadow-xl bg-gradient-to-r from-[#6790FF] to-[#5577DD] text-white">
              <template #content>
                <div class="text-center py-8">
                  <i class="pi pi-bell text-4xl mb-4"></i>
                  <h3 class="text-3xl font-bold mb-4">¡No te pierdas nuestros artículos!</h3>
                  <p class="text-xl mb-8">
                    Suscríbete a nuestro newsletter y recibe los mejores consejos de inversión directamente en tu correo.
                  </p>
                  
                  <div class="max-w-md mx-auto">
                    <InputGroup>
                      <InputText
                        v-model="newsletterEmail"
                        placeholder="tu@email.com"
                        class="text-gray-800"
                      />
                      <Button
                        label="Suscribirse"
                        icon="pi pi-send"
                        class="bg-white text-[#6790FF] hover:bg-gray-100 border-white"
                        @click="subscribeNewsletter"
                        :loading="isSubscribing"
                      />
                    </InputGroup>
                  </div>
                </div>
              </template>
            </Card>
          </div>

          <!-- Estadísticas del Blog -->
          <div class="grid md:grid-cols-4 gap-6 mb-16">
            <Card class="text-center shadow-lg hover:shadow-xl transition-shadow">
              <template #content>
                <i class="pi pi-file-edit text-4xl text-[#6790FF] mb-4"></i>
                <h4 class="text-2xl font-bold text-gray-800 mb-2">50+</h4>
                <p class="text-gray-600">Artículos Publicados</p>
              </template>
            </Card>
            
            <Card class="text-center shadow-lg hover:shadow-xl transition-shadow">
              <template #content>
                <i class="pi pi-users text-4xl text-green-500 mb-4"></i>
                <h4 class="text-2xl font-bold text-gray-800 mb-2">10K+</h4>
                <p class="text-gray-600">Lectores Mensuales</p>
              </template>
            </Card>
            
            <Card class="text-center shadow-lg hover:shadow-xl transition-shadow">
              <template #content>
                <i class="pi pi-heart-fill text-4xl text-red-500 mb-4"></i>
                <h4 class="text-2xl font-bold text-gray-800 mb-2">95%</h4>
                <p class="text-gray-600">Satisfacción</p>
              </template>
            </Card>
            
            <Card class="text-center shadow-lg hover:shadow-xl transition-shadow">
              <template #content>
                <i class="pi pi-trophy text-4xl text-yellow-500 mb-4"></i>
                <h4 class="text-2xl font-bold text-gray-800 mb-2">#1</h4>
                <p class="text-gray-600">Blog Fintech Perú</p>
              </template>
            </Card>
          </div>

          <!-- Categorías -->
          <div class="mb-16">
            <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center">Explora por Categorías</h2>
            
            <div class="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Button
                v-for="category in blogCategories"
                :key="category.value"
                :label="category.name"
                :icon="category.icon"
                class="p-3 text-center hover:scale-105 transition-transform"
                :class="category.class"
                @click="filterByCategory(category.value)"
              />
            </div>
          </div>

          <!-- Call to Action -->
          <div class="text-center">
            <Card class="shadow-xl">
              <template #content>
                <div class="py-8">
                  <h3 class="text-3xl font-bold text-gray-800 mb-4">
                    ¿Listo para comenzar a invertir?
                  </h3>
                  <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Descarga nuestra app y comienza a hacer crecer tu dinero con las mejores oportunidades de inversión del mercado.
                  </p>
                  
                  <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      label="Descargar App"
                      icon="pi pi-download"
                      class="p-3 text-lg font-semibold"
                      @click="downloadApp"
                    />
                    <Button
                      label="Hablar con Asesor"
                      icon="pi pi-phone"
                      class="p-3 text-lg font-semibold"
                      severity="secondary"
                      @click="contactAdvisor"
                    />
                  </div>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </section>

      <FooterWidget />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
import FooterWidget from '@/components/landing/FooterWidget.vue'

// Componentes PrimeVue
import Card from 'primevue/card'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputGroup from 'primevue/inputgroup'
import Dropdown from 'primevue/dropdown'
import Tag from 'primevue/tag'
import Chip from 'primevue/chip'
import Rating from 'primevue/rating'

// Estados reactivos
const searchQuery = ref('')
const selectedCategory = ref('')
const newsletterEmail = ref('')
const isSubscribing = ref(false)

// Categorías para filtros
const categories = [
  { name: 'Todas las categorías', value: '' },
  { name: 'Inversión', value: 'investment' },
  { name: 'Factoring', value: 'factoring' },
  { name: 'Inmobiliario', value: 'real-estate' },
  { name: 'Fintech', value: 'fintech' },
  { name: 'Análisis', value: 'analysis' }
]

// Categorías para explorar
const blogCategories = [
  { name: 'Factoring', value: 'factoring', icon: 'pi pi-chart-line', class: 'bg-blue-500 text-white hover:bg-blue-600' },
  { name: 'Hipotecas', value: 'mortgages', icon: 'pi pi-home', class: 'bg-purple-500 text-white hover:bg-purple-600' },
  { name: 'Fintech', value: 'fintech', icon: 'pi pi-mobile', class: 'bg-indigo-500 text-white hover:bg-indigo-600' },
  { name: 'Inversiones', value: 'investments', icon: 'pi pi-dollar', class: 'bg-green-500 text-white hover:bg-green-600' },
  { name: 'Análisis', value: 'analysis', icon: 'pi pi-chart-bar', class: 'bg-orange-500 text-white hover:bg-orange-600' },
  { name: 'Noticias', value: 'news', icon: 'pi pi-megaphone', class: 'bg-red-500 text-white hover:bg-red-600' }
]

// Funciones
const searchArticles = () => {
  console.log('Buscando:', searchQuery.value)
  // Implementar lógica de búsqueda
}

const filterByCategory = (category) => {
  selectedCategory.value = category
  console.log('Filtrando por categoría:', category)
  // Implementar lógica de filtrado
}

const readArticle = (articleId) => {
  console.log('Leyendo artículo:', articleId)
  // Navegar al artículo completo
}

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value.trim()) return
  
  isSubscribing.value = true
  
  try {
    // Simular suscripción
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('¡Suscripción exitosa! Recibirás nuestros mejores artículos en tu correo.')
    newsletterEmail.value = ''
  } catch (error) {
    alert('Error al suscribirse. Inténtalo de nuevo.')
  } finally {
    isSubscribing.value = false
  }
}

const downloadApp = () => {
  console.log('Descargando app...')
  // Redirigir a store
}

const contactAdvisor = () => {
  console.log('Contactando asesor...')
  // Abrir chat o formulario de contacto
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.transition-all {
  transition: all 0.3s ease;
}

.hover\\:scale-105:hover {
  transform: scale(1.05);
}

.hover\\:-translate-y-2:hover {
  transform: translateY(-0.5rem);
}

/* Animaciones para las cards */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.p-card {
  animation: fadeInUp 0.6s ease-out;
}

/* Efectos hover para botones */
.p-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Estilos para ratings */
.p-rating .p-rating-icon {
  color: #fbbf24;
}

/* Estilos responsivos adicionales */
@media (max-width: 768px) {
  .grid.lg\\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
  
  .grid.md\\:grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>