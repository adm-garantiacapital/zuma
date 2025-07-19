<template>
    <div>
        <Dialog :visible="visible" @update:visible="updateVisible" modal :style="{ width: '450px' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <!-- Título centrado con color personalizado -->
            <template #header>
                <div class="w-full text-center text-xl font-bold" style="color: #FF4929;">
                    Detalle de cuenta bancaria
                </div>
            </template>

            <div class="flex flex-col gap-6">
                <!-- Formulario -->
                <div>
                    <label class="block font-bold mb-1">Banco <span class="text-red-500">*</span></label>
                    <Select id="banco" v-model="form.banco" :options="bancos" optionLabel="name"
                        placeholder="Selecciona un banco" fluid :class="{ 'p-invalid': errors.banco }" />
                    <small v-if="errors.banco" class="p-error">{{ errors.banco }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">Tipo de Cuenta <span class="text-red-500">*</span></label>
                    <Select id="tipoCuenta" v-model="form.tipoCuenta" :options="tiposCuenta" optionLabel="name" :disabled="true"
                        placeholder="Selecciona tipo de cuenta" class="w-full" :class="{ 'p-invalid': errors.tipoCuenta }" />
                    <small v-if="errors.tipoCuenta" class="p-error">{{ errors.tipoCuenta }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">Moneda <span class="text-red-500">*</span></label>
                    <Select id="moneda" v-model="form.moneda" :options="monedas" optionLabel="name" :disabled="true"
                        placeholder="Selecciona una moneda" class="w-full" :class="{ 'p-invalid': errors.moneda }" />
                    <small v-if="errors.moneda" class="p-error">{{ errors.moneda }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">CC <span class="text-red-500">*</span></label>
                    <InputNumber id="cc" v-model="form.cc" placeholder="Número de cuenta (CC)" class="w-full" :disabled="true"
                        :useGrouping="false" :minFractionDigits="0" :class="{ 'p-invalid': errors.cc }" />
                    <small v-if="errors.cc" class="p-error">{{ errors.cc }}</small>
                </div>

                <div>
                    <label class="block font-bold mb-1">CCI <span class="text-red-500">*</span></label>
                    <InputNumber id="cci" v-model="form.cci" placeholder="Código interbancario (CCI)" class="w-full" :disabled="true"
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
                        <Button label="Cancelar" icon="pi pi-times" @click="closeDialog" 
                            text severity="secondary" rounded />
                    <Button label="Eliminar" icon="pi pi-trash" @click="showDeleteConfirm" 
                        severity="danger" outlined rounded />
                        <Button label="Actualizar" icon="pi pi-check" @click="actualizarCuenta" 
                            :loading="loading" severity="contrast" rounded />
            </template>
        </Dialog>

        <!-- Dialog de confirmación de actualización -->
        <Dialog :visible="showUpdateConfirmDialog" @update:visible="updateUpdateConfirmDialog" modal :style="{ width: '500px' }" 
            :closable="false" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="w-full text-center">
                    <i class="pi pi-check-circle text-4xl text-green-500 mb-3"></i>
                    <div class="text-xl font-bold text-green-600">
                        Cuenta actualizada exitosamente
                    </div>
                </div>
            </template>

            <div class="text-center py-4">
                <p class="text-gray-700 leading-relaxed">
                    Los datos de tu cuenta bancaria se han actualizado correctamente.
                </p>
            </div>

            <template #footer>
                <div class="flex justify-center">
                    <Button label="Aceptar" icon="pi pi-check" @click="closeUpdateConfirmDialog" 
                        class="px-6 py-2" severity="success" />
                </div>
            </template>
        </Dialog>

        <!-- Dialog de confirmación de eliminación -->
        <Dialog :visible="showDeleteConfirmDialog" @update:visible="updateDeleteConfirmDialog" modal :style="{ width: '500px' }" 
            :closable="false" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="w-full text-center">
                    <i class="pi pi-exclamation-triangle text-4xl text-red-500 mb-3"></i>
                    <div class="text-xl font-bold text-red-600">
                        Confirmar eliminación
                    </div>
                </div>
            </template>

            <div class="text-center py-4">
                <p class="text-gray-700 leading-relaxed">
                    ¿Estás seguro de que deseas eliminar esta cuenta bancaria? 
                    <strong>Esta acción no se puede deshacer.</strong>
                </p>
            </div>

            <template #footer>
                <div class="flex justify-center gap-3">
                    <Button label="Cancelar" icon="pi pi-times" @click="closeDeleteConfirmDialog" 
                        text severity="secondary" />
                    <Button label="Eliminar" icon="pi pi-trash" @click="eliminarCuenta" 
                        :loading="deleteLoading" severity="danger" />
                </div>
            </template>
        </Dialog>

        <!-- Dialog de confirmación de eliminación exitosa -->
        <Dialog :visible="showDeleteSuccessDialog" @update:visible="updateDeleteSuccessDialog" modal :style="{ width: '500px' }" 
            :closable="false" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
            <template #header>
                <div class="w-full text-center">
                    <i class="pi pi-check-circle text-4xl text-green-500 mb-3"></i>
                    <div class="text-xl font-bold text-green-600">
                        Cuenta eliminada exitosamente
                    </div>
                </div>
            </template>

            <div class="text-center py-4">
                <p class="text-gray-700 leading-relaxed">
                    La cuenta bancaria ha sido eliminada correctamente.
                </p>
            </div>

            <template #footer>
                <div class="flex justify-center">
                    <Button label="Aceptar" icon="pi pi-check" @click="closeDeleteSuccessDialog" 
                        class="px-6 py-2" severity="success" />
                </div>
            </template>
        </Dialog>
    </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { useToast } from 'primevue/usetoast';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Select from 'primevue/select';
import Tag from 'primevue/tag';
import { bankAccountService } from '@/services/bankAccountService.js';

// Toast service
const toast = useToast();

// Props
const props = defineProps({
    visible: {
        type: Boolean,
        default: false
    },
    accountData: {
        type: Object,
        default: null
    }
});

// Emits
const emit = defineEmits(['update:visible', 'account-updated', 'account-deleted']);

// Estados del componente
const loading = ref(false);
const deleteLoading = ref(false);
const showUpdateConfirmDialog = ref(false);
const showDeleteConfirmDialog = ref(false);
const showDeleteSuccessDialog = ref(false);

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
    { name: 'Cuenta de Ahorros', code: 'AHORROS' },
    { name: 'Cuenta Corriente', code: 'CORRIENTE' },
    { name: 'Cuenta CTS', code: 'CTS' }
]);

const monedas = ref([
    { name: 'Soles (PEN)', code: 'PEN' },
    { name: 'Dólares (USD)', code: 'USD' }
]);

// Watchers
watch(() => props.accountData, (newData) => {
    if (newData) {
        loadAccountData(newData);
    }
}, { immediate: true });

// Métodos
const updateVisible = (value) => {
    emit('update:visible', value);
};

const updateUpdateConfirmDialog = (value) => {
    showUpdateConfirmDialog.value = value;
};

const updateDeleteConfirmDialog = (value) => {
    showDeleteConfirmDialog.value = value;
};

const updateDeleteSuccessDialog = (value) => {
    showDeleteSuccessDialog.value = value;
};

const closeDialog = () => {
    resetForm();
    clearErrors();
    updateVisible(false);
};

const closeUpdateConfirmDialog = () => {
    showUpdateConfirmDialog.value = false;
    closeDialog();
    emit('account-updated');
};

const closeDeleteConfirmDialog = () => {
    showDeleteConfirmDialog.value = false;
};

const closeDeleteSuccessDialog = () => {
    showDeleteSuccessDialog.value = false;
    closeDialog();
    emit('account-deleted');
};

const showDeleteConfirm = () => {
    showDeleteConfirmDialog.value = true;
};

const loadAccountData = (accountData) => {
    if (!accountData) return;

    // Buscar el banco correspondiente
    const banco = bancos.value.find(b => b.code === accountData.bank) || 
                  bancos.value.find(b => b.name.toLowerCase().includes(accountData.bank.toLowerCase()));
    
    // Buscar el tipo de cuenta correspondiente
    const tipoCuenta = tiposCuenta.value.find(t => t.code.toLowerCase() === accountData.type.toLowerCase()) ||
                       tiposCuenta.value.find(t => t.name.toLowerCase().includes(accountData.type.toLowerCase()));
    
    // Buscar la moneda correspondiente
    const moneda = monedas.value.find(m => m.code === accountData.currency);

    form.banco = banco || null;
    form.tipoCuenta = tipoCuenta || null;
    form.moneda = moneda || null;
    form.cc = parseInt(accountData.cc);
    form.cci = parseInt(accountData.cci);
    form.alias = accountData.alias;
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

const actualizarCuenta = async () => {
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

        // Enviar solicitud de actualización a la API
        const response = await bankAccountService.updateBankAccount(props.accountData.id, payload);
        console.log('Respuesta actualización:', response.data);
        
        // Mostrar dialog de confirmación
        showUpdateConfirmDialog.value = true;

    } catch (e) {
        console.error('Error al actualizar cuenta', e);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al actualizar la cuenta. Intenta de nuevo.',
            life: 3000
        });
    } finally {
        loading.value = false;
    }
};

const eliminarCuenta = async () => {
    deleteLoading.value = true;

    try {
        // Enviar solicitud de eliminación a la API
        const response = await bankAccountService.deleteBankAccount(props.accountData.id);
        console.log('Respuesta eliminación:', response.data);
        
        // Cerrar dialog de confirmación y mostrar success
        showDeleteConfirmDialog.value = false;
        showDeleteSuccessDialog.value = true;

    } catch (e) {
        console.error('Error al eliminar cuenta', e);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al eliminar la cuenta. Intenta de nuevo.',
            life: 3000
        });
    } finally {
        deleteLoading.value = false;
    }
};
</script>