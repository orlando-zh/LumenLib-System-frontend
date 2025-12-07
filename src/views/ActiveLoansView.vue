<script setup lang="ts">
import { ref, onMounted } from 'vue'
import loanService from '@/api/services/loan.service'
import ActiveLoansTable from '@/components/library/ActiveLoansTable.vue'

const loans = ref([])

onMounted(async () => {
  loans.value = await loanService.getActiveLoans()
})
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-4">Préstamos activos</h1>

    <ActiveLoansTable :loans="loans" />
  </div>
</template>
