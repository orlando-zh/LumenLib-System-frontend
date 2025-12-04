<script setup lang="ts">
import { userAuth } from '@/stores/authStore.ts'

const authStore = userAuth();
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="flex-1">
      <div class="flex">
        <img src="../../asset/user.png" alt="logo" class="max-w-11 max-h-11"/>
        <a class="btn btn-ghost text-2xl">LumenLib</a>
      </div>
    </div>
    <div class="flex gap-2">

      <div class="flex-col px-4 text-center" v-if="authStore.user">
        <p class="text-xl font-bold">{{ authStore.user.NombreCompleto }}</p>
        <p class="text-sm text-gray-500">{{ authStore.user.Rol }}</p>
      </div>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img
                alt="Tailwind CSS Navbar component"
                src="../../assets/icons/user.png" />
          </div>
        </div>
        <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">

          <li><a>Settings</a></li>
          <li><button v-if="authStore.isAuthenticated" @click="authStore.logout()">Cerrar sección</button></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
