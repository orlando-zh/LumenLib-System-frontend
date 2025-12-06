<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getAllBooks } from '@/api/services/book.service';
import type { Libro } from '@/api/interfaces/book.interface';
import { getImageUrl } from '@/utils/constants';

const searchTerm = ref('');
const books = ref<Libro[]>([]);
const isLoading = ref(false);
const errorMsg = ref('');
let searchTimeout: number | undefined = undefined;
const SEARCH_DELAY_MS = 400;

const loadBooks = async (query: string) => { // Acepta el query como argumento
  isLoading.value = true;
  errorMsg.value = '';
  try {
    books.value = await getAllBooks(query);
  } catch (error) {
    console.error("Error al cargar catálogo:", error);
    errorMsg.value = "No se pudo conectar con la biblioteca.";
  } finally {
    isLoading.value = false;
  }
};

const debouncedLoadBooks = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    loadBooks(searchTerm.value);
  }, SEARCH_DELAY_MS);
};


watch(searchTerm, () => {
  debouncedLoadBooks();
});


onMounted(() => {
  loadBooks('');
});
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
      <div>
        <h2 class="text-3xl font-bold text-primary">Catálogo de Libros</h2>
        <p class="text-gray-500">Explora nuestra colección disponible.</p>
      </div>

      <div class="form-control w-full md:w-auto">
        <div class="input-group">
          <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por título..."
              class="input input-bordered w-full md:w-80"

          />
          <button class="btn btn-square btn-ghost" @click="debouncedLoadBooks">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <span class="loading loading-dots loading-lg text-primary"></span>
    </div>

    <div v-else-if="errorMsg" class="alert alert-error my-4">
      <span>{{ errorMsg }}</span>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div v-for="book in books" :key="book.LibroID" class="card card-compact bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-base-200">

        <figure class="h-48 bg-base-200 overflow-hidden relative">
          <img
              v-if="book.ImagenURL"
              :src="getImageUrl(book.ImagenURL)"
              :alt="book.Titulo"
              class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-neutral text-neutral-content">
            <span class="text-4xl font-bold opacity-30">📖</span>
          </div>

          <div class="absolute top-2 right-2 badge badge-secondary shadow-md">
            {{ book.NombreCategoria }}
          </div>
        </figure>

        <div class="card-body">
          <h3 class="card-title text-lg leading-tight truncate" :title="book.Titulo">
            {{ book.Titulo }}
          </h3>
          <p class="text-sm text-gray-500 font-medium">{{ book.NombreAutor }}</p>

          <div class="flex justify-between items-end mt-2">
            <div class="text-xs opacity-70">
              Año: {{ book.AnioPublicacion }}
            </div>

            <div v-if="book.Stock > 0" class="badge badge-outline badge-success gap-1">
              {{ book.Stock }} Disp.
            </div>
            <div v-else class="badge badge-outline badge-error">
              Agotado
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-if="!isLoading && !errorMsg && books.length === 0" class="text-center py-20 opacity-50">
      <p class="text-2xl font-bold">No se encontraron libros </p>
      <p>Intenta con otra búsqueda.</p>
    </div>
  </div>
</template>