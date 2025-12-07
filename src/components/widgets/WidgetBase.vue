<script setup lang="ts">
import { ref } from 'vue';
const isLoading = ref(false);
const errorMsg = ref('');
const empty = ref(false);
</script>


<template>
  <div class="card bg-base-100 shadow-lg border border-gray-200 rounded-2xl h-full max-h-[400px]">
    <div class="card-body p-4 flex flex-col h-full">
      <!-- Header -->
      <div class="flex items-center gap-2 mb-2">
        <div class="p-2 bg-primary text-white rounded-xl flex items-center justify-center">
          <slot name="icon" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-800"><slot name="title" /></h3>
          <p class="text-xs text-gray-500"><slot name="subtitle" /></p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center items-center flex-1">
        <span class="loading loading-dots loading-md text-primary"></span>
      </div>

      <!-- Error -->
      <div v-else-if="errorMsg" class="alert alert-error text-sm my-2">
        {{ errorMsg }}
      </div>

      <!-- Contenido -->
      <div v-else class="overflow-y-auto flex-1 space-y-2 pr-1">
        <slot name="content" />
      </div>

      <!-- Vacío -->
      <div v-if="!isLoading && empty" class="text-center text-gray-500 py-2 text-sm">
        <slot name="empty" />
      </div>
    </div>
  </div>
</template>

