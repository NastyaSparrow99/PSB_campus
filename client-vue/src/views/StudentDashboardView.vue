<template>
  <topBar />
  <section class="student-dashboard">
    <h1 class="student-dashboard__title">Кабинет студента</h1>

    <p class="student-dashboard__user">
      Текущий пользователь:
      <span class="student-dashboard__user-value">
        {{ authStore.currentUser?.name }}
      </span>
    </p>
    <h2 class="student-dashboard__subtitle">Мои курсы</h2>

    <div class="student-dashboard__courses">
      <p v-if="errorMessage" class="load-courses__error">
        {{ errorMessage }}
      </p>
      <router-link
        v-for="course in courses"
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
import { fetchCoursesByPerson } from '@/services/api'
import { Course } from '@/services/api'
import { RouteName } from '@/constants/route-names'
import { useAuthStore } from '@/stores/auth-store'
import TopBar from '@/components/TopBar.vue'
const courses = ref<Course[]>([])
const errorMessage = ref('')
const router = useRouter()
const authStore = useAuthStore()

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

function handleLogout() {
  authStore.logout()

  router.push({
    //navigate('/student')
    name: RouteName.Login,
  })
}
loadCoursesByPerson()
</script>

<style scoped>
.student-dashboard {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48px;
  background:
    radial-gradient(circle at 15% 15%, rgba(108, 92, 231, 0.16) 0%, transparent 34%),
    radial-gradient(circle at 85% 20%, rgba(74, 107, 255, 0.12) 0%, transparent 34%),
    linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 52%, #16213e 100%);
  color: #ffffff;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.student-dashboard__title {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.student-dashboard__subtitle {
  margin: 36px 0 18px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 750;
  letter-spacing: -0.02em;
}

.student-dashboard__user {
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

.student-dashboard__user-value {
  color: #e5e7eb;
  font-weight: 700;
}

.student-dashboard__courses {
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
}

.student-dashboard__course-card {
  display: block;
  width: 280px;
  min-height: 150px;
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

.student-dashboard__course-title {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.student-dashboard__course-description {
  margin: 0;
  color: #b2bec3;
  font-size: 14px;
  line-height: 1.5;
}

.student-dashboard__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 28px;
}

.student-dashboard__button {
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
  .student-dashboard {
    padding: 32px 20px;
  }

  .student-dashboard__title {
    font-size: 30px;
  }

  .student-dashboard__course-card {
    width: 100%;
  }
}
</style>
