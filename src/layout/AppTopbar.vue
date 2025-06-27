<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import AppConfigurator from './AppConfigurator.vue';
import OverlayBadge from 'primevue/overlaybadge';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const showNotifications = ref(false);
const notificationsPanelRef = ref(null); // Referencia al panel

// Notificaciones dinámicas
const notifications = ref([
    {
        id: 1,
        icon: 'pi pi-user',
        text: 'Te recordamos que aún tienes pendiente completar los datos Personales. Complétalos para continuar usando la web',
        action: 'Completar'
    },
    {
        id: 2,
        icon: 'pi pi-wallet',
        text: 'Aún no tienes ninguna cuenta bancaria asociada. Agrega una para continuar usando la web',
        action: 'Agregar cuenta'
    },
    {
        id: 3,
        icon: 'pi pi-dollar',
        text: 'Aún no tienes ningún movimiento. Realiza un depósito para continuar usando la web',
        action: 'Depositar'
    }
]);

// Mostrar/ocultar el panel desde la campanita
const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
};

// Eliminar una notificación
const completarNotificacion = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id);
};

// Cierre automático al hacer clic fuera
const handleClickOutside = (event) => {
    const clickedInsidePanel = notificationsPanelRef.value?.contains(event.target);
    const clickedBell = event.target.closest('.layout-topbar-action');

    if (!clickedInsidePanel && !clickedBell) {
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
            <div class="relative">
                <button @click="toggleNotifications" class="layout-topbar-action">
                    <OverlayBadge :value="notifications.length">
                        <i class="pi pi-bell text-2xl" />
                    </OverlayBadge>
                </button>

                <!-- Panel de notificaciones -->
                <div
                    v-if="showNotifications"
                    ref="notificationsPanelRef"
                    class="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50"
                >
                    <ul
                        :class="{ 'max-h-[400px] overflow-y-auto': notifications.length >= 4 }"
                        class="p-4 space-y-4"
                    >
                        <!-- Lista de notificaciones -->
                        <li
                            v-for="notification in notifications"
                            :key="notification.id"
                            class="bg-[#FF4929] text-white rounded-xl p-5 shadow-md transition hover:brightness-105"
                        >
                            <div class="flex items-start gap-3">
                                <i :class="notification.icon + ' text-3xl'" />
                                <div class="flex-1 text-sm leading-relaxed">
                                    {{ notification.text }}
                                </div>
                            </div>
                            <div class="mt-4 flex justify-end">
                                <button
                                    @click="completarNotificacion(notification.id)"
                                    class="bg-white text-black text-sm font-semibold px-4 py-2 rounded-full hover:bg-gray-100 transition shadow"
                                >
                                    {{ notification.action }}
                                </button>
                            </div>
                        </li>

                        <!-- Si no hay notificaciones -->
                        <li v-if="notifications.length === 0" class="text-center text-gray-500 text-sm">
                            No hay notificaciones pendientes
                        </li>
                    </ul>

                    <!-- Botón Ver más notificaciones -->
                    <div class="px-4 pt-2 pb-4">
                        <button
                            class="w-full text-center text-lg font-semibold text-[#FF4929] border-2 border-[#FF4929] rounded-full py-2 hover:bg-[#ff49291a] transition shadow-sm"
                        >
                            Ver más notificaciones
                        </button>
                    </div>
                </div>
            </div>

            <!-- Menú adicional -->
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
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
