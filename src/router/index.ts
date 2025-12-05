import { createRouter, createWebHistory } from 'vue-router'
import { userAuth } from '@/stores/authStore'
import { ROLES } from '@/constants/roles'
import LoginView from '../views/LoginView.vue'
import DashboardAdmin from '@/views/DashboardAdmin.vue'
import HomeComponent from "@/components/layouts/HomeComponent.vue";
import LibraryStaffView from '@/components/ui/LibraryStaff.vue'
import LibraryBooks from '@/components/ui/LibraryBooks.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'root',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        },
        {
            path: '/admin',
            name: 'admin',
            component: DashboardAdmin,
            meta: { requiresAuth: true, role: [ROLES.ADMIN, ROLES.BIBLIOTECARIO] },
            children: [
                { path: '', name: 'admin-home', component: HomeComponent, meta: { requiresAuth: true, role: [ROLES.ADMIN, ROLES.BIBLIOTECARIO]}},
                { path: 'staff', name: 'admin-staff', component: LibraryStaffView, meta: {requiresAuth: true, role: [ROLES.ADMIN, ROLES.BIBLIOTECARIO]}},
                { path: 'libros', name: 'admin-books', component: LibraryBooks,  meta: {requiresAuth: true, role: [ROLES.ADMIN, ROLES.BIBLIOTECARIO]}},
            ]
        },

        {
            path: '/:pathMatch(.*)*',
            redirect: '/login'
        }
    ],
})

router.beforeEach((to, from, next) => {
    const authStore = userAuth()
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return next('/login')
    }
    if (to.meta.requiresAuth && to.meta.role) {
        const userRole = authStore.getUserRole
        const allowedRoles = Array.isArray(to.meta.role)
            ? to.meta.role
            : [to.meta.role]
        // Comparamos String con String (Ej: ¿["Admin", "Bibliotecario"] incluye "Lector"?)
        if (!allowedRoles.includes(userRole)) {
            // Si no tiene permiso, lo mandamos al login o a una pagina de error
            return next('/login')
        }
    }

    next()
})

export default router