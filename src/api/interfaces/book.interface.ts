export interface Libro {
    LibroID: number;
    Titulo: string;
    ISBN: string;
    AnioPublicacion: number;
    Stock: number;
    ImagenURL: string | null;

    // Datos expandidos (JOINs de la vista)
    AutorID: number;
    NombreAutor: string;
    CategoriaID: number;
    NombreCategoria: string;
}

// LO QUE ENVÍAS AL BACKEND (POST/PUT)
export interface CreateBookDTO {
    Titulo: string;
    ISBN: string;
    AnioPublicacion: number; // El service lo pasará a string
    Stock: number;           // El service lo pasará a string
    AutorID: number;
    CategoriaID: number;
    imagen?: File | null;    // El archivo binario
}

export type UpdateBookDTO = Partial<CreateBookDTO>;