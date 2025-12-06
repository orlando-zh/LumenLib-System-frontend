<script setup lang="ts">
import OptionSidebar from '@/components/layouts/OptionSidebar.vue'
</script>

<template>
  <aside class="w-64 h-full bg-base-200 flex flex-col shadow-lg border-r border-base-300">
    <div class="p-4 border-b border-base-300">
      <h2 class="text-xl font-bold text-primary flex items-center gap-2">
        <span>📖</span> LumenLib
      </h2>
      <p class="text-xs text-gray-500 mt-1">Panel de Lector</p>
    </div>

    <div class="flex-1 overflow-y-auto overflow-x-hidden p-4">
      <ul class="menu rounded-box w-full space-y-2">

        <OptionSidebar
            route="/lector/catalogo"
            name="Catálogo de Libros"
            icon="#"
        />

        <hr class="my-1.5 border-base-300" />

        <OptionSidebar
            route="/lector/historial"
            name="Mi Historial"
            icon="#"
        />

      </ul>
    </div>

    <div class="p-4 border-t border-base-300 text-xs text-center text-gray-400">
      © 2025 LumenLib
    </div>
  </aside>
</template>