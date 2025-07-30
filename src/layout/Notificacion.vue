<template>
  <div class="notifications-wrapper">
    <!-- Campana con contador - Visible en desktop -->
    <div class="relative notifications-container hidden md:block">
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
            @click="irADetalleNotificacion(notification.type, $event)"
            class="bg-white border-l-4 p-4 rounded-xl shadow-sm transition hover:shadow-md cursor-pointer" :class="{
              'border-blue-500': notification.type === 'personal',
              'border-yellow-500': notification.type === 'cuenta',
              'border-green-500': notification.type === 'deposito',
              'border-orange-500': notification.type === 'reserva_pendiente',
              'border-gray-300': !['personal', 'cuenta', 'deposito', 'reserva_pendiente'].includes(notification.type)
            }">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="{
                'bg-blue-100 text-blue-600': notification.type === 'personal',
                'bg-yellow-100 text-yellow-600': notification.type === 'cuenta',
                'bg-green-100 text-green-600': notification.type === 'deposito',
                'bg-orange-100 text-orange-600': notification.type === 'reserva_pendiente',
                'bg-gray-100 text-gray-600': !['personal', 'cuenta', 'deposito', 'reserva_pendiente'].includes(notification.type)
              }">
                <i :class="notification.icon + ' text-lg'" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-800 mb-2 leading-snug">{{ notification.text }}</p>
                <div class="flex justify-end">
                  <button @click.stop="completarNotificacion(notification.id, $event)"
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
          <button @click="verTodasNotificaciones($event)"
            class="w-full text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition">
            <i class="pi pi-external-link mr-2 text-sm" />
            Ver todas las notificaciones
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de notificaciones para móvil -->
    <div v-if="mobileNotificationsModel" class="fixed inset-0 z-50 md:hidden">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="closeMobileNotifications"></div>
      
      <!-- Modal content -->
      <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[80vh] overflow-hidden"
           style="animation: slideUp 0.3s ease-out;">
        
        <!-- Header -->
        <div class="px-6 py-5 border-b flex items-center justify-between bg-white sticky top-0">
          <div class="flex items-center gap-3">
            <div class="bg-[#F1F5F9] p-3 rounded-full">
              <i class="pi pi-bell text-xl text-[#FF4929] animate-pulse" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800">Notificaciones</h3>
              <p class="text-gray-500 text-sm">{{ notifications.length }} pendientes</p>
            </div>
          </div>
          <button @click="closeMobileNotifications" class="text-gray-400 hover:text-gray-600 transition">
            <i class="pi pi-times text-lg" />
          </button>
        </div>

        <!-- Notifications list -->
        <div class="p-4 space-y-3 bg-white overflow-y-auto max-h-[calc(80vh-120px)]">
          <div v-for="notification in notifications" :key="notification.id"
            @click="irADetalleNotificacionMobile(notification.type, $event)"
            class="bg-white border-l-4 p-4 rounded-xl shadow-sm transition hover:shadow-md cursor-pointer" :class="{
              'border-blue-500': notification.type === 'personal',
              'border-yellow-500': notification.type === 'cuenta',
              'border-green-500': notification.type === 'deposito',
              'border-orange-500': notification.type === 'reserva_pendiente',
              'border-gray-300': !['personal', 'cuenta', 'deposito', 'reserva_pendiente'].includes(notification.type)
            }">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="{
                'bg-blue-100 text-blue-600': notification.type === 'personal',
                'bg-yellow-100 text-yellow-600': notification.type === 'cuenta',
                'bg-green-100 text-green-600': notification.type === 'deposito',
                'bg-orange-100 text-orange-600': notification.type === 'reserva_pendiente',
                'bg-gray-100 text-gray-600': !['personal', 'cuenta', 'deposito', 'reserva_pendiente'].includes(notification.type)
              }">
                <i :class="notification.icon + ' text-lg'" />
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-800 mb-3 leading-snug">{{ notification.text }}</p>
                <div class="flex justify-end">
                  <button @click.stop="completarNotificacionMobile(notification.id, $event)"
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
      </div>
    </div>

    <!-- Diálogo para agregar cuenta -->
    <AddCuenta :visible="showAddCuentaDialog" @update:visible="val => showAddCuentaDialog = val" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import OverlayBadge from 'primevue/overlaybadge';
import AddCuenta from '@/views/pages/Notificaciones/CuentaBancaria/Desarrollo/AddCuenta.vue';
import { notificationService } from '@/services/notificationService.js';

const props = defineProps({
  showMobileNotifications: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:showMobileNotifications', 'close-user-menu']);

const router = useRouter();
const route = useRoute();

const showNotifications = ref(false);
const showAddCuentaDialog = ref(false);
const notificationsPanelRef = ref(null);
const notifications = ref([]);

const mobileNotificationsModel = computed({
  get() {
    return props.showMobileNotifications;
  },
  set(value) {
    emit('update:showMobileNotifications', value);
  }
});

const currentSection = computed(() => {
  if (route.path.startsWith('/tasas-fijas')) return 'tasas-fijas';
  if (route.path.startsWith('/cliente')) return 'cliente';
  return 'hipotecas';
});

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
  emit('close-user-menu');
};

const closeMobileNotifications = () => {
  mobileNotificationsModel.value = false;
};

const completarNotificacion = async (id, event) => {
  // Prevenir que se cierre el panel inmediatamente
  event?.stopPropagation();
  
  try {
    // Buscar la notificación antes de eliminarla
    const notification = notifications.value.find(n => n.id === id);
    
    await notificationService.markAsCompleted(id);
    notifications.value = notifications.value.filter(n => n.id !== id);
    
    // Cerrar el panel primero
    showNotifications.value = false;
    
    // Navegar según el tipo de notificación después de un pequeño delay
    setTimeout(() => {
      const section = currentSection.value;
      
      if (notification?.type === 'personal') {
        router.push(`/${section}/Confirmar-Cuenta`);
      } else if (notification?.type === 'cuenta') {
        router.push(`/${section}/Cuenta-Bancaria`);
        // También mostrar el diálogo si es necesario
        setTimeout(() => {
          showAddCuentaDialog.value = true;
        }, 100);
      } else if (notification?.type === 'deposito') {
        router.push(`/${section}/Estado-Cuenta`);
      } else if (notification?.type === 'reserva_pendiente') {
        // Siempre navegar a /hipotecas/Estado-Cuenta para reservas pendientes
        router.push('/hipotecas/Estado-Cuenta');
      }
    }, 50);
    
  } catch (error) {
    console.error('Error al completar notificación', error);
  }
};

const completarNotificacionMobile = async (id, event) => {
  event?.stopPropagation();
  
  try {
    // Buscar la notificación antes de eliminarla
    const notification = notifications.value.find(n => n.id === id);
    
    await notificationService.markAsCompleted(id);
    notifications.value = notifications.value.filter(n => n.id !== id);
    
    // Cerrar el modal móvil primero
    mobileNotificationsModel.value = false;
    
    // Navegar según el tipo de notificación después de un pequeño delay
    setTimeout(() => {
      const section = currentSection.value;
      
      if (notification?.type === 'personal') {
        router.push(`/${section}/Confirmar-Cuenta`);
      } else if (notification?.type === 'cuenta') {
        router.push(`/${section}/Cuenta-Bancaria`);
        // También mostrar el diálogo si es necesario
        setTimeout(() => {
          showAddCuentaDialog.value = true;
        }, 100);
      } else if (notification?.type === 'deposito') {
        router.push(`/${section}/Estado-Cuenta`);
      } else if (notification?.type === 'reserva_pendiente') {
        // Siempre navegar a /hipotecas/Estado-Cuenta para reservas pendientes
        router.push('/hipotecas/Estado-Cuenta');
      }
    }, 50);
    
  } catch (error) {
    console.error('Error al completar notificación', error);
  }
};

const irADetalleNotificacion = (type, event) => {
  // Prevenir que se cierre el panel antes de navegar
  event?.stopPropagation();
  
  // Cerrar el panel primero
  showNotifications.value = false;
  
  // Navegar después de un pequeño delay
  setTimeout(() => {
    const section = currentSection.value;
    if (type === 'personal') {
      router.push(`/${section}/Confirmar-Cuenta`);
    } else if (type === 'cuenta') {
      router.push(`/${section}/Cuenta-Bancaria`);
    } else if (type === 'deposito') {
      router.push(`/${section}/Estado-Cuenta`);
    } else if (type === 'reserva_pendiente') {
      // Siempre navegar a /hipotecas/Estado-Cuenta para reservas pendientes
      router.push('/hipotecas/Estado-Cuenta');
    }
  }, 50);
};

const irADetalleNotificacionMobile = (type, event) => {
  event?.stopPropagation();
  mobileNotificationsModel.value = false;
  
  setTimeout(() => {
    const section = currentSection.value;
    if (type === 'personal') {
      router.push(`/${section}/Confirmar-Cuenta`);
    } else if (type === 'cuenta') {
      router.push(`/${section}/Cuenta-Bancaria`);
    } else if (type === 'deposito') {
      router.push(`/${section}/Estado-Cuenta`);
    } else if (type === 'reserva_pendiente') {
      // Siempre navegar a /hipotecas/Estado-Cuenta para reservas pendientes
      router.push('/hipotecas/Estado-Cuenta');
    }
  }, 50);
};

const verTodasNotificaciones = (event) => {
  event?.stopPropagation();
  showNotifications.value = false;
  
  setTimeout(() => {
    const section = currentSection.value;
    router.push(`/${section}/Notificaciones`);
  }, 50);
};

const handleClickOutside = (event) => {
  // Solo cerrar si el click no está dentro del contenedor de notificaciones
  const notificationsContainer = event.target.closest('.notifications-container');
  const notificationsPanel = event.target.closest('.notifications-wrapper');
  
  if (!notificationsContainer && !notificationsPanel) {
    showNotifications.value = false;
  }
};

const fetchNotifications = async () => {
  try {
    const res = await notificationService.getNotifications();
    if (res.data.success) {
      notifications.value = res.data.notifications;
    }
  } catch (err) {
    console.error('Error obteniendo notificaciones:', err);
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  fetchNotifications();
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

defineExpose({
  notificationsCount: computed(() => notifications.value.length)
});
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

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>