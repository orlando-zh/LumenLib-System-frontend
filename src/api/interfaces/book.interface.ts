export interface Libro {
  LibroID: number
  Titulo: string
  ISBN: string
  AnioPublicacion: number
  Stock: number
  AutorID: number
  CategoriaID: number
}

export interface CreateBookDTO {
  Titulo: string
  ISBN: string
  AnioPublicacion: number
  Stock: number
  AutorID: number
  CategoriaID: number
}
