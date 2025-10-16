<template>
    <aside class="w-full md:w-80">
        <div class="bg-white rounded-lg shadow p-5">
            <h2 class="text-lg font-semibold mb-4">Artículos relacionados</h2>

            <div v-if="!Array.isArray(related) || !related.length" class="text-sm text-gray-500">
                No hay artículos relacionados.
            </div>

            <ul v-else class="space-y-4">
                <li v-for="p in related" :key="p.id" class="flex gap-3">
                    <RouterLink :to="`/blog/${p.id}`" class="flex-shrink-0">
                        <img :src="imgSrc(p)" class="w-24 h-16 rounded object-cover bg-gray-100"
                            :alt="p.titulo || 'post'" @error="onErr($event, p)" />
                    </RouterLink>
                    <div class="min-w-0">
                        <RouterLink :to="`/blog/${p.id}`"
                            class="font-medium text-sm text-gray-800 hover:underline line-clamp-2">
                            {{ p.titulo || 'Sin título' }}
                        </RouterLink>
                        <div class="text-xs text-gray-500 mt-1">
                            {{ formatDate(p.fecha_publicacion || p.created_at) }}
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </aside>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
    related: { type: Array, default: () => [] },
    // base URL you passed from PostDetail (e.g., VITE_API_STORAGE)
    storage: { type: String, default: '' }
})

const imgTry = reactive({})

function candidates(p) {
    const raw = p?.imagen
    const base = (props.storage || '').replace(/\/$/, '') // e.g. http://127.0.0.1:8000/s3/images
    const list = []

    // 1) If backend sent a ready-to-use URL (absolute or /s3/images/...), prefer it
    if (p?.imagen_url) list.push(p.imagen_url)

    // 2) If imagen already is an absolute URL, honor it
    if (raw && /^https?:\/\//i.test(raw)) {
        list.push(raw)
    }

    // --- Normalize the key for proxy usage ---
    // Accept values like "file.jpg", "images/file.jpg", "/images/file.jpg"
    let key = (raw || '').toString().trim()
    if (key) {
        key = key.replace(/^\/+/, '')        // remove leading slashes
        key = key.replace(/^images\//, '')   // strip "images/" if present
    }

    // 3) Canonical proxy base passed from parent (preferred)
    if (key && base) list.push(`${base}/${key}`) // -> http://127.0.0.1:8000/s3/images/<file>

    // 4) Fallback to current origin /s3/images/<file> if parent didn’t pass base
    if (key) list.push(`${window.location.origin.replace(/\/$/, '')}/s3/images/${key}`)

    // 5) Placeholder
    list.push('')
    return list
}



function imgSrc(p) {
    const id = p?.id ?? 'tmp'
    if (imgTry[id] == null) imgTry[id] = 0
    const list = candidates(p)
    return list[Math.min(imgTry[id], list.length - 1)]
}

function onErr(e, p) {
    const id = p?.id ?? 'tmp'
    const list = candidates(p)
    imgTry[id] = (imgTry[id] ?? 0) + 1
    if (imgTry[id] < list.length) e.target.src = list[imgTry[id]]
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
</script>

<style scoped>
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
