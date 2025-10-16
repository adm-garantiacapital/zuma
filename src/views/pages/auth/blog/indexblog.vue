<template>
  <div id="home" class="landing-wrapper bg-[#edeae4]">
    <TopbarWidget />

    <h1 class="pt-4 px-20 text-center text-[#171717] font-bold font-noto">
      Blog
    </h1>
    <h3 class="font-medium text-xl text-center max-w-3xl mx-auto">
      Descubre las últimas tendencias en inversión, fintech y oportunidades de crecimiento financiero.
      Mantente al día con análisis expertos y consejos prácticos para maximizar tu patrimonio.
    </h3>

    <!-- Sección de Blog -->
    <section class="flex flex-col gap-14 py-10 px-6 lg:px-24 bg-gradient-to-br from-[#EDEAE4] to-[#F5F2EC]">
      <div class="max-w-7xl mx-auto w-full">

        <!-- Filtros y Búsqueda -->
        <div class="mb-12">
          <Card class="shadow-lg">
            <template #content>
              <div class="flex flex-col md:flex-row gap-4 items-center">
                <div class="flex-1">
                  <InputGroup>
                    <InputText v-model="searchQuery" placeholder="Buscar artículos..." class="w-full" />
                    <Button icon="pi pi-search" severity="secondary" @click="searchArticles" />
                  </InputGroup>
                </div>
                <div class="w-full md:w-64">
                  <Dropdown v-model="selectedCategory" :options="categories" optionLabel="name" optionValue="value"
                    placeholder="Todas las categorías" class="w-full" @change="e => filterByCategory(e.value)" />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <!-- Grid de Posts -->
        <div v-if="loading" class="text-center text-gray-600 py-12">Cargando publicaciones…</div>

        <div class="grid lg:grid-cols-3 gap-8 mb-16" v-else-if="postsFiltered && postsFiltered.length">
          <Card v-for="(post, idx) in postsFiltered" :key="post?.id ?? idx"
            class="shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
            <template #header>
              <div class="relative overflow-hidden">
                <img :src="normalizeUrl(post?.imagen_url)" alt="Imagen del artículo" class="w-full h-64 object-cover" />

                <div class="absolute top-4 left-4">
                  <Tag :value="productLabel(post)" severity="success" class="font-semibold" />
                </div>
                <div class="absolute top-4 right-4" v-if="post?.destacado">
                  <Tag value="Trending" icon="pi pi-fire" severity="danger" class="font-semibold" />
                </div>
              </div>
            </template>

            <template #title>
              <h3 class="text-xl font-bold text-gray-800 mb-2 line-clamp-2 text-[#171717]">
                {{ post?.titulo || 'Sin título' }}
              </h3>
            </template>

            <template #subtitle>
              <div class="flex items-center gap-2 text-[#171717] text-sm mb-4">
                <i class="pi pi-calendar"></i>
                <span>{{ formatDate(post?.fecha_publicacion) }}</span>
                <i class="pi pi-user ml-4"></i>
                <span>Equipo Zuma</span>
              </div>
            </template>

            <template #content>
              <!-- Excerpt: exactamente 3 líneas -->
              <p class="text-gray-600 leading-relaxed excerpt clamp-3 mb-6">
                {{ excerpt(post) }}
              </p>

              <div class="flex flex-wrap gap-2 mb-6">
                <Chip v-for="c in (post?.categories || [])" :key="c?.id" :label="c?.nombre"
                  class="bg-blue-100 text-[#171717]" />
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <Rating v-model="ratingsMap[post.id]" :cancel="false"
                    @update:modelValue="val => saveRating(post.id, val)" />
                </div>
                <Button label="Leer más" icon="pi pi-arrow-right" iconPos="right"
                  class="p-button-outlined !text-[#171717]" @click="readArticle(post.id)" />
              </div>


            </template>
          </Card>
        </div>


        <!-- Pagination -->
        <div v-if="meta.total > 0" class="flex items-center justify-center gap-3 mb-16">
          <Button label="Anterior" severity="secondary" @click="prevPage" :disabled="currentPage <= 1" />
          <span class="text-sm text-gray-700">
            Página {{ meta.current_page }} de {{ meta.last_page }}
          </span>
          <Button label="Siguiente" severity="secondary" @click="nextPage" :disabled="currentPage >= meta.last_page" />
        </div>


        <div v-else class="text-center text-gray-600 py-12">
          No hay publicaciones disponibles.
        </div>

        <!-- Categorías (Explora nuestros productos) -->
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-gray-800 mb-8 text-center text-[#171717]">
            Explora nuestros productos
          </h2>

          <div class="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto mt-12 w-full">
            <Button v-for="p in products" :key="p.id" :label="p.nombre || p.name || `Producto ${p.id}`"
              :icon="p.icon || 'pi pi-briefcase'" class="w-full md:w-1/3 sm:w-1/2 p-3 text-center hover:scale-105 transition-transform"
              :class="p.class || '!bg-[#6790FF] !border-none text-white hover:opacity-90 w-full md:w-1/3 sm:w-[40%]'"
              @click="$router?.push?.('/login') ?? (window.location.href = '/login')" />
          </div>
        </div>
      </div>
    </section>

    <FooterWidget />
  </div>
</template>

<script setup>
import { useToast } from 'primevue/usetoast'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

// services
import { apiAdmin1 } from '@/services/api.js'
import { blogService } from '@/services/blogService.js'

// Componentes locales
import FooterWidget from '@/components/landing/FooterWidget.vue'
import TopbarWidget from '@/components/landing/TopbarWidget.vue'

// PrimeVue
import Button from 'primevue/button'
import Card from 'primevue/card'
import Chip from 'primevue/chip'
import Dropdown from 'primevue/dropdown'
import InputGroup from 'primevue/inputgroup'
import InputText from 'primevue/inputtext'
import Rating from 'primevue/rating'
import Tag from 'primevue/tag'

const router = useRouter()
const toast = useToast()

// ---- Estado ----
const searchQuery = ref('')
const selectedCategory = ref('')
const posts = ref([])
const categories = ref([{ name: 'Todas las categorías', value: '' }])
const blogCategories = ref([])

// ⭐ map de rating por post (pre-llena con localStorage / my_rating)
const ratingsMap = reactive({})

const loading = ref(false)



const products = ref([])
const productMap = reactive({})


const currentPage = ref(1)
const perPage = ref(12)
const meta = reactive({ current_page: 1, last_page: 1, total: 0 })


function normalizeUrl(u = '') {
  // turn "http:\/\/127.0.0.1:8000\/s3\/images\/foo.png" into "http://127.0.0.1:8000/s3/images/foo.png"
  return String(u).replace(/\\\//g, '/').replace(/\\:/g, ':');
}



// carga productos para mapear id -> nombre
async function obtenerProductos() {
  try {
    const { data } = await apiAdmin1.get('/blog/productos') // -> /api/blog/productos
    products.value = Array.isArray(data) ? data : []
    products.value.forEach(p => {
      if (p?.id) productMap[p.id] = p.nombre || p.name || `Producto ${p.id}`
    })
  } catch {
    // opcional: toast de error
  }
}

// devuelve el nombre del producto de la 1ra categoría del post
function productLabel(post) {
  // 1) si el post ya trae product.nombre
  if (post?.product?.nombre) return post.product.nombre

  const firstCat = (post?.categories || [])[0]
  if (!firstCat) return 'Blog'

  // 2) si la categoría trae product.nombre
  if (firstCat?.product?.nombre) return firstCat.product.nombre

  // 3) usar product_id de la categoría y mapearlo
  const pid = firstCat?.product_id ?? firstCat?.pivot?.product_id
  return (pid && productMap[pid]) ? productMap[pid] : 'Blog'
}


// Base URLs
const API_BASE = (apiAdmin1?.defaults?.baseURL || '').replace(/\/$/, '')
const ORIGIN = API_BASE.replace(/\/api$/, '') // strip trailing /api for static assets

// ---- API: Categorías
async function obtenerCategorias() {
  try {
    const res = await blogService.getCategorias(100)
    const list = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : [])
    const mapped = list.filter(Boolean).map(c => ({
      id: c.id,
      name: c.nombre ?? 'Sin nombre',
      value: c.id,
      icon: c.icon ?? 'pi pi-tag',
      class: c.color_class ?? '!bg-[#6790FF] !border-none text-white hover:opacity-90'
    }))

    categories.value = [{ name: 'Todas las categorías', value: '' }, ...mapped]
    blogCategories.value = mapped
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar categorías', life: 3000 })
  }
}

// ---- API: Publicaciones (paginadas + filtros)
async function obtenerPublicaciones() {
  try {
    loading.value = true

    const { data } = await blogService.getPublicaciones({
      page: currentPage.value,
      perPage: perPage.value,
      search: searchQuery.value,
      categoryId: selectedCategory.value
    })

    const arr = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : [])
    posts.value = arr.filter(Boolean)

    // meta from backend
    const m = data?.meta || {}
    meta.current_page = Number(m.current_page || 1)
    meta.last_page = Number(m.last_page || 1)
    meta.total = Number(m.total || arr.length)

    // ⭐ Inicializa rating local por post
    posts.value.forEach(p => {
      const key = `post_rating_${p.id}`
      if (p?.my_rating != null) {
        ratingsMap[p.id] = Number(p.my_rating) || 0
      } else if (localStorage.getItem(key) != null) {
        ratingsMap[p.id] = Number(localStorage.getItem(key)) || 0
      } else if (ratingsMap[p.id] == null) {
        ratingsMap[p.id] = Number(p.promedio_estrellas ?? p.rating ?? 0)
      }
    })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar publicaciones', life: 3000 })
    posts.value = []
    meta.current_page = 1
    meta.last_page = 1
    meta.total = 0
  } finally {
    loading.value = false
  }
}


// ---- API: rating
async function saveRating(postId, estrellas) {
  try {
    await blogService.guardarRating(postId, estrellas)
    localStorage.setItem(`post_rating_${postId}`, String(estrellas))
    toast.add({ severity: 'success', summary: 'Gracias', detail: 'Tu calificación fue registrada', life: 2500 })
  } catch {
    toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo guardar tu calificación', life: 3000 })
  }
}

// ---- Excerpt helpers (3-line clamp uses this text)
function toPlainText(html) {
  if (!html) return ''
  const text = String(html).replace(/<[^>]*>/g, ' ')
  return text.replace(/\s+/g, ' ').trim()
}
function excerpt(post) {
  const res = (post?.resumen || '').toString().trim()
  return res ? res : toPlainText(post?.contenido)
}

// ---- Lógica UI ----
const postsFiltered = computed(() => {
  const q = (searchQuery.value || '').toLowerCase().trim()
  if (!q) return posts.value
  return posts.value.filter(p =>
    String(p?.titulo || '').toLowerCase().includes(q) ||
    String(p?.resumen || '').toLowerCase().includes(q) ||
    String(toPlainText(p?.contenido)).toLowerCase().includes(q)
  )
})

function searchArticles() {
  currentPage.value = 1
  obtenerPublicaciones()
}


function filterByCategory(categoryId) {
  selectedCategory.value = categoryId || ''
  currentPage.value = 1
  obtenerPublicaciones()
}

function readArticle(id) {
  router.push({ name: 'blog-detail', params: { id: String(id) } })
}









function formatDate(date) {
  if (!date) return ''
  const d = new Date(String(date).replace(' ', 'T'))
  if (isNaN(d)) return String(date)
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}


function goToPage(p) {
  if (p < 1 || p > meta.last_page) return
  currentPage.value = p
  obtenerPublicaciones()
}
function nextPage() {
  if (currentPage.value < meta.last_page) {
    currentPage.value++
    obtenerPublicaciones()
  }
}
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    obtenerPublicaciones()
  }
}


// ---- Init ----
onMounted(() => {
  obtenerCategorias()
  obtenerPublicaciones()
  obtenerProductos()
})

watch(searchQuery, (v) => {
  if (!v) obtenerPublicaciones()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* Exact 3-line clamp for the excerpt */
.excerpt {
  line-height: 1.625;
  word-break: break-word;
}

.clamp-3 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}

.transition-all {
  transition: all 0.3s ease;
}

.hover\:scale-105:hover {
  transform: scale(1.05);
}

.hover\:-translate-y-2:hover {
  transform: translateY(-0.5rem);
}

/* Animación para cards */
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

/* Botones */
.p-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Rating color */
.p-rating .p-rating-icon {
  color: #fbbf24;
}

/* Responsivo */
@media (max-width: 768px) {
  .grid.lg\:grid-cols-3 {
    grid-template-columns: 1fr;
  }
}
</style>
