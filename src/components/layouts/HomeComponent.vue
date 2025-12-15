<script setup lang="ts">
import TopReadersWidget from '@/components/widgets/TopReadersWidget.vue';
import CategoryStatsWidget from '@/components/widgets/CategoryStatsWidget.vue';
import ActiveLoansWidget from '@/components/widgets/ActiveLoansWidget.vue';
import TopAuthorsWidget from '@/components/widgets/TopAuthorsWidget.vue';
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-4xl font-bold text-slate-800 mb-2">
        Panel de Control
      </h1>
      <p class="text-slate-600">Gestión de Biblioteca - Dashboard Principal</p>
    </div>

    <!-- Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">

      <!-- Columna Izquierda - Widgets pequeños con altura fija -->
      <div class="lg:col-span-4 flex flex-col gap-6">
        <div class="flex-1">
          <TopReadersWidget />
        </div>
        <div class="flex-1">
          <TopAuthorsWidget />
        </div>
      </div>

      <!-- Columna Central y Derecha -->
      <div class="lg:col-span-8 flex flex-col gap-6">
        <ActiveLoansWidget />
        <CategoryStatsWidget />
      </div>

    </div>
  </main>
</template>