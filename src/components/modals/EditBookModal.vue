<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { updateBook } from '@/api/services/book.service'
import categoryService from '@/api/services/category.service.ts'
import * as authorService from '@/api/services/author.service.ts'
import type { Libro, UpdateBookDTO } from '@/api/interfaces/book.interface'
import type { Category } from '@/api/interfaces/category.interfaces'
import type { Autor } from '@/api/interfaces/author.interface'

interface Props {
  book: Libro
}

const props = defineProps<Props>()
const emit = defineEmits(['close', 'book-updated'])

// Formulario reactivo
const form = reactive<UpdateBookDTO & { imagen?: File | null }>({
  Titulo: props.book.Titulo,
  ISBN: props.book.ISBN,
  AnioPublicacion: props.book.AnioPublicacion,
  Stock: props.book.Stock,
  AutorID: Number(props.book.AutorID),
  CategoriaID: Number(props.book.CategoriaID),
  imagen: undefined
})

const isSaving = ref(false)
const isLoadingDependencies = ref(true)
const errors = ref<Record<string,string>>({})
const categories = ref<Category[]>([])
const authors = ref<Autor[]>([])

// Cargar autores y categorías desde API
onMounted(async () => {
  try {
    categories.value = await categoryService.getAll()
    authors.value = await authorService.getAllAuthors()

    // Buscar el autor y categoría por nombre
    const autor = authors.value.find(a => a.Nombre === props.book.NombreAutor)
    const categoria = categories.value.find(c => c.NombreCategoria === props.book.NombreCategoria)

    form.AutorID = autor ? autor.AutorID : 0
    form.CategoriaID = categoria ? categoria.CategoriaID : 0

    // Si no existen, los agregamos al inicio
    if (!autor && props.book.NombreAutor) {
      authors.value.unshift({ AutorID: 0, Nombre: props.book.NombreAutor, Nacionalidad: '' })
    }
    if (!categoria && props.book.NombreCategoria) {
      categories.value.unshift({ CategoriaID: 0, NombreCategoria: props.book.NombreCategoria })
    }
  } catch (err) {
    console.error('Error cargando dependencias:', err)
    errors.value.global = 'No se pudieron cargar autores o categorías.'
  } finally {
    isLoadingDependencies.value = false
  }
})

// Manejar subida de archivo
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    form.imagen = target.files[0]
  }
}

// Validación
const validate = () => {
  errors.value = {}
  if (!form.Titulo || !String(form.Titulo).trim()) errors.value.Titulo = 'Título requerido'
  if (!form.ISBN || !String(form.ISBN).trim()) errors.value.ISBN = 'ISBN requerido'
  if (!form.AnioPublicacion) errors.value.AnioPublicacion = 'Año requerido'
  if (form.Stock === undefined || form.Stock < 0) errors.value.Stock = 'Stock inválido'
  if (!form.AutorID || form.AutorID === 0) errors.value.AutorID = 'Selecciona un autor'
  if (!form.CategoriaID || form.CategoriaID === 0) errors.value.CategoriaID = 'Selecciona una categoría'
  return Object.keys(errors.value).length === 0
}

// Guardar libro
const save = async () => {
  if (!validate()) return
  isSaving.value = true
  try {
    const updated = await updateBook(props.book.LibroID, form)
    emit('book-updated', updated)
    emit('close')
  } catch (err: any) {
    console.error('Error actualizando libro:', err)
    errors.value.global = err?.response?.data?.message || 'Error al actualizar el libro.'
  } finally {
    isSaving.value = false
  }
}

const close = () => emit('close')
</script>

<template>
  <dialog class="modal modal-open">
    <div class="modal-box w-full max-w-lg">
      <h3 class="font-bold text-lg mb-4">Editar Libro</h3>

      <div v-if="isLoadingDependencies" class="flex flex-col justify-center items-center h-32 gap-2">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="text-gray-500 text-sm">Cargando datos...</p>
      </div>

      <form v-else @submit.prevent="save" class="space-y-3">
        <!-- Título -->
        <div>
          <label class="label"><span class="label-text">Título</span></label>
          <input v-model="form.Titulo" class="input input-bordered w-full" placeholder="Título del libro" />
          <p v-if="errors.Titulo" class="text-xs text-error mt-1">{{ errors.Titulo }}</p>
        </div>

        <!-- ISBN -->
        <div>
          <label class="label"><span class="label-text">ISBN</span></label>
          <input v-model="form.ISBN" class="input input-bordered w-full" placeholder="ISBN" />
          <p v-if="errors.ISBN" class="text-xs text-error mt-1">{{ errors.ISBN }}</p>
        </div>

        <!-- Año y Stock -->
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

        <!-- Autor y Categoría -->
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="label"><span class="label-text">Autor</span></label>
            <select v-model="form.AutorID" class="select select-bordered w-full">
              <option :value="0" disabled>Seleccionar...</option>
              <option v-for="autor in authors" :key="autor.AutorID" :value="autor.AutorID">
                {{ autor.Nombre }}
              </option>
            </select>
            <p v-if="errors.AutorID" class="text-xs text-error mt-1">{{ errors.AutorID }}</p>
          </div>

          <div>
            <label class="label"><span class="label-text">Categoría</span></label>
            <select v-model="form.CategoriaID" class="select select-bordered w-full">
              <option :value="0" disabled>Seleccionar...</option>
              <option v-for="cat in categories" :key="cat.CategoriaID" :value="cat.CategoriaID">
                {{ cat.NombreCategoria }}
              </option>
            </select>
            <p v-if="errors.CategoriaID" class="text-xs text-error mt-1">{{ errors.CategoriaID }}</p>
          </div>
        </div>

        <!-- Portada -->
        <div>
          <label class="label"><span class="label-text">Portada (Opcional)</span></label>
          <input
              type="file"
              @change="handleFileUpload"
              accept="image/png, image/jpeg, image/webp"
              class="file-input file-input-bordered w-full"
          />
        </div>

        <!-- Errores globales -->
        <div v-if="errors.global" class="alert alert-error text-sm mt-2">
          {{ errors.global }}
        </div>

        <!-- Botones -->
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
