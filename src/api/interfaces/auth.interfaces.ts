export interface LoginCredentials {
    email: string;
    password: string;
}


export type UserRole = 'Admin' | 'Bibliotecario' | 'Lector';


export interface User {
    UsuarioID: number;
    NombreCompleto: string;
    Email: string;
    Rol: UserRole;
}

export interface LoginResponse {
    token: string;
    user: User;
}