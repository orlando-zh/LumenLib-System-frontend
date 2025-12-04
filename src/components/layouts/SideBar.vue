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


        <!-- Libros -->
        <SubMenu name="Libros">
          <OptionSidebar route="/admin/journal-list" name="Libro diario" icon="#" />
          <OptionSidebar route="/admin/general-ledger" name="Libro mayor" icon="#" />
          <OptionSidebar route="/admin/trial-balance" name="Balance de comprobación" icon="#" />
          <OptionSidebar route="/admin/financial-statements" name="Estados financieros" icon="#" />
        </SubMenu>
      </ul>
    </div>
  </aside>
</template>
