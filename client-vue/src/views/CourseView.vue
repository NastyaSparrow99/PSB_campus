<template>
  <section class="page">
    <RouterLink
      :to="`/course/${route.params.courseId}/topics`"
      class="back-link"
    >
      ← К списку тем
    </RouterLink>

    <h1>Страница курса</h1>

    <p>
      ID курса:
      <b>{{ route.params.courseId }}</b>
    </p>

    <p v-if="route.params.topicId"> <!-- Если в URL есть topicId -->
      ID темы:
      <b>{{ route.params.topicId }}</b>
    </p>

    <p v-else>  <!-- если нет то undefined -->
      Тема не выбрана. Это старый маршрут курса для обратной совместимости.
    </p>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.page {
  padding: 48px;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

h1 {
  margin: 0 0 12px;
  font-size: 36px;
}

p {
  margin: 0 0 12px;
  color: #4b5563;
}
</style>