<template>
    <Dialog :visible="visible" @update:visible="emit('update:visible', $event)" modal header="Procesar Pago"
        :style="{ width: '500px' }" class="payment-dialog">

        <div v-if="payment" class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-lg">
                <div class="grid grid-cols-2 gap-4 text-sm">
                    <div><span class="text-gray-600">Cuota N°:</span><span class="font-semibold ml-2">{{ payment.cuota
                            }}</span></div>
                    <div><span class="text-gray-600">Vencimiento:</span><span class="font-semibold ml-2">{{
                        formatDate(payment.vencimiento) }}</span></div>
                    <div><span class="text-gray-600">Capital:</span><span class="font-semibold ml-2">{{
                            formatCurrency(payment.capital) }}</span></div>
                    <div><span class="text-gray-600">Intereses:</span><span class="font-semibold ml-2">{{
                            formatCurrency(payment.intereses) }}</span></div>
                    <div><span class="text-gray-600">IGV:</span><span class="font-semibold ml-2">{{
                            formatCurrency(payment.igv) }}</span></div>
                    <div class="col-span-2 pt-2 border-t">
                        <span class="text-gray-600">Total:</span>
                        <span class="font-bold text-lg text-green-600 ml-2">{{ formatCurrency(payment.total_cuota)
                            }}</span>
                    </div>
                </div>
            </div>
            <Dropdown v-model="paymentMethod" :options="paymentMethods" optionLabel="label" optionValue="value"
                placeholder="Método de Pago" class="w-full" />
            <div v-if="paymentMethod === 'transferencia'" class="space-y-4">
                <InputText v-model="operationNumber" placeholder="Número de operación" class="w-full" />
            </div>
            <Textarea v-model="paymentObservations" rows="3" placeholder="Observaciones" class="w-full" />
        </div>
        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" severity="secondary"
                    @click="emit('update:visible', false)" />
                <Button label="Procesar Pago" icon="pi pi-check" @click="submitPayment" severity="contrast"
                    :loading="loading" />
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'

const props = defineProps({ visible: Boolean, payment: Object })
const emit = defineEmits(['update:visible', 'payment-success'])

const toast = useToast()
const paymentMethod = ref('')
const operationNumber = ref('')
const operationDate = ref(null)
const paymentObservations = ref('')
const loading = ref(false)

const paymentMethods = [
    { label: 'Transferencia Bancaria', value: 'transferencia' },
    { label: 'zuma', value: 'zuma' },
]

const submitPayment = async () => {
    if (!paymentMethod.value) {
        return toast.add({ severity: 'warn', summary: 'Falta Método', detail: 'Seleccione un método de pago', life: 3000 })
    }

    if (paymentMethod.value === 'transferencia' && !operationNumber.value) {
        return toast.add({ severity: 'warn', summary: 'Falta Número', detail: 'Ingrese número de operación', life: 3000 })
    }

    loading.value = true
    try {
        // Aquí iría el llamado real a tu API
        toast.add({ severity: 'success', summary: 'Pago Realizado', detail: 'El pago fue exitoso', life: 5000 })
        emit('payment-success', props.payment.id)
        emit('update:visible', false)
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Error al procesar el pago', life: 5000 })
    } finally {
        loading.value = false
    }
}

const formatDate = (date) => new Date(date).toLocaleDateString('es-PE')
const formatCurrency = (amount) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount)
</script>
