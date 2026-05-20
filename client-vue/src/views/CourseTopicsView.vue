<template>
  <section class="course-topics">
    <RouterLink :to="backRoute" class="course-topics__back-link">
      ← Вернуться в кабинет
    </RouterLink>

    <h1 class="course-topics__title">Темы курса</h1>

    <p class="course-topics__text">
      ID курса:
      <span class="course-topics__value">
        {{ route.params.courseId }}
      </span>
    </p>

    <p class="course-topics__text">
      Пользователь:
      <span class="course-topics__value">
        {{ authStore.currentUser?.name }}
      </span>
      —
      <span class="course-topics__value">
        {{ authStore.currentUser?.role }}
      </span>
    </p>

    <h2 class="course-topics__subtitle">Темы</h2>

    <div class="course-topics__list">
      <RouterLink
        v-for="topic in demoTopics"
        :key="topic.id"
        :to="{
          name: RouteName.CourseTopic,
          params: {
            courseId: route.params.courseId,
            topicId: topic.id,
          },
        }"
        class="course-topics__topic-card"
      >
        <h3 class="course-topics__topic-title">
          {{ topic.title }}
        </h3>

        <p class="course-topics__topic-description">
          {{ topic.description }}
        </p>
      </RouterLink>
    </div>

    <div class="course-topics__actions">
      <button type="button" class="course-topics__button" @click="handleLogout">Выйти</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { RouteName } from '../constants/route-names'
import { useAuthStore } from '../stores/auth-store'

interface DemoTopic {
  id: number
  title: string
  description: string
}

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const demoTopics = ref<DemoTopic[]>([
  {
    id: 1,
    title: 'Тема 1. Введение',
    description: 'Краткое знакомство с материалами курса',
  },
  {
    id: 2,
    title: 'Тема 2. Практика',
    description: 'Практические задания и дополнительные материалы',
  },
])

const backRoute = computed(() => {
  if (authStore.currentUser?.role === 'teacher') {
    return {
      name: RouteName.TeacherDashboard,
    }
  }

  return {
    name: RouteName.StudentDashboard,
  }
})

function handleLogout() {
  authStore.logout()

  router.push({
    name: RouteName.Login,
  })
}
</script>

<style scoped>
.course-topics {
  padding: 48px;
}

.course-topics__back-link {
  display: inline-block;
  margin-bottom: 24px;
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

.course-topics__title {
  margin: 0 0 12px;
  font-size: 36px;
}

.course-topics__subtitle {
  margin: 32px 0 16px;
  font-size: 24px;
}

.course-topics__text {
  margin: 0 0 16px;
  color: #4b5563;
}

.course-topics__value {
  color: #111827;
  font-weight: 700;
}

.course-topics__list {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.course-topics__topic-card {
  display: block;
  width: 280px;
  padding: 20px;
  border-radius: 16px;
  background-color: #ffffff;
  color: #111827;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.course-topics__topic-title {
  margin: 0 0 8px;
  font-size: 20px;
}

.course-topics__topic-description {
  margin: 0;
  color: #4b5563;
}

.course-topics__actions {
  margin-top: 24px;
}

.course-topics__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>
