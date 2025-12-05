<script setup lang="ts">
import { ref } from 'vue'
import type { Libro, CreateBookDTO } from '@/api/interfaces/book.interface'

const emit = defineEmits(['close', 'book-added'])

const form = ref<CreateBookDTO>({
  Titulo: '',
  ISBN: '',
  AnioPublicacion: new Date().getFullYear(),
  Stock: 1,
  AutorID: 0,
  CategoriaID: 0
})

const isSaving = ref(false)
const errors = ref<Record<string,string>>({})

const validate = () => {
  errors.value = {}
  if (!form.value.Titulo.trim()) errors.value.Titulo = 'Título requerido'
  if (!form.value.ISBN.trim()) errors.value.ISBN = 'ISBN requerido'
  if (!form.value.AnioPublicacion) errors.value.AnioPublicacion = 'Año requerido'
  if (form.value.Stock < 0) errors.value.Stock = 'Stock inválido'
  return Object.keys(errors.value).length === 0
}

const save = async () => {
  if (!validate()) return
  isSaving.value = true
  try {
    const newBook: Libro = {
      LibroID: Math.floor(Math.random() * 100000) + 1,
      Titulo: form.value.Titulo,
      ISBN: form.value.ISBN,
      AnioPublicacion: Number(form.value.AnioPublicacion),
      Stock: Number(form.value.Stock),
      AutorID: Number(form.value.AutorID),
      CategoriaID: Number(form.value.CategoriaID)
    }

    // Emitir hacia el componente padre; aquí no llamamos API
    emit('book-added', newBook)
    // reset
    form.value = { Titulo: '', ISBN: '', AnioPublicacion: new Date().getFullYear(), Stock: 1, AutorID: 0, CategoriaID: 0 }
    emit('close')
  } catch (err) {
    console.error(err)
  } finally {
    isSaving.value = false
  }
}

const close = () => {
  emit('close')
}
</script>

<template>
  <dialog class="modal modal-open">
    <div class="modal-box w-full max-w-lg">
      <h3 class="font-bold text-lg mb-4">Agregar Libro</h3>

      <form @submit.prevent="save" class="space-y-3">
        <div class="grid grid-cols-1 gap-2">
          <div>
            <label class="label"><span class="label-text">Título</span></label>
            <input v-model="form.Titulo" class="input input-bordered w-full" placeholder="Título del libro" />
            <p v-if="errors.Titulo" class="text-sm text-error">{{ errors.Titulo }}</p>
          </div>

          <div>
            <label class="label"><span class="label-text">ISBN</span></label>
            <input v-model="form.ISBN" class="input input-bordered w-full" placeholder="ISBN" />
            <p v-if="errors.ISBN" class="text-sm text-error">{{ errors.ISBN }}</p>
          </div>

          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="label"><span class="label-text">Año</span></label>
              <input type="number" v-model.number="form.AnioPublicacion" class="input input-bordered w-full" />
            </div>
            <div>
              <label class="label"><span class="label-text">Stock</span></label>
              <input type="number" v-model.number="form.Stock" class="input input-bordered w-full" />
            </div>
            <div>
              <label class="label"><span class="label-text">AutorID</span></label>
              <input type="number" v-model.number="form.AutorID" class="input input-bordered w-full" />
            </div>
          </div>

          <div>
            <label class="label"><span class="label-text">CategoriaID</span></label>
            <input type="number" v-model.number="form.CategoriaID" class="input input-bordered w-full" />
          </div>
        </div>

        <div class="modal-action mt-4">
          <button type="button" class="btn" @click="close">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving">{{ isSaving ? 'Guardando...' : 'Guardar' }}</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop"><button @click="close" /></form>
  </dialog>
</template>
