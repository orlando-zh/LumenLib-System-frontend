<script setup lang="ts">
import Login from '@/components/features/Login.vue'
</script>

<template>
  <div class="hero bg-sky-200 min-h-screen p-16">
    <div class="hero-content bg-base-100 min-w-full h-full flex-col lg:flex-row rounded-xl border border-sky-400 px-2">
      <div class="w-full flex items-center justify-center">
        <div>
          <h1 class="text-5xl font-bold">LumenLib System</h1>
          <p class="py-6">
            Sistema Bibliotecario
          </p>
        </div>
      </div>
      <div class="w-xl h-full flex items-center ">
        <Login/>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
