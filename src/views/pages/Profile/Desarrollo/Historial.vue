<template>
    <div>
        <div v-if="inversiones.length === 0" class="text-center text-gray-500 mt-10">
            <i class="pi pi-info-circle text-3xl mb-2"></i>
            <p class="text-lg">No hay inversiones registradas.</p>
        </div>

        <Timeline
            v-else
            :value="inversiones"
            align="alternate"
            class="customized-timeline"
        >
            <template #marker="slotProps">
                <span
                    class="flex w-8 h-8 items-center justify-center text-white rounded-full z-10 shadow-sm"
                    :style="{
                        backgroundColor: slotProps.item.resultado === 'Ganó' ? '#4CAF50' : '#F44336'
                    }"
                >
                    <i
                        :class="slotProps.item.resultado === 'Ganó'
                            ? 'pi pi-thumbs-up'
                            : 'pi pi-thumbs-down'"
                    ></i>
                </span>
            </template>

            <template #content="slotProps">
                <Card class="mt-4">
                    <template #title>
                        Inversión #{{ slotProps.index + 1 }}
                    </template>
                    <template #subtitle>
                        {{ slotProps.item.fecha }} - Resultado:
                        <span
                            :class="slotProps.item.resultado === 'Ganó'
                                ? 'text-green-600'
                                : 'text-red-600'"
                        >
                            {{ slotProps.item.resultado }}
                        </span>
                    </template>
                    <template #content>
                        <p><strong>Propiedad:</strong> {{ slotProps.item.propiedad }}</p>
                        <p><strong>Monto Invertido:</strong> ${{ slotProps.item.monto }}</p>
                        <p><strong>Retorno:</strong> ${{ slotProps.item.retorno }}</p>
                    </template>
                </Card>
            </template>
        </Timeline>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchInvestorInversiones } from '@/services/investorService';

const inversiones = ref([]);

const formatearInversion = (item) => ({
    fecha: item.fecha_inversion,
    resultado: item.resultado,
    propiedad: item.propiedad_nombre,
    monto: item.monto_invertido,
    retorno: calcularRetorno(item)
});

const calcularRetorno = (item) => {
    if (item.resultado === 'Ganó') {
        return (item.monto_invertido * 1.3).toFixed(2); // ejemplo de retorno estimado
    }
    return 0;
};

onMounted(async () => {
    try {
        const res = await fetchInvestorInversiones();
        inversiones.value = res.data.data.map(formatearInversion);
    } catch (error) {
        console.error('❌ Error al cargar inversiones:', error);
    }
});
</script>
