<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import reportService from '@/api/services/report.service';
import type { CategoryStat } from '@/api/interfaces/report.interface';
import WidgetBase from '@/components/widgets/WidgetBase.vue';

const stats = ref<CategoryStat[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');
const empty = ref(false);

const loadCategoryStats = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    stats.value = await reportService.getCategoryStats();
    empty.value = stats.value.length === 0;
  } catch (error) {
    console.error('Error fetching category stats:', error);
    errorMsg.value = 'Fallo al cargar las estadísticas de inventario.';
    empty.value = true;
  } finally {
    isLoading.value = false;
  }
};

// Cálculo de libros totales
const totalBooks = computed(() => stats.value.reduce((sum, stat) => sum + stat.CantidadLibros, 0));

onMounted(loadCategoryStats);
</script>

<template>
  <WidgetBase :isLoading="isLoading" :errorMsg="errorMsg" :empty="empty">
    <!-- Icono del widget -->
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2z" />
      </svg>
    </template>

    <template #title>Inventario por Categoría</template>
    <template #subtitle>Total de libros: <span class="font-bold text-primary">{{ totalBooks }}</span></template>

    <template #content>
      <div v-for="stat in stats" :key="stat.NombreCategoria"
           class="flex items-center justify-between p-2 rounded-lg bg-base-200">
        <p class="font-medium text-sm text-gray-800">{{ stat.NombreCategoria }}</p>
        <div class="badge badge-xs badge-info font-semibold">{{ stat.CantidadLibros }}</div>
      </div>
    </template>

    <template #empty>No se encontraron categorías o el inventario está vacío.</template>
  </WidgetBase>
</template>
