import axios, { type AxiosInstance } from 'axios';

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
            return config;
        },
        (error) => Promise.reject(error)
    );

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            console.error('API Error:', error.response?.data || error.message);

            if (error.response?.status === 401) {
                // window.location.href = '/login';
            }

            return Promise.reject(error);
        }
    );

    return api;
};

export const usersApi = createApi(import.meta.env.VITE_API_URL || 'http://localhost:4000');

export default usersApi;