<script setup>
import ServiceCard from './ServiceCard.vue';
</script>

<template>
    <section class="container mx-auto px-4 md:px-8 mt-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2    ">
            <!-- Factoring -->
            <ServiceCard to="/factoring" image="/imagenes/zuma/imagen-2.png" image-position="right" :title-props="{
                text: 'Factoring',
                className: 'text-black hover:text-white',
                background: '#d4d4d4'
            }" class="rounded-3xl bg-neutral-300  h-full hover:bg-black " />

            <!-- Tasas Fijas -->
            <ServiceCard to="/tasas-fijas" image="/imagenes/zuma/imagen-3.png" image-position="right" :title-props="{
                text: 'Tasas fijas',
                className: 'text-black hover:text-white',
                background: '#d4d4d4'
            }" class="rounded-3xl bg-neutral-300 h-full hover:bg-black " />

            <!-- Hipotecas -->
            <ServiceCard to="/hipotecas" image="/imagenes/zuma/imagen-4.png" image-position="right" :title-props="{
                text: 'Hipotecas',
                className: 'text-black hover:text-white',
                background: '#d4d4d4'
            }" class="rounded-3xl bg-neutral-300 hover:bg-black h-full " />
        </div>
    </section>
</template>