<script setup lang="ts">
import TopReadersWidget from '@/components/widgets/TopReadersWidget.vue';
import CategoryStatsWidget from '@/components/widgets/CategoryStatsWidget.vue';
import ActiveLoansWidget from '@/components/widgets/ActiveLoansWidget.vue';
</script>

<template>
  <main class="p-6">
    <h1 class="text-3xl font-bold mb-8 text-gray-800">
      Panel de Control de la Biblioteca
    </h1>

    <!-- GRID GENERAL -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Widgets pequeños -->
      <div class="space-y-6">
        <ActiveLoansWidget />
        <TopReadersWidget />
      </div>

      <!-- Widget grande en dos columnas -->
      <div class="lg:col-span-2">
        <CategoryStatsWidget />
      </div>

    </div>
  </main>
</template>
