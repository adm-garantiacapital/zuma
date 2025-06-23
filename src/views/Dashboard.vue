<template>
    <Breadcrumb :home="home" :model="items" />
    <div class="card mb-6" style="background-color: #4F91FF; border-radius: 16px;">
        <h2 class="text-black">Bienvenido [Jeferson] a tu perfil del inversionista</h2>
    </div>
    <div class="grid grid-cols-12 gap-4">
        <StatsWidget />
    </div>
</template>

<script setup>
import { ref } from "vue";
import StatsWidget from '@/components/dashboard/StatsWidget.vue';

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: 'Subasta hipotecas' },
    { label: 'Mi billetera' }
]);
</script>