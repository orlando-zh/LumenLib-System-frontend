<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import { userAuth } from '@/stores/authStore'
const router = useRouter()
const authStore = userAuth()


const form = reactive({
  email: '',
  password: ''
})

const errors = ref<{ email?: string; password?: string; general?: string }>({})

// Schema de validación (Zod)
const loginSchema = z.object({
  email: z.string().email("El correo no es válido"),
  password: z.string().min(1, "La contraseña es requerida"),
})

const handleLogin = async () => {
  // Limpiar errores previos
  errors.value = {}

  try {
    loginSchema.parse(form)

    await authStore.login({
      email: form.email,
      password: form.password
    })


  } catch (error: any) {
    if (error instanceof z.ZodError) {
      error.issues.forEach((err) => {
        if (err.path[0] === 'email') errors.value.email = err.message
        if (err.path[0] === 'password') errors.value.password = err.message
      })
      return;
    }

    console.error('Error Login:', error);

    if (error.response && error.response.status === 401) {
      errors.value.general = "Correo o contraseña incorrectos.";
    } else if (error.response && error.response.data?.message) {
      errors.value.general = error.response.data.message;
    } else {
      errors.value.general = "Ocurrió un error de conexión. Intenta más tarde.";
    }
  }
}
</script>

<template>
  <fieldset class="fieldset w-full max-w-sm bg-white border border-base-200 p-6 rounded-box shadow-xl">
    <legend class="fieldset-legend text-3xl font-bold text-center mb-4">Iniciar Sesión</legend>

    <div v-if="errors.general" class="alert alert-error text-sm py-2 mb-4 rounded flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{{ errors.general }}</span>
    </div>

    <label class="fieldset-label font-bold">Correo</label>
    <input
        type="email"
        v-model="form.email"
        class="input w-full"
        :class="{ 'input-error': errors.email }"
        placeholder="Email"
        @keyup.enter="handleLogin"
    />
    <span v-if="errors.email" class="text-error text-sm mt-1 block">{{ errors.email }}</span>

    <label class="fieldset-label font-bold mt-4">Contraseña</label>
    <input
        type="password"
        v-model="form.password"
        class="input w-full"
        :class="{ 'input-error': errors.password }"
        placeholder="Password"
        @keyup.enter="handleLogin"
    />
    <span v-if="errors.password" class="text-error text-sm mt-1 block">{{ errors.password }}</span>

    <button class="btn btn-primary w-full mt-6" @click="handleLogin">Login</button>

    <div class="text-center mt-4">
      <a class="link link-info text-sm" @click.prevent="router.push('/forgot-password')">Recuperar Contraseña</a>
    </div>
  </fieldset>
</template>

<style scoped>
/* Opcional: Para feedback visual extra en inputs */
.input-error {
  border-color: #ff5861;
}
</style>