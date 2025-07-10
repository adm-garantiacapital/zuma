<template>
    <div>
        <br>
        <Breadcrumb :home="home" :model="items" />
        <div class="card">
            <AddCuentaBancaria @account-created="handleAccountCreated" />
            <ListCuentaBancaria ref="listCuentaBancariaRef" />
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import Breadcrumb from 'primevue/breadcrumb';
import ListCuentaBancaria from './Desarrollo/ListCuentaBancaria.vue';
import AddCuentaBancaria from './Desarrollo/AddCuentaBancaria.vue';
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