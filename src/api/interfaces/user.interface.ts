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

export interface CreateUserDTO {
    NombreCompleto: string;
    Email: string;
    Password: string;
    Rol?: string;
}