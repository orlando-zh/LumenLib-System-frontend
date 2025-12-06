<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};
</script>

<template>
  <div class="hero bg-white min-h-full">
    <div class="hero-content text-center">
      <div class="max-w-full">
        <h1 class="text-5xl font-bold">404</h1>
        <p class="py-6">
          ¡Ups! Página no encontrada.
        </p>
        <button class="btn btn-primary" @click="goBack">Volver</button>
      </div>
    </div>
  </div>
</template>
