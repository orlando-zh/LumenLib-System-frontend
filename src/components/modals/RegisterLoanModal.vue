<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { isAxiosError } from 'axios';


import { getAllUsers } from '@/api/services/user.service'
import { getAllBooks } from '@/api/services/book.service'
import loanService from '@/api/services/loan.service'
import type { Usuario } from '@/api/interfaces/user.interface'
import type { Libro } from '@/api/interfaces/book.interface'
import type { LoanTransactionDTO } from '@/api/interfaces/loans.interface'
import SearchBar from '@/components/ui/SearchBar.vue'

const emit = defineEmits<{ (e: 'saved'): void }>()

// --- Estado ---
const users = ref<Usuario[]>([])
const books = ref<Libro[]>([])
const modalRef = ref<HTMLDialogElement | null>(null)
const selectedUser = ref<number | null>(null)
const selectedBook = ref<number | null>(null)
const userSearch = ref('')
const bookSearch = ref('')
const errorMessage = ref('')

// --- Carga de datos ---
const fetchData = async () => {
  try {
    const [usersData, booksData] = await Promise.all([getAllUsers(), getAllBooks()])
    users.value = usersData
    books.value = booksData
  } catch (error) {
    console.error("Error cargando datos", error)
  }
}

onMounted(fetchData)

// --- Computados (Filtros) ---
const filteredUsers = computed(() => {
  if (!userSearch.value) return users.value
  const term = userSearch.value.toLowerCase()
  return users.value.filter(u => u.NombreCompleto.toLowerCase().includes(term))
})

const filteredBooks = computed(() => {
  let list = books.value
  if (bookSearch.value) {
    const term = bookSearch.value.toLowerCase()
    list = list.filter(b => b.Titulo.toLowerCase().includes(term))
  }
  return list
})

// --- Acciones ---
function open() {
  selectedUser.value = null
  selectedBook.value = null
  userSearch.value = ''
  bookSearch.value = ''
  errorMessage.value = ''
  modalRef.value?.showModal()
}

function close() {
  modalRef.value?.close()
}

defineExpose({ open, close })

async function submitLoan() {
  if (!selectedUser.value || !selectedBook.value) return
  errorMessage.value = ''

  const dto: LoanTransactionDTO = {
    UsuarioID: Number(selectedUser.value),
    LibroID: Number(selectedBook.value)
  };

  try {
    await loanService.createLoan(dto);
    books.value = await getAllBooks();
    close();
    emit('saved');

  } catch (error) {
    console.error("Error al registrar préstamo:", error);

    if (isAxiosError(error)) {
      const backendMsg = error.response?.data?.message;

      errorMessage.value = backendMsg
          ? ` ${backendMsg}`
          : 'Error de comunicación con el servidor.';
    } else {
      errorMessage.value = 'Ocurrió un error inesperado en la aplicación.';
    }
  }
}
</script>

<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box w-11/12 max-w-5xl h-[80vh] flex flex-col p-0 overflow-hidden bg-base-100">

      <div class="px-6 py-4 border-b border-base-200 flex justify-between items-center bg-base-100 shrink-0">
        <h3 class="font-bold text-lg">Registrar Préstamo</h3>
        <button @click="close" class="btn btn-sm btn-circle btn-ghost">✕</button>
      </div>

      <div v-if="errorMessage" class="px-6 pt-4 shrink-0">
        <div role="alert" class="alert alert-error text-sm py-2 shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <div class="flex-1 p-4 overflow-hidden bg-base-100">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">

          <div class="flex flex-col h-full min-h-0 border border-base-300 rounded-lg overflow-hidden">
            <div class="p-3 bg-base-200/50 border-b border-base-200 shrink-0">
              <label class="label text-sm font-bold pt-0 pb-1">1. Usuario</label>
              <SearchBar v-model="userSearch" placeholder="Buscar usuario..." />
            </div>

            <div class="flex-1 overflow-y-auto p-2 space-y-1 bg-base-100">
              <button
                  v-for="user in filteredUsers"
                  :key="user.UsuarioID"
                  @click="selectedUser = user.UsuarioID"
                  class="w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex justify-between items-center"
                  :class="selectedUser === user.UsuarioID ? 'bg-primary text-primary-content font-medium' : 'hover:bg-base-200'"
              >
                <span>{{ user.NombreCompleto }}</span>
                <span v-if="selectedUser === user.UsuarioID">✓</span>
              </button>
            </div>
          </div>

          <div class="flex flex-col h-full min-h-0 border border-base-300 rounded-lg overflow-hidden">
            <div class="p-3 bg-base-200/50 border-b border-base-200 shrink-0">
              <label class="label text-sm font-bold pt-0 pb-1">2. Libro</label>
              <SearchBar v-model="bookSearch" placeholder="Buscar libro..." />
            </div>

            <div class="flex-1 overflow-y-auto p-2 space-y-1 bg-base-100">
              <button
                  v-for="book in filteredBooks"
                  :key="book.LibroID"
                  @click="book.Stock > 0 ? selectedBook = book.LibroID : null"
                  class="w-full text-left px-3 py-3 rounded-md text-sm transition-colors flex justify-between items-center"
                  :class="[
                  selectedBook === book.LibroID ? 'bg-secondary text-secondary-content font-medium' : 'hover:bg-base-200',
                  book.Stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                ]"
              >
                <div class="flex-1 min-w-0 pr-2">
                  <div class="truncate">{{ book.Titulo }}</div>
                  <div class="text-xs opacity-70 truncate">{{ book.NombreAutor }}</div>
                </div>
                <span class="badge badge-sm shrink-0 font-mono">Stock: {{ book.Stock }}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      <div class="px-6 py-4 border-t border-base-200 bg-base-100 flex justify-end gap-2 shrink-0">
        <button class="btn" @click="close">Cancelar</button>
        <button
            class="btn btn-primary px-8"
            @click="submitLoan"
            :disabled="!selectedUser || !selectedBook"
        >
          Confirmar Préstamo
        </button>
      </div>

    </div>

    <form method="dialog" class="modal-backdrop">
      <button @click="close">close</button>
    </form>
  </dialog>
</template>