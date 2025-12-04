<script setup lang="ts">


defineProps({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: '#'
  },
  open: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <li>
    <details :open="open">
      <summary class="text-base font-normal">
        <img :src="icon" class="max-w-8 max-h-8" alt="" />
        {{ name }}
      </summary>
      <ul>
        <slot></slot>
      </ul>
    </details>
  </li>
</template>