<template>
  <section class="course-view">
    <router-link
      :to="{
        name: RouteName.CourseTopics,
        params: { courseId: route.params.courseId }, //в прараметр кладем новый маршрут
      }"
      class="course-view__back-link"
    >
      ← К списку тем
    </router-link>

    <h1 class="course-view__title">Материалы темы</h1>

    <p class="course-view__text">
      ID курса:
      <span class="course-view__value">
        {{ route.params.courseId }}
      </span>
    </p>

    <p class="course-view__text">
      ID темы:
      <span class="course-view__value">
        {{ route.params.topicId }}
      </span>
    </p>

    <p class="course-view__text">
      Пользователь:
      <span class="course-view__value">
        {{ authStore.currentUser?.name }}
      </span>
      —
      <span class="course-view__value">
        {{ authStore.currentUser?.role }}
      </span>
    </p>
<p v-if="errorMessage" class="course-view__error">
  {{ errorMessage }}
</p>
    <div class="course-view__material-card">
      <h2 class="course-view__material-title">Лекция по теме: {{ topicById?.title }}</h2>

      <p class="course-view__material-text">
  {{ topicById?.description }}
      </p>
    </div>

    <div class="course-view__actions">
      <button type="button" class="course-view__button" @click="handleLogout">Выйти</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

import { RouteName } from '@/constants/route-names'
import { useAuthStore } from '@/stores/auth-store'
import { onMounted, ref } from 'vue'
import { fetchTopicById, Topic } from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const topicById =ref<Topic | null>(null)
const errorMessage = ref('')

async function loadTopicById() { 
  const topicId = Number(route.params.topicId) // // route.params приходит из URL строкой
  try {
    errorMessage.value = '' // очищаем ошибку

    topicById.value = await fetchTopicById(topicId)
  } catch {
    errorMessage.value = 'Не удалось загрузить тему'
  }
}

function handleLogout() {
  authStore.logout()

  router.push({
    name: RouteName.Login,
  })
}
onMounted(loadTopicById)
</script>

<style scoped>
.course-view {
  padding: 48px;
}

.course-view__back-link {
  display: inline-block;
  margin-bottom: 24px;
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
}

.course-view__title {
  margin: 0 0 12px;
  font-size: 36px;
}

.course-view__text {
  margin: 0 0 16px;
  color: #4b5563;
}

.course-view__value {
  color: #111827;
  font-weight: 700;
}

.course-view__material-card {
  max-width: 600px;
  margin-top: 32px;
  padding: 24px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.course-view__material-title {
  margin: 0 0 12px;
  font-size: 24px;
}

.course-view__material-text {
  margin: 0;
  color: #4b5563;
}

.course-view__actions {
  margin-top: 24px;
}

.course-view__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: white;
  font-weight: 700;
  cursor: pointer;
}
</style>
