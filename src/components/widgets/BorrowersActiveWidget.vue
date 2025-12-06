<script setup lang="ts">
import { ref, onMounted } from 'vue';
import reportService from '@/api/services/report.service';
import type { TopReader } from '@/api/interfaces/report.interface';
import WidgetBase from '@/components/widgets/WidgetBase.vue';

const borrowers = ref<TopReader[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');
const empty = ref(false);

const loadBorrowers = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    borrowers.value = await reportService.getTopReaders();
    empty.value = borrowers.value.length === 0;
  } catch (error) {
    console.error('Error fetching borrowers:', error);
    errorMsg.value = 'No se pudo cargar la lista de préstamos activos.';
    empty.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadBorrowers);
</script>

<template>
  <WidgetBase :isLoading="isLoading" :errorMsg="errorMsg" :empty="empty">
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 14l9-5-9-5-9 5 9 5zm0 7l9-5-9-5-9 5 9 5z" />
      </svg>
    </template>

    <template #title>Préstamos Activos</template>
    <template #subtitle>Usuarios con libros prestados actualmente</template>

    <template #content>
      <div v-for="user in borrowers" :key="user.UsuarioID"
           class="flex items-center justify-between p-2 rounded-lg bg-base-200 hover:bg-base-300 transition">

        <!-- Avatar + Nombre -->
        <div class="flex items-center gap-2">
          <div class="avatar placeholder">
            <div class="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center">
              <span class="text-sm font-bold">
                {{ user.NombreCompleto.charAt(0).toUpperCase() }}
              </span>
            </div>
          </div>

          <div class="flex flex-col">
            <p class="font-medium text-gray-800 text-sm">{{ user.NombreCompleto }}</p>
            <p class="text-xs text-gray-500">{{ user.Email }}</p>
          </div>
        </div>

        <!-- Badge -->
        <div class="badge badge-xs badge-primary font-semibold">
          {{ user.TotalLibrosPrestados }} activos
        </div>
      </div>
    </template>

    <template #empty>No hay préstamos activos en este momento.</template>
  </WidgetBase>
</template>
