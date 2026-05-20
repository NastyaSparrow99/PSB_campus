<template>
  <div class="app">
    <!-- Router вствляет текущую страницу в зависимости от URL -->
    <router-view />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.app {
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background-color: #f5f6fa;
  color: #111827;
}
</style>
// scoped- стили действ. только на этот компонент
