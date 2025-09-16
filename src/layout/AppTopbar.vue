<template>
  <div class="layout-topbar">
    <img id="zuma-top" src="/imagenes/landing/logo-zuma.svg" alt="Logo Zuma"
      class="inline-block w-28 float-left hidden" />
    <div class="layout-topbar-actions">
      <div class="layout-config-menu">
        <svg xmlns="http://www.w3.org/2000/svg" id="menu-icon-top" width="20" height="20" viewBox="0 0 26 22"
          fill="none" @click="toggleMenu" class="menu-toggle-btn mt-[0.55rem] hidden">
          <rect x="1.51078" y="1.5267" width="22.7718" height="19.1942" rx="5.31803"
            transform="rotate(-0.620767 1.51078 1.5267)" stroke="#171717" stroke-width="2" />
          <line x1="11.0977" y1="20.5049" x2="11.0977" y2="1.35933" stroke="#171717" stroke-width="2" />
          <path d="M5.39844 6.86353H7.79163" stroke="#171717" stroke-width="2" stroke-linecap="round" />
          <path d="M5.39844 11.1711H7.79163" stroke="#171717" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>

      <!-- Componente de notificaciones separado -->
      <Notificacion v-model:showMobileNotifications="showMobileNotifications" @close-user-menu="showUserMenu = false"
        class="self-center mx-2" />
      <!-- MENÚ DE USUARIO - Visible en desktop -->
      <div class="relative user-menu-container hidden md:block">
        <button @click="toggleUserMenu"
          class="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200">
          <!-- Foto de perfil con iniciales -->
          <div
            class="w-12 h-12 rounded-full bg-[#E920AE] overflow-hidden flex-shrink-0 flex items-center justify-center">
            <img v-if="profilePhoto" :src="profilePhoto" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else-if="userInitials" class="text-lg font-bold text-white">{{ userInitials }}</span>
            <i v-else class="pi pi-user text-gray-600 text-sm"></i>
          </div>

          <!-- Nombre completo - responsivo -->
          <span class="text-sm font-bold text-gray-800 hidden sm:inline">{{ fullName }}</span>
          <i class="pi pi-chevron-down text-xs text-gray-600 transition-transform duration-200 hidden sm:inline"
            :class="{ 'rotate-180': showUserMenu }"></i>
        </button>

        <!-- Menú desplegable del usuario -->
        <div v-if="showUserMenu" ref="userMenuRef"
          class="absolute right-0 mt-2  bg-white border-0 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
          style="animation: slideDown 0.2s ease-out;">
          <div class="py-2">
            <!-- Información del usuario en el menú -->
            <div class="px-4 py-3 border-b border-gray-100">
              <p class="text-sm font-semibold text-gray-800">{{ fullName }}</p>
              <p class="text-xs text-gray-500">{{ userEmail }}</p>
            </div>

            <button @click="goToProfile"
              class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150">
              <i class="pi pi-user text-gray-600"></i>
              <span class="text-sm font-medium text-gray-700">Mi Perfil</span>
            </button>

            <div class="border-t border-gray-100 my-1"></div>

            <button @click="logout"
              class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 text-red-600">
              <i class="pi pi-sign-out text-red-600"></i>
              <span class="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Botón menú de 3 puntos - Solo visible en móvil/tablet -->
      <div class="relative mobile-menu-container md:hidden">
        <button @click="toggleMobileMenu"
          class="layout-topbar-action flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <i class="pi pi-ellipsis-v text-lg"></i>
        </button>

        <!-- Menú desplegable móvil -->
        <div v-if="showMobileMenu" ref="mobileMenuRef"
          class="absolute right-0 mt-2 w-64 bg-white border-0 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
          style="animation: slideDown 0.2s ease-out;">

          <!-- Información del usuario en móvil -->
          <div class="px-4 py-4 border-b border-gray-100 bg-gray-50">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <img v-if="profilePhoto" :src="profilePhoto" alt="Avatar" class="w-full h-full object-cover" />
                <span v-else-if="userInitials" class="text-sm font-semibold text-gray-700">{{ userInitials }}</span>
                <i v-else class="pi pi-user text-gray-600"></i>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-3xl font-semibold text-gray-800 truncate">{{ fullName }}</p>
                <p class="text-xs text-gray-500 truncate">{{ userEmail }}</p>
              </div>
            </div>
          </div>

          <div class="py-2">
            <!-- Notificaciones en móvil -->
            <button @click="handleMobileNotifications"
              class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150">
              <div class="relative">
                <i class="pi pi-bell text-gray-600"></i>
                <div v-if="notificationsCount > 0" class="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4929] rounded-full">
                </div>
              </div>
              <span class="text-sm font-medium text-gray-700">Notificaciones</span>
              <span v-if="notificationsCount > 0"
                class="ml-auto bg-[#FF4929] text-white text-xs px-2 py-1 rounded-full">
                {{ notificationsCount }}
              </span>
            </button>

            <!-- Mi Perfil en móvil -->
            <button @click="goToProfileMobile"
              class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150">
              <i class="pi pi-user text-gray-600"></i>
              <span class="text-sm font-medium text-gray-700">Mi Perfil</span>
            </button>

            <div class="border-t border-gray-100 my-1"></div>

            <!-- Cerrar sesión en móvil -->
            <button @click="logoutMobile"
              class="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-50 transition-colors duration-150 text-red-600">
              <i class="pi pi-sign-out text-red-600"></i>
              <span class="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useLayout } from '@/layout/composables/layout';
import admin2AuthService from '@/services/admin2AuthService';
import profileService from '@/services/profileService';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Notificacion from './Notificacion.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();

const router = useRouter();
const route = useRoute();
const showUserMenu = ref(false);
const showMobileMenu = ref(false);
const showMobileNotifications = ref(false);
const userMenuRef = ref(null);
const mobileMenuRef = ref(null);
const notificacionRef = ref(null);

// Computed para obtener el contador de notificaciones del componente hijo
const notificationsCount = computed(() => {
  return notificacionRef.value?.notificationsCount || 0;
});

// Computed para determinar la sección actual - ahora incluye cliente
const currentSection = computed(() => {
  const currentPath = route.path;
  console.log('Ruta actual:', currentPath); // Para debugging

  if (currentPath.startsWith('/tasas-fijas')) {
    return 'tasas-fijas';
  } else if (currentPath.startsWith('/cliente')) {
    console.log('Detectada sección cliente'); // Para debugging
    return 'cliente';
  }
  return 'hipotecas';
});

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
};

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

const handleMobileNotifications = () => {
  showMobileMenu.value = false;
  showMobileNotifications.value = true;
};

const logout = async () => {
  showUserMenu.value = false;

  try {
    await admin2AuthService.logout();
    localStorage.clear();
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  }
};

const logoutMobile = async () => {
  showMobileMenu.value = false;

  try {
    await admin2AuthService.logout();
    localStorage.clear();
    router.push('/login');
  } catch (error) {
    console.error('Error al cerrar sesión desde móvil:', error);
  }
};

const goToProfileMobile = () => {
  showMobileMenu.value = false;
  goToProfile();
};

const handleClickOutside = (event) => {
  const userMenuContainer = event.target.closest('.user-menu-container');
  const mobileMenuContainer = event.target.closest('.mobile-menu-container');

  if (!userMenuContainer) {
    showUserMenu.value = false;
  }

  if (!mobileMenuContainer) {
    showMobileMenu.value = false;
  }
};

// 👤 Perfil del usuario
const fullName = ref('');
const userEmail = ref('');
const profilePhoto = ref('');

// Computed para obtener las iniciales del usuario
const userInitials = computed(() => {
  if (!fullName.value) return '';

  const names = fullName.value.trim().split(' ');

  if (names.length === 1) {
    return names[0].substring(0, 2).toUpperCase();
  } else if (names.length === 2) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  } else if (names.length >= 3) {
    return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
  }

  return names[0].substring(0, 2).toUpperCase();
});

const loadProfile = async () => {
  try {
    const response = await profileService.getProfile();
    const user = response.data.data;

    fullName.value = [user.name, user.first_last_name, user.second_last_name].filter(Boolean).join(' ');
    userEmail.value = user.email || '';
    profilePhoto.value = user.profile_photo_path || '';
  } catch (error) {
    console.error('Error cargando perfil:', error);
    fullName.value = 'Usuario';
    userEmail.value = '';
    profilePhoto.value = '';
  }
};

const loadAvatar = async () => {
  try {
    const response = await profileService.getAvatar();
    profilePhoto.value = response.data?.data?.url || '';
  } catch (error) {
    console.error('Error cargando avatar:', error);
    profilePhoto.value = '';
  }
};

onMounted(() => {
  loadProfile();
  loadAvatar();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Función actualizada para manejar las 3 secciones
const goToProfile = () => {
  showUserMenu.value = false;

  const section = currentSection.value;
  console.log('Sección detectada para perfil:', section); // Para debugging

  switch (section) {
    case 'tasas-fijas':
      router.push('/tasas-fijas/Perfil');
      break;
    case 'cliente':
      router.push('/cliente/Perfil'); // ✅ CORREGIDO
      break;
    default:
      router.push('/hipotecas/Perfil');
      break;
  }
};

</script>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>