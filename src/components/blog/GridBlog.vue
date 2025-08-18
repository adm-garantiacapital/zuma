<template>
    <div class="max-w-7xl mx-auto px-4 py-8">
        <!-- Título -->
        <h1 class="text-3xl font-bold mb-6">Articulos</h1>

        <!-- Grid de artículos -->
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="(post, index) in paginatedPosts" :key="index"
                class="rounded-xl overflow-hidden shadow-lg relative bg-white group">
                <!-- Imagen -->
                <img :src="`${apiUrl}/${post.imagen}`" alt="Post image" class="h-72 w-full object-cover" />

                <!-- Etiqueta de producto arriba -->
                <div class="absolute top-4 left-4 bg-white text-sm px-3 py-1 rounded-full font-semibold shadow">
                    {{ post.productTag }}
                </div>

                <!-- Contenido -->
                <div class="p-4 flex flex-col justify-between h-48">
                    <div>
                        <h2 class="text-lg font-semibold line-clamp-2">{{ post.titulo }}</h2>
                        <p class="text-sm opacity-80 mt-1 line-clamp-3">
                            {{ post.contenido }}
                        </p>
                    </div>

                    <!-- Categorías debajo -->
                    <div class="mt-3 flex flex-wrap gap-2">
                        <span v-for="(cat, i) in post.categories" :key="i"
                            class="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            {{ cat.nombre }}
                        </span>
                    </div>

                    <!-- Botón Leer más (flecha) -->
                    <router-link :to="`/blog/post/${post.id}`">
                        <button
                            class="absolute bottom-4 right-4 p-2 text-gray-500 hover:text-gray-700 transition-all duration-300 group-hover:translate-x-1">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span class="sr-only">Leer más</span>
                        </button>
                    </router-link>
                </div>
            </div>
        </div>

        <!-- Paginación -->
        <div class="flex justify-center items-center mt-8 space-x-2">
            <button @click="prevPage" :disabled="currentPage === 1"
                class="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50">
                Prev
            </button>
            <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
                class="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50">
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";
const apiUrl = import.meta.env.VITE_API_STORAGE

// Definimos las props que recibirá el componente
const props = defineProps({
    posts: {
        type: Array,
        required: true,
        default: () => []
    },
    itemsPerPage: {
        type: Number,
        default: 6
    }
});

// Paginación
const currentPage = ref(1);

const totalPages = computed(() => Math.ceil(props.posts.length / props.itemsPerPage));

const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * props.itemsPerPage;
    return props.posts.slice(start, start + props.itemsPerPage);
});

function nextPage() {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
}
</script>

<style scoped>
img {
    transition: transform 0.3s ease;
}

img:hover {
    transform: scale(1.05);
}
</style>