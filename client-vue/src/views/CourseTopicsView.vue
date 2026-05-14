<template>
  <section class="page">
    <RouterLink to="/student" class="back-link">
      ← Вернуться в кабинет
    </RouterLink>
    <h1>Темы курса</h1>
<!-- courseId динамическое значение же из index.js  -->
    <p>
      ID курса из адреса:
      <!-- получает ID курса из URL  -->
      <b>{{ route.params.courseId }}</b> 
    </p>
    <RouterLink :to="`/course/${route.params.courseId}/topic/1`" class="link">
      Открыть тему 1
    </RouterLink>
    </section>
    </template>
<script setup>
import { useRoute } from 'vue-router'
const route = useRoute() //храним в переменной route параметры из URL
</script>

<style scoped>
.page {
  padding: 48px;
}

.back-link,
.link {
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
  margin: 0 0 24px;
  color: #4b5563;
}
</style>