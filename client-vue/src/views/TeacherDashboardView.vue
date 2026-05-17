<template>
  <section class="page">
    <h1>Кабинет преподавателя</h1>

    <p>
      Текущий пользователь:
      <b>{{ authStore.currentUser?.name }}</b>
      —
      <b>{{ authStore.currentUser?.role }}</b>
    </p>

    <h2>Мои курсы</h2>

    <div class="courses">
      <RouterLink
        v-for="course in demoCourses"
        :key="course.id"
        :to="`/course/${course.id}/topics`"
        class="course-card"
      >
        <h3>{{ course.title }}</h3>
        <p>{{ course.description }}</p>
      </RouterLink>
    </div>

    <div class="actions">
      <button type="button" @click="logout">
        Выйти
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const demoCourses = ref([
  {
    id: 1,
    title: 'Механика',
    description: 'Курс с темами, материалами и заданиями',
  },
  {
    id: 2,
    title: 'Программирование',
    description: 'Курс для студентов по основам разработки',
  },
])

function logout() {
  authStore.logout()
  router.push('/')
}
</script>

<style scoped>
.page {
  padding: 48px;
}

h1 {
  margin: 0 0 12px;
  font-size: 36px;
}

h2 {
  margin: 32px 0 16px;
  font-size: 24px;
}

p {
  margin: 0 0 16px;
  color: #4b5563;
}

.courses {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.course-card {
  display: block;
  width: 260px;
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
  color: #111827;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.course-card h3 {
  margin: 0 0 8px;
  font-size: 20px;
}

.course-card p {
  margin: 0;
}

.course-card:hover {
  transform: translateY(-2px);
}

.actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
}

button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>