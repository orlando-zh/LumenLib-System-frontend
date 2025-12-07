import { usersApi } from '@/api/axiosConfig';
import type { Usuario, CreateUserDTO } from '@/api/interfaces/user.interface';

// Obtener todos los usuarios
export const getAllUsers = async (searchTerm?: string): Promise<Usuario[]> => {
    const params = searchTerm ? { nombre: searchTerm } : undefined;

    const response = await usersApi.get<Usuario[]>('/api/users', { params });
    return response.data;
};
// Crear usuario (Usando el DTO importado)
export const createUser = async (data: CreateUserDTO): Promise<Usuario> => {
    const response = await usersApi.post<Usuario>('/api/users', data);
    return response.data;
};

// Actualizar usuario
export const updateUser = async (id: number, data: Partial<Usuario>): Promise<Usuario> => {
    const response = await usersApi.put<Usuario>(`/api/users/${id}`, data);
    return response.data;
};

// Eliminar usuario
export const deleteUser = async (id: number): Promise<void> => {
    await usersApi.delete<void>(`/api/users/${id}`);
};

// Obtener un usuario por ID
export const getUserById = async (id: number): Promise<Usuario> => {
    const response = await usersApi.get<Usuario>(`/api/users/${id}`);
    return response.data;
};
