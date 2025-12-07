<script setup lang="ts">
import ReturnLoanModal from './ReturnLoanModal.vue'
import { ref } from 'vue'
import type { ActiveLoan } from '@/api/interfaces/loans.interface'



const props = defineProps<{
  loans: ActiveLoan[]
}>()

const emit = defineEmits(['refresh'])

const selectedLoan = ref<ActiveLoan | null>(null)

function openModal(loan: ActiveLoan) {
  selectedLoan.value = loan
  ;(document.getElementById('return_modal') as HTMLDialogElement).showModal()
}
</script>

<template>
  <table class="table w-full">
    <thead>
    <tr>
      <th>ID</th>
      <th>Usuario</th>
      <th>Libro</th>
      <th>Fecha Préstamo</th>
      <th>Días</th>
      <th></th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="loan in loans" :key="loan.PrestamoID">
      <td>{{ loan.PrestamoID }}</td>
      <td>{{ loan.Usuario }}</td>
      <td>{{ loan.Libro }}</td>
      <td>{{ new Date(loan.FechaPrestamo).toLocaleDateString() }}</td>
      <td>{{ loan.DiasPrestado }}</td>

      <td>
        <button class="btn btn-sm btn-error" @click="openModal(loan)">
          Devolver
        </button>
      </td>
    </tr>
    </tbody>
  </table>

  <ReturnLoanModal :loan="selectedLoan" @returned="emit('refresh')" />
</template>
