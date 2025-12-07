<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getAllAuthors, deleteAuthor } from '@/api/services/author.service';
import type { Autor } from '@/api/interfaces/author.interface';
import AddAuthorModal from "@/components/modals/AddAuthorModal.vue";
import EditAuthorModal from '@/components/modals/EditAuthorModal.vue';
import DeleteAuthorModal from '@/components/modals/DeleteAuthorModal.vue';
import { userAuth } from '@/stores/authStore';

import SearchBar from '@/components/ui/SearchBar.vue';

const authStore = userAuth();
const authors = ref<Autor[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');

// Estados de los modales
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const authorToEdit = ref<Autor | null>(null);
const isDeleteModalOpen = ref(false);
const authorToDelete = ref<Autor | null>(null);

const tableContainer = ref<HTMLElement | null>(null);

// Búsqueda dinámica
const searchTerm = ref('');
let searchTimeout: number | undefined = undefined;
const SEARCH_DELAY_MS = 400;

// Lógica de carga
const fetchAuthors = async (query: string) => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    authors.value = await getAllAuthors(query);
  } catch (error) {
    console.error("Error al cargar autores:", error);
    errorMsg.value = "Error al conectar con el servidor para obtener autores.";
  } finally {
    isLoading.value = false;
  }
};

// Debounce
const debouncedFetchAuthors = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchAuthors(searchTerm.value);
  }, SEARCH_DELAY_MS);
};

watch(searchTerm, () => {
  debouncedFetchAuthors();
});

// Manejadores
const handleEdit = (author: Autor) => {
  authorToEdit.value = author;
  isEditModalOpen.value = true;
};



const openDeleteModal = (author: Autor) => {
  authorToDelete.value = author;
  isDeleteModalOpen.value = true;
};


const handleConfirmDelete = async () => {
  if (!authorToDelete.value) return;

  try {
    await deleteAuthor(authorToDelete.value.AutorID);
    authors.value = authors.value.filter(
        a => a.AutorID !== authorToDelete.value!.AutorID
    );
    authorToDelete.value = null;
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error(error);
    errorMsg.value = "Error al eliminar. Verifique si el autor aún tiene libros asociados.";
    isDeleteModalOpen.value = false;
  }
};

// Cargar al montar
onMounted(() => {
  fetchAuthors('');
});
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">
    <div class="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
      <h1 class="text-xl font-bold">Gestión de Autores</h1>

      <div class="flex gap-3 w-full md:w-auto items-center">
        <SearchBar
            v-model="searchTerm"
            placeholder="Buscar autor por nombre..."
        />

        <button class="btn btn-primary btn-sm h-9" @click="isAddModalOpen = true">
          Crear Autor
        </button>
      </div>
    </div>

    <hr class="mb-4">

    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="errorMsg" class="alert alert-error text-sm my-4">
      <span>⚠️ {{ errorMsg }}</span>
    </div>

    <div
        v-else-if="authors.length > 0"
        ref="tableContainer"
        class="overflow-x-auto max-h-[500px] rounded-lg border border-base-200 mt-4"
    >
      <table class="table w-full">
        <thead class="bg-base-200 sticky top-0 z-10">
        <tr>
          <th>ID</th>
          <th class="min-w-[200px]">Nombre Completo</th>
          <th>Nacionalidad</th>
          <th class="text-center">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="author in authors" :key="author.AutorID">
          <td class="font-mono text-xs opacity-60">{{ author.AutorID }}</td>
          <td><div class="text-sm">{{ author.Nombre }}</div></td>
          <td>
              <span class="badge badge-sm badge-info badge-outline">
                {{ author.Nacionalidad }}
              </span>
          </td>
          <td class="text-center space-x-2">
            <button
                class="btn btn-sm btn-info"
                @click="handleEdit(author)"
            >
              Editar
            </button>

            <button v-if="authStore.isAdmin" class="btn btn-sm btn-error" @click="openDeleteModal(author)">
              Eliminar
            </button>

          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal de agregar -->
    <AddAuthorModal
        v-if="isAddModalOpen"
        @close="isAddModalOpen = false"
        @author-added="() => fetchAuthors(searchTerm)"
    />

    <!-- Modal de editar -->
    <EditAuthorModal
        v-if="isEditModalOpen && authorToEdit"
        :author="authorToEdit"
        @close="() => { isEditModalOpen = false; authorToEdit = null }"
        @author-updated="() => fetchAuthors(searchTerm)"
    />


    <DeleteAuthorModal
        v-if="authorToDelete"
    :author="authorToDelete"
    modal-id="delete_author_modal"
    @close="authorToDelete = null"
    @confirm="handleConfirmDelete"
    />

    <div v-if="!isLoading && authors.length === 0 && !errorMsg" class="text-center py-8 text-gray-500">
      No hay autores registrados aún.
    </div>
  </main>
</template>
