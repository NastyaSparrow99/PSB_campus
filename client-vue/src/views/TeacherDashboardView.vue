<template>
  <section class="teacher-dashboard">
    <h1 class="teacher-dashboard__title">Кабинет преподавателя:</h1>

    <p class="teacher-dashboard__user">
      Текущий пользователь:
      <span class="teacher-dashboard__user-value">
        {{ authStore.currentUser?.name }}
      </span>
    </p>

    <h2 class="teacher-dashboard__subtitle">Созданные курсы</h2>
    <button type="button" class="teacher-dashboard__button-form" @click="handleOpenForm">
      Создать курс
    </button>
    <ModalBlock :is-open="isCreateTopicModalOpen">
      <button type="button" class="course-topics__button" @click="isCreateTopicModalOpen = false">
        Закрыть
      </button>

      <form v-if="isCreateFormVisible" @submit.prevent="handleSubmit">
        <input v-model="title" type="text" />
        <input v-model="description" type="text" />
        <button type="submit">Создать</button>
      </form>
    </ModalBlock>

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
import { fetchCoursesByPerson, fetchCreateCourse, fetchDeleteCourse } from '@/services/api'
import ModalBlock from '@/components/ModalBlock.vue'
const router = useRouter()
const authStore = useAuthStore()
const courses = ref<Course[]>([])
const errorMessage = ref('')
const errorMessageCreate = ref('')
const title = ref('') //записываем текст из input
const description = ref('')
const isCreateTopicModalOpen = ref(false)

const isCreateFormVisible = ref(false)

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
function handleOpenForm() {
  isCreateFormVisible.value = true
}
async function handleSubmit() {
  if (title.value == '') {
    errorMessageCreate.value = 'Нет названия у курса'
    return
  }
  if (!authStore.currentUser) {
    return
  }
  try {
    await fetchCreateCourse({
      title: title.value,
      description: description.value,
      teacher: authStore.currentUser.id,
    })
  } catch {
    errorMessageCreate.value = 'Не удалось создать курс'
  }
  await loadCoursesByPerson() //обновляем курсы
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
.teacher-dashboard__course-delete {
  border: none;
  background: none;
  color: #dc2626;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
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
