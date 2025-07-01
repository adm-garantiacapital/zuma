<template>
    <Breadcrumb :home="home" :model="items" />
    <div class="card">
        <AddEstadoCuenta
            @currency-changed="handleCurrencyChange"
            @deposit-success="handleTransactionSuccess"
            @withdraw-success="handleTransactionSuccess"
            ref="addEstadoCuentaRef"
        />
        <ListEstadoCuenta
            :currency="selectedCurrency"
            @balance-updated="handleBalanceUpdate"
            ref="listEstadoCuentaRef"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue'
import AddEstadoCuenta from './Desarrollo/TypeMoneda.vue'
import ListEstadoCuenta from './Desarrollo/ListEstadoCuenta.vue'

// Referencias a los componentes hijos
const addEstadoCuentaRef = ref()
const listEstadoCuentaRef = ref()

// Estado de la moneda seleccionada
const selectedCurrency = ref('PEN') // Por defecto PEN

// Datos de navegación
const home = ref({
    icon: 'pi pi-home'
})

const items = ref([
    { label: 'Información bancaria' },
    { label: 'Estado de cuenta' }
])

// Manejar cambio de moneda
const handleCurrencyChange = (currency) => {
    selectedCurrency.value = currency
}

// Manejar actualización de balance
const handleBalanceUpdate = (data) => {
    // Actualizar el balance en el componente de resumen
    if (addEstadoCuentaRef.value) {
        addEstadoCuentaRef.value.updateBalance(data.currency, data.balance)
    }
}

// Manejar éxito en transacciones
const handleTransactionSuccess = () => {
    // Recargar la lista de movimientos después de una transacción exitosa
    if (listEstadoCuentaRef.value) {
        listEstadoCuentaRef.value.refresh()
    }
}
</script>