<template>
    <div>
        <Button label="Nueva Cuenta" severity="contrast" rounded @click="openNew"/>
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
                <div class="text-center text-sm mb-1">
                    Titular de la cuenta
                </div>
                <div class="text-center text-base -mt-4">
                    JEFERSON GRABIEL COVEÑAS ROMAN
                </div>

                <!-- Formulario -->
                <div>
                    <label class="block font-bold mb-1">Banco <span class="text-red-500">*</span></label>
                    <Select id="banco" v-model="form.banco" :options="bancos" optionLabel="name"
                        placeholder="Selecciona un banco" fluid :class="{ 'p-invalid': errors.banco }" />
                    <small v-if="errors.banco" class="p-error">{{ errors.banco }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">Tipo de Cuenta <span class="text-red-500">*</span></label>
                    <Select id="tipoCuenta" v-model="form.tipoCuenta" :options="tiposCuenta" optionLabel="name"
                        placeholder="Selecciona tipo de cuenta" class="w-full" :class="{ 'p-invalid': errors.tipoCuenta }" />
                    <small v-if="errors.tipoCuenta" class="p-error">{{ errors.tipoCuenta }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">Moneda <span class="text-red-500">*</span></label>
                    <Select id="moneda" v-model="form.moneda" :options="monedas" optionLabel="name"
                        placeholder="Selecciona una moneda" class="w-full" :class="{ 'p-invalid': errors.moneda }" />
                    <small v-if="errors.moneda" class="p-error">{{ errors.moneda }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">CC <span class="text-red-500">*</span></label>
                    <InputNumber id="cc" v-model="form.cc" placeholder="Número de cuenta (CC)" class="w-full"
                        :useGrouping="false" :minFractionDigits="0" :class="{ 'p-invalid': errors.cc }" />
                    <small v-if="errors.cc" class="p-error">{{ errors.cc }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">CCI <span class="text-red-500">*</span></label>
                    <InputNumber id="cci" v-model="form.cci" placeholder="Código interbancario (CCI)" class="w-full"
                        :useGrouping="false" :minFractionDigits="0" :class="{ 'p-invalid': errors.cci }" />
                    <small v-if="errors.cci" class="p-error">{{ errors.cci }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">Alias <span class="text-red-500">*</span></label>
                    <InputText id="alias" v-model="form.alias" placeholder="Nombre o alias de la cuenta" class="w-full" 
                        :class="{ 'p-invalid': errors.alias }" />
                    <small v-if="errors.alias" class="p-error">{{ errors.alias }}</small>
                </div>
            </div>

            <!-- Footer -->
            <template #footer>
                <div class="flex justify-end gap-3">
                    <Button label="Cancelar" icon="pi pi-times" @click="closeDialog" text severity="secondary" rounded/>
                    <Button label="Enviar Notificación" icon="pi pi-check" @click="enviarNotificacion" :loading="loading" severity="contrast" rounded/>
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
                    <Button label="Aceptar" icon="pi pi-check" @click="closeConfirmDialog" 
                        class="px-6 py-2" severity="success" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import { bankAccountService } from '@/services/bankAccountService.js';

// Toast service
const toast = useToast();

// Estados del componente
const visible = ref(false);
const loading = ref(false);
const showConfirmDialog = ref(false);

// Emits para comunicar con el componente padre - CORREGIDO
const emit = defineEmits(['account-created']);

// Errores para validación
const errors = reactive({
    banco: '',
    tipoCuenta: '',
    moneda: '',
    cc: '',
    cci: '',
    alias: ''
});

// Formulario
const form = reactive({
    banco: null,
    tipoCuenta: null,
    moneda: null,
    cc: null,
    cci: null,
    alias: ''
});

// Opciones para selects
const bancos = ref([
    { name: 'Banco de la Nación', code: 'BN' },
    { name: 'Banco de Crédito del Perú', code: 'BCP' },
    { name: 'BBVA', code: 'BBVA' },
    { name: 'Scotiabank', code: 'SCOTIA' },
    { name: 'Interbank', code: 'INTERBANK' },
    { name: 'Banco Falabella', code: 'FALABELLA' },
    { name: 'Banco Ripley', code: 'RIPLEY' },
    { name: 'Otro', code: 'OTRO' }
]);

const tiposCuenta = ref([
    { name: 'Cuenta de Ahorros', code: 'AHORRO' },
    { name: 'Cuenta Corriente', code: 'CORRIENTE' },
]);

const monedas = ref([
    { name: 'Soles (PEN)', code: 'PEN' },
    { name: 'Dólares (USD)', code: 'USD' }
]);

// Métodos
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
    // Emitir evento para actualizar la lista - CORREGIDO
    emit('account-created');
};

const resetForm = () => {
    form.banco = null;
    form.tipoCuenta = null;
    form.moneda = null;
    form.cc = null;
    form.cci = null;
    form.alias = '';
};

const clearErrors = () => {
    errors.banco = '';
    errors.tipoCuenta = '';
    errors.moneda = '';
    errors.cc = '';
    errors.cci = '';
    errors.alias = '';
};

// Validaciones
const isAlpha = (val) => /^[A-Za-z\s]+$/.test(val);

const enviarNotificacion = async () => {
    loading.value = true;
    clearErrors();

    try {
        // Validaciones con errores en campos
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
        } else if (String(form.cc).length < 10) {
            errors.cc = 'El número de cuenta debe tener al menos 10 dígitos';
            hasErrors = true;
        }

        if (!form.cci) {
            errors.cci = 'Ingresa el código CCI';
            hasErrors = true;
        } else if (String(form.cci).length < 14) {
            errors.cci = 'El CCI debe tener al menos 14 dígitos';
            hasErrors = true;
        }

        if (!form.alias) {
            errors.alias = 'Ingresa un alias para la cuenta';
            hasErrors = true;
        } else if (!isAlpha(form.alias)) {
            errors.alias = 'El alias debe contener solo letras y espacios';
            hasErrors = true;
        }

        if (hasErrors) {
            return;
        }

        // Preparar datos para envío
        const payload = {
            bank: form.banco?.code || form.banco,
            type: form.tipoCuenta?.code?.toLowerCase() || form.tipoCuenta,
            currency: form.moneda?.code || form.moneda,
            cc: String(form.cc),
            cci: String(form.cci),
            alias: form.alias
        };

        // Enviar solicitud a la API usando el mismo servicio
        const response = await bankAccountService.createBankAccount(payload);
        console.log('Respuesta:', response.data);
        
        // Mostrar dialog de confirmación
        showConfirmDialog.value = true;

    } catch (e) {
        console.error('Error al enviar notificación', e);
        // Mostrar error general si es necesario
        errors.alias = 'Error al procesar la notificación. Intenta de nuevo.';
    } finally {
        loading.value = false;
    }
};
</script>