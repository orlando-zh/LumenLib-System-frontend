<script setup lang="ts">
import ActiveLoansTable from '@/components/library/ActiveLoansTable.vue'
import { ref, onMounted } from 'vue'
import loanService from '@/api/services/loan.service'
import type { ActiveLoan } from '@/api/interfaces/loans.interface'

const loans = ref<ActiveLoan[]>([])

const fetchActiveLoans = async () => {
  try {
    loans.value = await loanService.getActiveLoans()
  } catch (error) {
    console.error('Error fetching active loans:', error)
  }
}

onMounted(() => {
  fetchActiveLoans()
})

// Para refrescar desde el modal
const handleRefresh = () => fetchActiveLoans()
</script>

<template>
  <div class="p-4">
    <ActiveLoansTable :loans="loans" @refresh="handleRefresh" />
  </div>
</template>
