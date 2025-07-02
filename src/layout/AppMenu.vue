<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, onMounted } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import profileService from '@/services/profileService';
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
const { toggleMenu } = useLayout();

const model = ref([
    {
        items: [
            { label: 'Mi billetera', icon: '/imagenes/zuma/billetera.svg', to: '/' }
        ]
    },
    {
        items: [
            { label: 'Buscar hipotecas', icon: '/imagenes/zuma/buscar.svg', to: '/Search' }
        ]
    },
    {
        items: [
            { label: 'Online', icon: '/imagenes/zuma/buscar.svg', to: '/Online' }
        ]
    },
    {
        items: [
            { label: 'Mi dashboard', icon: '/imagenes/zuma/dashboard.svg', to: '/uikit/formlayout' }
        ]
    },
    {
        items: [
            {
                label: 'Información bancaria',
                icon: '/imagenes/zuma/informacion.svg',
                items: [
                    {
                        label: 'Cuentas',
                        icon: '/imagenes/zuma/billetera.svg',
                        to: '/Cuenta-Bancaria'
                    },
                    {
                        label: 'Estados de cuenta',
                        icon: '/imagenes/zuma/billetera.svg',
                        to: '/Estado-Cuenta'
                    }
                ]
            }
        ]
    }
]);
</script>
<template>
    <br>
    <ul class="layout-menu">
        <div class="layout-topbar-logo-container pt-5">
            <router-link to="/" class="layout-topbar-logo">
                <img src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma" class="inline-block w-28" />
            </router-link>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 26 22" fill="none"
                @click="toggleMenu" class="menu-toggle-btn inline-block float-right">
                <rect x="1.51078" y="1.5267" width="22.7718" height="19.1942" rx="5.31803"
                    transform="rotate(-0.620767 1.51078 1.5267)" stroke="#171717" stroke-width="2" />
                <line x1="11.0977" y1="20.5049" x2="11.0977" y2="1.35933" stroke="#171717" stroke-width="2" />
                <path d="M5.39844 6.86353H7.79163" stroke="#171717" stroke-width="2" stroke-linecap="round" />
                <path d="M5.39844 11.1711H7.79163" stroke="#171717" stroke-width="2" stroke-linecap="round" />
            </svg>
        </div>
        <div class="py-20">
            <div class="w-[104px] h-[116px] bg-[#F0F1F9] relative mx-auto rounded-[40px] overflow-hidden">
                <img src="/imagenes/zuma/hombre.svg" alt="Logo Zuma" class="w-[96px] absolute -bottom-1 left-1" />
            </div>
            <h3 class="text-center mt-2 mb-0 text-[#171717]">{{ fullName }}</h3>
        </div>
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
        </template>

        <div class="mt-20 p-5 rounded-3xl bg-[#FF4929] text-center">
            <img src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma" class="inline-block w-14" />
            <h3 class="text-center my-3 text-[#171717] font-noto">¿Tienes alguna duda?</h3>
            <p class="text-[#171717] mb-3">Tenemos especialistas que te podrán ayudar.</p>
            <button type="button"
                class="w-full text-[#171717] border-button-black focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 mb-3 transition duration-100 ease-in">
                <span class="inline-block align-middle">Contactar especialista</span>
            </button>
            <img src="/imagenes/zuma/alguna-duda.svg" alt="Imagen alguna duda" class="w-1/2 mx-auto" />
        </div>

        <button type="button"
            class="w-full text-white bg-[#171717] focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 mt-3 transition duration-100 ease-in">
            <span class="inline-block align-middle">¿Por qué invertir con nosotros?</span>
        </button>

        <button type="button"
            class="w-full text-white bg-[#171717] focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 mt-3 mb-20 transition duration-100 ease-in">
            <span class="inline-block align-middle">Preguntas frecuentes</span>
        </button>

    </ul>
</template>