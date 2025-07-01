<template>
    <Breadcrumb :home="home" :model="items" />

    <div class="card mb-6" style="background-color: #4F91FF; border-radius: 16px;">
        <h2 class="text-black">
            Bienvenido [{{ fullName }}] a tu perfil del inversionista
        </h2>
    </div>

    <div class="grid grid-cols-12 gap-4">
        <StatsWidget />
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import StatsWidget from '@/components/dashboard/StatsWidget.vue';
import profileService from '@/services/profileService';

const home = ref({
    icon: 'pi pi-home'
});
const items = ref([
    { label: 'Subasta hipotecas' },
    { label: 'Mi billetera' }
]);

const profile = ref(null);
const fullName = ref('');

// Lógica para obtener el perfil
const loadProfile = async () => {
    try {
        const response = await profileService.getProfile();
        profile.value = response.data.data;

        const { name, first_last_name, second_last_name } = profile.value;
        fullName.value = `${name} ${first_last_name} ${second_last_name}`;
    } catch (error) {
        console.error('Error cargando el perfil:', error);
    }
};

onMounted(loadProfile);
</script>
