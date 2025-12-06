export const BASE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

/**
 * Genera la URL completa para una imagen alojada en el backend.
 * @param path Ruta relativa de la imagen (ej: 'uploads/books/foto.jpg')
 * @returns URL absoluta (ej: 'http://localhost:4000/uploads/books/foto.jpg')
 */
export const getImageUrl = (path: string | null | undefined): string => {
    if (!path) return '';

    // Eliminamos la barra inicial '/' si existe en el path para evitar dobles slashes
    // al concatenar (por si la BD guarda '/uploads/...' o 'uploads/...')
    const cleanPath = path.replace(/^\//, '');

    return `${BASE_API_URL}/${cleanPath}`;
};
