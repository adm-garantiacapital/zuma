<template>
    <div id="home" class="landing-wrapper bg-[#edeae4]">
        <TopbarWidget />
        <div class="container mx-auto flex flex-col md:flex-row gap-6 mt-6 mb-2">

            <article class="flex-1 bg-white p-6 rounded-lg shadow">
                <div class="max-w-4xl mx-auto px-4 py-8">
                    <!-- Título -->
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ post.title }}</h1>

                    <!-- Imagen principal -->
                    <img v-if="post.mainImage" :src="post.mainImage" :alt="post.title"
                        class="w-full h-auto rounded-lg shadow-md mb-6" />

                    <!-- Contenido -->
                    <div class="prose prose-lg max-w-none mb-8" v-html="post.content"></div>

                    <!-- Imágenes adicionales -->
                    <Swiper :modules="[Navigation, Pagination, Autoplay]" :slides-per-view="1" :space-between="10"
                        :loop="true" :autoplay="{ delay: 4000 }" pagination navigation>
                        <SwiperSlide v-for="(img, index) in post.extraImages" :key="index">
                            <img :src="img" class="rounded-lg" />
                        </SwiperSlide>
                    </Swiper>

                    <!-- Referencias -->
                    <div v-if="post.references.length" class="bg-gray-100 p-4 rounded-lg shadow mt-2">
                        <h2 class="text-xl font-semibold mb-2">Referencias</h2>
                        <ul class="list-disc pl-6 space-y-1">
                            <li v-for="(ref, index) in post.references" :key="index">
                                <a :href="ref" target="_blank" class="text-blue-600 hover:underline">{{ ref }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </article>

            <!-- Sidebar de artículos relacionados -->
            <RelatedPosts :related="post.relatedPosts" />

        </div>

        <FooterWidget />
    </div>
</template>

<script setup>
import RelatedPosts from "@/components/blog/RelatedPosts.vue";
import FooterWidget from '@/components/landing/FooterWidget.vue';
import TopbarWidget from '@/components/landing/TopbarWidget.vue';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';


import { Swiper, SwiperSlide } from 'swiper/vue';

import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

// estilos
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const route = useRoute()
const post = ref({
    title: '',
    mainImage: '',
    content: '',
    extraImages: [],
    references: [],
    relatedPosts: [],
})

onMounted(() => {
    // Simulación: Cargar post según ID desde la URL
    const id = route.params.id
    // Aquí iría tu fetch real a la API
    if (id === '1') {
        post.value = {
            title: 'Cómo aprender Vue.js en 2025',
            mainImage: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
            content: `
        <p>Vue.js es uno de los frameworks más amigables para iniciar en el desarrollo web moderno. Su sintaxis sencilla y su documentación clara lo convierten en una excelente opción para principiantes. Además, la comunidad de Vue es muy activa y siempre está dispuesta a ayudar a nuevos desarrolladores. Aprender Vue te permitirá crear interfaces de usuario interactivas y modernas con facilidad. La curva de aprendizaje es suave en comparación con otros frameworks populares. Puedes comenzar con conceptos básicos y avanzar rápidamente hacia temas más avanzados. Esto hace que Vue sea ideal tanto para proyectos personales como profesionales.</p>
        <p>Para aprender Vue.js en 2025, es recomendable empezar por la documentación oficial, que está disponible en varios idiomas y se actualiza constantemente. Los tutoriales interactivos y ejemplos prácticos te ayudarán a entender cómo funciona el framework. También puedes encontrar cursos gratuitos y de pago en plataformas educativas reconocidas. Participar en foros y comunidades en línea te permitirá resolver dudas y compartir experiencias. Es importante practicar creando pequeños proyectos para afianzar los conocimientos adquiridos. No olvides explorar las herramientas del ecosistema de Vue, como Vue CLI y Vite. Estas herramientas facilitan la configuración y el desarrollo de aplicaciones modernas.</p>
        <p>Una vez que domines los conceptos básicos, puedes profundizar en temas como el manejo del estado con Pinia o Vuex, el enrutamiento con Vue Router y la composición de componentes reutilizables. Aprender sobre la reactividad y el ciclo de vida de los componentes te permitirá crear aplicaciones más eficientes. También es útil conocer cómo integrar Vue con otras tecnologías como Tailwind CSS para mejorar el diseño visual. La modularidad de Vue permite escalar proyectos de manera sencilla y mantener el código organizado. Explora las mejores prácticas recomendadas por la comunidad para escribir código limpio y mantenible. Mantente actualizado con las novedades del framework y sus librerías asociadas.</p>
        <p>Finalmente, participar en proyectos colaborativos y contribuir a repositorios open source te dará experiencia real y te ayudará a mejorar tus habilidades. Asistir a eventos, conferencias y meetups relacionados con Vue te permitirá conocer a otros desarrolladores y aprender de sus experiencias. Documenta tu aprendizaje y comparte tus proyectos en plataformas como GitHub para crear un portafolio profesional. No dudes en experimentar con nuevas funcionalidades y explorar el potencial de Vue en diferentes tipos de aplicaciones. Recuerda que la práctica constante es clave para dominar cualquier tecnología. Con dedicación y curiosidad, podrás convertirte en un experto en Vue.js y aprovechar todas las oportunidades que ofrece el desarrollo web moderno.</p>
      `,
            extraImages: [
                'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'
            ],
            references: [
                'https://vuejs.org/',
                'https://tailwindcss.com/'
            ],
            relatedPosts: [
                {
                    title: "Otro artículo interesante",
                    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
                    date: "12 Ago 2025",
                },
                {
                    title: "Tips para mejorar tu blog",
                    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                    date: "10 Ago 2025",
                },
                {
                    title: "Tips para mejorar tu blog",
                    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                    date: "10 Ago 2025",
                },
                {
                    title: "Tips para mejorar tu blog",
                    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                    date: "10 Ago 2025",
                },
                {
                    title: "Tips para mejorar tu blog",
                    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
                    date: "10 Ago 2025",
                },
                {
                    title: "Otro artículo interesante",
                    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
                    date: "12 Ago 2025",
                },
                {
                    title: "Otro artículo interesante",
                    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
                    date: "12 Ago 2025",
                },
                {
                    title: "Otro artículo interesante",
                    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80",
                    date: "12 Ago 2025",
                },

            ],
        }
    }
})
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
