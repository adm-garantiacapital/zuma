<template>
    <div>
        <br>
        <Breadcrumb :home="home" :model="items" />
        <div class="border rounded-3xl py-6">
            <div class="p-10">
            <h4 class="text-[#171717]">Mis cuentas bancaria</h4>
            <AddCuentaBancaria @account-created="handleAccountCreated" />
            <ListCuentaBancaria ref="listCuentaBancariaRef" />
            </div>
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