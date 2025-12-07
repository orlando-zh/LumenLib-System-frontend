<script setup lang="ts">
import { reactive } from 'vue';
import type { CreateAuthorDTO } from '@/api/interfaces/author.interface';
import { createAuthor } from '@/api/services/author.service';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'author-added'): void;
}>();

// Reactive form
const form = reactive<CreateAuthorDTO>({
  Nombre: '',
  Nacionalidad: '',
});

// Manejar submit
const handleSubmit = async () => {
  try {
    await createAuthor(form);
    emit('author-added');
    emit('close');
  } catch (error) {
    console.error('Error al crear autor:', error);
    // Opcional: mostrar alerta o toast de error
  }
};
</script>


<template>
  <dialog id="add-author-modal" class="modal" open>
    <form method="dialog" class="modal-box" @submit.prevent="handleSubmit">
      <h3 class="font-bold text-lg mb-4">Agregar Autor</h3>

      <div class="flex flex-col gap-3">
        <div>
          <label class="label">
            <span class="label-text">Nombre</span>
          </label>
          <input
              type="text"
              placeholder="Nombre del autor"
              v-model="form.Nombre"
              class="input input-bordered w-full"
              required
          />
        </div>

        <div>
          <label class="label">
            <span class="label-text">Nacionalidad</span>
          </label>
          <input
              type="text"
              placeholder="Nacionalidad"
              v-model="form.Nacionalidad"
              class="input input-bordered w-full"
          />
        </div>
      </div>

      <div class="modal-action mt-4">
        <button type="button" class="btn btn-ghost" @click="$emit('close')">Cancelar</button>
        <button type="submit" class="btn btn-primary">Guardar</button>
      </div>
    </form>
  </dialog>
</template>

