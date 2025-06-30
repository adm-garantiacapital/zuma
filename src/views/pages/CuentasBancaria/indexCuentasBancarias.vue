<template>
    <div>
        <Breadcrumb :home="home" :model="items" />
        <div class="card">
            <p class="text-2xl font-bold">Mis cuentas bancarias</p>
            <AddCuentaBancaria @account-created="handleAccountCreated" />
            <ListCuentaBancaria ref="listCuentaBancariaRef" />
            <h2 class="text-4xl font-bold text-gray-800 mb-2">Nuestras Hipotecas</h2>
            <p class="text-gray-600 text-lg">Encuentra la opción perfecta para tu hogar</p>
            <ListHipotecasCB />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';
import ListCuentaBancaria from './Desarrollo/ListCuentaBancaria.vue';
import AddCuentaBancaria from './Desarrollo/AddCuentaBancaria.vue';
import ListHipotecasCB from './Desarrollo/ListHipotecasCB.vue'
const home = ref({
    icon: 'pi pi-home'
});

const items = ref([
    { label: 'informacion bancaria' },
    { label: 'Cuentas' }
]);

// Referencia al componente de lista
const listCuentaBancariaRef = ref();

// Manejador de evento
const handleAccountCreated = () => {
    // Recargar la lista cuando se crea una nueva cuenta
    if (listCuentaBancariaRef.value) {
        listCuentaBancariaRef.value.refreshList();
    }
};
</script>