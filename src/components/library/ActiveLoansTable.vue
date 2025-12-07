<script setup lang="ts">
import { ref } from 'vue'
import type { ActiveLoan } from '@/api/interfaces/loans.interface'
import loanService from '@/api/services/loan.service'
import ReturnLoanModal from '../modals/ReturnLoanModal.vue'
import RegisterLoanModal from '../modals/RegisterLoanModal.vue'

// Props y eventos
const props = defineProps<{ loans: ActiveLoan[] }>()
const emit = defineEmits(['refresh'])

// --- Interfaz para los métodos expuestos de los modales ---
interface ModalMethods {
  open: () => void
  close: () => void
}

// --- Referencias a los modales con los métodos expuestos ---
const returnModalRef = ref<InstanceType<typeof ReturnLoanModal> & ModalMethods | null>(null)
const registerModalRef = ref<InstanceType<typeof RegisterLoanModal> & ModalMethods | null>(null)

// --- Estado local ---
const selectedLoan = ref<ActiveLoan | null>(null)

// --- Funciones ---
function openReturnModal(loan: ActiveLoan) {
  selectedLoan.value = loan
  returnModalRef.value?.open()
}

function openRegisterModal() {
  registerModalRef.value?.open()
}

async function returnBook() {
  if (!selectedLoan.value) return
  await loanService.returnLoanById(selectedLoan.value.PrestamoID)
  returnModalRef.value?.close()
  emit('refresh')
}
</script>

<template>
  <main class="w-full h-full p-4 bg-base-100 rounded-lg shadow-md">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-xl font-bold">Préstamos Activos</h1>
      <button class="btn btn-primary btn-sm" @click="openRegisterModal">
        Registrar Préstamo
      </button>
    </div>

    <div v-if="props.loans === null" class="flex justify-center py-8">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>

    <div v-else-if="props.loans.length > 0" class="overflow-x-auto max-h-[500px] rounded-lg border border-base-200 mt-4">
      <table class="table w-full">
        <thead class="bg-base-200 sticky top-0 z-10">
        <tr>
          <th>ID</th>
          <th class="min-w-[150px]">Usuario</th>
          <th class="min-w-[150px]">Libro</th>
          <th>Fecha Préstamo</th>
          <th>Días</th>
          <th class="text-center">Acción</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="loan in props.loans" :key="loan.PrestamoID" class="hover:bg-base-100 transition-colors">
          <td class="font-mono text-xs opacity-60">{{ loan.PrestamoID }}</td>
          <td class="text-sm">{{ loan.Usuario }}</td>
          <td class="text-sm">{{ loan.Libro }}</td>
          <td class="text-sm">{{ new Date(loan.FechaPrestamo).toLocaleDateString() }}</td>
          <td class="text-center">{{ loan.DiasPrestado }}</td>
          <td class="text-center">
            <button class="btn btn-sm btn-error" @click="openReturnModal(loan)">Devolver</button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      No hay préstamos activos.
    </div>

    <!-- Modales -->
    <ReturnLoanModal ref="returnModalRef" :loan="selectedLoan" @returned="emit('refresh')" />
    <RegisterLoanModal ref="registerModalRef" @saved="emit('refresh')" />
  </main>
</template>
