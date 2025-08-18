<template>
    <div id="home" class="landing-wrapper bg-[#edeae4]">
        <TopbarWidget />
        <div class="container mx-auto flex flex-col md:flex-row gap-6 mt-6 mb-2">

            <article class="flex-1 bg-white p-6 rounded-lg shadow">
                <div class="max-w-4xl mx-auto px-4 py-8">
                    <!-- Título -->
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ post.titulo }}</h1>

                    <!-- Imagen principal -->
                    <img v-if="post.imagen" :src="`${storageUrl}/${post.imagen}`" :alt="post.titulo"
                        class="w-full h-auto rounded-lg shadow-md mb-6" />

                    <!-- Contenido -->
                    <div class="prose prose-lg max-w-none mb-8" v-html="post.contenido"></div>

                    <!-- Imágenes adicionales -->
                    <Swiper :modules="[Navigation, Pagination, Autoplay]" :slides-per-view="1" :space-between="10"
                        :loop="true" :autoplay="{ delay: 4000 }" pagination navigation>
                        <SwiperSlide v-for="(img, index) in post.images" :key="index">
                            <img :src="`${storageUrl}/${img.image_path}`" class="rounded-lg" />
                        </SwiperSlide>
                    </Swiper>

                    <!-- Referencias -->
                    <div v-if="post" class="bg-gray-100 p-4 rounded-lg shadow mt-2">
                        <h2 class="text-xl font-semibold mb-2">Referencias</h2>
                        <ul class="list-disc pl-6 space-y-1">
                            <li v-for="(ref, index) in post.enlaces" :key="index">
                                <a :href="ref" target="_blank" class="text-blue-600 hover:underline">{{ ref }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>

            <!-- Sidebar de artículos relacionados -->
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

const apiUrl = import.meta.env.VITE_API_ADMIN1
const storageUrl = import.meta.env.VITE_API_STORAGE


import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// estilos
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const post = ref({})
const toast = useToast()


onMounted(() => {
    const route = useRoute()

    const id = route.params.id

    obtenerPost(id)
})






async function obtenerPost(id) {
    try {
        const res = await axios.get(`${apiUrl}/blog/showpost/${id}`)
        console.log(res.data)

        const data = res.data

        // Mapeamos los campos para que encajen con tu template
        post.value = {
            ...data,
            enlaces: data.enlaces ? data.enlaces.split(",") : [] // 👈 aquí se transforma a array
        }

    } catch (error) {
        console.error(error)
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar posts',
            life: 3000
        })
    }
}
</script>

<style scoped>
/* Opcional: mejorar la apariencia de enlaces y listas en el contenido */
.prose a {
    color: #2563eb;
    text-decoration: none;
}

.prose a:hover {
    text-decoration: underline;
}
</style>
