// 1. La entidad completa (tal como viene de la Base de Datos)
export interface Autor {
    AutorID: number;
    Nombre: string;
    Nacionalidad: string;
}

// 2. DTO para Crear (Hereda todo de Autor, EXCEPTO el ID)
// Coincide con tu JSON de ejemplo.
export type CreateAuthorDTO = Omit<Autor, 'AutorID'>;

// 3. DTO para Actualizar (El ID es obligatorio, el resto es opcional)
export type UpdateAuthorDTO = Partial<CreateAuthorDTO>;