// 1. Reporte Top Lectores (VistaTopLectores)
export interface TopReader {
    UsuarioID: number;
    NombreCompleto: string;
    Email: string;
    TotalLibrosPrestados: number;
}

// 2. Reporte Estadísticas por Categoría (VistaConteoPorCategoria)
export interface CategoryStat {
    NombreCategoria: string;
    CantidadLibros: number;
}

// 3. Reporte Top Autores (sp_ObtenerAutoresTop)
export interface TopAuthor {
    Nombre: string;
    TotalLibros: number;
}