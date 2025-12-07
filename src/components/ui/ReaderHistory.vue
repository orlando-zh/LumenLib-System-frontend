<script setup lang="ts">
import { ref, onMounted } from 'vue';
import loanService from '@/api/services/loan.service';
import type { LoanHistory } from '@/api/interfaces/loans.interface';

const loans = ref<LoanHistory[]>([]);
const isLoading = ref(false);

const fetchHistory = async () => {
  isLoading.value = true;
  try {
    const data = await loanService.getMyLoanHistory();
    loans.value = data;
  } catch (error) {
    console.error('Error al obtener historial de préstamos:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchHistory();
});

// Función para determinar el color del badge según estado
const getStatusBadge = (estado: string) => {
  if (estado === 'Devuelto') return 'badge-success badge-outline';
  return 'badge-warning';
};

// Función para formatear fechas
const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
};
</script>

<template>
  <div class="p-6">
    <div class="mb-6">
      <h2 class="text-3xl font-bold text-secondary">Mi Historial de Lectura</h2>
      <p class="text-gray-500">Consulta el estado de tus préstamos actuales y pasados.</p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-10">
      <span class="loading loading-spinner loading-md text-secondary"></span>
    </div>

    <div v-else class="overflow-x-auto bg-base-100 rounded-lg shadow border border-base-200">
      <table class="table w-full">
        <thead class="bg-base-200">
        <tr>
          <th>#</th>
          <th>Libro</th>
          <th>Fecha Préstamo</th>
          <th>Fecha Devolución</th>
          <th class="text-center">Estado</th>
        </tr>
        </thead>

        <tbody>
        <tr v-for="(loan, index) in loans" :key="loan.PrestamoID" class="hover">
          <td class="font-mono text-xs opacity-50">{{ index + 1 }}</td>

          <td>
            <div class="font-bold text-primary">{{ loan.Titulo }}</div>
            <div class="text-xs opacity-50">ISBN: {{ loan.ISBN }} • ID Préstamo: {{ loan.PrestamoID }}</div>
          </td>

          <td>{{ formatDate(loan.FechaPrestamo) }}</td>

          <td>
              <span v-if="loan.FechaDevolucion" class="text-success font-medium">
                {{ formatDate(loan.FechaDevolucion) }}
              </span>
            <span v-else class="text-gray-400 italic">-- Pendiente --</span>
          </td>

          <td class="text-center">
            <div class="badge" :class="getStatusBadge(loan.Estado)">
              {{ loan.Estado }}
            </div>
          </td>
        </tr>
        </tbody>
      </table>

      <div v-if="loans.length === 0" class="p-8 text-center text-gray-500">
        No tienes historial de préstamos aún. ¡Ve al catálogo y pide un libro!
      </div>
    </div>
  </div>
</template>