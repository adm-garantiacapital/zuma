<script setup>
import ServiceCard from './ServiceCard.vue';

import SlideCard from './SlideCard.vue';

const items = [
  { name: 'Invierte con garantia hipotecaria', to: 'Hipotecas', image:'icons/icono.svg' },
  { name: 'Tu capital siempre protegido', to: 'Hipotecas', image:'icons/time-is-money.svg' }

]
</script>

<template>
    <section class="container mx-auto px-4 md:px-8 mt-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2    ">
            <!-- Factoring -->
            <ServiceCard to="/factoring" image="/imagenes/zuma/imagen-2.png" image-position="right" :title-props="{
                text: 'Factoring',
                className: 'text-black hover:text-white font-bold',
                background: '#d4d4d4'
            }" class="rounded-3xl bg-neutral-300 h-full" />


            <!-- Tasas Fijas 
            <ServiceCard to="/tasas-fijas" image="/imagenes/zuma/imagen-3.png" image-position="right" :title-props="{
                text: 'Tasas fijas',
                className: 'text-black hover:text-white font-bold',
                background: '#d4d4d4'
            }" class="rounded-3xl bg-neutral-300 h-full " />
            -->            

            <SlideCard :items="items"/>
            
            <!-- Hipotecas -->
            <ServiceCard to="/hipotecas" image="/imagenes/zuma/imagen-4.png" image-position="right" :title-props="{
                text: 'Hipotecas',
                className: 'text-black hover:text-white font-bold',
                background: '#d4d4d4'
            }" class="rounded-3xl bg-neutral-300  h-full " />
        </div>
    </section>
</template>