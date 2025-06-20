
<template>
    <Breadcrumb :home="home" :model="items" />
</template>

<script setup>
import { ref } from "vue";

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: 'Subasta hipotecas' },
    { label: 'Mi billetera' }
]);
</script>
