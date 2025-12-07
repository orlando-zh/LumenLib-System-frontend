<script setup lang="ts">
import { reactive, watch } from 'vue';
import type { Autor, UpdateAuthorDTO } from '@/api/interfaces/author.interface';
import { updateAuthor } from '@/api/services/author.service';

const props = defineProps<{
  author: Autor;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'author-updated'): void;
}>();

// Reactive form basado en los datos que llegan por props
const form = reactive<UpdateAuthorDTO>({
  Nombre: '',
  Nacionalidad: '',
});

// Prellenar el formulario cuando cambie el author
watch(
    () => props.author,
    (newAuthor) => {
      if (newAuthor) {
        form.Nombre = newAuthor.Nombre;
        form.Nacionalidad = newAuthor.Nacionalidad;
      }
    },
    { immediate: true }
);

// Manejar submit
const handleSubmit = async () => {
  try {
    if (!props.author) return;
    await updateAuthor(props.author.AutorID, form);
    emit('author-updated');
    emit('close');
  } catch (error) {
    console.error('Error al actualizar autor:', error);
    // Opcional: mostrar alerta o toast de error
  }
};
</script>

<template>
  <dialog id="edit-author-modal" class="modal" open>
    <form method="dialog" class="modal-box" @submit.prevent="handleSubmit">
      <h3 class="font-bold text-lg mb-4">Editar Autor</h3>

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
        <button type="submit" class="btn btn-info">Actualizar</button>
      </div>
    </form>
  </dialog>
</template>
