<template>
  <section class="course-topics">
    <router-link :to="backRoute" class="course-topics__back-link">
      ← Вернуться в кабинет
    </router-link>

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
    <p v-if="errorMessage" class="course-topics__error">
  {{ errorMessage }}
</p>
<div
  v-if="authStore.currentUser?.role === 'teacher'"
  class="course-topics__create"
>
  <button
    type="button"
    class="course-topics__button"
    @click="handleOpenCreateTopicForm"
  >
    Создать тему
  </button>

  <form
    v-if="isCreateTopicFormVisible"
    class="course-topics__form"
    @submit.prevent="handleCreateTopic"
  >
    <input
      v-model="titleOfTopic"
      class="course-topics__input"
      type="text"
      placeholder="Название темы"
    >

    <input
      v-model="description"
      class="course-topics__input"
      type="text"
      placeholder="Описание темы"
    >

    <p
      v-if="errorMessageCreate"
      class="course-topics__error"
    >
      {{ errorMessageCreate }}
    </p>

    <button
      type="submit"
      class="course-topics__button"
    >
      Добавить
    </button>
  </form>
</div>
    <div class="course-topics__list">
      <router-link
        v-for="topic in topics"
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
      </router-link>
    </div>

    <div class="course-topics__actions">
      <button type="button" class="course-topics__button" @click="handleLogout">Выйти</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { RouteName } from '../constants/route-names'
import { useAuthStore } from '../stores/auth-store'
import { fetchTopicsByCourse , fetchCreateTopic } from '@/services/api'
import { Topic } from '@/services/api'
const topics = ref<Topic[]>([])
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const errorMessage= ref('')
const titleOfTopic = ref('')
const description = ref('')
const isCreateTopicFormVisible = ref(false)
const errorMessageCreate = ref('')
const backRoute = computed(() => ({
  name: authStore.currentUser?.role === 'teacher'
    ? RouteName.TeacherDashboard
    : RouteName.StudentDashboard,
}))

async function loadTopicsByCourse() { //courseId: number
  const courseId = Number(route.params.courseId) // route.params приходит из URL строкой
 if (!authStore.currentUser) {
    return
  }
  try {
    errorMessage.value = '' // очищаем ошибку

    topics.value = await fetchTopicsByCourse(courseId)
  } catch {
    errorMessage.value = 'Не удалось загрузить темы'
  }
}

function handleOpenCreateTopicForm() {
  isCreateTopicFormVisible.value = true
}

async function handleCreateTopic() {
  const courseId = Number(route.params.courseId)
   if (titleOfTopic.value == '') {
    errorMessageCreate.value = 'Нет названия у темы'
    return
  }
   if (!courseId) {
    errorMessageCreate.value = 'Не найден ID курса'
    return
  }

 try {
    errorMessageCreate.value = ''
    topics.value = await fetchTopicsByCourse(courseId)
    await fetchCreateTopic({
      title: titleOfTopic.value,
      description: description.value,
      course: courseId,
    })

    titleOfTopic.value = ''
    description.value = ''
    await loadTopicsByCourse()
  } catch {
    errorMessageCreate.value = 'Не удалось создать тему'
  }
}



function handleLogout() {
  authStore.logout()

  router.push({
    name: RouteName.Login,
  })
}
onMounted(loadTopicsByCourse)
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
.course-topics__create {
  margin-bottom: 24px;
}

.course-topics__form {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.course-topics__input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 16px;
}

.course-topics__error {
  width: 100%;
  margin: 0;
  color: #dc2626;
  font-weight: 700;
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
