// author.service.ts
import { booksApi } from '@/api/axiosConfig'; // Usamos la instancia de Axios configurada
import type { Autor, CreateAuthorDTO, UpdateAuthorDTO } from '@/api/interfaces/author.interface.ts';

// Definimos la ruta base para no repetirla en cada función
const AUTHORS_ENDPOINT = '/api/library/authors';

// 1. Obtener todos los autores
export const getAllAuthors = async (nombre?: string): Promise<Autor[]> => {
    // Si se envía un nombre, lo ponemos en los params
    const params = nombre ? { nombre } : {};

    const response = await booksApi.get<Autor[]>(AUTHORS_ENDPOINT, { params });
    return response.data;
};

// 2. Obtener un autor por ID
export const getAuthorById = async (id: number): Promise<Autor> => {
    const response = await booksApi.get<Autor>(`${AUTHORS_ENDPOINT}/${id}`);
    return response.data;
};

// 3. Crear autor (Usando el DTO)
export const createAuthor = async (data: CreateAuthorDTO): Promise<Autor> => {
    // Enviamos el DTO de creación (sin el ID)
    const response = await booksApi.post<Autor>(AUTHORS_ENDPOINT, data);
    return response.data;
};

// 4. Actualizar autor
export const updateAuthor = async (id: number, data: UpdateAuthorDTO): Promise<Autor> => {
    // Necesitas el ID en la URL y el DTO parcial en el cuerpo (body)
    const response = await booksApi.put<Autor>(`${AUTHORS_ENDPOINT}/${id}`, data);
    return response.data;
};

// 5. Eliminar autor
export const deleteAuthor = async (id: number): Promise<void> => {
    await booksApi.delete(`${AUTHORS_ENDPOINT}/${id}`);
};