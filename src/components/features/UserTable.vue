<script setup lang="ts">
import type { Usuario } from '@/api/interfaces/user.interface'


interface Props {
  users: Usuario[]
  loading?: boolean
}

interface Emits {
  (e: 'edit', user: Usuario): void
  (e: 'delete', userId: number): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const getRoleBadgeClass = (rol: string) => {
  switch (rol) {
    case 'Admin':
      return 'badge-error'
    case 'Bibliotecario':
      return 'badge-warning'
    case 'Lector':
      return 'badge-info'
    default:
      return 'badge-ghost'
  }
}

const formatDate = (date?: string) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center p-12">
      <span class="loading loading-spinner loading-lg"></span>
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="text-center p-12">
      <div class="text-gray-400 text-lg">
        <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <p class="font-semibold">No hay usuarios registrados</p>
        <p class="text-sm mt-2">Comienza agregando un nuevo usuario</p>
      </div>
    </div>

    <!-- Table -->
    <table v-else class="table table-zebra">
      <thead>
        <tr>
          <th class="bg-base-200">ID</th>
          <th class="bg-base-200">Nombre Completo</th>
          <th class="bg-base-200">Email</th>
          <th class="bg-base-200">Rol</th>
          <th class="bg-base-200">Fecha Creación</th>
          <th class="bg-base-200 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.UsuarioID" class="hover">
          <td class="font-mono text-sm">{{ user.UsuarioID }}</td>
          <td class="font-medium">{{ user.NombreCompleto }}</td>
          <td class="text-sm text-gray-600">{{ user.Email }}</td>
          <td>
            <span class="badge" :class="getRoleBadgeClass(user.Rol)">
              {{ user.Rol }}
            </span>
          </td>
          <td class="text-sm text-gray-500">
            {{ formatDate(user.FechaCreacion) }}
          </td>
          <td class="text-center">
            <div class="flex gap-2 justify-center">
              <button
                @click="emit('edit', user)"
                class="btn btn-sm btn-ghost btn-square"
                title="Editar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                @click="emit('delete', user.UsuarioID)"
                class="btn btn-sm btn-ghost btn-square text-error"
                title="Eliminar"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>