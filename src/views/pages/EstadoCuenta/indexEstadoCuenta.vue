<template>
    <Breadcrumb :home="home" :model="items" />
    <div class="card">
        <AddEstadoCuenta/>
        <ListEstadoCuenta/>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import AddEstadoCuenta from './Desarrollo/TypeMoneda.vue';
    import ListEstadoCuenta from './Desarrollo/ListEstadoCuenta.vue';

    const home = ref({
        icon: 'pi pi-home'
    });

    const items = ref([
        { label: 'informacion bancaria' },
        { label: 'Estad de cuenta' }
    ]);

</script>