<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Autor } from '@/api/interfaces/author.interface';

const props = defineProps<{
  author: Autor;
  modalId: string;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

let dialogRef: HTMLDialogElement | null = null;

onMounted(() => {
  dialogRef = document.getElementById(props.modalId) as HTMLDialogElement;
  dialogRef?.showModal();
});

watch(() => props.author, () => {
  if (dialogRef && props.author) dialogRef.showModal();
});

const handleConfirm = () => {
  emit('confirm');
  dialogRef?.close();
};

const handleClose = () => {
  emit('close');
  dialogRef?.close();
};
</script>

<template>
  <dialog :id="modalId" class="modal">
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Eliminar Autor</h3>
      <p class="py-4">
        ¿Está seguro de que desea eliminar al autor
        <strong>{{ author.Nombre }}</strong>? Esta acción no se puede deshacer.
      </p>
      <div class="modal-action">
        <button type="button" class="btn btn-ghost" @click="handleClose">Cancelar</button>
        <button type="button" class="btn btn-error" @click="handleConfirm">Eliminar</button>
      </div>
    </form>
  </dialog>
</template>
