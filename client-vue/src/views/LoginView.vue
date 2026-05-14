<template>
  <section  class="page">
    <h1>PSB Campus</h1>
    <p>страница входа в систему</p>
    <nav class="demo-nav">
        <RouterLink to="/student">Перейти в кабинет студента</RouterLink>
      <RouterLink to="/teacher">Перейти в кабинет преподавателя</RouterLink>
    </nav>
  </section>
</template>

<script setup>

</script>

<style scoped>
.page {
  min-height: 100vh;
  padding: 48px;
}

h1 {
  margin: 0 0 12px;
  font-size: 40px;
}

p {
  margin: 0 0 24px;
  color: #4b5563;
}

.demo-nav {
  display: flex;
  gap: 16px;
}

.demo-nav a {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}
</style>