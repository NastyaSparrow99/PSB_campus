<template>
  <section class="page">
    <h1>Кабинет студента</h1>
    <p>Здесь позже появятся курсы студента.</p>

    <RouterLink to="/course/1/topics" class="link">
      Открыть темы курса
    </RouterLink>
  </section>
</template>

<script setup>
</script>

<style scoped>
.page {
  padding: 48px;
}

h1 {
  margin: 0 0 12px;
  font-size: 36px;
}

p {
  margin: 0 0 24px;
  color: #4b5563;
}

.link {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}
</style>