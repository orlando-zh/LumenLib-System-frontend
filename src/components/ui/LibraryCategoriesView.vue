<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import categoryService from '@/api/services/category.service';
import type { Category } from '@/api/interfaces/category.interfaces';
import SearchBar from '@/components/ui/SearchBar.vue'; // Componente de búsqueda

const categories = ref<Category[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');
const isModalOpen = ref(false);
const searchTerm = ref(''); // Variable vigilada
const tableContainer = ref<HTMLElement | null>(null);

// Constantes para el Debounce
let searchTimeout: number | undefined = undefined;
const SEARCH_DELAY_MS = 400;

// --- LÓGICA DE CARGA (FETCH) ---
const fetchCategories = async (query = '') => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    categories.value = await categoryService.getAll(query);
  } catch (error) {
    console.error("Error al cargar categorías:", error);
    errorMsg.value = "Error al conectar con el servidor para obtener categorías.";
  } finally {
    isLoading.value = false;
  }
};

// --- LÓGICA DE DEBOUNCING (OBSERVER) ---

const debouncedFetchCategories = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  searchTimeout = setTimeout(() => {
    fetchCategories(searchTerm.value);
  }, SEARCH_DELAY_MS);
};

// 3. Vigilar el cambio de searchTerm (se actualiza gracias al v-model)
watch(searchTerm, () => {
  debouncedFetchCategories();
});

// --- MANEJADORES DE ACCIONES ---

const handleEdit = (category: Category) => {
  console.log(`Editar categoría: ${category.NombreCategoria}`);
  isModalOpen.value = true;
};

const handleDelete = (id: number) => {
  console.log(`Eliminar categoría ID: ${id}`);
};

const handleCategoryUpdated = () => {
  fetchCategories(); // Recarga los datos
};


// Cargar al montar el componente
onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">

    <div class="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
      <h1 class="text-xl font-bold">Gestión de Categorías</h1>

      <div class="flex gap-3 w-full md:w-auto items-center">
        <SearchBar
            v-model="searchTerm"
            placeholder="Buscar por nombre..."
        />

        <button class="btn btn-primary btn-sm h-9" @click="isModalOpen = true">
          Crear Categoría
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
        v-else-if="categories.length > 0"
        ref="tableContainer"
        class="overflow-x-auto max-h-[500px] rounded-lg border border-base-200 mt-4"
    >
      <table class="table w-full">
        <thead class="bg-base-200 sticky top-0 z-10">
        <tr>
          <th>ID</th>
          <th class="min-w-[250px]">Nombre de Categoría</th>
          <th class="text-center">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="cat in categories" :key="cat.CategoriaID">
          <td class="font-mono text-xs opacity-60">{{ cat.CategoriaID }}</td>

          <td>
            <div class="text-sm">{{ cat.NombreCategoria }}</div>
            <div class="text-xs opacity-50"></div>
          </td>

          <td class="text-center">
            <button
                class="btn btn-ghost btn-xs text-info"
                @click="handleEdit(cat)"
            >
              Editar
            </button>
            <button
                class="btn btn-ghost btn-xs text-error"
                @click="handleDelete(cat.CategoriaID)"
            >
              Eliminar
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading" class="text-center py-8 text-gray-500">
      No hay categorías registradas aún.
    </div>

  </main>
</template>