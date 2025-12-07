export interface ActiveLoan {
    PrestamoID: number;
    Usuario: string;
    Libro: string;
    LibroID: number;
    FechaPrestamo: string;
    DiasPrestado: number;
}


export interface LoanTransactionDTO {
    UsuarioID: number | null;
    LibroID: number | null;
}


export interface LoanCreatedResponse {
    PrestamoID: number;
    Usuario: string;
    Libro: string;
    LibroID: number;
    FechaPrestamo: string;
    DiasPrestado: number;
}