<template>
    <div class="col-span-2 lg:col-span-1">
        <div class="border-general-grey rounded-3xl bg-white relative p-10">
            <h5 class="text-[#171717] m-0 font-semibold w-full">Última factura invertida</h5>

            <!-- Mostrar mensaje y SVG si no hay inversión -->
            <div v-if="!lastInvestment && !loading" class="text-center my-20">
                <p class="font-bold mt-0 mb-3 fill-[#171717]">¡Ups aún no has invertido en una factura!</p>
                <!-- SVG aquí -->
                <svg xmlns='http://www.w3.org/2000/svg' class="fill-[#171717] relative mx-auto" width='169.333'
                    height='228' version='1.0' viewBox='0 0 127 171'>
                    <path
                        d='M106.5 2.3c-3.3.5-6.1 1.1-6.3 1.2-.4.4 9.8 53.8 10.4 54.4.2.2 2.8 0 5.9-.4l5.6-.7-.6-3.1c-.7-3.9-6.5-50.2-6.5-51.6 0-1.2-.2-1.2-8.5.2zM44 16.1C25.6 18.8 10.1 31.7 4 49.4c-8.1 23.5 2.9 50.3 24.8 60.8l6.9 3.3-2.6 4.9c-2.5 4.9-2.6 5.5-2.9 27.8l-.3 22.8H51v-3c0-2.2-.5-3-1.8-3-1 0-2.8-.7-4-1.6-2.1-1.5-2.2-2.1-2.2-18.6 0-19.2.5-21 7-24.7 6.5-3.6 13.6-2.4 18.9 3.2 2 2.2 2.8 5.6 5.8 23.3 1.9 11.5 3.6 21 3.9 21.3.4.4 15.3-1.5 18.5-2.5 1.1-.3 1.4-1.3 1.1-3.4-.4-2.5-.9-3-3.1-3-5.5 0-6.2-1.5-9.1-19.1-2.7-16.3-4.3-21.2-8.4-25.8l-2.1-2.3 2.5-1.6c7.2-4.7 14.3-12.9 18.3-21.1 3.7-7.8 4.1-9.2 4.5-18.7.4-8.4.1-11.4-1.6-17.1-5.7-18.6-21.5-32.2-40.9-35.2-3.9-.6-7.5-1-8-1-.4.1-3.3.5-6.3 1zm23.2 14.1c8 3.7 15.2 10.7 19.1 18.7 2.9 6.1 3.2 7.4 3.2 16.6 0 8.8-.3 10.7-2.7 15.7C75.2 106 43.1 112 24 93 3.3 72.2 12.1 37.7 40.5 28.3c6.6-2.1 19.9-1.2 26.7 1.9z' />
                    <path
                        d='M43.7 35.6c-.3.3-.3 2-.1 3.7.5 2.9.2 3.4-3.2 5.2-5.3 2.8-7.9 6.8-7.9 11.9 0 8.9 4.3 12.3 17 13.6 9.3 1 10 1.2 11.5 4.1 1.8 3.2-2.8 6.9-8.4 6.9-3.7 0-4.8-.5-7-3.1-2.5-2.9-3-3.1-7.2-2.4-4.3.6-4.5.8-4 3.3 1 4 6.8 9 12.1 10.3 4 1 4.5 1.4 4.5 4 0 3.4.5 3.7 5.3 3.1 3.8-.4 3.9-.5 3.3-3.8-.6-3.1-.4-3.5 3.3-5.3 7.4-3.8 10.6-11.5 7.8-18.3-2.2-5.3-5.4-6.9-15.9-8-10-1-11.8-1.8-11.8-5.4 0-6.6 12.7-7.2 15.1-.7.7 1.7 9.3 0 9.7-1.8.7-3.5-8-10.9-12.6-10.9-2.1 0-3.2-1.8-3.2-5.1 0-1.5-.7-1.9-3.8-1.9-2.1 0-4.1.3-4.5.6zM115.4 63c-2.9 1.1-5.4 4.9-5.4 7.8 0 3.2 5.2 8.2 8.5 8.2 3.4 0 8.5-5 8.5-8.4 0-5.2-6.8-9.6-11.6-7.6z' />
                </svg>
                <p class="mt-3 mb-0 fill-[#171717]">¡Comienza a generar ganancias!</p>
            </div>

            <!-- Mostrar datos de la inversión si existe -->
            <div v-else-if="lastInvestment" class="mt-6">
                <p class="text-lg font-semibold text-gray-800">Monto invertido: S/. {{ lastInvestment.amount }}</p>
                <p class="text-sm text-gray-600">Estado: {{ lastInvestment.status }}</p>
                <p class="text-sm text-gray-600">Tasa: {{ lastInvestment.rate }}%</p>
                <p class="text-sm text-gray-600">Plazo: {{ lastInvestment.term_plan }}</p>
                <p class="text-sm text-gray-600">Frecuencia: {{ lastInvestment.frequency }}</p>
                <p class="text-sm text-gray-600">Fecha de creación: {{ lastInvestment.created_at }}</p>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { fixedTermInvestmentService } from '@/services/fixedTermInvestmentService'

const lastInvestment = ref(null)
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await fixedTermInvestmentService.getLast()
        lastInvestment.value = res.data.data
    } catch (e) {
        lastInvestment.value = null
    } finally {
        loading.value = false
    }
})
</script>
