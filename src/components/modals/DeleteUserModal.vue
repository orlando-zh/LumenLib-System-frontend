<script setup lang="ts">
import type { Usuario } from '@/api/interfaces/user.interface';

const props = defineProps<{ user: Usuario; modalId: string }>();

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'confirm'): void;
}>();
</script>

<template>
  <dialog class="modal" open>
    <form method="dialog" class="modal-box">
      <h3 class="font-bold text-lg">Eliminar Usuario</h3>
      <p>¿Estás seguro que deseas eliminar al usuario <strong>{{ props.user.NombreCompleto }}</strong>?</p>
      <div class="modal-action">
        <button type="button" class="btn btn-ghost" @click="emit('close')">Cancelar</button>
        <button type="button" class="btn btn-error" @click="emit('confirm')">Eliminar</button>
      </div>
    </form>
  </dialog>
</template>
