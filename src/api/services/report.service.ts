import { booksApi } from '@/api/axiosConfig';
import type { TopReader, CategoryStat, TopAuthor } from '@/api/interfaces/report.interface';

const BASE_ENDPOINT = '/api/library/reports';

export default {


    // GET /api/library/reports/top-readers
    // Obtiene la lista de usuarios con más préstamos.
    async getTopReaders(): Promise<TopReader[]> {
        const response = await booksApi.get<TopReader[]>(`${BASE_ENDPOINT}/top-readers`);
        return response.data;
    },


     // GET /api/library/reports/categories
     // Obtiene el conteo total de libros por categoría.
    async getCategoryStats(): Promise<CategoryStat[]> {
        const response = await booksApi.get<CategoryStat[]>(`${BASE_ENDPOINT}/categories`);
        return response.data;
    },

     //GET /api/library/reports/top-authors?min=N
     //Obtiene autores con un mínimo de libros (ejecuta SP dinámico).
    async getTopAuthors(minBooks: number = 2): Promise<TopAuthor[]> {
        // En Express, el endpoint era /top-authors, pero el URL es /top-authors/
        // Usamos /top-authors?min=N
        const response = await booksApi.get<TopAuthor[]>(`${BASE_ENDPOINT}/top-authors`, {
            params: { min: minBooks }
        });
        return response.data;
    },

};