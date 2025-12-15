<script setup lang="ts">
import { ref, onMounted } from 'vue';
import reportService from '@/api/services/report.service';
import type { TopReader } from '@/api/interfaces/report.interface';

const readers = ref<TopReader[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');

const loadTopReaders = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    readers.value = await reportService.getTopReaders();
  } catch (error) {
    console.error('Error fetching top readers:', error);
    errorMsg.value = 'No se pudo cargar la lista de lectores top.';
  } finally {
    isLoading.value = false;
  }
};

const getMedalColor = (index: number) => {
  if (index === 0) return 'from-amber-400 to-amber-600';
  if (index === 1) return 'from-slate-300 to-slate-500';
  if (index === 2) return 'from-orange-400 to-orange-600';
  return 'from-slate-200 to-slate-400';
};

onMounted(loadTopReaders);
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-700 to-slate-800 p-5">
      <div class="flex items-center gap-3 text-white">
        <div class="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold">Lectores Top</h3>
          <p class="text-slate-300 text-xs">Ranking de lectores</p>
        </div>
      </div>
    </div>

    <!-- Contenido con altura máxima y scroll -->
    <div class="p-5 flex-1 overflow-hidden flex flex-col min-h-0">
      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center py-8 flex-1">
        <span class="loading loading-spinner loading-md text-slate-700"></span>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="alert alert-error alert-sm">
        <span class="text-sm">{{ errorMsg }}</span>
      </div>

      <!-- Lista sin scroll (máximo 6 items) -->
      <div v-else-if="readers.length > 0" class="space-y-2.5">
        <div v-for="(reader, index) in readers.slice(0, 6)" :key="reader.UsuarioID"
             class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-400 transition-all duration-200 group">

          <!-- Posición -->
          <div :class="['w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0', getMedalColor(index)]">
            {{ index + 1 }}
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <p class="font-bold text-slate-800 text-sm truncate group-hover:text-slate-700 transition-colors">
              {{ reader.NombreCompleto }}
            </p>
            <p class="text-xs text-slate-500 truncate">{{ reader.Email }}</p>
          </div>

          <!-- Badge -->
          <div class="badge badge-sm font-semibold bg-slate-700 text-white border-0 flex-shrink-0">
            {{ reader.TotalLibrosPrestados }}
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else class="text-center py-8 flex-1 flex items-center justify-center">
        <p class="text-slate-500 text-sm">No hay datos disponibles</p>
      </div>
    </div>
  </div>
</template>