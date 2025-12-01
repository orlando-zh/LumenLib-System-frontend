import type { UserRole } from '@/constants/roles';

export interface Usuario {
    UsuarioID: number;
    NombreCompleto: string;
    Email: string;
    Rol: UserRole;
    PasswordHash?: string;
    FechaCreacion?: string;
    FechaActualizacion?: string;
}