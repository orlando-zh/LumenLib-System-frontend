<script setup lang="ts">
import { ref } from 'vue';

// ⚠️ Usamos la convención estándar de v-model: modelValue
const props = defineProps({
  modelValue: { // Valor de entrada
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Buscar...'
  }
});

// Emite el evento de actualización estándar para v-model
const emit = defineEmits(['update:modelValue']);
</script>

<template>
  <div class="form-control w-full">
    <input
    :value="props.modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    type="text"
    :placeholder="placeholder"
    class="input input-bordered w-full input-sm"
    />
  </div>
</template>