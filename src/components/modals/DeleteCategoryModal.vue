<script setup lang="ts">
import { defineProps, defineEmits, onMounted, ref } from 'vue';
import type { Category } from '@/api/interfaces/category.interfaces';

const props = defineProps<{
  category: Category;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'confirm'): void;
}>();

const modalRef = ref<HTMLDialogElement | null>(null);

onMounted(() => {
  modalRef.value?.showModal();
});

const handleConfirm = () => emit('confirm');
const handleClose = () => emit('close');
</script>

<template>
  <dialog ref="modalRef" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Eliminar Categoría</h3>
      <p class="py-4">
        ¿Está seguro de que desea eliminar la categoría
        <strong>{{ props.category.NombreCategoria }}</strong>?
        Esta acción no se puede deshacer.
      </p>
      <div class="modal-action">
        <button class="btn btn-ghost" @click="handleClose">Cancelar</button>
        <button class="btn btn-error" @click="handleConfirm">Eliminar</button>
      </div>
    </div>
  </dialog>
</template>
