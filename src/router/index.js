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
            path: '/registrarte',
            name: 'registro',
            component: () => import('@/views/pages/auth/Registro.vue')
        },
        {
            path: '/inversionistas/editar/:id',
            name: 'EditarInversionista',
            component: () => import('@/views/pages/auth/RegistroUpdate.vue')
        },
        {
            path: '/recuperacion',
            name: 'recuperacion',
            component: () => import('@/views/pages/auth/Recuperacion.vue')
        },
        {
            path: '/email/verify/:id?/:hash?',
            component: () => import('@/views/pages/auth/verificacion.vue')
        },
        {
            path: '/terminos-y-condiciones',
            name: 'terminoscondicones',
            component: () => import('@/views/pages/auth/TerminoCondiciones.vue')
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
            path: '/verificar-cuenta',
            name: 'VerificarCuenta',
            component: () => import('@/views/pages/auth/VerificarCuenta.vue')
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
        // SECCIÓN HIPOTECAS - Solo para inversionista y mixto
        {
            path: '/hipotecas',
            component: AppLayout,
            meta: { 
                requiresAuth: true,
                allowedUserTypes: ['inversionista', 'mixto'],
                section: 'hipotecas'
            },
            children: [
                {
                    path: '',
                    name: 'hipotecas',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'buscar',
                    name: 'hipotecas-search',
                    component: () => import('@/views/pages/Search/indexSearch.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'subasta',
                    name: 'hipotecas-online',
                    component: () => import('@/views/pages/OnlineAuctions/indexOnlineAuctions.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'dashboard',
                    name: 'hipotecas-dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Cuenta-Bancaria',
                    name: 'hipotecas-cuenta-bancaria',
                    component: () => import('@/views/pages/CuentasBancaria/indexCuentasBancarias.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Estado-Cuenta',
                    name: 'hipotecas-estado-cuenta',
                    component: () => import('@/views/pages/EstadoCuenta/indexEstadoCuenta.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Perfil',
                    name: 'hipotecas-perfil',
                    component: () => import('@/views/pages/Profile/indexProfile.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Confirmar-Cuenta',
                    name: 'hipotecas-confirmar-cuenta',
                    component: () => import('@/views/pages/ConfigurarCuenta/index.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                }
            ]
        },
        // SECCIÓN TASAS FIJAS - Solo para inversionista y mixto
        {
            path: '/tasas-fijas',
            component: AppLayout,
            meta: { 
                requiresAuth: true,
                allowedUserTypes: ['inversionista', 'mixto'],
                section: 'tasas-fijas'
            },
            children: [
                {
                    path: '',
                    name: 'tasas-fijas',
                    component: () => import('@/views/TasasFijas/Dashboard.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Search',
                    name: 'tasas-fijas-Search',
                    component: () => import('@/views/TasasFijas/BuscarOportunidades.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'dashboard',
                    name: 'tasas-fijas-dashboard',
                    component: () => import('@/views/TasasFijas/Dashboard.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Cuenta-Bancaria',
                    name: 'tasas-fijas-Cuenta-Bancaria',
                    component: () => import('@/views/TasasFijas/CuentasBancaria/indexCuentasBancarias.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Estado-Cuenta',
                    name: 'tasas-fijas-Estado-Cuenta',
                    component: () => import('@/views/TasasFijas/EstadoCuenta/indexEstadoCuenta.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Perfil',
                    name: 'tasas-fijas-perfil',
                    component: () => import('@/views/pages/Profile/indexProfile.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                },
                {
                    path: 'Confirmar-Cuenta',
                    name: 'tasas-fijas-confirmar-cuenta',
                    component: () => import('@/views/TasasFijas/ConfigurarCuenta/index.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['inversionista', 'mixto']
                    }
                }
            ]
        },
        // SECCIÓN CLIENTE - Solo para cliente y mixto
        {
            path: '/cliente',
            component: AppLayout,
            meta: { 
                requiresAuth: true,
                allowedUserTypes: ['cliente', 'mixto'],
                section: 'cliente'
            },
            children: [
                {
                    path: '',
                    name: 'cliente',
                    component: () => import('@/views/Cliente/Dashboard.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['cliente', 'mixto']
                    }
                },
                {
                    path: 'dashboard',
                    name: 'cliente-dashboard',
                    component: () => import('@/views/Cliente/Dashboard.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['cliente', 'mixto']
                    }
                },
                {
                    path: 'Cuenta-Bancaria',
                    name: 'cliente-Cuenta-Bancaria',
                    component: () => import('@/views/Cliente/CuentasBancaria/indexCuentasBancarias.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['cliente', 'mixto']
                    }
                },
                {
                    path: 'Estado-Cuenta',
                    name: 'cliente-Estado-Cuenta',
                    component: () => import('@/views/Cliente/EstadoCuenta/indexEstadoCuenta.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['cliente', 'mixto']
                    }
                },
                {
                    path: 'Perfil',
                    name: 'cliente-perfil',
                    component: () => import('@/views/pages/Profile/indexProfile.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['cliente', 'mixto']
                    }
                },
                {
                    path: 'Confirmar-Cuenta',
                    name: 'cliente-confirmar-cuenta',
                    component: () => import('@/views/Cliente/ConfigurarCuenta/index.vue'),
                    meta: { 
                        requiresAuth: true,
                        allowedUserTypes: ['cliente', 'mixto']
                    }
                }
            ]
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/'
        }
    ]
});

// Función helper para obtener el tipo de usuario
function getUserType() {
    const customer = authService.getCustomer();
    return customer?.type || null;
}

// Función helper para obtener la ruta por defecto según el tipo de usuario
function getDefaultRouteForUserType(userType) {
    switch (userType) {
        case 'cliente':
            return '/cliente';
        case 'inversionista':
            return '/hipotecas';
        case 'mixto':
            return '/hipotecas'; // Por defecto mixto va a hipotecas, pero puede acceder a ambas
        default:
            return '/';
    }
}

// Función helper para verificar si el usuario puede acceder a una ruta
function canAccessRoute(route, userType) {
    // Si la ruta no tiene restricciones de tipo, permitir acceso
    if (!route.meta?.allowedUserTypes) {
        return true;
    }
    
    // Verificar si el tipo de usuario está en la lista de tipos permitidos
    return route.meta.allowedUserTypes.includes(userType);
}

// Guard de navegación
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
        return;
    }
    
    if (to.name === 'login' && isAuthenticated) {
        console.log('✅ Ya autenticado, redirigiendo según tipo de usuario');
        const userType = getUserType();
        const defaultRoute = getDefaultRouteForUserType(userType);
        next(defaultRoute);
        return;
    }
    
    // Verificar permisos por tipo de usuario para rutas protegidas
    if (requiresAuth && isAuthenticated) {
        const userType = getUserType();
        console.log('  - Tipo de usuario:', userType);
        
        // Verificar si alguna ruta en el matched requiere permisos específicos
        const restrictedRoute = to.matched.find(record => 
            record.meta.allowedUserTypes && !record.meta.allowedUserTypes.includes(userType)
        );
        
        if (restrictedRoute) {
            console.log('🚫 Acceso denegado por tipo de usuario');
            console.log('  - Tipos permitidos:', restrictedRoute.meta.allowedUserTypes);
            console.log('  - Tipo actual:', userType);
            
            // Redirigir a la sección apropiada para el tipo de usuario
            const defaultRoute = getDefaultRouteForUserType(userType);
            
            // Mostrar mensaje de error (opcional)
            // Puedes agregar un toast aquí si tienes el servicio disponible
            
            next(defaultRoute);
            return;
        }
    }
    
    console.log('✅ Navegación permitida');
    next();
});

export default router;