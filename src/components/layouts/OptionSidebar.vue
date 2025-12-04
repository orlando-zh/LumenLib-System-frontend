<script setup lang="ts">
import { RouterLink } from 'vue-router'

defineProps({
  name: {
    type: String,
    required: true
  },
  route: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

<template>
  <li>
    <RouterLink :to="route" class="text-base">
      <img :href="icon" class="max-w-8 max-h-8">
      {{name}}
    </RouterLink>
  </li>

</template>
