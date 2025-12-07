<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Usuario } from '@/api/interfaces/user.interface';
import { getAllUsers, deleteUser } from '@/api/services/user.service';
import UserModal from '@/components/modals/UserModal.vue';
import EditUserModal from '@/components/modals/EditUserModal.vue';
import DeleteUserModal from '@/components/modals/DeleteUserModal.vue';
import SearchBar from '@/components/ui/SearchBar.vue';
import { userAuth } from '@/stores/authStore';

const authStore = userAuth();
// Tabla y búsqueda
const users = ref<Usuario[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');
const searchTerm = ref('');
let searchTimeout: number | undefined;
const SEARCH_DELAY_MS = 400;

// Modales
const isAddModalOpen = ref(false);
const isEditModalOpen = ref(false);
const userToEdit = ref<Usuario | null>(null);

const isDeleteModalOpen = ref(false);
const userToDelete = ref<Usuario | null>(null);

// --- FETCH USERS ---
const fetchUsers = async (query = '') => {
  try {
    isLoading.value = true;
    const data = await getAllUsers(query);
    users.value = data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    errorMsg.value = 'Error al cargar usuarios.';
  } finally {
    isLoading.value = false;
  }
};

// --- DEBOUNCE ---
const debouncedFetchUsers = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => fetchUsers(searchTerm.value), SEARCH_DELAY_MS);
};
watch(searchTerm, () => debouncedFetchUsers());

// --- MANEJADORES ---
const handleSavedUser = () => {
  isAddModalOpen.value = false;
  fetchUsers();
};

const openEditModal = (user: Usuario) => {
  userToEdit.value = user;
  isEditModalOpen.value = true;
};

const handleUserUpdated = () => {
  isEditModalOpen.value = false;
  userToEdit.value = null;
  fetchUsers();
};

const openDeleteModal = (user: Usuario) => {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
};

const handleConfirmDelete = async () => {
  if (!userToDelete.value) return;

  try {
    await deleteUser(userToDelete.value.UsuarioID);
    users.value = users.value.filter(u => u.UsuarioID !== userToDelete.value!.UsuarioID);
    userToDelete.value = null;
    isDeleteModalOpen.value = false;
  } catch (error) {
    console.error(error);
    errorMsg.value = 'Error al eliminar el usuario.';
    isDeleteModalOpen.value = false;
  }
};

// --- ON MOUNT ---
onMounted(() => fetchUsers());
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">

    <div class="flex flex-col md:flex-row items-center justify-between mb-4 gap-3">
      <h1 class="text-xl font-bold">Catálogo de Usuarios</h1>
      <div class="flex gap-3 w-full md:w-auto items-center">
        <SearchBar v-model="searchTerm" placeholder="Buscar por nombre" />
        <button
            v-if="authStore.isAdmin"
            class="btn btn-primary btn-sm h-9"
            @click="isAddModalOpen = true">
          Agregar Usuario
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

    <div v-else-if="users.length > 0" class="overflow-x-auto max-h-[500px] rounded-lg border border-base-200 mt-4">
      <table class="table w-full">
        <thead class="bg-base-200 sticky top-0 z-10">
        <tr>
          <th>ID</th>
          <th class="min-w-[200px]">Nombre Completo</th>
          <th>Email</th>
          <th>Rol</th>
          <th class="text-center">Acciones</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in users" :key="user.UsuarioID">
          <td class="font-mono text-xs opacity-60">{{ user.UsuarioID }}</td>
          <td>{{ user.NombreCompleto }}</td>
          <td>{{ user.Email }}</td>
          <td>{{ user.Rol }}</td>
          <td class="text-center space-x-2">
            <button  v-if="authStore.isStaff"  class="btn btn-sm btn-info" @click="openEditModal(user)">Editar</button>
            <button  v-if="authStore.isAdmin"  class="btn btn-sm btn-error" @click="openDeleteModal(user)">Eliminar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading" class="text-center py-8 text-gray-500">
      No hay usuarios para mostrar.
    </div>

    <!-- MODALES -->
    <UserModal
        v-if="isAddModalOpen"
        @close="isAddModalOpen = false"
        @saved="handleSavedUser"
    />

    <EditUserModal
        v-if="isEditModalOpen && userToEdit"
        :user="userToEdit"
        @close="() => { isEditModalOpen = false; userToEdit = null }"
        @saved="handleUserUpdated"
    />

    <DeleteUserModal
        v-if="userToDelete"
        :user="userToDelete"
        modal-id="delete_user_modal"
        @close="userToDelete = null"
        @confirm="handleConfirmDelete"
    />
  </main>
</template>
