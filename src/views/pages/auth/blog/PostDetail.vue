<template>
    <div id="home" class="landing-wrapper bg-[#edeae4]">
        <TopbarWidget />
        <div class="container mx-auto flex flex-col md:flex-row gap-6 mt-6 mb-2">

            <article class="flex-1 bg-white p-6 rounded-lg shadow">
                <div class="max-w-4xl mx-auto px-4 py-8">
                    <!-- Título -->
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ post.titulo }}</h1>

                    <!-- Metadatos -->
                    <div class="flex items-center text-gray-600 mb-6">
                        <span class="mr-4">{{ formatDate(post.created_at) }}</span>
                        <span>Por: {{ post.autor || 'Admin' }}</span>
                    </div>

                    <!-- Imagen principal -->
                    <img v-if="post.imagen" :src="`${storageUrl}/${post.imagen}`" :alt="post.titulo"
                        class="w-full h-auto rounded-lg shadow-md mb-6 max-h-96 object-cover" />

                    <!-- Contenido -->
                    <div class="prose prose-lg max-w-none mb-8" v-html="post.contenido"></div>

                    <!-- Slider de imágenes con altura fija -->
                    <div v-if="post.images && post.images.length > 0" class="mb-8">
                        <h2 class="text-xl font-semibold mb-4">Galería de imágenes</h2>
                        <div class="relative h-96 overflow-hidden rounded-lg shadow-md bg-gray-100">
                            <Swiper :modules="[Navigation, Pagination, Autoplay]" :slides-per-view="1"
                                :space-between="10" :loop="true" :autoplay="{ delay: 4000 }" pagination navigation
                                class="h-full">
                                <SwiperSlide v-for="(img, index) in post.images" :key="index">
                                    <img :src="`${storageUrl}/${img.image_path}`" class="w-fit h-fit object-contain" />
                                </SwiperSlide>
                            </Swiper>
                        </div>
                    </div>

                    <!-- Referencias -->
                    <div v-if="post.enlaces && post.enlaces.length > 0" class="bg-gray-100 p-4 rounded-lg shadow mt-8">
                        <h2 class="text-xl font-semibold mb-2">Referencias</h2>
                        <ul class="list-disc pl-6 space-y-1">
                            <li v-for="(ref, index) in post.enlaces" :key="index">
                                <a :href="ref" target="_blank" class="text-blue-600 hover:underline">{{ ref }}</a>
                            </li>
                        </ul>
                    </div>

                    <!-- Sección de comentarios -->
                    <div class="mt-12 border-t pt-8">
                        <div class="flex justify-between items-center mb-6">
                            <h2 class="text-2xl font-bold">Comentarios</h2>
                            <span class="text-gray-600">{{ comments.length }} comentario(s)</span>
                        </div>

                        <!-- Formulario para nuevo comentario -->
                        <div class="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                            <h3 class="text-lg font-semibold mb-4">Deja tu comentario</h3>
                            <form @submit.prevent="submitComment">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label for="name" class="block text-gray-700 mb-2">Nombre*</label>
                                        <input type="text" id="name" v-model="commentForm.name"
                                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required>
                                    </div>
                                    <div>
                                        <label for="email" class="block text-gray-700 mb-2">Email* (no se
                                            mostrará)</label>
                                        <input type="email" id="email" v-model="commentForm.email"
                                            class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            required>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <label class="block text-gray-700 mb-2">Calificación</label>
                                    <div class="flex items-center">
                                        <span v-for="star in 5" :key="star" @click="commentForm.rating = star"
                                            class="cursor-pointer text-2xl mr-1 transition-transform hover:scale-110"
                                            :class="star <= commentForm.rating ? 'text-yellow-400' : 'text-gray-300'">
                                            ★
                                        </span>
                                        <span class="ml-2 text-sm text-gray-500">({{ commentForm.rating }}/5)</span>
                                    </div>
                                </div>
                                <div class="mb-4">
                                    <label for="comment" class="block text-gray-700 mb-2">Comentario*</label>
                                    <textarea id="comment" v-model="commentForm.content" rows="4"
                                        class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required></textarea>
                                </div>
                                <div class="flex justify-end">
                                    <button type="submit"
                                        class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                                                clip-rule="evenodd" />
                                        </svg>
                                        Enviar comentario
                                    </button>
                                </div>
                            </form>
                        </div>

                        <!-- Lista de comentarios -->
                        <div v-if="comments.length > 0">
                            <!-- Filtros y ordenación -->
                            <div
                                class="flex flex-col md:flex-row justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
                                <div class="mb-2 md:mb-0">
                                    <span class="text-sm text-gray-600 mr-2">Ordenar por:</span>
                                    <select v-model="sortOption" @change="sortComments"
                                        class="border rounded p-1 text-sm">
                                        <option value="newest">Más recientes</option>
                                        <option value="oldest">Más antiguos</option>
                                        <option value="highest">Mejor valorados</option>
                                        <option value="lowest">Peor valorados</option>
                                    </select>
                                </div>
                                <div class="text-sm text-gray-600">
                                    Mostrando {{ paginatedComments.length }} de {{ comments.length }} comentarios
                                </div>
                            </div>

                            <!-- Comentarios -->
                            <div v-for="comment in paginatedComments" :key="comment.id"
                                class="mb-6 pb-6 border-b last:border-0">
                                <div class="flex items-start">
                                    <div class="flex-shrink-0 mr-4">
                                        <div
                                            class="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                                            {{ comment.name.charAt(0).toUpperCase() }}
                                        </div>
                                    </div>
                                    <div class="flex-1">
                                        <div class="flex flex-col md:flex-row md:items-center justify-between mb-1">
                                            <h4 class="font-semibold">{{ comment.name }}</h4>
                                            <div class="flex items-center">
                                                <div class="flex mr-2">
                                                    <span v-for="star in 5" :key="star" class="text-sm"
                                                        :class="star <= comment.rating ? 'text-yellow-400' : 'text-gray-300'">
                                                        ★
                                                    </span>
                                                </div>
                                                <span class="text-sm text-gray-500">{{ formatDate(comment.created_at)
                                                    }}</span>
                                            </div>
                                        </div>
                                        <p class="text-gray-700 whitespace-pre-line">{{ comment.content }}</p>

                                        <!-- Acciones (responder, reportar) -->
                                        <div class="flex mt-3 space-x-4">
                                            <button class="text-sm text-blue-600 hover:underline">Responder</button>
                                            <button class="text-sm text-gray-500 hover:underline">Reportar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Paginación mejorada -->
                            <div class="flex flex-col items-center mt-8">
                                <div class="flex space-x-1 mb-4">
                                    <button @click="currentPage--" :disabled="currentPage === 1"
                                        class="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                        &laquo; Anterior
                                    </button>
                                    <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                                        class="px-3 py-1 border-t border-b border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                                        :class="{
                                            'bg-blue-50 text-blue-600 border-blue-500': currentPage === page,
                                            'hidden md:block': shouldHidePageNumber(page)
                                        }">
                                        {{ page }}
                                    </button>
                                    <button @click="currentPage++" :disabled="currentPage === totalPages"
                                        class="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                        Siguiente &raquo;
                                    </button>
                                </div>
                                <span class="text-sm text-gray-500">
                                    Página {{ currentPage }} de {{ totalPages }}
                                </span>
                            </div>
                        </div>

                        <div v-else class="text-center py-12 text-gray-500 border rounded-lg bg-gray-50">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p class="mt-2 text-lg">Aún no hay comentarios</p>
                            <p class="text-sm mt-1">¡Sé el primero en compartir tu opinión!</p>
                        </div>
                    </div>
                </div>
            </article>

            <!-- Sidebar -->
            <RelatedPosts :storage="`${storageUrl}`" :related="post.related_articles" />

        </div>

        <FooterWidget />
    </div>
</template>

<script setup>
import RelatedPosts from "@/components/blog/RelatedPosts.vue";
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import axios from "axios";
import { useToast } from 'primevue/usetoast';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const apiUrl = import.meta.env.VITE_API_ADMIN1
const storageUrl = import.meta.env.VITE_API_STORAGE

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Datos del post
const post = ref({})
const comments = ref([])
const toast = useToast()
const route = useRoute()

// Formulario de comentario
const commentForm = ref({
    name: '',
    email: '',
    content: '',
    rating: 0,
    post_id: route.params.id
})

// Paginación
const currentPage = ref(1)
const commentsPerPage = 5
const sortOption = ref('newest')

// Obtener datos al montar el componente
onMounted(() => {
    const id = route.params.id
    obtenerPost(id)
    obtenerComentarios(id)
})

// Obtener el post
async function obtenerPost(id) {
    try {
        const res = await axios.get(`${apiUrl}/blog/showpost/${id}`)
        const data = res.data

        post.value = {
            ...data,
            enlaces: data.enlaces ? data.enlaces.split(",") : []
        }

    } catch (error) {
        console.error(error)
        mostrarError('No se pudo cargar el post')
    }
}

// Obtener comentarios
async function obtenerComentarios(postId) {
    try {
        const res = await axios.get(`${apiUrl}/blog/comments/${postId}`)
        comments.value = res.data
        sortComments() // Ordenar inicialmente
    } catch (error) {
        console.error(error)
        mostrarError('No se pudieron cargar los comentarios')
    }
}

// Ordenar comentarios
function sortComments() {
    switch (sortOption.value) {
        case 'newest':
            comments.value.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            break
        case 'oldest':
            comments.value.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
            break
        case 'highest':
            comments.value.sort((a, b) => b.rating - a.rating)
            break
        case 'lowest':
            comments.value.sort((a, b) => a.rating - b.rating)
            break
    }
    currentPage.value = 1 // Resetear a primera página al cambiar orden
}

// Enviar comentario
async function submitComment() {
    try {
        const res = await axios.post(`${apiUrl}/blog/comments`, commentForm.value)

        // Limpiar formulario (excepto nombre y email)
        commentForm.value.content = ''
        commentForm.value.rating = 0

        // Recargar comentarios
        await obtenerComentarios(route.params.id)

        toast.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Comentario enviado correctamente',
            life: 3000
        })
    } catch (error) {
        console.error(error)
        mostrarError('Error al enviar el comentario')
    }
}

// Formatear fecha
function formatDate(dateString) {
    if (!dateString) return ''
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    return new Date(dateString).toLocaleDateString('es-ES', options)
}

// Mostrar error
function mostrarError(mensaje) {
    toast.add({
        severity: 'error',
        summary: 'Error',
        detail: mensaje,
        life: 3000
    })
}

// Computed properties para paginación
const totalPages = computed(() => Math.ceil(comments.value.length / commentsPerPage))
const paginatedComments = computed(() => {
    const start = (currentPage.value - 1) * commentsPerPage
    const end = start + commentsPerPage
    return comments.value.slice(start, end)
})
const visiblePages = computed(() => {
    const pages = []
    const maxVisible = 5 // Máximo de números de página visibles

    let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages.value, start + maxVisible - 1)

    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
        pages.push(i)
    }

    return pages
})

// Ocultar números de página en móviles cuando hay muchas páginas
function shouldHidePageNumber(page) {
    return totalPages.value > 7 &&
        (page < currentPage.value - 1 || page > currentPage.value + 1) &&
        page !== 1 &&
        page !== totalPages.value
}
</script>

<style scoped>
.prose a {
    color: #2563eb;
    text-decoration: none;
}

.prose a:hover {
    text-decoration: underline;
}

/* Estilo para el slider de imágenes */
.swiper-slide {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
}

/* Transición suave para los botones de paginación */
button {
    transition: all 0.2s ease;
}

/* Mejorar la visibilidad de las estrellas */
.text-yellow-400 {
    filter: drop-shadow(0 0 2px rgba(250, 204, 21, 0.5));
}

/* Estilo para los botones deshabilitados */
button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>