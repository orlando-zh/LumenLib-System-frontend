<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// --- CAMBIO AQUÍ: Importación con Destructuring ---
import { createBook } from '@/api/services/book.service'
// Nota: categoryService lo definimos como "export default", así que se queda igual
import categoryService from '@/api/services/category.service.ts'
import { getAllAuthors } from '@/api/services/author.service'

import type { CreateBookDTO } from '@/api/interfaces/book.interface'
import type { Category } from '@/api/interfaces/category.interfaces'
import type { Autor } from '@/api/interfaces/author.interface'




const emit = defineEmits(['close', 'book-added'])

const form = reactive<CreateBookDTO>({
  Titulo: '',
  ISBN: '',
  AnioPublicacion: new Date().getFullYear(),
  Stock: 1,
  AutorID: 0,
  CategoriaID: 0,
  imagen: null
})

const isSaving = ref(false)
const isLoadingDependencies = ref(true)
const errors = ref<Record<string,string>>({})
const categories = ref<Category[]>([])
const authors = ref<Autor[]>([])

onMounted(async () => {
  try {
    isLoadingDependencies.value = true

    const [categoriesResponse, authorsResponse] = await Promise.all([
      categoryService.getAll(),
      getAllAuthors()
    ])

    categories.value = categoriesResponse
    authors.value = authorsResponse

  } catch (error) {
    console.error('Error cargando dependencias:', error)
    errors.value.global = 'No se pudieron cargar categorías o autores.'
  } finally {
    isLoadingDependencies.value = false
  }
})



const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    form.imagen = target.files[0];
  }
}

const validate = () => {
  errors.value = {}
  if (!form.Titulo.trim()) errors.value.Titulo = 'Título requerido'
  if (!form.ISBN.trim()) errors.value.ISBN = 'ISBN requerido'
  if (!form.AnioPublicacion) errors.value.AnioPublicacion = 'Año requerido'
  if (form.Stock < 0) errors.value.Stock = 'Stock inválido'
  if (!form.AutorID) errors.value.AutorID = 'Selecciona un autor'
  if (!form.CategoriaID) errors.value.CategoriaID = 'Selecciona una categoría'
  return Object.keys(errors.value).length === 0
}

const save = async () => {
  if (!validate()) return

  isSaving.value = true
  try {
    // --- CAMBIO AQUÍ: Uso directo de createBook ---
    const newBook = await createBook(form);

    emit('book-added', newBook)
    emit('close')
  } catch (err: any) {
    console.error(err)
    errors.value.global = err.response?.data?.message || 'Error al guardar el libro.';
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

      <div v-if="isLoadingDependencies" class="flex flex-col justify-center items-center h-32 gap-2">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-gray-500 text-sm">Cargando datos...</p>
      </div>

      <form v-else @submit.prevent="save" class="space-y-3">
        <div>
          <label class="label"><span class="label-text">Título</span></label>
          <input v-model="form.Titulo" class="input input-bordered w-full" placeholder="Título del libro" />
          <p v-if="errors.Titulo" class="text-xs text-error mt-1">{{ errors.Titulo }}</p>
        </div>

        <div>
          <label class="label"><span class="label-text">ISBN</span></label>
          <input v-model="form.ISBN" class="input input-bordered w-full" placeholder="ISBN" />
          <p v-if="errors.ISBN" class="text-xs text-error mt-1">{{ errors.ISBN }}</p>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label"><span class="label-text">Año</span></label>
            <input type="number" v-model.number="form.AnioPublicacion" class="input input-bordered w-full" />
            <p v-if="errors.AnioPublicacion" class="text-xs text-error mt-1">{{ errors.AnioPublicacion }}</p>
          </div>
          <div>
            <label class="label"><span class="label-text">Stock</span></label>
            <input type="number" v-model.number="form.Stock" class="input input-bordered w-full" />
            <p v-if="errors.Stock" class="text-xs text-error mt-1">{{ errors.Stock }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label"><span class="label-text">Autor</span></label>
            <select v-model.number="form.AutorID" class="select select-bordered w-full">
              <option :value="0" disabled>Seleccionar...</option>
              <option v-for="autor in authors" :key="autor.AutorID" :value="autor.AutorID">
                {{ autor.Nombre }}
              </option>
            </select>
            <p v-if="errors.AutorID" class="text-xs text-error mt-1">{{ errors.AutorID }}</p>
          </div>

          <div>
            <label class="label"><span class="label-text">Categoría</span></label>
            <select v-model.number="form.CategoriaID" class="select select-bordered w-full">
              <option :value="0" disabled>Seleccionar...</option>
              <option v-for="cat in categories" :key="cat.CategoriaID" :value="cat.CategoriaID">
                {{ cat.NombreCategoria }}
              </option>
            </select>
            <p v-if="errors.CategoriaID" class="text-xs text-error mt-1">{{ errors.CategoriaID }}</p>
          </div>
        </div>

        <div>
          <label class="label"><span class="label-text">Portada (Opcional)</span></label>
          <input
              type="file"
              @change="handleFileUpload"
              accept="image/png, image/jpeg, image/webp"
              class="file-input file-input-bordered w-full"
          />
        </div>

        <div v-if="errors.global" class="alert alert-error text-sm mt-2">
          {{ errors.global }}
        </div>

        <div class="modal-action mt-6">
          <button type="button" class="btn" @click="close">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="isSaving">
            <span v-if="isSaving" class="loading loading-spinner loading-xs"></span>
            {{ isSaving ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop"><button @click="close" /></form>
  </dialog>
</template>