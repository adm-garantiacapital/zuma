<script setup>
import { useLayout } from '@/layout/composables/layout';
import profileService from '@/services/profileService';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppMenuItem from './AppMenuItem.vue';

const route = useRoute();
const profile = ref(null);
const fullName = ref('');
const fullDoce = ref('');
const initials = ref('');
const profilePhoto = ref('');
const showCopyTooltip = ref(false);

const { isSidebarCollapsed, toggleMenu } = useLayout();

const loadProfile = async () => {
    try {
        const response = await profileService.getProfile();
        profile.value = response.data.data;

        const { alias, first_last_name, profile_photo_path, codigo } = profile.value;
        fullName.value = alias;
        fullDoce.value = codigo || 'Sin código';
        initials.value = `${alias?.[0] ?? ''}${first_last_name?.[0] ?? ''}`.toUpperCase();
        profilePhoto.value = profile_photo_path ? profile_photo_path : '';
    } catch (error) {
        console.error('Error cargando el perfil:', error);
    }
};

const copyUserCode = async () => {
    try {
        await navigator.clipboard.writeText(fullDoce.value);
        showCopyTooltip.value = true;
        setTimeout(() => {
            showCopyTooltip.value = false;
        }, 2000);
    } catch (error) {
        console.error('Error al copiar:', error);
    }
};

onMounted(loadProfile);

const hipotecasMenu = [
    {
        items: [{ label: 'Mi billetera', icon: 'billetera', to: '/hipotecas', icon2: 'si' }]
    },
    {
        items: [
            {
                label: 'Información bancaria',
                icon: 'informacion',
                items: [
                    { label: 'Cuentas', icon: 'cuentas', to: '/hipotecas/Cuenta-Bancaria', icon2: 'si' },
                    { label: 'Estados de cuenta', icon: 'estados', to: '/hipotecas/Estado-Cuenta' }
                ]
            }
        ]
    },
    {
        items: [{ label: 'Buscar hipotecas', icon: 'buscar', to: '/hipotecas/buscar' }]
    },
    {
        items: [{ label: 'Subastas en línea', icon: 'datos', to: '/hipotecas/subasta' }]
    },
];

const tasasFijasMenu = [
    {
        items: [{ label: 'Mi billetera', icon: 'billetera', to: '/tasas-fijas' }]
    },
    {
        items: [
            {
                label: 'Información bancaria',
                icon: 'informacion', icon2: 'si',
                items: [
                    { label: 'Cuentas', icon: 'cuentas', to: '/tasas-fijas/Cuenta-Bancaria', icon2: 'si' },
                    { label: 'Estados de cuenta', icon: 'estados', to: '/tasas-fijas/Estado-Cuenta' }
                ]
            }
        ]
    },
    {
        items: [{ label: 'Oportunidades', icon: 'buscar', to: '/tasas-fijas/Search' }]
    },
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
    <ul class="layout-menu">
        <div class="layout-topbar-logo-container pt-5 flex items-center justify-between px-4">
            <router-link to="/" class="layout-topbar-logo flex items-center gap-3">
                <div class="flex items-center justify-center rounded-lg bg-white text-sidebar-primary-foreground">
                    <img id="zuma" src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma"
                        :class="{ 'hidden': isSidebarCollapsed, 'block': !isSidebarCollapsed, 'h-auto w-auto max-w-[140px] object-contain duration-200': true }" />
                    <img id="zuma-m" src="/imagenes/landing/logo-zuma-m.svg" alt="Logo Zuma"
                        :class="{ 'hidden': !isSidebarCollapsed, 'block': isSidebarCollapsed, 'h-7 w-7': true }" />
                </div>
            </router-link>

            <!-- Botón de toggle siempre visible -->
            <button @click="toggleMenu" class="inline-flex items-center justify-center whitespace-nowrap text-sm 
                font-medium ring-offset-background transition-colors focus-visible:outline-none 
                focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none 
                disabled:opacity-50 underline-offset-4 hover:underline rounded-full h-10 w-10 text-tertiary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 26 22" fill="none">
                    <rect x="1.5" y="1.5" width="22.7" height="19.2" rx="5.3" stroke="#171717" stroke-width="2" />
                    <line x1="11.1" y1="20.5" x2="11.1" y2="1.3" stroke="#171717" stroke-width="2" />
                    <path d="M5.4 6.8H7.8" stroke="#171717" stroke-width="2" stroke-linecap="round" />
                    <path d="M5.4 11.1H7.8" stroke="#171717" stroke-width="2" stroke-linecap="round" />
                </svg>
            </button>
        </div>

        <!-- Avatar y nombre -->
        <div class="py-5 text-center my-5 px-4 relative" :class="{ 'px-2': isSidebarCollapsed }">
            <div class="avatar-zuma w-[104px] h-[116px] bg-[#E920AE] relative mx-auto rounded-2xl duration-200 overflow-hidden flex items-center justify-center text-white text-2xl"
                :class="{ 'w-16 h-16': isSidebarCollapsed }">
                <img v-if="profilePhoto" :src="profilePhoto" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else class="text-5xl rounded-3xl duration-200" :class="{ 'text-3xl': isSidebarCollapsed }">{{
                    initials }}</span>
            </div>

            <!-- Nombre -->
            <h5 class="name-zuma text-center mt-2 mb-3 text-black text-xl" :class="{ 'hidden': isSidebarCollapsed }">
                {{ fullName }}
            </h5>

            <!-- Código de usuario con mejor estética -->
            <div class="user-code-container mx-auto"
                :class="{ 'max-w-[200px]': !isSidebarCollapsed, 'hidden': isSidebarCollapsed }">
                <div class="relative">
                    <div
                        class="bg-gradient-to-r from-[#6790FF] to-[#FF4929] rounded-xl p-3 shadow-lg flex flex-col items-center gap-1">
                        <span class="text-white font-mono font-bold text-sm tracking-wider">
                            {{ fullDoce }}
                        </span>
                        <button @click="copyUserCode"
                            class="mt-1 p-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 group"
                            title="Copiar código">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-white group-hover:scale-110 transition-transform">
                                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                            </svg>
                        </button>
                        <span class="text-white/80 text-xs font-bold">Gana más, REFIRIENDO.</span>
                    </div>

                    <!-- Tooltip -->
                    <div v-if="showCopyTooltip"
                        class="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow-lg animate-fade-in">
                        ¡Copiado!
                        <div
                            class="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Menú dinámico -->
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"
                :collapsed="isSidebarCollapsed"></app-menu-item>
        </template>

        <!-- Sección final -->
        <div class="announce-zuma px-4" :class="{ 'px-2': isSidebarCollapsed }">
            <div class="mt-20 p-5 rounded-3xl bg-[#FF4929] text-center" :class="{ 'hidden': isSidebarCollapsed }">
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
                class="w-full text-white bg-[#171717] focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 mt-3 transition duration-100 ease-in"
                :class="{ 'hidden': isSidebarCollapsed }">
                <span class="inline-block align-middle">¿Por qué invertir con nosotros?</span>
            </button>

            <button type="button"
                class="w-full text-white bg-[#171717] focus:outline-none hover:bg-[#6790FF] focus:bg-[#FF4929] font-bold rounded-3xl px-5 py-3 my-3 transition duration-100 ease-in"
                :class="{ 'hidden': isSidebarCollapsed }">
                <span class="inline-block align-middle">Preguntas frecuentes</span>
            </button>
        </div>
    </ul>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(-5px);
    }

    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out;
}

.layout-menu {
    transition: all 0.3s ease;
}

.avatar-zuma,
.name-zuma,
.user-code-container {
    transition: all 0.3s ease;
}
</style>