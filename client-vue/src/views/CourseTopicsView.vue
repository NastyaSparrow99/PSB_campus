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
      Текущий пользователь:
      <b>{{ authStore.currentUser?.name }}</b>
    </p>

    <p>
      Роль:
      <b>{{ authStore.currentUser?.role }}</b>
    </p>

    <p>
      ID курса:
      <b>{{ route.params.courseId }}</b>
    </p>

    <p v-if="route.params.topicId">
      ID темы:
      <b>{{ route.params.topicId }}</b>
    </p>

    <p v-else>
      Тема не выбрана. Это старый маршрут курса для обратной совместимости.
    </p>

    <button type="button"  v-on:click="logout">
      Выйти
    </button>
  </section>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

function logout() {
  authStore.logout()
  router.push('/')
}
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
  margin: 0 0 16px;
  color: #4b5563;
}

button {
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>