<script setup>
    import '@splidejs/splide/dist/css/splide.min.css';
    import { Splide, SplideSlide } from '@splidejs/vue-splide';

    
    const props = defineProps({
        to: { type: String, required: true },
        image: { type: String, required: true },
        url: { type: String, required: true },
        items: { type: Array, default: () => [] },
        className: { type: String, default: '' }
    });
</script>

<template>
    <div :href="props.to" style="height:100px; width:100%;" class="rounded-3xl shadow-sm flex-1 relative overflow-hidden w-full md:max-h-28 h-full group transition-all duration-300 
    opacity-100  h-full">
        <Splide
        :options="{
            type: 'loop',
            direction: 'ttb',
            perPage: 1,
            heightRatio: 0.2,  
            gap: '2px',
            autoplay: true,
            interval: 3500,
            drag: true,
            pagination: false,
            arrows: false
        }"
        style="height:100%;"        
        >
            <SplideSlide
                v-for="item in props.items"
                :key="item.name"
                style="height:100px; display:flex; align-items:center; justify-content:center; "
            >
                <span :href="item.to" class="transition-all duration-300 flex h-full w-full justify-center text-black items-center  font-bold ">
                    <svg class="me-3" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24"><path fill="currentColor" d="m22.69 18.37l1.14-1l-1-1.73l-1.45.49a3.7 3.7 0 0 0-1.08-.63L20 14h-2l-.3 1.49a3.7 3.7 0 0 0-1.08.63l-1.45-.49l-1 1.73l1.14 1a3.3 3.3 0 0 0 0 1.26l-1.14 1l1 1.73l1.45-.49a3.7 3.7 0 0 0 1.08.63L18 24h2l.3-1.49a3.7 3.7 0 0 0 1.08-.63l1.45.49l1-1.73l-1.14-1a3.4 3.4 0 0 0 0-1.27M19 21a2 2 0 1 1 2-2a2.006 2.006 0 0 1-2 2m4-10H1V1h22ZM3 9h18V3H3Zm10-4H4v2h9Zm3 0a1 1 0 1 0 1 1a1 1 0 0 0-1-1m3 0a1 1 0 1 0 1 1a1 1 0 0 0-1-1"/><path fill="currentColor" d="M12.294 21H3v-6h10.26a7 7 0 0 1 2.148-2H1v10h12.26a7 7 0 0 1-.966-2"/><path fill="currentColor" d="M4 19h8a7 7 0 0 1 .294-2H4Z"/></svg>
                    <small class="md:text-lg  ">{{ item.name }}</small> 
                </span>    
            </SplideSlide>
        </Splide>
    </div>
</template>


<style scoped>
/* Add any additional styles here if needed */
</style>