// 1. Lo que RECIBES del Backend (GET)
export interface Category {
    CategoriaID: number;
    NombreCategoria: string;
}

// 2. Lo que ENVÍAS para Crear o Editar (POST / PUT)
export interface CategoryDTO {
    NombreCategoria: string;
}