<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import reportService from '@/api/services/report.service';
import type { CategoryStat } from '@/api/interfaces/report.interface';

const stats = ref<CategoryStat[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');
const currentPage = ref(0);

const loadCategoryStats = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    stats.value = await reportService.getCategoryStats();
  } catch (error) {
    console.error('Error fetching category stats:', error);
    errorMsg.value = 'Fallo al cargar las estadísticas de inventario.';
  } finally {
    isLoading.value = false;
  }
};

const totalBooks = computed(() => stats.value.reduce((sum, stat) => sum + stat.CantidadLibros, 0));

const ITEMS_PER_PAGE = 6;
const totalPages = computed(() => Math.ceil(stats.value.length / ITEMS_PER_PAGE));

const paginatedStats = computed(() => {
  const start = currentPage.value * ITEMS_PER_PAGE;
  return stats.value.slice(start, start + ITEMS_PER_PAGE);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--;
  }
};

const getColorClass = (index: number) => {
  const colors = [
    'from-slate-600 to-slate-700',
    'from-slate-500 to-slate-600',
    'from-slate-700 to-slate-800',
    'from-gray-600 to-gray-700',
    'from-zinc-600 to-zinc-700',
    'from-neutral-600 to-neutral-700',
  ];
  return colors[index % colors.length];
};

const getPercentage = (cantidad: number) => {
  if (totalBooks.value === 0) return 0;
  return ((cantidad / totalBooks.value) * 100).toFixed(1);
};

onMounted(loadCategoryStats);
</script>

<template>
  <div class="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-slate-700 to-slate-800 p-6">
      <div class="flex items-center justify-between text-white">
        <div class="flex items-center gap-3">
          <div class="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-2xl font-bold">Inventario por Categoría</h3>
            <p class="text-slate-300 text-sm">Distribución del catálogo</p>
          </div>
        </div>

        <div class="text-right">
          <div class="text-3xl font-bold">{{ totalBooks }}</div>
          <div class="text-slate-300 text-xs uppercase font-medium">Total Libros</div>
        </div>
      </div>
    </div>

    <!-- Contenido -->
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

      <!-- Grid de categorías con carrusel -->
      <div v-else-if="stats.length > 0">
        <!-- Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div v-for="(stat, index) in paginatedStats" :key="stat.NombreCategoria"
               class="group relative overflow-hidden rounded-xl bg-gradient-to-br p-5 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-white/20"
               :class="getColorClass(index)">

            <!-- Background Pattern -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 20px 20px;"></div>
            </div>

            <!-- Contenido -->
            <div class="relative z-10">
              <div class="flex items-start justify-between mb-3">
                <div class="flex-1">
                  <h4 class="text-white font-bold text-base mb-1 line-clamp-2 min-h-[3rem]">
                    {{ stat.NombreCategoria }}
                  </h4>
                  <p class="text-white/80 text-xs font-medium">
                    {{ getPercentage(stat.CantidadLibros) }}% del total
                  </p>
                </div>

                <div class="ml-3 bg-white/20 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>

              <!-- Número grande -->
              <div class="flex items-end gap-2">
                <span class="text-4xl font-black text-white">
                  {{ stat.CantidadLibros }}
                </span>
                <span class="text-white/80 text-xs font-medium mb-1.5 uppercase">
                  Libros
                </span>
              </div>

              <!-- Barra de progreso -->
              <div class="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                    class="h-full bg-white rounded-full transition-all duration-500 group-hover:bg-white/90"
                    :style="{ width: `${getPercentage(stat.CantidadLibros)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles de navegación -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-4">
          <button
              @click="prevPage"
              :disabled="currentPage === 0"
              class="btn btn-circle btn-sm hover:bg-slate-700 hover:text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-600">
              Página {{ currentPage + 1 }} de {{ totalPages }}
            </span>
          </div>

          <button
              @click="nextPage"
              :disabled="currentPage === totalPages - 1"
              class="btn btn-circle btn-sm hover:bg-slate-700 hover:text-white disabled:bg-slate-200 disabled:text-slate-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p class="text-slate-600 font-medium">No hay categorías disponibles</p>
        <p class="text-slate-400 text-sm mt-1">El inventario está vacío</p>
      </div>
    </div>
  </div>
</template>