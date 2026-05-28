<template>
  <div v-if="isOpen" class="modal">
    <!--isOpen переменная,которую модалка получает -->
  </div>
</template>
<script setup lang="ts">
defineProps<{
  isOpen: boolean
}>()
</script>

<style scoped>
.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.4);
}
</style>
