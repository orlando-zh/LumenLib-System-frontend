import { defineStore } from 'pinia';
import router from '@/router';
import authService from '@/api/services/authService';
import type { LoginCredentials, User } from '@/api/interfaces/auth.interfaces.ts'; // Ajusta ruta si es necesario

export const userAuth = defineStore('userAuth', {
    state: () => {
        // Recuperación segura del usuario
        const storedUser = sessionStorage.getItem('user');
        let parsedUser: User | null = null;

        if (storedUser && storedUser !== 'undefined') {
            try {
                parsedUser = JSON.parse(storedUser);
            } catch (e) {
                console.error("Error parsing user from storage:", e);
                parsedUser = null;
            }
        }

        return {
            user: parsedUser,
            token: sessionStorage.getItem('token') || null,
        }
    },

    actions: {
        async login(credentials: LoginCredentials) {
            try {
                // 1. Petición API
                const data = await authService.login(credentials);

                // 2. Actualizar Estado Pinia
                this.token = data.token;
                this.user = data.user;

                // 3. Persistencia
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data.user));

                // 4. Redirección CORRECTA y SEGURA
                // Usamos router.push con 'name' para evitar errores de URL string
                if (this.isStaff) {
                    // Antes tenías '/admin/dashboard' que daba 404.
                    // Ahora vamos a la ruta nombrada 'admin-home' (que es /admin)
                    await router.push({ name: 'admin-home' });
                } else {
                    // Antes ibas a '/' que rebotaba.
                    // Ahora vamos directo al catálogo.
                    await router.push({ name: 'reader-catalog' });
                }

            } catch (error: any) {
                console.error("Error en login action:", error);
                throw error;
            }
        },

        logout() {
            this.user = null;
            this.token = null;
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('token');

            // Redirigir al login usando nombre
            router.push({ name: 'login' });
        }
    },

    getters: {
        isAuthenticated: (state) => !!state.token,
        getUserRole: (state) => state.user?.Rol || '',

        isStaff: (state) => {
            const role = state.user?.Rol;
            return role === 'Admin' || role === 'Bibliotecario';
        },

        isLector: (state) => state.user?.Rol === 'Lector'
    }
});