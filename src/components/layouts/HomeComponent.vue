<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col w-full p-6 space-y-6">

    <div class="flex flex-col">
      <h1 class="text-3xl font-bold text-gray-800">Panel de Control</h1>
      <p class="text-gray-500">Bienvenido al sistema de administración.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <span class="text-sm text-gray-500 font-medium">Ventas Totales</span>
        <span class="text-2xl font-bold text-blue-600">$0.00</span>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <span class="text-sm text-gray-500 font-medium">Transacciones</span>
        <span class="text-2xl font-bold text-green-600">0</span>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <span class="text-sm text-gray-500 font-medium">Productos</span>
        <span class="text-2xl font-bold text-purple-600">0</span>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
        <span class="text-sm text-gray-500 font-medium">Alertas</span>
        <span class="text-2xl font-bold text-orange-500">0</span>
      </div>

    </div>

    <div class="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex items-center justify-center min-h-[300px]">
      <p class="text-gray-400">Aquí irá tu gráfico de ventas</p>
    </div>

  </div>
</template>