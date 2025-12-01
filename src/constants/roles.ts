export const ROLES = {
    ADMIN: 'Admin',
    BIBLIOTECARIO: 'Bibliotecario',
    LECTOR: 'Lector',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];