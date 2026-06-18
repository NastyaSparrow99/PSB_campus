<template>
  <topBar />
  <section class="teacher-dashboard">
    <h1 class="teacher-dashboard__title">Кабинет преподавателя:</h1>
    <p class="teacher-dashboard__user">
      Текущий пользователь:
      <span class="teacher-dashboard__user-value">
        {{ authStore.currentUser?.name }}
      </span>
    </p>
    <h2 class="teacher-dashboard__subtitle">Созданные курсы</h2>

    <button
      type="button"
      class="teacher-dashboard__button-form"
      @click="handleOpenCreateCourseModal"
    >
      Создать курс
    </button>

    <div class="teacher-dashboard__form"></div>
    <div class="teacher-dashboard__courses">
      <p v-if="errorMessage" class="load-courses__error">
        {{ errorMessage }}
      </p>
      <div v-for="course in courses" :key="course.id" class="teacher-dashboard__course-card">
        <div class="teacher-dashboard__course-header">
          <h3 class="teacher-dashboard__course-title">
            {{ course.title }}
          </h3>
          <button
            type="button"
            class="teacher-dashboard__course-delete"
            @click="handleDeleteCourse(course.id)"
          >
            Удалить
          </button>
        </div>

        <p class="teacher-dashboard__course-description">
          {{ course.description }}
        </p>

        <router-link
          :to="{
            name: RouteName.CourseTopics,
            params: { courseId: course.id },
          }"
          class="teacher-dashboard__course-link"
        >
          Открыть курс
        </router-link>
      </div>
    </div>

    <div class="teacher-dashboard__actions">
      <button type="button" class="teacher-dashboard__button" @click="handleLogout">Выйти</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Course } from '@/services/api'
import { RouteName } from '@/constants/route-names'
import { useAuthStore } from '@/stores/auth-store'
import { fetchCoursesByPerson, fetchDeleteCourse } from '@/services/api'
import { openModal } from 'jenesius-vue-modal'
import CreateCourseModal from '@/components/CreateCourseModal.vue'
import TopBar from '@/components/TopBar.vue'
const router = useRouter()
const authStore = useAuthStore()
const courses = ref<Course[]>([])
const errorMessage = ref('')
async function loadCoursesByPerson() {
  if (!authStore.currentUser) {
    return
  }
  try {
    errorMessage.value = '' // очищаем ошибку

    courses.value = await fetchCoursesByPerson(authStore.currentUser.id) //загружаем польз.
  } catch {
    errorMessage.value = 'Не удалось загрузить курсы'
  }
}
async function handleOpenCreateCourseModal() {
  if (!authStore.currentUser) {
    return
  }

  await openModal(CreateCourseModal, {
    // пропсы
    teacherId: authStore.currentUser.id,
    onCreated: loadCoursesByPerson,
  })
}
async function handleDeleteCourse(courseId: number) {
  try {
    await fetchDeleteCourse(courseId)

    await loadCoursesByPerson()
  } catch {
    errorMessage.value = 'Не удалось удалить курс'
  }
  await loadCoursesByPerson()
}


function handleLogout() {
  authStore.logout()

  router.push({
    name: RouteName.Login,
  })
}
loadCoursesByPerson()
</script>

<style scoped>


.teacher-dashboard {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48px;
  background:
    radial-gradient(circle at 15% 15%, rgba(108, 92, 231, 0.16) 0%, transparent 34%),
    radial-gradient(circle at 85% 20%, rgba(74, 107, 255, 0.12) 0%, transparent 34%),
    linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 52%, #16213e 100%);
  color: #ffffff;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.teacher-dashboard__title {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.teacher-dashboard__subtitle {
  margin: 36px 0 18px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.teacher-dashboard__user {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  margin: 0 0 18px;
  padding: 10px 16px;
  border: 1px solid rgba(148, 163, 184, 0.45);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  color: #9ca3af;
  font-size: 14px;
}

.teacher-dashboard__user-value {
  color: #e5e7eb;
  font-weight: 700;
}

.teacher-dashboard__button-form {
  margin: 0 0 24px;
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

.teacher-dashboard__form {
  display: none;
}

.teacher-dashboard__courses {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.teacher-dashboard__course-card {
  display: block;
  width: 280px;
  min-height: 170px;
  box-sizing: border-box;
  padding: 22px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background:
    radial-gradient(circle at top left, rgba(148, 163, 248, 0.16), transparent 42%),
    rgba(25, 25, 35, 0.82);
  color: #ffffff;
  text-decoration: none;
  box-shadow:
    0 18px 34px rgba(0, 0, 0, 0.32),
    0 0 0 1px rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(18px);
}

.teacher-dashboard__course-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 10px;
}

.teacher-dashboard__course-title {
  margin: 0;
  color: #ffffff;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.teacher-dashboard__course-delete {
  flex-shrink: 0;
  border: 1px solid rgba(248, 113, 113, 0.35);
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(127, 29, 29, 0.28);
  color: #fecaca;
  font-size: 12px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.teacher-dashboard__course-description {
  margin: 0 0 18px;
  color: #b2bec3;
  font-size: 14px;
  line-height: 1.5;
}

.teacher-dashboard__course-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  border-radius: 10px;
  padding: 10px 14px;
  background: rgba(108, 92, 231, 0.18);
  color: #c4b5fd;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
}

.teacher-dashboard__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 28px;
}

.teacher-dashboard__button {
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #6c5ce7 0%, #5d4fd6 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.28);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.load-courses__error {
  width: 100%;
  margin: 0 0 16px;
  padding: 14px 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-size: 14px;
}

@media (max-width: 768px) {
  .teacher-dashboard {
    padding: 32px 20px;
  }

  .teacher-dashboard__title {
    font-size: 30px;
  }

  .teacher-dashboard__course-card {
    width: 100%;
  }
}

</style>
