<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'; // ⬅️ AGREGAMOS 'watch'
import { getAllAuthors, deleteAuthor } from '@/api/services/author.service';
import type { Autor } from '@/api/interfaces/author.interface';
import SearchBar from '@/components/ui/SearchBar.vue'; // ⬅️ Importamos el buscador

const authors = ref<Autor[]>([]); // Array de Autores
const isLoading = ref(true);
const errorMsg = ref('');
const isModalOpen = ref(false);
const tableContainer = ref<HTMLElement | null>(null);

// 🆕 ESTADO Y LÓGICA DE BÚSQUEDA DINÁMICA
const searchTerm = ref('');
let searchTimeout: number | undefined = undefined;
const SEARCH_DELAY_MS = 400;


// Lógica de carga (Acepta el query)
const fetchAuthors = async (query: string) => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    // ⬅️ Pasamos el término de búsqueda al servicio
    authors.value = await getAllAuthors(query);
  } catch (error) {
    console.error("Error al cargar autores:", error);
    errorMsg.value = "Error al conectar con el servidor para obtener autores.";
  } finally {
    isLoading.value = false;
  }
};

// LÓGICA DE DEBOUNCING
const debouncedFetchAuthors = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  searchTimeout = setTimeout(() => {
    fetchAuthors(searchTerm.value);
  }, SEARCH_DELAY_MS);
};

// 3. Vigilar el cambio de searchTerm y ejecutar el Debounce
watch(searchTerm, () => {
  debouncedFetchAuthors();
});

// Manejadores de acciones
const handleEdit = (author: Autor) => {
  console.log(`Editar Autor: ${author.Nombre}`);
  isModalOpen.value = true;
};

const handleDelete = async (id: number) => {
  if (!confirm('¿Está seguro de que desea eliminar este autor? Esta acción no se puede deshacer.')) return;

  try {
    await deleteAuthor(id);
    authors.value = authors.value.filter(a => a.AutorID !== id);
    console.log(`Autor ID: ${id} eliminado.`);
  } catch (error) {
    console.error("Error al eliminar autor:", error);
    errorMsg.value = "Error al eliminar. Verifique si el autor aún tiene libros asociados.";
  }
};


// Cargar al montar el componente
onMounted(() => {
  fetchAuthors('');
});
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">

    <div class="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
      <h1 class="text-xl font-bold">✍️ Gestión de Autores</h1>

      <div class="flex gap-3 w-full md:w-auto items-center">
        <SearchBar
            v-model="searchTerm"
            placeholder="Buscar autor por nombre..."
        />

        <button class="btn btn-primary btn-sm h-9" @click="isModalOpen = true">
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

          <td>
            <div class="text-sm">{{ author.Nombre }}</div>
          </td>

          <td>
            <span class="badge badge-sm badge-info badge-outline">
              {{ author.Nacionalidad }}
            </span>
          </td>

          <td class="text-center space-x-2">
            <button
                class="btn btn-ghost btn-xs text-info"
                @click="handleEdit(author)"
            >
              Editar
            </button>
            <button
                class="btn btn-ghost btn-xs text-error"
                @click="handleDelete(author.AutorID)"
            >
              Eliminar
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading" class="text-center py-8 text-gray-500">
      No hay autores registrados aún.
    </div>

  </main>
</template>