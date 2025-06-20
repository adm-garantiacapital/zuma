<template>
    <Breadcrumb :home="home" :model="items" />

    <div class="grid gap-4 p-4">
        <div
            v-for="prop in subastas"
            :key="prop.id"
            class="col-12 md:col-6 xl:col-4"
        >
            <div class="p-4 border-round shadow-2 surface-card">
                <img :src="prop.foto" class="w-full mb-3 rounded-md" alt="Imagen" />
                <h5>{{ prop.nombre }}</h5>
                <p class="m-0 text-sm text-color-secondary">{{ prop.distrito }}</p>
                <p class="m-0 text-sm">Monto inicial: <strong>S/ {{ prop.monto }}</strong></p>
                <p class="m-0 text-sm">
                    Finaliza: {{ formatFecha(prop.finalizacion) }}
                </p>
                <Button
                    label="Ver Apuestas"
                    class="mt-2 p-button-sm"
                    @click="verApostadores(prop.id)"
                />
            </div>
        </div>
    </div>

    <!-- Lista de apostadores -->
    <div v-if="apostadores.length" class="p-4 border-top-1 surface-border">
        <h4 class="mb-3">Clientes que apostaron</h4>
        <ul class="list-none p-0 m-0">
            <li
                v-for="(cliente, index) in apostadores"
                :key="index"
                class="mb-2 p-2 border-bottom-1 surface-border"
            >
                {{ cliente.nombre }} — <strong>S/ {{ cliente.monto }}</strong>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const subastas = ref([]);
const apostadores = ref([]);
const home = ref({ icon: 'pi pi-home' });
const items = ref([{ label: 'Subasta hipotecas' }, { label: 'Online' }]);

const formatFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
};

const loadSubastas = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/subastadas`);
        subastas.value = res.data.data;
    } catch (err) {
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudo cargar la lista de subastas',
        });
    }
};

const verApostadores = async (subastaId) => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/subastadas/${subastaId}/apostadores`);
        apostadores.value = res.data;
    } catch (err) {
        toast.add({
            severity: 'warn',
            summary: 'Sin datos',
            detail: 'No hay apostadores para esta subasta',
        });
        apostadores.value = [];
    }
};

onMounted(() => {
    loadSubastas();
});
</script>
