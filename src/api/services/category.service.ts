import { booksApi } from '@/api/axiosConfig';
import type { Category, CategoryDTO } from '@/api/interfaces/category.interfaces';

// Definimos la ruta base para no repetirla
const ENDPOINT = '/api/library/categories';

export default {


    async getAll(nombre?: string): Promise<Category[]> {
        // Axios permite pasar parámetros query (lo que va después del ?) usando 'params'
        const params = nombre ? { nombre } : {};

        const response = await booksApi.get<Category[]>(ENDPOINT, { params });
        return response.data;
    },


    async getById(id: number): Promise<Category> {
        const response = await booksApi.get<Category>(`${ENDPOINT}/${id}`);
        return response.data;
    },

    async create(data: CategoryDTO): Promise<Category> {
        const response = await booksApi.post<Category>(ENDPOINT, data);
        return response.data;
    },

    async update(id: number, data: CategoryDTO): Promise<Category> {
        const response = await booksApi.put<Category>(`${ENDPOINT}/${id}`, data);
        return response.data;
    },
    async delete(id: number): Promise<void> {
        await booksApi.delete(`${ENDPOINT}/${id}`);
    }
};