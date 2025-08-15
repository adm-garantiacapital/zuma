<script setup>
import { useRoute } from 'vue-router';

const route = useRoute()

function isActive(path) {
    const url = window.location.pathname; // Obtiene la ruta después del host, ej: "/productos/123"
    const segmentos = url.split('/').filter(seg => seg); // Filtra elementos vacíos
    const primerSegmento = segmentos[0];
    return primerSegmento === path
}
</script>

<template>
    <section class="md:px-8 mt-6 flex flex-wrap gap-4">
        <!-- Factoring -->
        <a href="/factoring"
            class="flex items-center justify-between rounded-3xl overflow-hidden w-full md:w-[32%] bg-[#FF4929] h-28">
            <div class="px-6 flex-1 text-white font-semibold">
                Factoring
                <div v-if="isActive('factoring')" class="h-[2px] w-20 bg-white mt-2"></div>
            </div>
            <div class="h-full w-1/2 bg-cover bg-center" style="
          clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
          background-image: url('/imagenes/zuma/imagen-2.png');
        "></div>
        </a>

        <!-- Tasas Fijas -->
        <a href="/tasas-fijas"
            class="flex items-center justify-between rounded-3xl overflow-hidden w-full md:w-[32%] bg-[#F0F1F9] h-28">
            <div class="px-6 flex-1 text-[#171717] font-semibold">
                Tasas fijas
                <div v-if="isActive('tasas-fijas')" class="h-[2px] w-20 bg-[#171717] mt-2"></div>
            </div>
            <div class="h-full w-1/2 bg-cover bg-center" style="
          clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
          background-image: url('/imagenes/zuma/imagen-3.png');
        "></div>
        </a>

        <!-- Hipotecas -->
        <a href="/hipotecas"
            class="flex items-center justify-between rounded-3xl overflow-hidden w-full md:w-[32%] bg-[#171717] h-28">
            <div class="px-6 flex-1 text-white font-semibold">
                Hipotecas
                <div v-if="isActive('hipotecas')" class="h-[2px] w-20 bg-white mt-2"></div>
            </div>
            <div class="h-full w-1/2 bg-cover bg-center" style="
          clip-path: polygon(20% 0, 100% 0, 100% 100%, 0% 100%);
          background-image: url('/imagenes/zuma/imagen-4.png');
        "></div>
        </a>
    </section>
</template>
