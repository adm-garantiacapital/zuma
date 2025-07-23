<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';
import profileService from '@/services/profileService';

const route = useRoute();
const profile = ref(null);
const fullName = ref('');
const initials = ref('');
const profilePhoto = ref('');

const loadProfile = async () => {
    try {
        const response = await profileService.getProfile();
        profile.value = response.data.data;

        const { name, first_last_name, second_last_name, profile_photo_path } = profile.value;

        fullName.value = `${name} ${first_last_name} ${second_last_name}`;
        initials.value = `${name?.[0] ?? ''}${first_last_name?.[0] ?? ''}`.toUpperCase();
        profilePhoto.value = profile_photo_path ? profile_photo_path : '';
    } catch (error) {
        console.error('Error cargando el perfil:', error);
    }
};

onMounted(loadProfile);

const { toggleMenu } = useLayout();

const hipotecasMenu = [
    {
        items: [{ label: 'Mi billetera', icon: 'billetera', to: '/hipotecas' }]
    },
    {
        items: [{ label: 'Buscar hipotecas', icon: 'buscar', to: '/hipotecas/buscar' }]
    },
    {
        items: [{ label: 'Subastas en línea', icon: 'datos', to: '/hipotecas/subasta' }]
    },
    {
        items: [{ label: 'Mi dashboard', icon: 'dashboard', to: '/hipotecas/dashboard' }]
    },
    {
        items: [
            {
                label: 'Información bancaria',
                icon: 'informacion',
                items: [
                    { label: 'Cuentas', icon: 'cuentas', to: '/hipotecas/Cuenta-Bancaria' },
                    { label: 'Estados de cuenta', icon: 'estados', to: '/hipotecas/Estado-Cuenta' }
                ]
            }
        ]
    }
];

const tasasFijasMenu = [
    {
        items: [{ label: 'Mi billetera', icon: 'billetera', to: '/tasas-fijas' }]
    },
    {
        items: [{ label: 'Oportunidades', icon: 'buscar', to: '/tasas-fijas/Search' }]
    },
    {
        items: [{ label: 'Mi dashboard', icon: 'dashboard', to: '/tasas-fija' }]
    },
    {
        items: [
            {
                label: 'Información bancaria',
                icon: 'informacion',
                items: [
                    { label: 'Cuentas', icon: 'cuentas', to: '/tasas-fijas/Cuenta-Bancaria' },
                    { label: 'Estados de cuenta', icon: 'estados', to: '/tasas-fijas/Estado-Cuenta' }
                ]
            }
        ]
    }
];

const clienteMenu = [
    {
        items: [{ label: 'Mi billetera', icon: 'billetera', to: '/cliente' }]
    },
    {
        items: [
            {
                label: 'Información bancaria',
                icon: 'informacion',
                items: [
                    { label: 'Cuentas', icon: 'cuentas', to: '/cliente/Cuenta-Bancaria' },
                    { label: 'Estados de cuenta', icon: 'estados', to: '/cliente/Estado-Cuenta' }
                ]
            }
        ]
    }
];

const model = computed(() => {
    if (route.path.startsWith('/tasas-fijas')) return tasasFijasMenu;
    if (route.path.startsWith('/cliente')) return clienteMenu;
    return hipotecasMenu;
});
</script>

<template>
    <br>
    <ul class="layout-menu">
        <div class="layout-topbar-logo-container pt-5">
            <router-link to="/" class="layout-topbar-logo inline-block">
                <img id="zuma" src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma" class="inline-block w-28" />
                <img id="zuma-m" src="/imagenes/landing/logo-zuma-m.svg" alt="Logo Zuma" class="hidden w-full mb-5" />
            </router-link>
            <svg xmlns="http://www.w3.org/2000/svg" id="menu-icon" width="20" height="20" viewBox="0 0 26 22"
                fill="none" @click="toggleMenu" class="menu-toggle-btn inline-block ms-[119px] float-none">
                <rect x="1.51078" y="1.5267" width="22.7718" height="19.1942" rx="5.31803"
                    transform="rotate(-0.620767 1.51078 1.5267)" stroke="#171717" stroke-width="2" />
                <line x1="11.0977" y1="20.5049" x2="11.0977" y2="1.35933" stroke="#171717" stroke-width="2" />
                <path d="M5.39844 6.86353H7.79163" stroke="#171717" stroke-width="2" stroke-linecap="round" />
                <path d="M5.39844 11.1711H7.79163" stroke="#171717" stroke-width="2" stroke-linecap="round" />
            </svg>
        </div>

        <!-- Avatar y nombre -->
        <div class="py-20">
            <div
                class="avatar-zuma w-[104px] h-[116px] bg-[#F0F1F9] relative mx-auto rounded-[40px] overflow-hidden flex items-center justify-center text-[#171717] text-3xl font-bold">
                <img
                    v-if="profilePhoto"
                    :src="profilePhoto"
                    alt="Avatar"
                    class="w-full h-full object-cover"
                />
                <span v-else>{{ initials }}</span>
            </div>
            <h3 class="name-zuma text-center mt-2 mb-0 text-[#171717]">{{ fullName }}</h3>
        </div>

        <!-- Menú dinámico -->
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
        </template>

        <!-- Sección final -->
        <div class="announce-zuma">
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
                class="w-full text-white bg-[#171717] focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 my-3 transition duration-100 ease-in">
                <span class="inline-block align-middle">Preguntas frecuentes</span>
            </button>
        </div>
    </ul>
</template>
