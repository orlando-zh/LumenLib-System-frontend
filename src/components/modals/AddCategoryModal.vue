<script setup lang="ts">
import { ref } from 'vue';
import { defineEmits } from 'vue';
import categoryService from '@/api/services/category.service';
import type { CategoryDTO } from '@/api/interfaces/category.interfaces';

// Definir eventos emitidos
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'category-added'): void;
}>();

const name = ref('');
const error = ref('');


const handleSubmit = async () => {
  if (!name.value.trim()) {
    error.value = 'El nombre es obligatorio';
    return;
  }

  const newCategory: CategoryDTO = { NombreCategoria: name.value };

  try {
    await categoryService.create(newCategory);
    emit('category-added');
    emit('close');
  } catch (e) {
    console.error(e);
    error.value = 'Error al crear la categoría';
  }
};
// Cerrar modal sin guardar
const handleClose = () => emit('close');
</script>

<template>
  <dialog class="modal" open>
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Crear Categoría</h3>

      <input
          v-model="name"
          type="text"
          placeholder="Nombre de categoría"
          class="input input-bordered w-full mt-2"
      />

      <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>

      <div class="modal-action">
        <button type="button" class="btn btn-ghost" @click="handleClose">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" @click="handleSubmit">
          Crear
        </button>
      </div>
    </form>
  </dialog>
</template>
