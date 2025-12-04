<script setup lang="ts">


defineProps({
  name: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    default: false
  }
})

</script>

<template>
  <ul class="menu bg-base-200 rounded-box w-56 m-0 p-0">
    <li>
      <details :open="open" class="text-base">
        <summary class="pl-5">{{name}}</summary>
        <ul>
          <slot></slot>
        </ul>
      </details>
    </li>
  </ul>
</template>
