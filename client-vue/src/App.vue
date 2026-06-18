<template>
  <div class="app">
    <!-- Router вствляет текущую страницу в зависимости от URL -->
    <router-view />
     <WidgetContainerModal />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { container as WidgetContainerModal } from 'jenesius-vue-modal'
</script>

<style scoped>

.app {
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f5f6fa;
  color: #111827;
}
</style>
// scoped- стили действ. только на этот компонент

