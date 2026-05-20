<template>
  <section class="student-dashboard">
    <h1 class="student-dashboard__title">Кабинет студента</h1>

    <p class="student-dashboard__user">
      Текущий пользователь:
      <span class="student-dashboard__user-value">
        {{ authStore.currentUser?.name }}
      </span>
      —
      <span class="student-dashboard__user-value">
        {{ authStore.currentUser?.role }}
      </span>
    </p>

    <h2 class="student-dashboard__subtitle">Мои курсы</h2>

    <div class="student-dashboard__courses">
      <router-link
        v-for="course in Courses"
        :key="course.id"
        :to="{
          name: RouteName.CourseTopics,
          params: { courseId: course.id },
        }"
        class="student-dashboard__course-card"
      >
        <h3 class="student-dashboard__course-title">
          {{ course.title }}
        </h3>

        <p class="student-dashboard__course-description">
          {{ course.description }}
        </p>
      </router-link>
    </div>

    <div class="student-dashboard__actions">
      <button type="button" class="student-dashboard__button" @click="handleLogout">Выйти</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { RouteName } from '../constants/route-names'
import { useAuthStore } from '../stores/auth-store'

interface Course {
  id: number
  title: string
  description: string
}

const router = useRouter()
const authStore = useAuthStore()

const Courses = ref<Course[]>([
  {
    id: 1,
    title: 'Механика',
    description: 'Курс с материалами и домашними заданиями',
  },
  {
    id: 2,
    title: 'Программирование',
    description: 'Базовый курс по разработке',
  },
])

function handleLogout() {
  authStore.logout()

  router.push({
    //navigate('/student')
    name: RouteName.Login,
  })
}
</script>

<style scoped>
.student-dashboard {
  padding: 48px;
}

.student-dashboard__title {
  margin: 0 0 12px;
  font-size: 36px;
}

.student-dashboard__subtitle {
  margin: 32px 0 16px;
  font-size: 24px;
}

.student-dashboard__user {
  margin: 0 0 16px;
  color: #4b5563;
}

.student-dashboard__user-value {
  color: #111827;
  font-weight: 700;
}

.student-dashboard__courses {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.student-dashboard__course-card {
  display: block;
  width: 260px;
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
  color: #111827;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.student-dashboard__course-card:hover {
  transform: translateY(-2px);
}

.student-dashboard__course-title {
  margin: 0 0 8px;
  font-size: 20px;
}

.student-dashboard__course-description {
  margin: 0;
  color: #4b5563;
}

.student-dashboard__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
}

.student-dashboard__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>
