import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import { authService } from '@/services/auth.js';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'landing',
            component: () => import('@/views/Landing.vue')
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/nosotros',
            name: 'nosotros',
            component: () => import('@/views/pages/auth/Nosotros/indexNosotros.vue')
        },
        {
            path: '/productos',
            name: 'productos',
            component: () => import('@/views/pages/auth/Producto/indexProducto.vue')
        },
        {
            path: '/contactanos',
            name: 'contactanos',
            component: () => import('@/views/pages/auth/Contactanos/indexContactanos.vue')
        },
        {
            path: '/blog',
            name: 'blog',
            component: () => import('@/views/pages/auth/blog/indexblog.vue')
        },
        {
            path: '/hipotecas',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'hipotecas',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'buscar',
                    name: 'hipotecas-search',
                    component: () => import('@/views/pages/Search/indexSearch.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'subasta',
                    name: 'hipotecas-online',
                    component: () => import('@/views/pages/OnlineAuctions/indexOnlineAuctions.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'dashboard',
                    name: 'hipotecas-dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'Cuenta-Bancaria',
                    name: 'hipotecas-cuenta-bancaria',
                    component: () => import('@/views/pages/CuentasBancaria/indexCuentasBancarias.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'Estado-Cuenta',
                    name: 'hipotecas-estado-cuenta',
                    component: () => import('@/views/pages/EstadoCuenta/indexEstadoCuenta.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'Perfil',
                    name: 'hipotecas-perfil',
                    component: () => import('@/views/pages/Profile/indexProfile.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'Confirmar-Cuenta',
                    name: 'hipotecas-confirmar-cuenta',
                    component: () => import('@/views/pages/ConfigurarCuenta/index.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            path: '/tasas-fijas',
            component: AppLayout,
            meta: { requiresAuth: true },
            children: [
                {
                    path: '',
                    name: 'tasas-fijas',
                    component: () => import('@/views/TasasFijas/Dashboard.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'Search',
                    name: 'tasas-fijas-Search',
                    component: () => import('@/views/TasasFijas/BuscarOportunidades.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'Cuenta-Bancaria',
                    name: 'tasas-fijas-Cuenta-Bancaria',
                    component: () => import('@/views/TasasFijas/CuentasBancaria/indexCuentasBancarias.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'Estado-Cuenta',
                    name: 'tasas-fijas-Estado-Cuenta',
                    component: () => import('@/views/TasasFijas/EstadoCuenta/indexEstadoCuenta.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
});

router.beforeEach((to, from, next) => {
    console.log('🔍 Router Guard ejecutado:');
    console.log('  - Desde:', from.path);
    console.log('  - Hacia:', to.path);
    console.log('  - Nombre de ruta:', to.name);
    
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
    console.log('  - Requiere auth:', requiresAuth);
    
    const isAuthenticated = authService.isAuthenticated();
    console.log('  - Está autenticado:', isAuthenticated);
    
    if (requiresAuth && !isAuthenticated) {
        console.log('🔒 Acceso denegado a área protegida, redirigiendo a login');
        next({ name: 'login' });
    } else if (to.name === 'login' && isAuthenticated) {
        console.log('✅ Ya autenticado, redirigiendo a dashboard');
        next({ name: 'hipotecas' });
    } else {
        console.log('✅ Navegación permitida');
        next();
    }
});

export default router;