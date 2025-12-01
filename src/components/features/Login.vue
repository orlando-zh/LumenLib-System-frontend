<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { z } from 'zod'

// Imports corregidos (carpeta stores en plural)
import { userAuth } from '@/stores/authStore'
import { ROLES } from '@/constants/roles'

const router = useRouter()
const authStore = userAuth()

const email = ref('')
const password = ref('')


const errors = ref<{ email?: string; password?: string; general?: string }>({})

const loginSchema = z.object({
  email: z.string().email("El correo no es válido"),
  password: z.string().min(6, "La contraseña no es valida"),
})

const handleLogin = async () => {
  errors.value = {}

  try {
    loginSchema.parse({
      email: email.value,
      password: password.value,
    })

    const response = await axios.post('http://localhost:4000/api/auth/login', {
      email: email.value,
      password: password.value
    })

    const userData = response.data.user
    const token = response.data.token
    authStore.login(userData, token)
    const role = authStore.getUserRole

    if (role === ROLES.ADMIN || role === ROLES.BIBLIOTECARIO) {
      await router.push({ name: 'admin' })
    } else if (role === ROLES.LECTOR) {
      await router.push('/')
    } else {
      await router.push('/')
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err: any) => {
        if (err.path[0] === 'email') {
          errors.value.email = err.message
        } else if (err.path[0] === 'password') {
          errors.value.password = err.message
        }
      })
    } else if (axios.isAxiosError(error)) {
      const msg = error.response?.data?.message || 'Credenciales incorrectas'
      errors.value.general = msg
      errors.value.email = msg
    } else {
      console.error('Error durante el login:', error)
    }
  }
}
</script>

<template>
  <fieldset class="fieldset w-full max-w-sm bg-white border border-base-200 p-6 rounded-box shadow-xl">
    <legend class="fieldset-legend text-3xl font-bold text-center mb-4">Iniciar Sesión</legend>

    <!-- Error general de API -->
    <div v-if="errors.general" class="alert alert-error text-sm py-2 mb-4">
      <span>{{ errors.general }}</span>
    </div>

    <label class="fieldset-label font-bold">Correo</label>
    <input type="email" v-model="email" class="input w-full" placeholder="Email" />
    <span v-if="errors.email" class="text-red-500 text-sm mt-1 block">{{ errors.email }}</span>

    <label class="fieldset-label font-bold mt-4">Contraseña</label>
    <input type="password" v-model="password" class="input w-full" placeholder="Password" />
    <span v-if="errors.password" class="text-red-500 text-sm mt-1 block">{{ errors.password }}</span>

    <button class="btn btn-primary w-full mt-6" @click="handleLogin">Login</button>

    <div class="text-center mt-4">
      <a class="link link-info text-sm" @click.prevent="router.push('/forgot-password')">Recuperar Contraseña</a>
    </div>
  </fieldset>
</template>

<style scoped>
</style>