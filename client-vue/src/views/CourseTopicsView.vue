<template>
  <topBar />
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
      -
      <span class="course-topics__value">
        {{ authStore.currentUser?.role }}
      </span>
    </p>

    <h2 class="course-topics__subtitle">Темы</h2>
    <p v-if="errorMessage" class="course-topics__error">
      {{ errorMessage }}
    </p>
    <button
      v-if="authStore.currentUser?.role === 'teacher'"
      type="button"
      class="course-topics__button"
      @click="openCreateTopicModal"
    >
      Создать тему
    </button>
   <div class="course-topics__list">
  <article
    v-for="topic in topics"
    :key="topic.id"
    class="course-topics__topic-card"
    :style="{ backgroundColor: getTopicColor(topic) }"
  >
    <router-link
      :to="{
        name: RouteName.CourseTopic,
        params: {
          courseId: route.params.courseId,
          topicId: topic.id,
        },
      }"
      class="course-topics__topic-link"
    >
      <h3 class="course-topics__topic-title">
        {{ topic.title }}
      </h3>

      <p class="course-topics__topic-description">
        {{ topic.description }}
      </p>

      <span class="course-topics__topic-action">
        Перейти к материалам →
      </span>
    </router-link>

    <button
      v-if="authStore.currentUser?.role === 'teacher'"
      type="button"
      class="course-topics__delete-button"
      @click="removeTopic(topic)"
    >
      Удалить
    </button>
  </article>
</div>
</section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute,  } from 'vue-router'
import { RouteName } from '../constants/route-names'
import { useAuthStore } from '../stores/auth-store'
import { fetchTopicsByCourse, Topic, deleteTopic } from '@/services/api'
import { openModal } from 'jenesius-vue-modal'
import CreateTopicModal from '@/components/CreateTopicModal.vue'
const topics = ref<Topic[]>([])
const route = useRoute()

const authStore = useAuthStore()

const errorMessage = ref('')

const backRoute = computed(() => ({
  name:
    authStore.currentUser?.role === 'teacher'
      ? RouteName.TeacherDashboard
      : RouteName.StudentDashboard,
}))
async function openCreateTopicModal() {
  const courseId = Number(route.params.courseId)

  if (!courseId) {
    errorMessage.value = 'Не найден ID курса'
    return
  }

  await openModal(CreateTopicModal, {
    courseId,

    // Когда в CreateTopicModal выполнится emit('created'),
    // здесь вызовется loadTopicsByCourse и список тем обновится.
    onCreated: loadTopicsByCourse,
  })
}
async function loadTopicsByCourse() {
  //courseId: number
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
function getTopicColor(topic: Topic) {
  return topic.color ?? '#9B7EDE'
}
async function removeTopic(topic: Topic) {
  const isConfirmed = window.confirm(`Удалить тему "${topic.title}"?`)

  if (!isConfirmed) {
    return
  }

  try {
    errorMessage.value = ''

    await deleteTopic(topic.id)

    topics.value = topics.value.filter((currentTopic) => currentTopic.id !== topic.id)
  } catch {
    errorMessage.value = 'Не удалось удалить тему'
  }
}
loadTopicsByCourse()
</script>

<style scoped>
.course-topics {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48px;
  background:
    radial-gradient(circle at 14% 16%, rgba(108, 92, 231, 0.18) 0%, transparent 34%),
    radial-gradient(circle at 86% 18%, rgba(79, 192, 232, 0.12) 0%, transparent 32%),
    linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.course-topics__back-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: 28px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 12px;
  padding: 11px 16px;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-weight: 700;
  text-decoration: none;
  backdrop-filter: blur(10px);
}

.course-topics__title {
  margin: 0 0 12px;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #ffffff, #a29bfe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.course-topics__subtitle {
  margin: 36px 0 18px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
}

.course-topics__text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px 14px 0;
  padding: 9px 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  color: #b2bec3;
  font-size: 14px;
}

.course-topics__value {
  color: #ffffff;
  font-weight: 700;
}

.course-topics__error {
  width: 100%;
  box-sizing: border-box;
  margin: 0 0 18px;
  padding: 14px 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-weight: 700;
}

.course-topics__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
  border: none;
  border-radius: 12px;
  padding: 13px 20px;
  background: linear-gradient(135deg, #6c5ce7 0%, #5d4fd6 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.28);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.course-topics__list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(310px, 1fr));
  gap: 22px;
  margin-top: 6px;
}

.course-topics__topic-card {
  position: relative;
  min-height: 190px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 18px;
  overflow: hidden;
  box-shadow:
    0 18px 34px rgba(0, 0, 0, 0.32),
    inset 0 0 0 999px rgba(0, 0, 0, 0.08);
}

.course-topics__topic-link {
  display: flex;
  min-height: 190px;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px;
  color: #ffffff;
  text-decoration: none;
}

.course-topics__topic-title {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.course-topics__topic-description {
  margin: 0;
  color: rgba(255, 255, 255, 0.88);
  font-size: 14px;
  line-height: 1.5;
}

.course-topics__topic-action {
  display: inline-flex;
  margin-top: 22px;
  color: rgba(255, 255, 255, 0.95);
  font-size: 14px;
  font-weight: 700;
}

.course-topics__delete-button {
  position: absolute;
  right: 14px;
  bottom: 14px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  padding: 8px 12px;
  background: rgba(15, 23, 42, 0.34);
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  backdrop-filter: blur(10px);
}

.course-topics__delete-button:hover {
  background: rgba(127, 29, 29, 0.55);
}

@media (max-width: 768px) {
  .course-topics {
    padding: 32px 20px;
  }

  .course-topics__title {
    font-size: 30px;
  }

  .course-topics__list {
    grid-template-columns: 1fr;
  }
}
</style>
