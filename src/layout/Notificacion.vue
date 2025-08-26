<template>
  <div class="notifications-wrapper">
    <!-- Campana con contador - Visible en desktop -->
    <div class="relative notifications-container hidden md:block">
      <button @click="toggleNotifications" class="layout-topbar-action relative group flex items-center">
        <OverlayBadge :value="notifications.length">
          <div class="relative">
            <!-- Icono de campana Lucide -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-bell transition-all duration-300 group-hover:scale-110 align-middle"
              :class="showNotifications ? 'text-[#FF4929]' : ''" aria-hidden="true">
              <path d="M10.268 21a2 2 0 0 0 3.464 0"></path>
              <path
                d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326">
              </path>
            </svg>

            <div v-if="notifications.length > 0"
              class="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4929] rounded-full animate-pulse"></div>
          </div>
        </OverlayBadge>
      </button>

      <!-- Panel de notificaciones -->
      <div v-if="showNotifications" ref="notificationsPanelRef"
        class="absolute right-0 mt-1 w-[320px] bg-white border-0 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] z-50 backdrop-blur-sm overflow-hidden"
        style="animation: slideDown 0.3s ease-out;">
        <!-- <div class="px-6 py-5 border-b flex items-center justify-between">
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
        </div> -->

        <!-- Lista de notificaciones -->
        <div :class="{ 'max-h-[400px] overflow-y-auto': notifications.length >= 4 }" class="p-4 space-y-3">
          <div v-for="notification in notifications" :key="notification.id"
            @click="irADetalleNotificacion(notification.type, $event)"
            class="bg-[#FF4929] p-4 rounded-2xl text-black flex flex-col gap-3 cursor-pointer">

            <div class="flex items-start gap-4">
              <!-- Ícono -->
              <div class="w-10 h-10 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 74 113" fill="none" xmlns="http://www.w3.org/2000/svg"
                  class="!size-8 text-black">
                  <path
                    d="M5.29488 41.7433C2.90046 24.0246 15.3514 7.6893 33.0702 5.29488C50.7889 2.90046 67.1242 15.3515 69.5186 33.0702C71.913 50.7889 59.462 67.1242 41.7433 69.5186C24.0246 71.913 7.6893 59.462 5.29488 41.7433Z"
                    stroke="black" stroke-width="8.17668" stroke-miterlimit="10" />
                  <path
                    d="M45.8414 34.7728C47.4909 35.1985 48.8743 35.9967 49.9917 37.1141C51.1091 38.2847 51.854 39.9342 52.1201 42.0625C52.4926 44.8294 51.854 47.277 50.1513 49.5118C48.4486 51.6934 46.0542 53.2365 42.9681 54.141L43.6598 59.2492L37.6471 60.0473L36.9554 54.8328C33.6564 54.7264 30.9428 53.7686 28.708 52.0127C26.4732 50.2568 25.1429 47.9688 24.7173 45.0955L31.8473 44.2441C32.2198 45.8936 33.0711 47.1706 34.4546 48.022C35.838 48.8733 37.5407 49.1394 39.6159 48.8733C41.3186 48.6605 42.702 48.0752 43.6598 47.2238C44.6708 46.3725 45.0432 45.2551 44.8836 43.9781C44.7772 43.0735 44.3515 42.3818 43.713 41.9561C43.0213 41.4772 42.1167 41.2112 40.9993 41.0516C39.8819 40.8919 38.126 40.7323 35.838 40.5727C33.55 40.4662 31.5813 40.147 29.985 39.7213C28.3887 39.2424 27.0053 38.4443 25.8879 37.2737C24.7705 36.1031 24.0255 34.4004 23.7595 32.2188C23.387 29.6115 24.0255 27.2703 25.6218 25.1952C27.2181 23.12 29.4529 21.6301 32.3794 20.7788L31.6877 15.6175L37.7004 14.8193L38.3921 20.0871C41.3718 20.2467 43.9259 21.1512 46.001 22.7475C48.0762 24.397 49.3 26.5254 49.7257 29.1327L42.5956 30.0904C42.2232 28.6538 41.4782 27.5896 40.2544 26.8446C39.0838 26.0997 37.5939 25.8337 35.838 26.0997C34.2417 26.3126 32.9647 26.8446 32.1134 27.6428C31.2088 28.4409 30.8896 29.5051 31.0492 30.7289C31.1556 31.6335 31.5813 32.3252 32.2198 32.7509C32.8583 33.1766 33.7629 33.4426 34.8803 33.6554C35.9977 33.8151 37.7004 33.9747 39.9884 34.0811C42.2231 34.0811 44.1919 34.3472 45.8414 34.7728Z"
                    fill="currentColor" />
                  <path
                    d="M40.9984 74.1478C46.479 73.3497 51.6403 77.0744 52.4916 82.6081L57.0144 110.862L65.6876 109.479L71.7002 108.521L71.0085 104.158L69.7847 104.371C67.1242 104.796 64.6234 102.987 64.1977 100.327L61.0583 80.8522C59.5153 71.1149 50.3101 64.4637 40.5195 66.0068L40.9984 74.1478Z"
                    fill="currentColor" />
                  <path
                    d="M41.1593 74.1479L40.0951 66.0601C30.1982 66.0601 22.2168 74.0947 22.2168 83.9384V112.884H30.9963H37.1154V108.468H35.8384C33.1779 108.468 30.9963 106.286 30.9963 103.626V84.3109C30.9963 78.7239 35.5191 74.1479 41.1593 74.1479Z"
                    fill="currentColor" />
                </svg>
              </div>

              <!-- Texto y botón -->
              <div class="flex-1">
                <p class="text-sm font-bold text-black mb-3 leading-snug">
                  {{ notification.text }}
                </p>
                <div class="flex justify-end">
                  <button @click.stop="completarNotificacion(notification.id, $event)"
                    class="text-sm font-semibold px-5 py-2 rounded-full bg-white text-black shadow-sm hover:bg-gray-100 transition">
                    {{ notification.action }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Cuando no hay notificaciones -->
          <div v-if="notifications.length === 0" class="text-center py-10">
            <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i class="pi pi-check text-2xl text-gray-400" />
            </div>
            <p class="text-gray-600 font-medium text-sm">¡Todo está al día!</p>
            <p class="text-gray-400 text-xs">No hay notificaciones pendientes</p>
          </div>
        </div>


        <!-- <div class="p-4 border-t bg-gray-50">
          <button @click="verTodasNotificaciones($event)"
            class="w-full text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition">
            <i class="pi pi-external-link mr-2 text-sm" />
            Ver todas las notificaciones
          </button>
        </div> -->
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
import { notificationService } from '@/services/notificationService.js';
import AddCuenta from '@/views/pages/Notificaciones/CuentaBancaria/Desarrollo/AddCuenta.vue';
import OverlayBadge from 'primevue/overlaybadge';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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