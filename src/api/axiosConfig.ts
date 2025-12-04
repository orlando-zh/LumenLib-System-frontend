import axios, { type AxiosInstance } from 'axios';
import { userAuth } from '@/stores/authStore';

export const createApi = (baseURL: string): AxiosInstance => {
    const api = axios.create({
        baseURL,
        withCredentials: false,
        headers: {
            'Content-Type': 'application/json',
        }
    });

    api.interceptors.request.use(
        (config) => {
            const authStore = userAuth();

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

            if (error.response?.status === 401) {
                const authStore = userAuth();
                authStore.logout();
            }

            return Promise.reject(error);
        }
    );

    return api;
};

export const usersApi = createApi(import.meta.env.VITE_API_URL || 'http://localhost:4000');