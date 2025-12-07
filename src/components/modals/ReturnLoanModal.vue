<script setup lang="ts">
import { ref } from 'vue'
import type { ActiveLoan } from '@/api/interfaces/loans.interface'
import loanService from '@/api/services/loan.service'

const props = defineProps<{ loan: ActiveLoan | null }>()
const emit = defineEmits(['returned'])

const dialogRef = ref<HTMLDialogElement | null>(null)
const loading = ref(false)

// --- Abrir/cerrar modal ---
function open() {
  dialogRef.value?.showModal()
}

function close() {
  dialogRef.value?.close()
}

defineExpose({ open, close })

// --- Función para devolver libro ---
async function returnBook() {
  if (!props.loan) return
  loading.value = true
  try {
    await loanService.returnLoanById(props.loan.PrestamoID)
    emit('returned')
    close()
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <dialog ref="dialogRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirmar Devolución</h3>

      <div v-if="props.loan" class="py-4">
        <p><strong>Usuario:</strong> {{ props.loan.Usuario }}</p>
        <p><strong>Libro:</strong> {{ props.loan.Libro }}</p>
        <p><strong>Días prestado:</strong> {{ props.loan.DiasPrestado }}</p>
      </div>

      <div class="modal-action">
        <button class="btn" @click="close" :disabled="loading">Cancelar</button>
        <button class="btn btn-error" @click="returnBook" :disabled="loading">
          <span v-if="loading" class="loading loading-spinner"></span>
          {{ loading ? 'Devolviendo...' : 'Confirmar' }}
        </button>
      </div>
    </div>
  </dialog>
</template>
