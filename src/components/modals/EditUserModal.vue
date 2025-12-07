<script setup lang="ts">
import { ref } from 'vue'
import { updateUser } from '@/api/services/user.service'
import type { Usuario } from '@/api/interfaces/user.interface'

interface Props {
  user: Usuario
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'saved'])

const form = ref({
  NombreCompleto: props.user.NombreCompleto,
  Email: props.user.Email,
  Password: '',
  Rol: props.user.Rol
})

const isSaving = ref(false)
const errors = ref<Record<string, string>>({})

const validateForm = () => {
  errors.value = {}
  
  if (!form.value.NombreCompleto.trim()) {
    errors.value.NombreCompleto = 'El nombre completo es requerido'
  }
  if (!form.value.Email.trim()) {
    errors.value.Email = 'El email es requerido'
  }
  
  return Object.keys(errors.value).length === 0
}

const saveUser = async () => {
  if (!validateForm()) return

  isSaving.value = true

  try {
    const body = {
      NombreCompleto: form.value.NombreCompleto,
      Email: form.value.Email,
      Password: form.value.Password || undefined,
      Rol: form.value.Rol
    }

    await updateUser(props.user.UsuarioID, body)

    errors.value = {}

    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    errors.value.submit = 'Error al actualizar el usuario. Intenta de nuevo.'
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  form.value = {
    NombreCompleto: props.user.NombreCompleto,
    Email: props.user.Email,
    Password: '',
    Rol: props.user.Rol
  }
  errors.value = {}
  emit('close')
}
</script>

<template>
  <dialog class="modal modal-open">
    <div class="modal-box w-full max-w-md">
      <!-- Título -->
      <h3 class="font-bold text-lg mb-6">Editar Usuario</h3>

      <!-- Formulario -->
      <form @submit.prevent="saveUser" class="space-y-4">
        
        <!-- Nombre Completo -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Nombre Completo</span>
          </label>
          <input 
            type="text" 
            placeholder="Ej: Juan Pérez"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.NombreCompleto }"
            v-model="form.NombreCompleto"
            required
          />
          <label v-if="errors.NombreCompleto" class="label">
            <span class="label-text-alt text-error">{{ errors.NombreCompleto }}</span>
          </label>
        </div>

        <!-- Email -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Email</span>
          </label>
          <input 
            type="email" 
            placeholder="Ej: juan@example.com"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.Email }"
            v-model="form.Email"
            required
          />
          <label v-if="errors.Email" class="label">
            <span class="label-text-alt text-error">{{ errors.Email }}</span>
          </label>
        </div>

        <!-- Contraseña -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Contraseña</span>
          </label>
          <input 
            type="password" 
            placeholder="••••••••"
            class="input input-bordered w-full"
            :class="{ 'input-error': errors.Password }"
            v-model="form.Password"
          />
          <label class="label">
            <span class="label-text-alt text-xs">Déjalo vacío para no cambiarla</span>
          </label>
        </div>

        <!-- Rol -->
        <div class="form-control">
          <label class="label">
            <span class="label-text font-semibold">Rol</span>
          </label>
          <select class="select select-bordered w-full" v-model="form.Rol">
            <option value="Admin">Admin</option>
            <option value="Bibliotecario">Bibliotecario</option>
            <option value="Lector">Lector</option>
          </select>
        </div>

        <!-- Error general -->
        <div v-if="errors.submit" class="alert alert-error">
          <span>{{ errors.submit }}</span>
        </div>

        <!-- Botones -->
        <div class="modal-action mt-6">
          <button 
            type="button"
            class="btn btn-ghost" 
            @click="closeModal"
            :disabled="isSaving"
          >
            Cancelar
          </button>

          <button 
            type="submit"
            class="btn btn-primary"
            :disabled="isSaving"
          >
            <span v-if="isSaving" class="loading loading-spinner loading-sm"></span>
            {{ isSaving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Backdrop para cerrar -->
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal" />
    </form>
  </dialog>
</template>
