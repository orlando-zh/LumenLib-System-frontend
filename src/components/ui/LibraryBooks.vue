<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Libro } from '@/api/interfaces/book.interface';
import { getAllBooks } from '@/api/services/book.service'; // Importamos el servicio
import AddBookModal from '@/components/modals/AddBookModal.vue';

const showModal = ref(false);
const isLoading = ref(true);
const books = ref<Libro[]>([]);

// Función para traer los libros de la API
const fetchBooks = async () => {
  try {
    isLoading.value = true;
    const data = await getAllBooks();
    if (data) {
      books.value = data;
    }
  } catch (error) {
    console.error('Error fetching books:', error);
  } finally {
    isLoading.value = false;
  }
};

// Manejador: Cuando se crea un libro, cerramos modal y recargamos la tabla
const handleBookAdded = () => {
  showModal.value = false;
  fetchBooks(); // Recarga los datos frescos de la API
};

// Cargar al montar el componente
onMounted(() => {
  fetchBooks();
});
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">

    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold">Catálogo de Libros</h1>
      <button class="btn btn-primary btn-sm" @click="showModal = true">
        Agregar Libro
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div
        v-else-if="books.length > 0"
        ref="tableContainer"
        class="overflow-x-auto max-h-[500px] rounded-lg border border-base-200 mt-4"
    >
      <table class="table w-full">
        <thead class="bg-base-200 sticky top-0 z-10">
        <tr>
          <th>ID</th>
          <th class="min-w-[200px]">Título</th>
          <th>ISBN</th>
          <th class="text-center">Stock</th>
          <th>AutorID</th>
          <th class="text-center">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="book in books" :key="book.LibroID">
          <td class="font-mono text-xs opacity-60">{{ book.LibroID }}</td>

          <td>
            <div class="text-sm">{{ book.Titulo }}</div>
            <div class="text-xs opacity-50">Publicado: {{ book.AnioPublicacion }}</div>
          </td>

          <td class="text-sm font-mono">{{ book.ISBN }}</td>

          <td class="text-center">
              <span class="badge badge-sm" :class="book.Stock > 0 ? 'badge-success badge-outline' : 'badge-error'">
                {{ book.Stock }}
              </span>
          </td>

          <td>
            <div class="text-sm">Autor: {{ book.AutorID }}</div>
            <div class="text-xs opacity-50">Cat: {{ book.CategoriaID }}</div>
          </td>

          <td class="text-center">
            <button class="btn btn-ghost btn-xs">Editar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading" class="text-center py-8 text-gray-500">
      No hay libros registrados aún.
    </div>

    <AddBookModal
        v-if="showModal"
        @close="showModal = false"
        @book-added="handleBookAdded"
    />

  </main>
</template>