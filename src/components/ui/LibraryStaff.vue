<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Usuario } from '@/api/interfaces/user.interface';
import { getAllUsers } from '@/api/services/user.service'; // Vite resuelve el .ts automáticamente
import UserModal from '@/components/modals/UserModal.vue'; //  IMPORTA EL MODAL
import EditUserModal from '@/components/modals/EditUserModal.vue';

const showModal = ref(false); // CONTROLAR EL MODAL
const showEditModal = ref(false);
const userToEdit = ref<Usuario | null>(null);


const isLoading = ref(true);
const users = ref<Usuario[]>([]);

const fetchUsers = async () => {
  try {
    isLoading.value = true;
    const data = await getAllUsers();
    if (data) {
      users.value = data;
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleSavedUser = () => {
  showModal.value = false;
  fetchUsers(); // Recarga la tabla con el nuevo usuario
};

const openEditModal = (user: Usuario) => {
  userToEdit.value = user;
  showEditModal.value = true;
};

const handleUserUpdated = () => {
  showEditModal.value = false;
  userToEdit.value = null;
  fetchUsers(); // Recarga la tabla con datos actualizados
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">

    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold">Catálogo de Usuarios</h1>

      <button class="btn btn-primary btn-sm" @click="showModal = true">
      Agregar Usuario
    </button>

    </div>

    <div v-if="isLoading" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div
        v-else-if="users.length > 0"
        ref="tableContainer"
        class="overflow-x-auto max-h-[500px] rounded-lg border border-base-200 mt-4"
    >
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
          <td>{{ user.UsuarioID }}</td>

          <td>
            <div> {{ user.NombreCompleto }} </div>
            <div class="text-xs opacity-50"> Registrado el: {{ user.FechaCreacion?.substring(0, 10) || 'N/A' }}</div>

          </td>

          <td>{{ user.Email }}</td>

          <td>
              <span>
                {{ user.Rol }}
              </span>
          </td>

          <td class="text-center">
            <button class="btn btn-ghost btn-xs" @click="openEditModal(user)">Editar</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else-if="!isLoading">
      No hay usuarios para mostrar.
    </div>
    <UserModal
      v-if="showModal"
      @close="showModal = false"
      @saved="handleSavedUser"
    />

    <EditUserModal
      v-if="showEditModal && userToEdit"
      :user="userToEdit"
      @close="showEditModal = false"
      @saved="handleUserUpdated"
    />

  </main>


</template>