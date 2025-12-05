<script setup lang="ts">
import { ref } from 'vue'
import type { Libro } from '@/api/interfaces/book.interface'
import AddBookModal from '@/components/modals/AddBookModal.vue'

const showModal = ref(false)
const books = ref<Libro[]>([])

// Puedes reemplazar esto por fetch a tu API cuando lo tengas
const loadMockBooks = () => {
  books.value = [
    {
      LibroID: 1,
      Titulo: 'Ejemplo: Aprendiendo Vue',
      ISBN: '978-1234567890',
      AnioPublicacion: 2023,
      Stock: 5,
      AutorID: 1,
      CategoriaID: 1
    }
  ]
}

const handleBookAdded = (book: Libro) => {
  books.value.push(book)
}

loadMockBooks()
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">

    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold">Catálogo de Libros</h1>

      <button class="btn btn-primary btn-sm" @click="showModal = true">Agregar Libro</button>

    </div>

    <div v-if="books.length === 0" class="text-center py-8">
      <p class="text-gray-500">No hay libros registrados aún.</p>
    </div>

    <div v-else class="overflow-x-auto max-h-[600px] rounded-lg border border-base-200 mt-4">
      <table class="table w-full">
        <thead class="bg-base-200 sticky top-0 z-10">
          <tr>
            <th>LibroID</th>
            <th>Título</th>
            <th>ISBN</th>
            <th>Año</th>
            <th>Stock</th>
            <th>AutorID</th>
            <th>CategoriaID</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in books" :key="book.LibroID">
            <td class="font-mono text-sm">{{ book.LibroID }}</td>
            <td class="font-medium">{{ book.Titulo }}</td>
            <td class="text-sm">{{ book.ISBN }}</td>
            <td class="text-sm">{{ book.AnioPublicacion }}</td>
            <td class="text-sm">{{ book.Stock }}</td>
            <td class="text-sm">{{ book.AutorID }}</td>
            <td class="text-sm">{{ book.CategoriaID }}</td>
            <td class="text-center">
              <button class="btn btn-ghost btn-xs">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AddBookModal v-if="showModal" @close="showModal = false" @book-added="handleBookAdded" />

  </main>
</template>