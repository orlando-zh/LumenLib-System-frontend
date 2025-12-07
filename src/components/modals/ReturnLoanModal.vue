<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ActiveLoan } from '@/api/interfaces/loans.interface'
import loanService from '@/api/services/loan.service'

// Recibimos el préstamo seleccionado
const props = defineProps<{
  loan: ActiveLoan | null
}>()

const loading = ref(false)
const message = ref('')

// Función para ejecutar la devolución
async function returnBook() {
  if (!props.loan) return
  loading.value = true
  message.value = ''

  try {
    await loanService.returnLoanById(props.loan.PrestamoID)
    message.value = 'Libro devuelto correctamente.'

    // Cerrar modal después de 1 segundo
    setTimeout(() => {
      (document.getElementById('return_modal') as HTMLDialogElement).close()
      window.location.reload() // refresco simple por ahora
    }, 1000)
  } catch (error) {
    console.error(error)
    message.value = 'Error al devolver el libro.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <dialog id="return_modal" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirmar devolución</h3>

      <div v-if="props.loan" class="py-4 space-y-2">
        <p><strong>Usuario:</strong> {{ props.loan.Usuario }}</p>
        <p><strong>Libro:</strong> {{ props.loan.Libro }}</p>
        <p><strong>Días prestado:</strong> {{ props.loan.DiasPrestado }}</p>
      </div>

      <p v-if="message" class="mt-3 text-success">{{ message }}</p>

      <div class="modal-action">
        <button class="btn" @click="return_modal.close()">Cancelar</button>

        <button
            class="btn btn-error"
            :disabled="loading"
            @click="returnBook">
          {{ loading ? "Procesando..." : "Confirmar" }}
        </button>
      </div>
    </div>
  </dialog>
</template>
