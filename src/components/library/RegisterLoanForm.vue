<script setup lang="ts">
import { ref, onMounted } from 'vue'
import loanService from '@/api/services/loan.service'
import userService from '@/api/services/user.service'
import bookService from '@/api/services/book.service'

import type { User } from '@/api/interfaces/user.interface'
import type { Book } from '@/api/interfaces/book.interface'
import type { LoanTransactionDTO } from '@/api/interfaces/loans.interface'

// --- State ---
const users = ref<User[]>([])
const books = ref<Book[]>([])
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Form
const form = ref<LoanTransactionDTO>({
  UsuarioID: null,
  LibroID: null
})

// --- Fetch data ---
onMounted(async () => {
  try {
    users.value = await userService.getReaders()     // Solo lectores
    books.value = await bookService.getAvailable()   // Libros disponibles
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Error cargando datos iniciales'
  }
})

// --- Submit ---
const registerLoan = async () => {
  if (!form.value.UsuarioID || !form.value.LibroID) {
    errorMessage.value = 'Debe seleccionar usuario y libro.'
    return
  }

  loading.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await loanService.createLoan(form.value)

    successMessage.value = 'Préstamo registrado correctamente.'
    form.value.UsuarioID = null
    form.value.LibroID = null
  } catch (error) {
    errorMessage.value = 'No se pudo registrar el préstamo.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="card bg-base-100 shadow-xl p-6">
    <h2 class="text-2xl font-bold mb-4">Registrar Préstamo</h2>

    <!-- Mensajes -->
    <p v-if="successMessage" class="text-green-600 mb-2">{{ successMessage }}</p>
    <p v-if="errorMessage" class="text-red-600 mb-2">{{ errorMessage }}</p>

    <form @submit.prevent="registerLoan" class="space-y-4">

      <!-- Usuario -->
      <div>
        <label class="label">
          <span class="label-text">Seleccionar Usuario</span>
        </label>
        <select
            v-model="form.UsuarioID"
            class="select select-bordered w-full"
        >
          <option disabled value="">Seleccione un usuario</option>
          <option v-for="u in users" :key="u.UsuarioID" :value="u.UsuarioID">
            {{ u.NombreCompleto }}
          </option>
        </select>
      </div>

      <!-- Libro -->
      <div>
        <label class="label">
          <span class="label-text">Seleccionar Libro</span>
        </label>
        <select
            v-model="form.LibroID"
            class="select select-bordered w-full"
        >
          <option disabled value="">Seleccione un libro</option>
          <option v-for="l in books" :key="l.LibroID" :value="l.LibroID">
            {{ l.Titulo }}
          </option>
        </select>
      </div>

      <!-- Botón -->
      <button
          class="btn btn-primary w-full"
          :disabled="loading"
      >
        <span v-if="loading" class="loading loading-spinner"></span>
        Registrar Préstamo
      </button>
    </form>
  </div>
</template>
