<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import OverlayBadge from 'primevue/overlaybadge';
import AddCuenta from '@/views/pages/Notificaciones/CuentaBancaria/Desarrollo/AddCuenta.vue';

const showNotifications = ref(false);
const notificationsPanelRef = ref(null);
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

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value;
};

const completarNotificacion = (id) => {
  const notification = notifications.value.find(n => n.id === id);
  if (notification?.type === 'cuenta') {
    showAddCuentaDialog.value = true;
  } else {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }
};

const handleClickOutside = (event) => {
  const notificationsContainer = event.target.closest('.notifications-container');
  const clickedBell = event.target.closest('.layout-topbar-action');

  if (!notificationsContainer && !clickedBell) {
    showNotifications.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="layout-topbar">
    <div class="layout-topbar-actions">
      <!-- Campana con contador -->
      <div class="relative notifications-container">
        <button @click="toggleNotifications" class="layout-topbar-action relative group">
          <OverlayBadge :value="notifications.length">
            <div class="relative">
              <i class="pi pi-bell text-2xl transition-all duration-300 group-hover:scale-110"
                 :class="showNotifications ? 'text-[#FF4929]' : ''" />
              <div v-if="notifications.length > 0"
                   class="absolute -top-1 -right-1 w-3 h-3 bg-[#FF4929] rounded-full animate-pulse"></div>
            </div>
          </OverlayBadge>
        </button>

        <!-- Panel de notificaciones -->
        <div
          v-if="showNotifications"
          ref="notificationsPanelRef"
          class="absolute right-0 mt-3 w-[420px] bg-white border-0 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.15)] z-50 backdrop-blur-sm overflow-hidden"
          style="animation: slideDown 0.3s ease-out;"
        >
          <!-- Header -->
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
          <div
            :class="{ 'max-h-[400px] overflow-y-auto': notifications.length >= 4 }"
            class="p-4 space-y-3 bg-white"
          >
            <!-- Notificación -->
            <div
              v-for="(notification, index) in notifications"
              :key="notification.id"
              class="bg-white border-l-4 p-4 rounded-xl shadow-sm transition hover:shadow-md"
              :class="{
                'border-blue-500': notification.type === 'personal',
                'border-yellow-500': notification.type === 'cuenta',
                'border-green-500': notification.type === 'deposito',
                'border-gray-300': !['personal', 'cuenta', 'deposito'].includes(notification.type)
              }"
            >
              <div class="flex items-start gap-4">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center"
                  :class="{
                    'bg-blue-100 text-blue-600': notification.type === 'personal',
                    'bg-yellow-100 text-yellow-600': notification.type === 'cuenta',
                    'bg-green-100 text-green-600': notification.type === 'deposito',
                    'bg-gray-100 text-gray-600': !['personal', 'cuenta', 'deposito'].includes(notification.type)
                  }"
                >
                  <i :class="notification.icon + ' text-lg'" />
                </div>
                <div class="flex-1">
                  <p class="text-sm text-gray-800 mb-2 leading-snug">{{ notification.text }}</p>
                  <div class="flex justify-end">
                    <button
                      @click="completarNotificacion(notification.id)"
                      class="text-xs font-semibold px-4 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                    >
                      {{ notification.action }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sin notificaciones -->
            <div v-if="notifications.length === 0" class="text-center py-10">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <i class="pi pi-check text-2xl text-gray-400" />
              </div>
              <p class="text-gray-600 font-medium text-sm">¡Todo está al día!</p>
              <p class="text-gray-400 text-xs">No hay notificaciones pendientes</p>
            </div>
          </div>

          <!-- Footer -->
          <div class="p-4 border-t bg-gray-50">
            <button
              class="w-full text-sm font-semibold text-gray-700 border border-gray-300 rounded-xl py-2 hover:bg-gray-100 transition"
            >
              <i class="pi pi-external-link mr-2 text-sm" />
              Ver todas las notificaciones
            </button>
          </div>
        </div>
      </div>

      <!-- Botón menú adicional -->
      <button
        class="layout-topbar-menu-button layout-topbar-action"
        v-styleclass="{
          selector: '@next',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-scalein',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeout',
          hideOnOutsideClick: true
        }"
      >
        <i class="pi pi-ellipsis-v"></i>
      </button>

      <!-- Perfil -->
      <div class="layout-topbar-menu hidden lg:block">
        <div class="layout-topbar-menu-content">
          <button type="button" class="layout-topbar-action">
            <i class="pi pi-user"></i>
            <span>Perfil</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para agregar cuenta -->
  <AddCuenta
    :visible="showAddCuentaDialog"
    @update:visible="val => showAddCuentaDialog = val"
  />
</template>

<style scoped>
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Scroll personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}
.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
