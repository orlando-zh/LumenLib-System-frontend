<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Libro } from '@/api/interfaces/book.interface';
import { getAllBooks, deleteBook } from '@/api/services/book.service';
import AddBookModal from '@/components/modals/AddBookModal.vue';
import EditBookModal from '@/components/modals/EditBookModal.vue';
import SearchBar from '@/components/ui/SearchBar.vue';


const showDeleteModal = ref(false);
const bookToDelete = ref<Libro | null>(null)
const searchTerm = ref('');
const showModal = ref(false);
const showEditModal = ref(false);
const bookToEdit = ref<Libro | null>(null);
const books = ref<Libro[]>([]);
const isLoading = ref(true);
let searchTimeout: number | undefined = undefined;
const SEARCH_DELAY_MS = 400;



// Función para traer los libros de la API
const fetchBooks = async (query = '') => {
  try {
    isLoading.value = true;
    const data = await getAllBooks(query);
    books.value = data || [];
  } catch (error) {
    console.error('Error fetching books:', error);
  } finally {
    isLoading.value = false;
  }
};



const debouncedFetchBooks = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchBooks(searchTerm.value);
  }, SEARCH_DELAY_MS);
};

// Watch sobre searchTerm
watch(searchTerm, () => {
  debouncedFetchBooks();
});

// Manejador: Cuando se crea un libro, cerramos modal y recargamos la tabla
const handleBookAdded = () => {
  showModal.value = false;
  fetchBooks();
};

// Abrir modal de edición
const openEditModal = (book: Libro) => {
  bookToEdit.value = book;
  showEditModal.value = true;
};


const openDeleteModal = (book: Libro) => {
  bookToDelete.value = book;
  showDeleteModal.value = true;
};

// Manejar actualizaciones del libro
const handleBookUpdated = (updated: Libro) => {
  showEditModal.value = false;
  bookToEdit.value = null;

  const idx = books.value.findIndex(b => b.LibroID === updated.LibroID);

  if (idx !== -1) {
    books.value.splice(idx, 1, updated);
    books.value = books.value.slice(); // Forzar reactividad
  } else {
    fetchBooks(); // Si no está en la lista, recargar
  }
};

const handleBookDeleted = async () => {
  if (!bookToDelete.value) return;

  try {
    await deleteBook(bookToDelete.value.LibroID);
    books.value = books.value.filter(b => b.LibroID !== bookToDelete.value?.LibroID);
    bookToDelete.value = null;
    showDeleteModal.value = false;
  } catch (error) {
    console.error('Error eliminando libro:', error);
  }
};


// Cargar al montar el componente
onMounted(() => {
  fetchBooks();
});
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">

    <div class="flex justify-between items-center mb-4">
      <h1 class="text-xl font-bold">Catálogo de Libros</h1>
      <div class="flex gap-2">
        <SearchBar v-model="searchTerm" placeholder="Buscar por título" />
        <button class="btn btn-primary btn-sm" @click="showModal = true">Agregar Libro</button>
      </div>
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
          <th>Autor</th>
          <th>Categoría</th>
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
      <span
          class="badge badge-sm"
          :class="book.Stock > 0 ? 'badge-success badge-outline' : 'badge-error'"
      >
        {{ book.Stock }}
      </span>
          </td>
          <td class="text-sm">{{ book.NombreAutor }}</td>
          <td class="text-xs opacity-50">{{ book.NombreCategoria }}</td>
          <td class="text-center space-x-2">
            <button class="btn btn-sm btn-info" @click="openEditModal(book)">
              Editar
            </button>
            <button class="btn btn-sm btn-error" @click="openDeleteModal(book)">
              Eliminar
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading" class="text-center py-8 text-gray-500">
      No hay libros registrados aún.
    </div>

    <!-- Modal de agregar libro -->
    <AddBookModal
      v-if="showModal"
      @close="showModal = false"
      @book-added="handleBookAdded"
    />

    <!-- Modal de editar libro -->
    <EditBookModal
      v-if="showEditModal && bookToEdit"
      :book="bookToEdit"
      @close="showEditModal = false"
      @book-updated="handleBookUpdated"
    />

    <DeleteBookModal
        v-if="showDeleteModal && bookToDelete"
        :book="bookToDelete"
        modal-id="deleteBookModal"
        @close="showDeleteModal = false"
        @confirm="handleBookDeleted"
    />



  </main>
</template>
