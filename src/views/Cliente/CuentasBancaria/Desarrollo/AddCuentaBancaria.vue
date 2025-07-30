<template>
    <div>
        <br>
        <div class="flex items-center gap-3">
            <Button label="Nueva Cuenta" severity="contrast" rounded @click="openNew" />

            <span class="text-[#171717] font-semibold">
                Ir a
                <RouterLink to="/cliente/Cuenta-Bancaria"
                    class="text-[#FF4929] underline cursor-pointer font-semibold">
                    estados de cuentas
                </RouterLink>
                para depositar o retirar
            </span>
        </div>
        <Dialog :visible="visible" @update:visible="updateVisible" modal :style="{ width: '450px' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <!-- Título centrado con color personalizado -->
            <template #header>
                <div class="w-full text-center text-xl font-bold" style="color: #FF4929;">
                    Detalle de cuenta bancaria
                </div>
            </template>

            <div class="flex flex-col gap-6">
                <!-- Subtítulo -->
                <!-- Formulario -->
                <div>
                    <label class="block font-bold mb-1">Banco <span class="text-red-500">*</span></label>
                    <Select id="banco" v-model="form.banco" :options="bancos" optionLabel="name"
                        placeholder="Selecciona un banco" fluid :class="{ 'p-invalid': errors.banco }" />
                    <small v-if="errors.banco" class="p-error text-red-500">{{ errors.banco }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">Tipo de Cuenta <span class="text-red-500">*</span></label>
                    <Select id="tipoCuenta" v-model="form.tipoCuenta" :options="tiposCuenta" optionLabel="name"
                        placeholder="Selecciona tipo de cuenta" class="w-full"
                        :class="{ 'p-invalid': errors.tipoCuenta }" />
                    <small v-if="errors.tipoCuenta" class="p-error">{{ errors.tipoCuenta }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">Moneda <span class="text-red-500">*</span></label>
                    <Select id="moneda" v-model="form.moneda" :options="monedas" optionLabel="name"
                        placeholder="Selecciona una moneda" class="w-full" :class="{ 'p-invalid': errors.moneda }" />
                    <small v-if="errors.moneda" class="p-error text-red-500">{{ errors.moneda }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">CC <span class="text-red-500">*</span></label>
                    <InputText id="cc" v-model="form.cc" placeholder="Número de cuenta (10 dígitos)" class="w-full"
                        maxlength="10" @input="onCCInput" :class="{ 'p-invalid': errors.cc }" />
                    <small v-if="errors.cc" class="p-error text-red-500">{{ errors.cc }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">CCI <span class="text-red-500">*</span></label>
                    <InputText id="cci" v-model="form.cci" placeholder="Código interbancario (20 dígitos)"
                        class="w-full" maxlength="20" @input="onCCIInput" :class="{ 'p-invalid': errors.cci }" />
                    <small v-if="errors.cci" class="p-error text-red-500">{{ errors.cci }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">Alias <span class="text-red-500">*</span></label>
                    <InputText id="alias" v-model="form.alias" placeholder="Nombre o alias de la cuenta" class="w-full"
                        :class="{ 'p-invalid': errors.alias }" />
                    <small v-if="errors.alias" class="p-error text-red-500">{{ errors.alias }}</small>
                </div>
            </div>

            <!-- Footer -->
            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancelar" icon="pi pi-times" @click="closeDialog" text severity="secondary"
                        rounded />
                    <Button label="Enviar" icon="pi pi-check" @click="enviarNotificacion" :loading="loading"
                        severity="contrast" rounded />
                </div>
            </template>
        </Dialog>

        <!-- Dialog de confirmación -->
        <Dialog :visible="showConfirmDialog" @update:visible="updateConfirmDialog" modal :style="{ width: '500px' }"
            :closable="false" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="w-full text-center">
                    <i class="pi pi-check-circle text-4xl text-green-500 mb-3"></i>
                    <div class="text-xl font-bold text-green-600">
                        Notificación enviada exitosamente
                    </div>
                </div>
            </template>

            <div class="text-center py-4">
                <p class="text-gray-700 leading-relaxed">
                    Tu notificación se ha enviado correctamente. El proceso puede tomar un
                    <strong>máximo de 48 horas</strong>, terminado el cual recibirás un
                    <strong>correo de confirmación</strong>.
                </p>
            </div>

            <template #footer>
                <div class="flex justify-center">
                    <Button label="Aceptar" icon="pi pi-check" @click="closeConfirmDialog" class="px-6 py-2"
                        severity="success" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { bankAccountService } from '@/services/bankAccountService.js';
import { bankService } from '@/services/bankService.js';

const toast = useToast();

const visible = ref(false);
const loading = ref(false);
const showConfirmDialog = ref(false);

const emit = defineEmits(['account-created']);

const errors = reactive({
    banco: '',
    tipoCuenta: '',
    moneda: '',
    cc: '',
    cci: '',
    alias: ''
});

const form = reactive({
    banco: null,
    tipoCuenta: null,
    moneda: null,
    cc: '',
    cci: '',
    alias: ''
});

// Opciones dinámicas
const bancos = ref([]);
const tiposCuenta = ref([
    { name: 'Cuenta de Ahorros', code: 'AHORRO' },
    { name: 'Cuenta Corriente', code: 'CORRIENTE' },
]);
const monedas = ref([
    { name: 'Soles (PEN)', code: 'PEN' },
    { name: 'Dólares (USD)', code: 'USD' }
]);

// Cargar bancos desde la API
onMounted(async () => {
    try {
        const response = await bankService.getBanks();
        bancos.value = response.data.data.map(bank => ({
            name: bank.name,
            code: bank.id // el ID real del banco
        }));
    } catch (error) {
        console.error('Error al cargar bancos:', error);
    }
});

const onCCInput = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    form.cc = numericValue;
    if (errors.cc) errors.cc = '';
};

const onCCIInput = (event) => {
    const numericValue = event.target.value.replace(/[^0-9]/g, '');
    form.cci = numericValue;
    if (errors.cci) errors.cci = '';
};

const openNew = () => {
    resetForm();
    clearErrors();
    visible.value = true;
};

const updateVisible = (value) => {
    visible.value = value;
};

const updateConfirmDialog = (value) => {
    showConfirmDialog.value = value;
};

const closeDialog = () => {
    resetForm();
    clearErrors();
    visible.value = false;
};

const closeConfirmDialog = () => {
    showConfirmDialog.value = false;
    closeDialog();
    emit('account-created');
};

const resetForm = () => {
    form.banco = null;
    form.tipoCuenta = null;
    form.moneda = null;
    form.cc = '';
    form.cci = '';
    form.alias = '';
};

const clearErrors = () => {
    Object.keys(errors).forEach(key => errors[key] = '');
};

const isAlpha = (val) => /^[A-Za-z\s]+$/.test(val);

const handleBackendErrors = (error) => {
    clearErrors();

    if (error.response?.data) {
        const backendErrors = error.response.data;

        if (backendErrors.errors) {
            const fieldMapping = {
                bank: 'banco',
                type: 'tipoCuenta',
                currency: 'moneda',
                cc: 'cc',
                cci: 'cci',
                alias: 'alias'
            };

            Object.entries(backendErrors.errors).forEach(([field, messages]) => {
                const localField = fieldMapping[field] || field;
                if (errors.hasOwnProperty(localField)) {
                    errors[localField] = Array.isArray(messages) ? messages[0] : messages;
                }
            });
        } else if (backendErrors.message) {
            errors.alias = backendErrors.message;
        } else if (typeof backendErrors === 'string') {
            errors.alias = backendErrors;
        }
    } else {
        errors.alias = 'Error de conexión. Verifica tu conexión a internet.';
    }
};

const enviarNotificacion = async () => {
    loading.value = true;
    clearErrors();

    let hasErrors = false;

    if (!form.banco) {
        errors.banco = 'Selecciona un banco';
        hasErrors = true;
    }

    if (!form.tipoCuenta) {
        errors.tipoCuenta = 'Selecciona el tipo de cuenta';
        hasErrors = true;
    }

    if (!form.moneda) {
        errors.moneda = 'Selecciona una moneda';
        hasErrors = true;
    }

    if (!form.cc) {
        errors.cc = 'Ingresa el número de cuenta';
        hasErrors = true;
    } else if (form.cc.length !== 10) {
        errors.cc = 'El número de cuenta debe tener exactamente 10 dígitos';
        hasErrors = true;
    }

    if (!form.cci) {
        errors.cci = 'Ingresa el código CCI';
        hasErrors = true;
    } else if (form.cci.length !== 20) {
        errors.cci = 'El CCI debe tener exactamente 20 dígitos';
        hasErrors = true;
    }

    if (!form.alias) {
        errors.alias = 'Ingresa un alias';
        hasErrors = true;
    } else if (!isAlpha(form.alias)) {
        errors.alias = 'El alias debe contener solo letras y espacios';
        hasErrors = true;
    }

    if (hasErrors) return;

    try {
        const payload = {
            bank: form.banco?.code,
            type: form.tipoCuenta?.code.toLowerCase(),
            currency: form.moneda?.code,
            cc: form.cc,
            cci: form.cci,
            alias: form.alias
        };

        const response = await bankAccountService.createBankAccount(payload);
        console.log('Respuesta exitosa:', response.data);
        showConfirmDialog.value = true;
    } catch (error) {
        console.error('Error al enviar notificación:', error);
        handleBackendErrors(error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al procesar la solicitud.',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};
</script>
