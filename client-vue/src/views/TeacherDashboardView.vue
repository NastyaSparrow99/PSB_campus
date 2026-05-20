<template>
  <section class="teacher-dashboard">
    <h1 class="teacher-dashboard__title">Кабинет преподавателя</h1>

    <p class="teacher-dashboard__user">
      Текущий пользователь:
      <span class="teacher-dashboard__user-value">
        {{ authStore.currentUser?.name }}
      </span>
      —
      <span class="teacher-dashboard__user-value">
        {{ authStore.currentUser?.role }}
      </span>
    </p>

    <h2 class="teacher-dashboard__subtitle">Мои курсы</h2>

    <div class="teacher-dashboard__courses">
      <RouterLink
        v-for="course in demoCourses"
        :key="course.id"
        :to="{
          name: RouteName.CourseTopics,
          params: { courseId: course.id },
        }"
        class="teacher-dashboard__course-card"
      >
        <h3 class="teacher-dashboard__course-title">
          {{ course.title }}
        </h3>

        <p class="teacher-dashboard__course-description">
          {{ course.description }}
        </p>
      </RouterLink>
    </div>

    <div class="teacher-dashboard__actions">
      <button type="button" class="teacher-dashboard__button" @click="handleLogout">Выйти</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { RouteName } from '../constants/route-names'
import { useAuthStore } from '../stores/auth-store'

interface DemoCourse {
  id: number
  title: string
  description: string
}

const router = useRouter()
const authStore = useAuthStore()

const demoCourses = ref<DemoCourse[]>([
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

function handleLogout() {
  authStore.logout()

  router.push({
    name: RouteName.Login,
  })
}
</script>

<style scoped>
.teacher-dashboard {
  padding: 48px;
}

.teacher-dashboard__title {
  margin: 0 0 12px;
  font-size: 36px;
}

.teacher-dashboard__subtitle {
  margin: 32px 0 16px;
  font-size: 24px;
}

.teacher-dashboard__user {
  margin: 0 0 16px;
  color: #4b5563;
}

.teacher-dashboard__user-value {
  color: #111827;
  font-weight: 700;
}

.teacher-dashboard__courses {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.teacher-dashboard__course-card {
  display: block;
  width: 260px;
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
  color: #111827;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.teacher-dashboard__course-card:hover {
  transform: translateY(-2px);
}

.teacher-dashboard__course-title {
  margin: 0 0 8px;
  font-size: 20px;
}

.teacher-dashboard__course-description {
  margin: 0;
  color: #4b5563;
}

.teacher-dashboard__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
}

.teacher-dashboard__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>
