import api from '../axiosConfig';
import type { AxiosResponse } from 'axios';
import { userAuth } from '@/stores/authStore';
import type { Usuario } from '../interfaces/user.interface';

export interface CreateUserDTO {
    NombreCompleto: string;
    Email: string;
    Password: string;
    Rol?: string;
}

export const userService = {

    async getAllUsers(): Promise<Usuario[] | null> {
        const authStore = userAuth();
        const token = authStore.token;

        try {
            const response = await api.get<Usuario[]>('/usuarios', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            return null;
        }
    },


    async createUser(data: CreateUserDTO): Promise<AxiosResponse<Usuario>> {
        const authStore = userAuth();
        const token = authStore.token;

        try {
            return await api.post<Usuario>('/usuarios', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },


    async updateUser(id: number, data: Partial<Usuario>): Promise<AxiosResponse<Usuario>> {
        const authStore = userAuth();
        const token = authStore.token;

        try {
            return await api.put<Usuario>(`/usuarios/${id}`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    async deleteUser(id: number): Promise<AxiosResponse<void>> {
        const authStore = userAuth();
        const token = authStore.token;

        try {
            return await api.delete<void>(`/usuarios/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    }
};