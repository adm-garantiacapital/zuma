<template>
  <div class="layout-topbar">
    <div class="layout-topbar-actions">
      <!-- Campana con contador -->
      <div class="relative notifications-container">
        <button @click="toggleNotifications" class="layout-topbar-action relative group flex items-center">

          <OverlayBadge :value="notifications.length">
            <div class="relative">
              <i class="pi pi-bell text-2xl transition-all duration-300 group-hover:scale-110 align-middle"
                :class="showNotifications ? 'text-[#FF4929]' : ''" />

              <div v-if="notifications.length > 0"
                class="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4929] rounded-full animate-pulse"></div>
            </div>
          </OverlayBadge>
        </button>

        <!-- Panel de notificaciones -->
        <div v-if="showNotifications" ref="notificationsPanelRef"
          class="absolute right-0 mt-3 w-[420px] bg-white border-0 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] z-50 backdrop-blur-sm overflow-hidden"
          style="animation: slideDown 0.3s ease-out;">
          <div class="px-6 py-5 border-b flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-[#F1F5F9] p-3 rounded-full">
                <i class="pi pi-bell text-xl text-[#FF4929] animate-pulse" />
              </div>
              <div>
                <h3 class="text-lg font-semibold text-gray-800">Notificaciones</h3>
                <p class="text-gray-500 text-sm">{{ notifications.length }} pendientes</p>
              </div>
            </div>
            <button @click="showNotifications = false" class="text-gray-400 hover:text-gray-600 transition">
              <i class="pi pi-times text-base" />
            </button>
          </div>

          <!-- Lista de notificaciones -->
          <div :class="{ 'max-h-[400px] overflow-y-auto': notifications.length >= 4 }" class="p-4 space-y-3 bg-white">
            <div v-for="notification in notifications" :key="notification.id"
              @click="irADetalleNotificacion(notification.type)"
              class="bg-white border-l-4 p-4 rounded-xl shadow-sm transition hover:shadow-md cursor-pointer" :class="{
                'border-blue-500': notification.type === 'personal',
                'border-yellow-500': notification.type === 'cuenta',
                'border-green-500': notification.type === 'deposito',
                'border-gray-300': !['personal', 'cuenta', 'deposito'].includes(notification.type)
              }">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="{
                  'bg-blue-100 text-blue-600': notification.type === 'personal',
                  'bg-yellow-100 text-yellow-600': notification.type === 'cuenta',
                  'bg-green-100 text-green-600': notification.type === 'deposito',
                  'bg-gray-100 text-gray-600': !['personal', 'cuenta', 'deposito'].includes(notification.type)
                }">
                  <i :class="notification.icon + ' text-lg'" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 mb-2 leading-snug">{{ notification.text }}</p>
                  <div class="flex justify-end">
                    <button @click.stop="completarNotificacion(notification.id)"
                      class="text-xs font-semibold px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition">
                      {{ notification.action }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="notifications.length === 0" class="text-center py-10">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <i class="pi pi-check text-2xl text-gray-400" />
              </div>
              <p class="text-gray-600 font-medium text-sm">¡Todo está al día!</p>
              <p class="text-gray-400 text-xs">No hay notificaciones pendientes</p>
            </div>
          </div>

          <div class="p-4 border-t bg-gray-50">
            <button
              class="w-full text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition">
              <i class="pi pi-external-link mr-2 text-sm" />
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      </div>

      <!-- MENÚ DE USUARIO -->
      <div class="relative user-menu-container">
        <button @click="toggleUserMenu"
          class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
          <!-- Foto de perfil -->
          <div class="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
            <img v-if="profilePhoto" :src="profilePhoto" alt="Avatar" class="w-full h-full object-cover" />
            <i v-else class="pi pi-user text-gray-600 text-sm flex items-center justify-center w-full h-full"></i>
          </div>
          <span class="text-sm font-medium text-gray-800">[ {{ fullName }} ]</span>
          <i class="pi pi-chevron-down text-xs text-gray-600 transition-transform duration-200"
            :class="{ 'rotate-180': showUserMenu }"></i>
        </button>

        <!-- Menú desplegable del usuario -->
        <div v-if="showUserMenu" ref="userMenuRef"
          class="absolute right-0 mt-2 w-48 bg-white border-0 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 overflow-hidden"
          style="animation: slideDown 0.2s ease-out;">
          <div class="py-2">
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

      <!-- Botón menú adicional -->
      <button class="layout-topbar-menu-button layout-topbar-action" v-styleclass="{
        selector: '@next',
        enterFromClass: 'hidden',
        enterActiveClass: 'animate-scalein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'animate-fadeout',
        hideOnOutsideClick: true
      }">
        <i class="pi pi-ellipsis-v"></i>
      </button>
    </div>
  </div>

  <AddCuenta :visible="showAddCuentaDialog" @update:visible="val => showAddCuentaDialog = val" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import OverlayBadge from 'primevue/overlaybadge';
import AddCuenta from '@/views/pages/Notificaciones/CuentaBancaria/Desarrollo/AddCuenta.vue';
import profileService from '@/services/profileService';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const showNotifications = ref(false);
const showUserMenu = ref(false);
const notificationsPanelRef = ref(null);
const userMenuRef = ref(null);
const showAddCuentaDialog = ref(false);

const notifications = ref([
  {
    id: 1,
    icon: 'pi pi-user',
    text: 'Te recordamos que aún tienes pendiente completar los datos personales. Complétalos para continuar usando la web.',
    action: 'Completar',
    type: 'personal'
  },
  {
    id: 2,
    icon: 'pi pi-wallet',
    text: 'Aún no tienes ninguna cuenta bancaria asociada. Agrega una para continuar usando la web.',
    action: 'Agregar cuenta',
    type: 'cuenta'
  },
  {
    id: 3,
    icon: 'pi pi-dollar',
    text: 'Aún no tienes ningún movimiento. Realiza un depósito para continuar usando la web.',
    action: 'Depositar',
    type: 'deposito'
  }
]);

// Computed para determinar la sección actual
const currentSection = computed(() => {
  if (route.path.startsWith('/tasas-fijas')) {
    return 'tasas-fijas';
  }
  return 'hipotecas';
});

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false; // Cerrar menú de usuario si está abierto
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false; // Cerrar notificaciones si están abiertas
};

const completarNotificacion = (id) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification?.type === 'cuenta') {
    showAddCuentaDialog.value = true;
  } else {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }
};

const logout = () => {
  showUserMenu.value = false;
  console.log('Cerrar sesión');
};

const handleClickOutside = (event) => {
  const notificationsContainer = event.target.closest('.notifications-container');
  const userMenuContainer = event.target.closest('.user-menu-container');

  if (!notificationsContainer) {
    showNotifications.value = false;
  }

  if (!userMenuContainer) {
    showUserMenu.value = false;
  }
};

// 👤 Perfil del usuario
const fullName = ref('');

const loadProfile = async () => {
  try {
    const response = await profileService.getProfile();
    const user = response.data.data;
    fullName.value = `${user.alias}`;
  } catch (error) {
    console.error('Error cargando perfil:', error);
    // Fallback si hay error
    fullName.value = 'Usuario';
  }
};

onMounted(() => {
  loadProfile();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const goToProfile = () => {
  showUserMenu.value = false;
  // Redirigir al perfil según la sección actual
  if (currentSection.value === 'tasas-fijas') {
    router.push('/tasas-fijas/Perfil'); // Necesitarás agregar esta ruta
  } else {
    router.push('/hipotecas/Perfil');
  }
};

const irADetalleNotificacion = (type) => {
  const section = currentSection.value;
  
  if (type === 'personal') {
    if (section === 'tasas-fijas') {
      router.push('/tasas-fijas/Confirmar-Cuenta'); // Necesitarás agregar esta ruta
    } else {
      router.push('/hipotecas/Confirmar-Cuenta');
    }
  } else if (type === 'cuenta') {
    if (section === 'tasas-fijas') {
      router.push('/tasas-fijas/Cuenta-Bancaria');
    } else {
      router.push('/hipotecas/Cuenta-Bancaria');
    }
  } else if (type === 'deposito') {
    if (section === 'tasas-fijas') {
      router.push('/tasas-fijas/Estado-Cuenta');
    } else {
      router.push('/hipotecas/Estado-Cuenta');
    }
  }
};
</script>

<style scoped></style>