<script setup lang="ts">
import type { Libro } from '@/api/interfaces/book.interface';

const props = defineProps<{ book: Libro; modalId: string }>();
const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'confirm'): void;
}>();
</script>

<template>
  <dialog class="modal modal-open">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Eliminar Libro</h3>
      <p>
        ¿Estás seguro que deseas eliminar el libro
        <strong>{{ props.book.Titulo }}</strong>?
      </p>
      <div class="modal-action">
        <button type="button" class="btn btn-ghost" @click="emit('close')">Cancelar</button>
        <button type="button" class="btn btn-error" @click="emit('confirm')">Eliminar</button>
      </div>
    </form>
  </dialog>
</template>
