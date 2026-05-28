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
      <p v-if="materials.length === 0" class="course-view__empty">Материалов по теме пока нет</p>

      <div v-else class="course-view__materials-list">
        <button
          v-if="authStore.currentUser?.role === 'teacher'"
          type="button"
          class="course-view__button"
          @click="isDownloadMaterialModalOpen = true"
        >
          <ModalBlock :isOpen="isDownloadMaterialModalOpen">
            <button
              type="button"
              class="course-view__button"
              @click="isDownloadMaterialModalOpen = false"
            >
              Закрыть
            </button>

            <form class="course-view__form" @submit.prevent="handleDownloadMaterial">
              <input
                v-model="materialTitle"
                class="course-view__input"
                type="text"
                placeholder="Название материала"
              />

              <select v-model="materialType" class="course-view__input">
                <option value="text">Текст</option>

                <option value="url">Ссылка</option>
              </select>

              <textarea
                v-model="materialText"
                class="course-view__input"
                placeholder="Текст материала"
              />

              <input
                v-model="materialUrl"
                class="course-view__input"
                type="url"
                placeholder="Ссылка"
              />

              <p v-if="errorMessage" class="course-view__error">
                {{ errorMessage }}
              </p>

              <button type="submit" class="course-view__button">Создать материал</button>
            </form>
          </ModalBlock>
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

import { RouteName } from '@/constants/route-names'
import { useAuthStore } from '@/stores/auth-store'
import { ref } from 'vue'
import {
  fetchDownloadMaterials,
  fetchMaterials,
  fetchTopicById,
  Material,
  Topic,
} from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const topicById = ref<Topic | null>(null)
const errorMessage = ref('')

const materials = ref<Material[]>([])
const isDownloadMaterialModalOpen = ref(false)
const materialTitle = ref('')
const materialType = ref('text')
const materialText = ref('')
const materialUrl = ref('')
//const selectedFile = ref<Filel>

async function loadTopicById() {
  const topicId = Number(route.params.topicId) // // route.params приходит из URL строкой
  try {
    errorMessage.value = '' // очищаем ошибку

    topicById.value = await fetchTopicById(topicId)
  } catch {
    errorMessage.value = 'Не удалось загрузить тему'
  }
}

async function loadMaterials() {
  const courseId = Number(route.params.courseId)
  try {
    errorMessage.value = '' // очищаем ошибку

    materials.value = await fetchMaterials(courseId)
  } catch {
    errorMessage.value = 'Не удалось загрузить материал'
  }
}
async function handleDownloadMaterial() {
  const courseId = Number(route.params.courseId)
  const topicId = Number(route.params.topicId)

  if (!materialTitle.value) {
    errorMessage.value = 'Нет названия'
  }
  try {
    errorMessage.value = ''

    await fetchDownloadMaterials({
      title: materialTitle.value,
      material_type: materialType.value,
      text: materialText.value,
      url: materialUrl.value,
      course: courseId,
      topic: topicId,
    })

    materialTitle.value = ''
    materialType.value = 'text'
    materialText.value = ''
    materialUrl.value = ''

    isDownloadMaterialModalOpen.value = false

    await loadMaterials()
  } catch {
    errorMessage.value = 'Не удалось создать материал'
  }
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
