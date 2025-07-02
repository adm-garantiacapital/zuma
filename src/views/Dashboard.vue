<template>
    <br>
    <Breadcrumb :home="home" :model="items" />
    <div class="mb-10 rounded-3xl bg-[#6790FF] relative overflow-hidden">
        <div class="px-10 py-20 relative superior inline-block">
            <h2 class="m-0 text-[#171717]">Bienvenido [{{ fullName }}] a tu perfil del inversionista</h2>
        </div>
        <div class="mask absolute -top-14 -right-8">
            <img src="/imagenes/zuma/imagen-1.png" alt="Logo Zuma"
                class="inline-block w-49 hover:scale-110 transition duration-100 ease-in" />
        </div>
    </div>

    <StatsWidget />

    <div class="p-10 my-10 rounded-3xl bg-[#F0F1F9]">
        <div class="grid grid-cols-8 gap-0">
            <div class="col-span-8 lg:col-span-4">
                <h3 class="m-0 text-[#171717]">Mi billetera</h3>
                <p class="m-0 text-[#171717]">Puedes utilizar ambas monedas al momento de hacer la inversión.</p>
            </div>
            <div class="col-span-8 lg:col-span-4 text-end">
                <button type="button"
                    class="text-[#171717] bg-white focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 me-3 transition duration-100 ease-in">
                    <img src="/imagenes/zuma/pen.png" alt="Logo Zuma" class="inline-block me-2" width="20" />
                    <span class="inline-block align-middle">PEN</span>
                </button>
                <button type="button"
                    class="text-[#171717] bg-white focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 me-3 transition duration-100 ease-in">
                    <img src="/imagenes/zuma/usd.png" alt="Logo Zuma" class="inline-block me-2" width="20" />
                    <span class="inline-block align-middle">USD</span>
                </button>
                <button type="button"
                    class="text-white bg-[#171717] focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 me-3 transition duration-100 ease-in">
                    <i class="pi pi-plus inline-block align-middle me-2"></i>
                    <span class="inline-block align-middle">Calcular</span>
                </button>
                <button type="button"
                    class="text-[#171717] border-button-black focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 transition duration-100 ease-in">
                    <i class="pi pi-minus inline-block align-middle me-2"></i>
                    <span class="inline-block align-middle">Retiro</span>
                </button>
            </div>
        </div>
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

        const { alias} = profile.value;
        fullName.value = `${alias}`;
    } catch (error) {
        console.error('Error cargando el perfil:', error);
    }
};

onMounted(loadProfile);
</script>
