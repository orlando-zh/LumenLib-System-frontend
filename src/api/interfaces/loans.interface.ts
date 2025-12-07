export interface ActiveLoan {
    PrestamoID: number;
    Usuario: string;
    Libro: string;
    LibroID: number;
    FechaPrestamo: string;
    DiasPrestado: number;
}

export interface LoanHistory {
    PrestamoID: number;
    LibroID: number;
    Titulo: string;
    ISBN: string;
    FechaPrestamo: string;
    FechaDevolucion: string | null;
    Estado: string;
    DiasTranscurridos: number | null;
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