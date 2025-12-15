<script setup lang="ts">
import { ref, onMounted } from 'vue';
import loanService from '@/api/services/loan.service';
import type { ActiveLoan } from '@/api/interfaces/loans.interface';

const loans = ref<ActiveLoan[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');

const loadActiveLoans = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    loans.value = await loanService.getActiveLoans();
  } catch (error) {
    console.error('Error fetching active loans:', error);
    errorMsg.value = 'No se pudieron cargar los préstamos activos.';
  } finally {
    isLoading.value = false;
  }
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'Sin fecha';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return 'Fecha inválida';
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

const getDaysColor = (days: number) => {
  if (days <= 7) return 'badge-success';
  if (days <= 14) return 'badge-warning';
  return 'badge-error';
};

onMounted(loadActiveLoans);
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
    <!-- Header con gradiente -->
    <div class="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
      <div class="flex items-center justify-between text-white">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold">Préstamos Activos</h3>
            <p class="text-slate-300 text-sm">Libros actualmente prestados</p>
          </div>
        </div>

        <div class="text-right">
          <div class="text-3xl font-bold">{{ loans.length }}</div>
          <div class="text-slate-300 text-xs uppercase font-medium">Total Activos</div>
        </div>
      </div>
    </div>

    <!-- Contenido con altura máxima y scroll -->
    <div class="p-6">
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center py-12">
        <span class="loading loading-spinner loading-lg text-slate-700"></span>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="alert alert-error shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{{ errorMsg }}</span>
      </div>

      <!-- Lista de préstamos con scroll -->
      <div v-else-if="loans.length > 0" class="space-y-3 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <div v-for="loan in loans" :key="loan.PrestamoID"
             class="group flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 hover:shadow-md hover:border-slate-400 transition-all duration-200">

          <!-- Avatar + Info -->
          <div class="flex items-center gap-4">
            <div class="avatar placeholder">
              <div class="bg-gradient-to-br from-slate-600 to-slate-700 text-white rounded-full w-12 h-12 ring-4 ring-slate-200 flex items-center justify-center">
                <span class="text-lg font-bold">
                  {{ loan.Usuario.charAt(0).toUpperCase() }}
                </span>
              </div>
            </div>

            <div>
              <p class="font-bold text-slate-800 text-base group-hover:text-slate-700 transition-colors">
                {{ loan.Usuario }}
              </p>
              <div class="flex items-center gap-2 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-sm text-slate-500">{{ formatDate(loan.FechaPrestamo) }}</p>
              </div>
            </div>
          </div>

          <!-- Badge de días -->
          <div class="flex flex-col items-end gap-1">
            <div :class="['badge badge-lg font-bold', getDaysColor(loan.DiasPrestado)]">
              {{ loan.DiasPrestado }} días
            </div>
            <span class="text-xs text-slate-400">prestado</span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-slate-600 font-medium">No hay préstamos activos</p>
        <p class="text-slate-400 text-sm mt-1">Todos los libros han sido devueltos</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scrollbar personalizado */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>