import { defineStore } from 'pinia'

interface User {
    UsuarioID: number;
    NombreCompleto: string;
    Email: string;
    Rol: string; // Backend devuelve 'Admin', 'Lector', etc.
}

export const userAuth = defineStore('userAuth', {
    state: () => {
        const storedUser = sessionStorage.getItem('user');
        let parsedUser: User | null = null;
        if (storedUser && storedUser !== 'undefined') {
            try {
                parsedUser = JSON.parse(storedUser);
            } catch (e) {
                console.error("Error al leer usuario del storage:", e);
                parsedUser = null;
            }
        }

        return {
            user: parsedUser,
            token: sessionStorage.getItem('token') || null,
        }
    },
    actions: {
        login(userData: User, token: string) {
            this.user = userData
            this.token = token
            sessionStorage.setItem('user', JSON.stringify(userData))
            sessionStorage.setItem('token', token)
        },
        logout() {
            this.user = null
            this.token = null
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
            window.location.href = '/login'
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token,
        getUserRole: (state) => {
            const role = state.user?.Rol || '';
            return role;
        },
        getToken: (state) => state.token
    }
})