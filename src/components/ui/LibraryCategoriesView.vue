<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import categoryService from '@/api/services/category.service';
import type { Category } from '@/api/interfaces/category.interfaces';
import { userAuth } from '@/stores/authStore';

const authStore = userAuth();
import SearchBar from '@/components/ui/SearchBar.vue';
import AddCategoryModal from '@/components/modals/AddCategoryModal.vue';
import EditCategoryModal from '@/components/modals/EditCategoryModal.vue';
import DeleteCategoryModal from '@/components/modals/DeleteCategoryModal.vue';

const categories = ref<Category[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');

// Estados de los modales
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const categoryToEdit = ref<Category | null>(null);

const categoryToDelete = ref<Category | null>(null);

const tableContainer = ref<HTMLElement | null>(null);

// Búsqueda dinámica
const searchTerm = ref('');
let searchTimeout: number | undefined = undefined;
const SEARCH_DELAY_MS = 400;

// --- LÓGICA DE CARGA ---
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

// --- DEBOUNCE ---
const debouncedFetchCategories = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchCategories(searchTerm.value), SEARCH_DELAY_MS);
};

watch(searchTerm, () => debouncedFetchCategories());

// --- MANEJADORES ---
const handleEdit = (category: Category) => {
  categoryToEdit.value = category;
  isEditModalOpen.value = true;
};

const openDeleteModal = (category: Category) => {
  categoryToDelete.value = category;
};

const handleConfirmDelete = async () => {
  if (!categoryToDelete.value) return;

  try {
    await categoryService.delete(categoryToDelete.value.CategoriaID);
    categories.value = categories.value.filter(
        c => c.CategoriaID !== categoryToDelete.value!.CategoriaID
    );
    categoryToDelete.value = null;
  } catch (error) {
    console.error(error);
    errorMsg.value = "Error al eliminar. Verifique si la categoría está en uso.";
    categoryToDelete.value = null;
  }
};

const handleCategoryUpdated = () => {
  fetchCategories(); // recarga la tabla
};

// Cargar al montar
onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">

    <!-- HEADER -->
    <div class="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
      <h1 class="text-xl font-bold">Gestión de Categorías</h1>

      <div class="flex gap-3 w-full md:w-auto items-center">
        <SearchBar v-model="searchTerm" placeholder="Buscar por nombre..." />
        <button class="btn btn-primary btn-sm h-9" @click="isAddModalOpen = true">
          Crear Categoría
        </button>
      </div>
    </div>

    <hr class="mb-4" />

    <!-- LOADING / ERROR -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
    <div v-else-if="errorMsg" class="alert alert-error text-sm my-4">
      <span>⚠️ {{ errorMsg }}</span>
    </div>

    <!-- TABLE -->
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
          <td><div class="text-sm">{{ cat.NombreCategoria }}</div></td>
          <td class="text-center space-x-2">
            <button class="btn btn-sm btn-info" @click="handleEdit(cat)">Editar</button>
            <button v-if="authStore.isAdmin" class="btn btn-sm btn-error" @click="openDeleteModal(cat)">Eliminar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading" class="text-center py-8 text-gray-500">
      No hay categorías registradas aún.
    </div>

    <!-- MODALES -->
    <AddCategoryModal
        v-if="isAddModalOpen"
        @close="isAddModalOpen = false"
        @category-added="handleCategoryUpdated"
    />

    <EditCategoryModal
        v-if="isEditModalOpen && categoryToEdit"
        :category="categoryToEdit"
        @close="() => { isEditModalOpen = false; categoryToEdit = null }"
        @category-updated="handleCategoryUpdated"
    />

    <DeleteCategoryModal
        v-if="categoryToDelete"
        :category="categoryToDelete"
        @close="categoryToDelete = null"
        @confirm="handleConfirmDelete"
    />

  </main>
</template>
