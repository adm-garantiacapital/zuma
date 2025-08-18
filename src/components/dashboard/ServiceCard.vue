    <script setup>
    import { useRoute } from 'vue-router';

    const route = useRoute()

    function isActive(path) {
        const url = window.location.pathname;
        const segmentos = url.split('/').filter(seg => seg);
        const primerSegmento = segmentos[0];
        return primerSegmento === path
    }

    function getrute(path) {
        const url = window.location.pathname;
        const segmentos = url.split('/').filter(seg => seg);
        const primerSegmento = segmentos[0];
        return primerSegmento;
    }

    const props = defineProps({
        to: { type: String, required: true },
        image: { type: String, required: true },
        imagePosition: { type: String, default: 'left', validator: (value) => ['left', 'right'].includes(value) },
        url: { type: String, required: true },
        titleProps: {
            type: Object,
            required: true,
            validator: (value) => {
                return 'text' in value && 'background' in value // 👈 ahora pedimos también color de fondo
            }
        },
        className: { type: String, default: '' }
    });
</script>

<template>
    <a :href="props.to"
        class="flex-1 relative overflow-hidden w-full md:max-h-28 h-full group transition-all duration-300" :class="{
            'hover:grayscale-0 opacity-100 bg-[#FF4929]': !isActive(props.to.split('/').filter(seg => seg)[0]),
            'grayscale opacity-80 ': !isActive(props.to.split('/').filter(seg => seg)[0]),
            'grayscale-0 opacity-100  ': isActive(props.to.split('/').filter(seg => seg)[0]),

        }">
        <div class="relative h-full " :class="{
            'bg-[#FF4929]': isActive(props.to.split('/').filter(seg => seg)[0]),


        }" :style="{ color: isActive(props.to.split('/').filter(seg => seg)[0]) ? '#FF4929' : '#d4d4d4  ', }">
            <img :src="props.image" :alt="props.titleProps.text || 'Servicio'" :class="[
                'w-32 sm:max-h-28 md:w-48 object-cover transition-transform duration-    will-change-transform h-full',
                props.imagePosition === 'right' && 'ml-auto',
                'group-hover:scale-110'
            ]" />
            <svg width="392" height="215" viewBox="0 0 252 215" fill="none" xmlns="http://www.w3.org/2000/svg"
                class="absolute top-0 right-12 h-full w-fit z-10">
                <path
                    d="M139.641 76.4189C95.2051 106.896 99.4612 174.964 147.418 198.987L179.366 215H18C8.05888 215 0 206.941 0 197V18C0 8.05887 8.05887 1.93277e-07 18 0H251.179L139.641 76.4189Z"
                    fill="currentColor" />
            </svg>
        </div>
        <span :class="[
            'absolute text-white px-6 rounded-full bottom-3 left-4 md:bottom-8 md:left-12 font-semibold md:text-lg z-10',
            props.titleProps.className
        ]">
            {{ props.titleProps.text }}
            <div v-if="isActive(props.to.split('/').filter(seg => seg)[0])" class="w-full h-[2px] mt-1"
                :class="isActive(props.to.split('/').filter(seg => seg)[0]) ? 'bg-white' : 'bg-[#171717]'" />
        </span>
    </a>
</template>


<style scoped>
/* Add any additional styles here if needed */
</style>