<script setup lang="ts">
import { ref, watch } from 'vue';
import type { Category } from '@/api/interfaces/category.interfaces';
import { defineProps, defineEmits } from 'vue';
import categoryService from '@/api/services/category.service';

const props = defineProps<{ category: Category }>();
const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'category-updated'): void;
}>();

const name = ref(props.category.NombreCategoria);
const error = ref('');

watch(() => props.category, (newVal) => {
  if (newVal) name.value = newVal.NombreCategoria;
});

const handleSubmit = async () => {
  if (!name.value.trim()) {
    error.value = 'El nombre es obligatorio';
    return;
  }
  try {
    await categoryService.update(props.category.CategoriaID, { NombreCategoria: name.value });
    emit('category-updated'); // evento tipado correctamente
    emit('close');            // evento tipado correctamente
  } catch (e) {
    console.error(e);
    error.value = 'Error al actualizar la categoría';
  }
};

const handleClose = () => emit('close');
</script>

<template>
  <dialog class="modal" open>
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Editar Categoría</h3>
      <input
          v-model="name"
          type="text"
          placeholder="Nombre de categoría"
          class="input input-bordered w-full mt-2"
      />
      <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>
      <div class="modal-action">
        <button type="button" class="btn btn-ghost" @click="handleClose">Cancelar</button>
        <button type="button" class="btn btn-primary" @click="handleSubmit">Guardar</button>
      </div>
    </form>
  </dialog>
</template>
