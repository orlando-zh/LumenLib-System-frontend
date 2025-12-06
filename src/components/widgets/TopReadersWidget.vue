<script setup lang="ts">
import { ref, onMounted } from 'vue';
import reportService from '@/api/services/report.service';
import type { TopReader } from '@/api/interfaces/report.interface';
import WidgetBase from '@/components/widgets/WidgetBase.vue';

const readers = ref<TopReader[]>([]);
const isLoading = ref(true);
const errorMsg = ref('');
const empty = ref(false);

const loadTopReaders = async () => {
  isLoading.value = true;
  errorMsg.value = '';
  try {
    readers.value = await reportService.getTopReaders();
    empty.value = readers.value.length === 0;
  } catch (error) {
    console.error('Error fetching top readers:', error);
    errorMsg.value = 'No se pudo cargar la lista de lectores top.';
    empty.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(loadTopReaders);
</script>

<template>
  <WidgetBase :isLoading="isLoading" :errorMsg="errorMsg" :empty="empty">
    <!-- Icono del widget -->
    <template #icon>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none"
           viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 14l9-5-9-5-9 5 9 5zm0 7l9-5-9-5-9 5 9 5z" />
      </svg>
    </template>

    <template #title>Lectores Top</template>
    <template #subtitle>Usuarios con más préstamos activos</template>

    <template #content>
      <div v-for="reader in readers" :key="reader.UsuarioID"
           class="flex items-center justify-between p-2 rounded-lg bg-base-200 hover:bg-base-300 transition">
        <p class="font-medium text-sm text-gray-800">{{ reader.NombreCompleto }}</p>
        <div class="badge badge-xs badge-primary font-semibold">{{ reader.TotalLibrosPrestados }} libros</div>
      </div>
    </template>

    <template #empty>No hay lectores con préstamos activos.</template>
  </WidgetBase>
</template>
