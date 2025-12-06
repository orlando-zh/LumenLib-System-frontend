import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { userAuth } from '@/stores/authStore'
import { ROLES } from '@/constants/roles'

// --- VISTAS ---
import LoginView from '../components/ui/LoginView.vue'
import NotFound from '@/components/layouts/NotFound.vue'
import Unauthorized from '@/components/ui/Unauthorized.vue'
import DashboardAdmin from '@/views/DashboardAdmin.vue'
import HomeComponent from "@/components/layouts/HomeComponent.vue"
import LibraryStaffView from '@/components/ui/LibraryStaff.vue'
import LibraryBooks from '@/components/ui/LibraryBooks.vue'
import ReaderHomeView from '@/views/ReaderHomeView.vue'
import ReaderCatalog from "@/components/ui/ReaderCatalog.vue"
import ReaderHistory from "@/components/ui/ReaderHistory.vue"
import LibraryCategoriesView from "@/components/ui/LibraryCategoriesView.vue";
import LibraryAuthorsView from "@/components/ui/LibraryAuthorsView.vue";

const routes: Array<RouteRecordRaw> = [
    // 1. RAÍZ: Redirige al login (o el guardián lo moverá si ya hay sesión)
    {
        path: '/',
        name: 'root',
        redirect: { name: 'login' }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { guest: true } // Marca explicita para rutas de invitados
    },

    // --- ÁREA ADMINISTRATIVA (Staff) ---
    {
        path: '/admin',
        // Componente Layout principal del admin
        component: DashboardAdmin,
        // Meta en el padre protege a todos los hijos automáticamente
        meta: { requiresAuth: true, role: [ROLES.ADMIN, ROLES.BIBLIOTECARIO] },
        children: [
            {
                path: '', // /admin
                name: 'admin-home', // ESTE ES EL NOMBRE CLAVE
                component: HomeComponent
            },
            {
                path: 'staff', // /admin/staff
                name: 'admin-staff',
                component: LibraryStaffView
            },
            {
                path: 'categorias',
                name: 'admin-categories',
                component: LibraryCategoriesView
            },
            {
                path: 'autores',
                name: 'admin-authors',
                component: LibraryAuthorsView
            },
            {
                path: 'libros', // /admin/libros
                name: 'admin-books',
                component: LibraryBooks
            },
        ]
    },

    // --- ÁREA DE LECTOR ---
    {
        path: '/lector',
        component: ReaderHomeView,
        meta: { requiresAuth: true, role: [ROLES.LECTOR] },
        children: [
            {
                path: 'catalogo', // /lector/catalogo
                name: 'reader-catalog', // ESTE ES EL NOMBRE CLAVE
                component: ReaderCatalog
            },
            {
                path: 'historial', // /lector/historial
                name: 'reader-history',
                component: ReaderHistory
            },

            // Redirección por defecto: Si entra a /lector va al catálogo
            {
                path: '',
                redirect: { name: 'reader-catalog' }
            }
        ]
    },

    // --- ERRORES ---
    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: Unauthorized
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// --- GUARDIA DE NAVEGACIÓN PRO ---
router.beforeEach((to, from, next) => {
    const authStore = userAuth()
    const isAuthenticated = authStore.isAuthenticated
    const userRole = authStore.getUserRole

    // A. Si el usuario YA está logueado e intenta ir a Login o Raíz
    if (isAuthenticated && (to.name === 'login' || to.path === '/')) {
        if (authStore.isLector) {
            return next({ name: 'reader-catalog' })
        } else if (authStore.isStaff) {
            return next({ name: 'admin-home' })
        }
    }

    // B. Rutas que requieren autenticación
    if (to.meta.requiresAuth) {
        // 1. Si no está autenticado -> Login
        if (!isAuthenticated) {
            return next({ name: 'login' })
        }

        // 2. Validación de Roles
        if (to.meta.role) {
            const allowedRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]

            // Si el rol NO coincide
            if (!allowedRoles.includes(userRole as any)) {
                // Redirigir a su área segura en lugar de Unauthorized (Mejor UX)
                if (authStore.isLector) return next({ name: 'reader-catalog' })
                if (authStore.isStaff) return next({ name: 'admin-home' })

                return next({ name: 'unauthorized' })
            }
        }
    }

    next()
})

export default router