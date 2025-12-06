<script setup lang="ts">
import { ref, onMounted } from 'vue';
// import { getMyLoans } from '@/api/services/loan.service'; // Descomentar cuando conectes la API

const loans = ref<any[]>([]);
const isLoading = ref(false);

// Datos simulados
const mockLoans = [
  { PrestamoID: 101, Libro: 'El Principito', FechaPrestamo: '2025-11-20', FechaDevolucion: null, Estado: 'Activo' },
  { PrestamoID: 98, Libro: 'Clean Code', FechaPrestamo: '2025-10-15', FechaDevolucion: '2025-10-25', Estado: 'Devuelto' },
  { PrestamoID: 105, Libro: 'Cien Años de Soledad', FechaPrestamo: '2025-12-01', FechaDevolucion: null, Estado: 'Activo' },
];

const fetchHistory = async () => {
  isLoading.value = true;
  try {
    // const data = await getMyLoans();
    // loans.value = data;
    setTimeout(() => { loans.value = mockLoans }, 600);
  } catch (error) {
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchHistory();
});

// Función para determinar el color del badge según estado
const getStatusBadge = (fechaDevolucion: string | null) => {
  if (fechaDevolucion) return 'badge-success badge-outline'; // Ya devuelto
  return 'badge-warning'; // Aún lo tiene
};

const getStatusText = (fechaDevolucion: string | null) => {
  if (fechaDevolucion) return 'Devuelto';
  return 'En Posesión';
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
            <div class="font-bold text-primary">{{ loan.Libro }}</div>
            <div class="text-xs opacity-50">ID Préstamo: {{ loan.PrestamoID }}</div>
          </td>

          <td>{{ loan.FechaPrestamo }}</td>

          <td>
              <span v-if="loan.FechaDevolucion" class="text-success font-medium">
                {{ loan.FechaDevolucion }}
              </span>
            <span v-else class="text-gray-400 italic">-- Pendiente --</span>
          </td>

          <td class="text-center">
            <div class="badge" :class="getStatusBadge(loan.FechaDevolucion)">
              {{ getStatusText(loan.FechaDevolucion) }}
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