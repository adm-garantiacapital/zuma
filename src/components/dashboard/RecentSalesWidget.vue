<script setup>
import { ref, watch, onMounted } from 'vue';
import { propertyService } from '@/services/propertyService.js';

// Props recibidos del componente padre
const props = defineProps({
    selectedPropertyId: {
        type: [Number, String],
        default: null
    },
    selectedAuction: {
        type: Object,
        default: null
    }
});

// Estado del componente
const investments = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const perPage = ref(15);
const total = ref(0);
const error = ref(null);

// Dialog para crear nueva inversión
const investmentDialog = ref(false);
const newInvestment = ref({
    monto_invertido: '',
    notas: ''
});
const submittingInvestment = ref(false);

// Cargar inversiones/participantes
const loadInvestments = async (page = 1) => {
    if (!props.selectedPropertyId) {
        investments.value = [];
        return;
    }

    try {
        loading.value = true;
        error.value = null;
        
        const response = await propertyService.getPropertyInvestments(props.selectedPropertyId, page);
        
        // Adaptar estructura según tu API
        if (response.data.data) {
            investments.value = response.data.data;
            currentPage.value = response.data.meta?.current_page || 1;
            totalPages.value = response.data.meta?.last_page || 1;
            perPage.value = response.data.meta?.per_page || 15;
            total.value = response.data.meta?.total || 0;
        } else {
            investments.value = response.data || [];
        }
    } catch (err) {
        console.error('Error loading investments:', err);
        error.value = 'Error al cargar los participantes';
        investments.value = [];
    } finally {
        loading.value = false;
    }
};

// Crear nueva inversión
const createNewInvestment = async () => {
    if (!newInvestment.value.monto_invertido || !props.selectedPropertyId) {
        return;
    }

    try {
        submittingInvestment.value = true;

        const investmentData = {
            property_id: props.selectedPropertyId,
            monto_invertido: parseFloat(newInvestment.value.monto_invertido),
            notas: newInvestment.value.notas || ''
        };

        await propertyService.createInvestment(props.selectedPropertyId, investmentData);
        
        // Resetear formulario y cerrar dialog
        newInvestment.value = { monto_invertido: '', notas: '' };
        investmentDialog.value = false;
        
        // Recargar inversiones
        loadInvestments(currentPage.value);
        
    } catch (err) {
        console.error('Error creating investment:', err);
        error.value = 'Error al crear la inversión';
    } finally {
        submittingInvestment.value = false;
    }
};

// Formatear moneda
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN'
    }).format(amount);
};

// Formatear fecha
const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    return new Date(dateString).toLocaleString('es-PE', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Obtener iniciales del nombre
const getInitials = (name) => {
    if (!name) return 'NN';
    return name.split(' ').map(word => word.charAt(0)).join('').substring(0, 2).toUpperCase();
};

// Calcular total de inversiones
</script>

<template>
    <DataTable
      :value="investments"
      :rows="perPage"
      :paginator="true"
      :totalRecords="totalRecords"
      lazy
      dataKey="id"
      :loading="loading"
      :first="(currentPage - 1) * perPage"
      @page="(e) => currentPage.value = e.page + 1"
      responsiveLayout="scroll"
      showGridlines
    >
      <!-- Columna: Inversor (con avatar) -->
      <Column header="Inversor" style="width: 30%">
        <template #body="{ data }">
          <div class="flex items-center gap-3">
            <Avatar :label="data.inversor.charAt(0).toUpperCase()" shape="circle" class="bg-blue-500 text-white" />
            <span class="font-medium">{{ data.inversor }}</span>
          </div>
        </template>
      </Column>

      <!-- Columna: Monto invertido -->
      <Column field="monto_invertido" header="Monto" style="width: 20%">
        <template #body="{ data }">
          <span class="text-green-600 font-semibold">S/ {{ parseFloat(data.monto_invertido).toFixed(2) }}</span>
        </template>
      </Column>

      <!-- Columna: Fecha -->
      <Column field="fecha_inversion" header="Fecha" style="width: 20%">
        <template #body="{ data }">
          <span>{{ data.fecha_inversion }}</span>
        </template>
      </Column>

      <!-- Columna: Ranking -->
      <Column field="Ranking" header="Ranking" style="width: 30%">
        <template #body="{ data }">
          <Tag value="Sigue pujando" severity="info" v-if="data.Ranking === 'Sigue pujando'" />
          <span v-else>{{ data.Ranking }}</span>
        </template>
      </Column>
    </DataTable>
</template>
