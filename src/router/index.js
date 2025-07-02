import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/Search',
                    name: 'search',
                    component: () => import('@/views/pages/Search/indexSearch.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/Online',
                    name: 'online',
                    component: () => import('@/views/pages/OnlineAuctions/indexOnlineAuctions.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/Cuenta-Bancaria',
                    name: 'cuenta-bancaria',
                    component: () => import('@/views/pages/CuentasBancaria/indexCuentasBancarias.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/Estado-Cuenta',
                    name: 'estado-cuenta',
                    component: () => import('@/views/pages/EstadoCuenta/indexEstadoCuenta.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/Perfil',
                    name: 'perfil',
                    component: () => import('@/views/pages/Profile/indexProfile.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/Confirmar-Cuenta',
                    name: 'confirmar-cuenta',
                    component: () => import('@/views/pages/ConfigurarCuenta/index.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
});
export default router;
