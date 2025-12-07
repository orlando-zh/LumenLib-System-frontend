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
import LibraryCategoriesView from "@/components/ui/LibraryCategoriesView.vue";
import LibraryAuthorsView from "@/components/ui/LibraryAuthorsView.vue";
import ReaderHomeView from '@/views/ReaderHomeView.vue'
import ReaderCatalog from "@/components/ui/ReaderCatalog.vue"
import ReaderHistory from "@/components/ui/ReaderHistory.vue"

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'root',
        redirect: { name: 'login' }
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
        meta: { guest: true }
    },

    // --- ÁREA ADMINISTRATIVA ---
    {
        path: '/admin',
        component: DashboardAdmin,
        meta: { requiresAuth: true, role: [ROLES.ADMIN, ROLES.BIBLIOTECARIO] },
        children: [
            { path: '', name: 'admin-home', component: HomeComponent },
            { path: 'staff', name: 'admin-staff', component: LibraryStaffView },
            { path: 'categorias', name: 'admin-categories', component: LibraryCategoriesView },
            { path: 'autores', name: 'admin-authors', component: LibraryAuthorsView },
            { path: 'libros', name: 'admin-books', component: LibraryBooks },
        ]
    },

    // --- ÁREA DE LECTOR ---
    {
        path: '/lector',
        component: ReaderHomeView,
        meta: { requiresAuth: true, role: [ROLES.LECTOR] },
        children: [
            { path: 'catalogo', name: 'reader-catalog', component: ReaderCatalog },
            { path: 'historial', name: 'reader-history', component: ReaderHistory },
            { path: '', redirect: { name: 'reader-catalog' } }
        ]
    },

    // --- ERRORES ---
    { path: '/unauthorized', name: 'unauthorized', component: Unauthorized },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

// --- GUARDIA DE NAVEGACIÓN ---
router.beforeEach((to, from, next) => {
    const authStore = userAuth()
    const isAuthenticated = authStore.isAuthenticated
    const userRole = authStore.getUserRole

    if (isAuthenticated && (to.name === 'login' || to.path === '/')) {
        if (authStore.isLector) return next({ name: 'reader-catalog' })
        if (authStore.isStaff) return next({ name: 'admin-home' })
    }

    if (to.meta.requiresAuth) {
        if (!isAuthenticated) return next({ name: 'login' })
        if (to.meta.role) {
            const allowedRoles = Array.isArray(to.meta.role) ? to.meta.role : [to.meta.role]
            if (!allowedRoles.includes(userRole as any)) {
                if (authStore.isLector) return next({ name: 'reader-catalog' })
                if (authStore.isStaff) return next({ name: 'admin-home' })
                return next({ name: 'unauthorized' })
            }
        }
    }

    next()
})

export default router
