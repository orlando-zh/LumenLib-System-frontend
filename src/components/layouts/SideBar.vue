<script setup lang="ts">
import OptionSidebar from '@/components/layouts/OptionSidebar.vue'
import SubMenu from '@/components/ui/SubMenu.vue'
</script>

<template>
  <aside class="w-64 h-full bg-base-200 flex flex-col">
    <div class="flex-1 overflow-y-auto overflow-x-hidden p-4">
      <ul class="menu rounded-box w-full space-y-2">

        <!-- Home -->
        <OptionSidebar icon="#" route="/admin" name="Inicio" />
        <hr class="my-1.5 border-gray-400" />

        <!-- Bibliotecarios -->
        <OptionSidebar route="/admin/staff" name="Usuarios" icon="#" />
        <hr class="my-1.5 border-gray-400" />

        <OptionSidebar route="/admin/libros" name="Libros" icon="#" />
        <hr class="my-1.5 border-gray-400" />

        <OptionSidebar route="/admin/categorias" name="Categorías" icon="#" />
        <hr class="my-1.5 border-gray-400" />

        <OptionSidebar route="/admin/autores" name="Autores" icon="#" />
        <hr class="my-1.5 border-gray-400" />

        <OptionSidebar route="/admin/prestamos-activos" name="Préstamos Activos" icon="#" />
        <hr class="my-1.5 border-gray-400" />

      </ul>
    </div>
  </aside>
</template>
