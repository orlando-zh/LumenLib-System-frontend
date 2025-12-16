<script setup lang="ts">
import { ref, onMounted } from 'vue';
import reportService  from '@/api/services/report.service';
import type { TopAuthor } from '@/api/interfaces/report.interface';

const authors = ref<TopAuthor[]>([]);
const loading = ref(true);
const error = ref(false);

const fetchAuthors = async () => {
  loading.value = true;
  error.value = false;
  try {
    authors.value = await reportService.getTopAuthors(1);
  } catch (err) {
    console.error('Error cargando top autores:', err);
    error.value = true;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchAuthors();
});
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden h-full flex flex-col">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-700 to-slate-800 p-5">
      <div class="flex items-center gap-3 text-white">
        <div class="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </div>
        <div>
          <h3 class="text-xl font-bold">Top Autores</h3>
          <p class="text-slate-300 text-xs">Más prolíficos</p>
        </div>
      </div>
    </div>

    <!-- Contenido con altura máxima y scroll -->
    <div class="p-5 flex-1 overflow-hidden flex flex-col min-h-0">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-8 flex-1">
        <span class="loading loading-spinner loading-md text-slate-700"></span>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="text-center py-6 flex-1 flex flex-col items-center justify-center">
        <p class="text-red-500 text-sm mb-2">Error al cargar autores</p>
      </div>

      <!-- Empty -->
      <div v-else-if="authors.length === 0" class="text-center py-8 flex-1 flex items-center justify-center">
        <p class="text-slate-500 text-sm">No hay datos disponibles</p>
      </div>

      <!-- Lista con altura máxima y scroll -->
      <ul v-else class="space-y-2.5 overflow-y-auto pr-2 flex-1 min-h-0 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        <li
            v-for="(author, index) in authors"
            :key="index"
            class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all duration-200 group border border-slate-100 hover:border-slate-400"
        >
          <div class="flex items-center gap-3">
            <span
                :class="[
                'flex items-center justify-center w-8 h-8 text-xs font-bold rounded-lg flex-shrink-0',
                index < 3 ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-600'
              ]"
            >
              {{ index + 1 }}
            </span>

            <span class="text-sm font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
              {{ author.Nombre }}
            </span>
          </div>

          <div class="text-right flex-shrink-0">
            <span class="block text-base font-bold text-slate-900">
              {{ author.TotalLibros }}
            </span>
            <span class="text-[10px] text-slate-400 uppercase font-medium">Libros</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>