<template>
    <div id="home" class="landing-wrapper bg-[#edeae4] min-h-screen">
        <TopbarWidget />

        <!-- HERO (text ABOVE the slider) -->
        <section class="bg-[#faf8f4]">
            <div class="container mx-auto px-4 py-8 md:py-12">
                <div class="max-w-5xl mx-auto">
                    <!-- Text block -->
                    <div v-if="isLoadingPost" class="animate-pulse">
                        <div class="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                        <div class="h-10 w-4/5 bg-gray-200 rounded mb-3"></div>
                        <div class="h-10 w-3/5 bg-gray-200 rounded mb-6"></div>
                        <div class="h-4 w-40 bg-gray-200 rounded"></div>
                    </div>

                    <div v-else class="text-left mb-6 md:mb-8">
                        <div class="uppercase tracking-widest text-xs md:text-sm text-gray-600 font-semibold mb-3">
                            {{ categoryName }}
                        </div>

                        <h1 class="text-3xl md:text-5xl font-extrabold leading-tight text-gray-900">
                            {{ post?.titulo }}
                        </h1>

                        <div class="mt-6 flex items-center gap-6">
                            <time class="text-sm md:text-base text-slate-700 tracking-wide uppercase"
                                :dateTime="isoDate(post?.created_at || post?.fecha_publicacion)">
                                {{ formattedDateUpper }}
                            </time>

                            <!-- Share -->
                            <button type="button" @click="sharePost" class="icon-btn-dark" aria-label="Compartir"
                                title="Compartir">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
                                    stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">
                                    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" />
                                    <path d="M12 3v12" />
                                    <path d="M8.25 6.75L12 3l3.75 3.75" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- HERO slider (always, even with 1 image) -->
                    <div class="relative rounded-xl overflow-hidden shadow">
                        <div v-if="isLoadingPost" class="h-[280px] md:h-[520px] bg-gray-200 animate-pulse"></div>

                        <div v-else
                            class="relative h-[280px] md:h-[520px] bg-gray-100 select-none overflow-hidden flex items-center justify-center"
                            role="region" aria-label="Carrusel de imágenes del artículo" @touchstart="onTouchStart"
                            @touchend="onTouchEnd" tabindex="0" @keydown.left.prevent="prevSlide"
                            @keydown.right.prevent="nextSlide">
                            <!-- CONTAIN the image inside the slider -->
                            <img :src="heroSrc(currentSlide)" :alt="post?.titulo || 'Imagen del artículo'"
                                class="w-full h-full object-contain object-center" loading="eager" decoding="async"
                                @error="e => onHeroImgError(currentSlide, e)" @load="preloadNeighbors" />

                            <!-- Controls -->
                            <button type="button" @click="prevSlide" class="nav-btn left-2" aria-label="Anterior">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                                    <path d="M15.75 19.5L8.25 12l7.5-7.5" />
                                </svg>
                                <span class="sr-only">Anterior</span>
                            </button>

                            <button type="button" @click="nextSlide" class="nav-btn right-2" aria-label="Siguiente">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6" aria-hidden="true">
                                    <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                </svg>
                                <span class="sr-only">Siguiente</span>
                            </button>

                            <!-- Dots -->
                            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                                <button v-for="(_, i) in slidesCandidates.length" :key="i" @click="goTo(i)"
                                    :aria-label="`Ir a imagen ${i + 1}`" :class="[
                                        'w-2.5 h-2.5 rounded-full border',
                                        i === currentSlide ? 'bg-blue-600 border-blue-600' : 'bg-white/80 border-gray-300'
                                    ]" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- BODY -->
        <section class="max-w-4xl mx-auto w-full px-4 md:px-6 py-8">
            <div v-if="isLoadingPost" class="space-y-3 animate-pulse">
                <div class="h-4 bg-gray-200 rounded"></div>
                <div class="h-4 bg-gray-200 rounded w-11/12"></div>
                <div class="h-4 bg-gray-200 rounded w-10/12"></div>
                <div class="h-4 bg-gray-200 rounded w-9/12"></div>
            </div>

            <div v-else class="prose prose-lg max-w-none mb-6 prose-a:text-blue-600 hover:prose-a:underline"
                v-html="safeHtml"></div>

            <!-- Share / actions -->
            <div class="flex flex-wrap items-center gap-2 md:gap-3">
                <button type="button" @click="sharePost" class="btn-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">
                        <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5" />
                        <path d="M12 3v12" />
                        <path d="M8.25 6.75L12 3l3.75 3.75" />
                    </svg>
                    <span>Compartir</span>
                </button>

                <button type="button" @click="copyLink" class="btn-ghost">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" class="h-5 w-5" aria-hidden="true">
                        <rect x="9" y="9" width="11" height="11" rx="2"></rect>
                        <rect x="4" y="4" width="11" height="11" rx="2"></rect>
                    </svg>
                    <span>Copiar enlace</span>
                </button>
            </div>
        </section>

        <!-- References -->
        <section v-if="normalizedRefs.length" class="max-w-4xl mx-auto w-full px-4 md:px-6 pb-10">
            <div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h2 class="text-xl font-semibold mb-2">Referencias</h2>
                <ul class="list-disc pl-6 space-y-1">
                    <li v-for="(ref, index) in normalizedRefs" :key="index">
                        <a :href="ref" target="_blank" rel="noopener" class="text-blue-600 hover:underline">{{ ref
                            }}</a>
                    </li>
                </ul>
            </div>
        </section>

        <div class="container mx-auto px-4">
            <RelatedPosts :storage="storageBase" :related="post?.related_articles || []" />

        </div>

        <FooterWidget />
    </div>
</template>

<script setup>
import FooterWidget from '@/components/landing/FooterWidget.vue'
import TopbarWidget from '@/components/landing/TopbarWidget.vue'
import RelatedPosts from './RelatedPosts.vue'

import axios from 'axios'
import { useToast } from 'primevue/usetoast'
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// ENV
const apiUrl = import.meta.env.VITE_API_ADMIN1
const storageUrl = import.meta.env.VITE_API_STORAGE

// STATE
const post = ref({})
const isLoadingPost = ref(true)

const toast = useToast()
const route = useRoute()

// URL helpers
const origin = computed(() => (apiUrl || '').replace(/\/(api|admin\/api)\/?$/, ''))
const UNSPLASH = ''
const storageBase = computed(() => `${origin.value}/s3/public/images`)

function buildCandidates(name) {
    if (!name) return [UNSPLASH]
    // If backend already sent absolute URL (e.g., /s3/images/...), use it as-is
    if (/^https?:\/\//i.test(name)) return [name]

    const clean = String(name).replace(/^\/+/, '')
    const org = origin.value
    // If key already includes "images/", keep it; else prefix it.
    const path = clean.startsWith('images/') ? clean : `images/${clean}`

    return [
        `${org}/s3/${path}`,
        UNSPLASH
    ]
}


// Slides: main first, then gallery, dedup
const slidesCandidates = computed(() => {
    const groups = []
    const seen = new Set()
    const pushFile = (val) => {
        if (!val) return
        const key = String(val)
        if (seen.has(key)) return
        seen.add(key)
        groups.push(buildCandidates(val))
    }
    if (post.value?.imagen_url) pushFile(post.value.imagen_url)
    else if (post.value?.imagen) pushFile(post.value.imagen)
    const arr = Array.isArray(post.value?.images) ? post.value.images : []
    arr.forEach(img => {
        const val = img?.url || img?.image_path || img?.path || img?.imagen
        pushFile(val)
    })
    if (!groups.length) groups.push([UNSPLASH])
    return groups
})

// Slider state & fallbacks per slide
const currentSlide = ref(0)
const heroTry = reactive({})
function heroSrc(i) {
    const list = slidesCandidates.value[i] || [UNSPLASH]
    const t = heroTry[i] || 0
    return list[Math.min(t, list.length - 1)]
}
function onHeroImgError(i, e) {
    const list = slidesCandidates.value[i] || [UNSPLASH]
    heroTry[i] = (heroTry[i] || 0) + 1
    if (heroTry[i] < list.length) e.target.src = list[heroTry[i]]
}

let touchStartX = 0
function onTouchStart(e) { touchStartX = e.changedTouches?.[0]?.clientX || 0 }
function onTouchEnd(e) {
    const dx = (e.changedTouches?.[0]?.clientX || 0) - touchStartX
    if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide() }
}
function nextSlide() {
    const n = slidesCandidates.value.length
    if (!n) return
    currentSlide.value = (currentSlide.value + 1) % n
}
function prevSlide() {
    const n = slidesCandidates.value.length
    if (!n) return
    currentSlide.value = (currentSlide.value - 1 + n) % n
}
function goTo(i) { currentSlide.value = i }
function preloadNeighbors() {
    const n = slidesCandidates.value.length
    if (!n) return
    const left = (currentSlide.value - 1 + n) % n
    const right = (currentSlide.value + 1) % n
        ;[left, right].forEach(i => {
            const src = slidesCandidates.value[i]?.[0]
            if (src) { const im = new Image(); im.src = src }
        })
}

// FETCH
async function obtenerPost(id) {
    isLoadingPost.value = true
    try {
        const res = await axios.get(`${apiUrl}/blog/showpost/${id}`)
        const data = res?.data || {}
        post.value = {
            ...data,
            enlaces: Array.isArray(data.enlaces)
                ? data.enlaces
                : (typeof data.enlaces === 'string' && data.enlaces.length
                    ? data.enlaces.split(',').map(s => s.trim()).filter(Boolean)
                    : [])
        }
        currentSlide.value = 0
        for (const k in heroTry) delete heroTry[k]
        hydrateHead()
    } catch (error) {
        console.error(error)
        mostrarError('No se pudo cargar el post')
    } finally {
        isLoadingPost.value = false
    }
}

onMounted(() => {
    obtenerPost(route.params.id)
    window.addEventListener('keydown', onKeyNav)
})
onBeforeUnmount(() => {
    window.removeEventListener('keydown', onKeyNav)
    cleanupHead()
})
function onKeyNav(e) {
    if (e.key === 'ArrowLeft') prevSlide()
    if (e.key === 'ArrowRight') nextSlide()
}

// UTILS
function formatDate(dateString) {
    if (!dateString) return ''
    const d = new Date(String(dateString).replace(' ', 'T'))
    if (isNaN(d)) return String(dateString)
    return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
}
const formattedDateUpper = computed(() =>
    formatDate(post.value?.created_at || post.value?.fecha_publicacion).toUpperCase()
)
function isoDate(dateString) {
    const d = new Date(String(dateString).replace(' ', 'T'))
    return isNaN(d) ? '' : d.toISOString()
}
function mostrarError(mensaje) {
    toast.add({ severity: 'error', summary: 'Error', detail: mensaje, life: 3000 })
}

// Category
const categoryName = computed(() =>
    (post.value?.categoria || post.value?.category || 'AVISOS').toString().toUpperCase()
)

// REFS
const normalizedRefs = computed(() => {
    return Array.isArray(post.value?.enlaces)
        ? post.value.enlaces
        : (typeof post.value?.enlaces === 'string' && post.value.enlaces.length
            ? post.value.enlaces.split(',').map(s => s.trim()).filter(Boolean)
            : [])
})

// SEO / SHARING
const safeHtml = computed(() => sanitizeHtml(post.value?.contenido || ''))
const postUrl = computed(() => {
    try {
        const loc = window.location
        return `${loc.origin}${loc.pathname}`
    } catch { return '' }
})
function stripHtml(html) {
    const tmp = document.createElement('div')
    tmp.innerHTML = html || ''
    return (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim()
}
function sanitizeHtml(html) {
    if (!html) return ''
    html = html.replace(/<\/(?:script|style|iframe)>/gi, '')
    html = html.replace(/<(script|style|iframe)[^>]*>[\s\S]*?<\/\1>/gi, '')
    html = html.replace(/ on[a-z]+\s*=\s*"[^"]*"/gi, '')
    html = html.replace(/ on[a-z]+\s*=\s*'[^']*'/gi, '')
    html = html.replace(/ on[a-z]+\s*=\s*[^\s>]+/gi, '')
    return html
}
function sharePost() {
    const data = {
        title: post.value?.titulo || 'Blog',
        text: stripHtml(post.value?.contenido || '').slice(0, 140) + '…',
        url: postUrl.value
    }
    if (navigator.share) { navigator.share(data).catch(() => copyLink()) }
    else { copyLink() }
}
async function copyLink() {
    try {
        await navigator.clipboard.writeText(postUrl.value)
        toast.add({ severity: 'success', summary: 'Enlace copiado', detail: '¡Listo para compartir!', life: 2000 })
    } catch {
        mostrarError('No se pudo copiar el enlace')
    }
}

let ldJsonEl = null
const seoPrimaryImage = computed(() => slidesCandidates.value?.[0]?.[0] || '')
function hydrateHead() {
    try {
        document.title = `${post.value?.titulo || 'Blog'} — ${post.value?.autor || ''}`.trim()
        let link = document.querySelector('link[rel="canonical"]')
        if (!link) {
            link = document.createElement('link')
            link.setAttribute('rel', 'canonical')
            document.head.appendChild(link)
        }
        link.setAttribute('href', postUrl.value)
        const json = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.value?.titulo,
            author: { '@type': 'Person', name: post.value?.autor || 'Admin' },
            datePublished: isoDate(post.value?.created_at || post.value?.fecha_publicacion),
            image: seoPrimaryImage.value || undefined,
            url: postUrl.value
        }
        ldJsonEl = document.createElement('script')
        ldJsonEl.type = 'application/ld+json'
        ldJsonEl.textContent = JSON.stringify(json)
        document.head.appendChild(ldJsonEl)
    } catch (e) { /* no-op */ }
}
function cleanupHead() {
    try { if (ldJsonEl) document.head.removeChild(ldJsonEl) } catch { }
}

watch(() => route.params.id, (id) => { obtenerPost(id) })
</script>

<style scoped>
.prose a {
    color: #2563eb;
    text-decoration: none;
}

.prose a:hover {
    text-decoration: underline;
}

button {
    transition: all 0.2s ease;
}

.btn-primary {
    @apply inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700;
}

.btn-ghost {
    @apply inline-flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50;
}

.icon-btn-dark {
    @apply p-2 rounded-full hover:bg-black/5 text-slate-700 ring-1 ring-black/0 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500;
}

.nav-btn {
    @apply absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 hover:bg-white shadow ring-1 ring-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500;
}

.nav-btn.left-2 {
    left: .5rem;
}

.nav-btn.right-2 {
    right: .5rem;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1
    }

    50% {
        opacity: .4
    }
}

.animate-pulse {
    animation: pulse 1.5s ease-in-out infinite
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
</style>
