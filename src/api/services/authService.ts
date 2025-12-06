import { usersApi } from '@/api/axiosConfig';
import type { LoginCredentials, LoginResponse } from '@/api/interfaces/auth.interfaces.ts';

export default {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        // La ruta '/login' depende de tu backend
        const response = await usersApi.post<LoginResponse>('/api/auth/login', credentials);
        return response.data;
    }
}