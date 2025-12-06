import { booksApi } from '@/api/axiosConfig';
import type { Libro, CreateBookDTO, UpdateBookDTO } from '@/api/interfaces/book.interface';

// Definimos la ruta base
const BOOKS_ENDPOINT = '/api/library/books';

/**
 * Helper para convertir el objeto DTO a FormData.
 * Esto es OBLIGATORIO porque el backend espera 'multipart/form-data' para la imagen.
 */
const toFormData = (data: CreateBookDTO | UpdateBookDTO): FormData => {
    const formData = new FormData();

    // Campos de texto (Siempre validamos que existan antes de agregar)
    if (data.Titulo) formData.append('Titulo', data.Titulo);
    if (data.ISBN) formData.append('ISBN', data.ISBN);

    // Números convertidos a String (FormData solo acepta string o blob)
    if (data.AnioPublicacion) formData.append('AnioPublicacion', String(data.AnioPublicacion));
    if (data.Stock !== undefined) formData.append('Stock', String(data.Stock));
    if (data.AutorID) formData.append('AutorID', String(data.AutorID));
    if (data.CategoriaID) formData.append('CategoriaID', String(data.CategoriaID));

    // Archivo de imagen (Solo si el usuario seleccionó uno)
    if (data.imagen) {
        formData.append('imagen', data.imagen);
    }

    return formData;
};

// 1. Obtener todos los libros (Con soporte para búsqueda por título)
export const getAllBooks = async (titulo?: string): Promise<Libro[]> => {
    // Si enviamos un título, axios lo pone como query param: ?titulo=...
    const params = titulo ? { titulo } : {};

    const response = await booksApi.get<Libro[]>(BOOKS_ENDPOINT, { params });
    return response.data;
};

// 2. Obtener un libro por ID
export const getBookById = async (id: number): Promise<Libro> => {
    const response = await booksApi.get<Libro>(`${BOOKS_ENDPOINT}/${id}`);
    return response.data;
};

// 3. Crear libro
export const createBook = async (data: CreateBookDTO): Promise<Libro> => {
    // Convertimos a FormData
    const formData = toFormData(data);

    // Axios detecta FormData y pone el header 'Content-Type': 'multipart/form-data' automáticamente,
    // pero es buena práctica indicarlo explícitamente si prefieres seguridad.
    const response = await booksApi.post<Libro>(BOOKS_ENDPOINT, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
};

// 4. Actualizar libro
export const updateBook = async (id: number, data: UpdateBookDTO): Promise<Libro> => {
    const formData = toFormData(data);

    const response = await booksApi.put<Libro>(`${BOOKS_ENDPOINT}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

    return response.data;
};

// 5. Eliminar libro
export const deleteBook = async (id: number): Promise<void> => {
    await booksApi.delete(`${BOOKS_ENDPOINT}/${id}`);
};