import axios, { type AxiosInstance } from 'axios';
import { userAuth } from '@/stores/authStore';

// Función fábrica para crear instancias de API con interceptores
export const createApi = (baseURL: string): AxiosInstance => {
    const api = axios.create({
        baseURL,
        withCredentials: false,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    // --- INTERCEPTOR DE REQUEST (Inyectar Token) ---
    api.interceptors.request.use(
        (config) => {
            const authStore = userAuth();

            // Si existe un token en Pinia, lo agregamos al header
            if (authStore.token) {
                config.headers.Authorization = `Bearer ${authStore.token}`;
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    // --- INTERCEPTOR DE RESPONSE (Manejo de errores globales) ---
    api.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error('API Error:', error.response?.data || error.message);

            // Si el backend dice "No autorizado" (Token vencido o falso)
            if (error.response?.status === 401) {
                const authStore = userAuth();
                authStore.logout(); // Limpiamos todo y mandamos al login
            }

            return Promise.reject(error);
        }
    );

    return api;
};

// --- EXPORTACIÓN DE INSTANCIAS ---


const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const usersApi = createApi(BASE_URL);
export const booksApi = createApi(BASE_URL);