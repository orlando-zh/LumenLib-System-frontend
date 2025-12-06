<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1);
  } else {
    router.push('/');
  }
};

const goHome = () => {
  router.push('/admin');
}
</script>

<template>
  <div class="min-h-full bg-base-200 flex flex-col items-center justify-center p-4">
    <div class="card bg-base-100 shadow-xl max-w-md w-full">
      <figure class="px-10 pt-10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </figure>
      <div class="card-body items-center text-center">
        <h2 class="card-title text-2xl font-bold">Acceso no autorizado</h2>
        <p class="py-4">Tu rol no tiene los permisos necesarios para acceder a este contenido.</p>
        <div class="card-actions">
          <button @click="goBack" class="btn btn-ghost mr-2">
            Volver atrás
          </button>
          <button @click="goHome" class="btn btn-primary">
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
