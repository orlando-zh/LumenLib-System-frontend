<script setup lang="ts">
import Navbar from '@/components/layouts/Navbar.vue'
import SideBarLector from '@/components/layouts/SideBarLector.vue';
import { RouterView } from 'vue-router'

</script>


<template>
  <div class="flex flex-col h-screen">
    <Navbar class="sticky top-0 z-50"/>

    <div class="flex flex-1 overflow-hidden">
      <SideBarLector class="h-[calc(100vh-4rem)] overflow-y-auto" />

      <main class="flex-1 p-4 overflow-y-auto bg-gray-100">
        <RouterView />
      </main>
    </div>
  </div>
</template>





<style scoped>

</style>