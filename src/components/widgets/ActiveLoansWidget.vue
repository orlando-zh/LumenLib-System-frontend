<script setup lang="ts">
import { ref, onMounted } from 'vue';
import loanService from '@/api/services/loan.service';
import type { ActiveLoan } from '@/api/interfaces/loans.interface';
import WidgetBase from '@/components/widgets/WidgetBase.vue';

const loans = ref<ActiveLoan[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');
const empty = ref(false);

const loadActiveLoans = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    loans.value = await loanService.getActiveLoans();
    empty.value = loans.value.length === 0;
  } catch (error) {
    console.error('Error fetching active loans:', error);
    errorMsg.value = 'No se pudieron cargar los préstamos activos.';
    empty.value = true;
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  return new Intl.DateTimeFormat('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).format(date);
};

onMounted(loadActiveLoans);
</script>

<template>
  <WidgetBase :isLoading="isLoading" :errorMsg="errorMsg" :empty="empty">
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 14l9-5-9-5-9 5 9 5zm0 7l9-5-9-5-9 5 9 5z" />
      </svg>
    </template>

    <template #title>Préstamos Activos</template>
    <template #subtitle>Usuarios con préstamos sin devolver</template>

    <template #content>
      <div v-for="loan in loans" :key="loan.PrestamoID"
           class="flex items-center justify-between p-2 rounded-lg bg-base-200 hover:bg-base-300 transition">
        <div>
          <p class="font-medium text-gray-800 text-sm">{{ loan.Usuario }}</p>
          <p class="text-xs text-gray-500">{{ formatDate(loan.FechaPrestamo) }}</p>
        </div>
        <div class="badge badge-xs badge-primary font-semibold">{{ loan.DiasPrestado }} días</div>
      </div>
    </template>

    <template #empty>No hay préstamos activos.</template>
  </WidgetBase>
</template>
