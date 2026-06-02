<template>
  <section class="course-view">
    <router-link
      :to="{
        name: RouteName.CourseTopics,
        params: { courseId: route.params.courseId },
      }"
      class="course-view__back-link"
    >
      ← К списку тем
    </router-link>

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
    <section v-if="topicById" class="course-view__topic-card">
      <p class="course-view__label">Тема</p>

      <h1 class="course-view__title">
        {{ topicById.title }}
      </h1>

      <p class="course-view__topic-description">
        {{ topicById.description }}
      </p>
    </section>
    <section class="course-view__materials">
      <div class="course-view__section-header">
        <h2 class="course-view__subtitle">Материалы темы</h2>
        <span class="course-view__count">
          {{ materials.length }}
        </span>
      </div>
      <p v-if="!materials.length" class="course-view__empty">Материалов по теме пока нет</p>

      <div v-else class="course-view__materials-list">
        <button
          v-if="authStore.currentUser?.role === 'teacher'"
          type="button"
          class="course-view__button"
          @click="handleOpenCreateMaterialModal"
        >
          Добавить материал
        </button>
        <article
          v-for="material in materials"
          :key="material.id"
          class="course-view__material-item"
        >
          <div class="course-view__material-content">
            <h3 class="course-view__material-title">
              {{ material.title }}
            </h3>

            <p class="course-view__material-text">
              {{ material.text }}
            </p>
          </div>
          <div class="course-view__material-actions">
            <a v-if="material.url" :href="material.url" class="course-view__material-link">
              Открыть ссылку
            </a>

            <a v-if="material.file" :href="material.file" class="course-view__material-link">
              Открыть файл
            </a>
          </div>
        </article>
      </div>
    </section>
    <div class="course-view__actions">
      <button type="button" class="course-view__button" @click="handleLogout">Выйти</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { openModal } from 'jenesius-vue-modal'
import CreateMaterialModal from '@/components/CreateMaterialModal.vue'
import { RouteName } from '@/constants/route-names'
import { useAuthStore } from '@/stores/auth-store'
import { ref } from 'vue'
import { fetchMaterials, fetchTopicById, Material, Topic } from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const topicById = ref<Topic | null>(null)
const errorMessage = ref('')
const materials = ref<Material[]>([])

async function loadTopicById() {
  const [topicId] = Object.keys(route.params).map((key) => Number(route.params[key]))
  try {
    errorMessage.value = '' // очищаем ошибку

    topicById.value = await fetchTopicById(topicId)
  } catch {
    errorMessage.value = 'Не удалось загрузить тему'
  }
}

async function loadMaterials() {
  //const courseId = Number(route.params.courseId)
  // Из URL достаём courseId, потому что материалы загружаются по курсу
  // route.params.courseId приходит строкой, поэтому преобразуем значение в число
  const [courseId] = Object.keys(route.params).map((key) => Number(route.params[key]))
  try {
    errorMessage.value = '' // очищаем ошибку

    materials.value = await fetchMaterials(courseId)
  } catch {
    errorMessage.value = 'Не удалось загрузить материал'
  }
}
async function handleOpenCreateMaterialModal() {
  //const courseId = Number(route.params.courseId)
  //const topicId = Number(route.params.topicId)

  // Object.keys(route.params) берёт все ключи параметров маршрута.
  // для пути /course/:courseId/topic/:topicId первым будет courseId, вторым topicId
  const [courseId, topicId] = Object.keys(route.params).map((key) => Number(route.params[key]))

  await openModal(CreateMaterialModal, { courseId, topicId, onCreated: loadMaterials })
}

function handleLogout() {
  authStore.logout()

  router.push({
    name: RouteName.Login,
  })
}
loadTopicById()
loadMaterials()
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
.course-view__count {
  min-width: 28px;
  border-radius: 999px;
  padding: 4px 10px;
  background-color: #e5e7eb;
  color: #374151;
  font-weight: 700;
  text-align: center;
}

.course-view__empty {
  margin: 0;
  padding: 20px 24px;
  border-radius: 16px;
  background-color: #ffffff;
  color: #6b7280;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.course-view__materials-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-view__material-item {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 20px 24px;
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.course-view__material-content {
  min-width: 0;
}

.course-view__material-title {
  margin: 0 0 8px;
  font-size: 20px;
  color: #111827;
}

.course-view__material-text {
  margin: 0;
  color: #4b5563;
  line-height: 1.5;
}

.course-view__material-actions {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 8px;
}

.course-view__material-link {
  color: #2563eb;
  font-weight: 700;
  text-decoration: none;
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
