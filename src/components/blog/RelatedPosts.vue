<template>
    <aside class="w-full md:w-1/3 lg:w-1/4 bg-white shadow-md rounded-lg p-4 space-y-4"
        :style="{ height: `${related.length * 80 + 70}px` }">
        <h2 class="text-lg font-semibold text-gray-800 border-b pb-2">Artículos relacionados</h2>

        <ul class="space-y-3">
            <li v-for="(post, index) in related" :key="index"
                class="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition">
                <img :src="post.image" alt="Miniatura" class="w-16 h-16 object-cover rounded-md" />
                <div>
                    <h3 class="text-sm font-medium text-gray-700">{{ post.title }}</h3>
                    <p class="text-xs text-gray-500">{{ post.date }}</p>
                </div>
            </li>
        </ul>
    </aside>
</template>

<script>
export default {
    name: "RelatedPosts",
    props: {
        related: {
            type: Array,
            default: () => [],
        },
    },
};
</script>

<style scoped>
aside {
    position: sticky;
    top: 1rem;
}
</style>
