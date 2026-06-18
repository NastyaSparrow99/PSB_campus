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
      <h2 class="course-view__subtitle">Материалы темы</h2>
      <span class="course-view__count">
        {{ materials.length }}
      </span>
      <button
        v-if="authStore.currentUser?.role === 'teacher'"
        type="button"
        class="course-view__button"
        @click="handleOpenCreateMaterialModal"
      >
        Добавить материал
      </button>
      <p v-if="!materials.length" class="course-view__empty">Материалов по теме пока нет</p>

      <div v-else class="course-view__materials-list">
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
    <section class="course-view__assignments">
      <div class="course-view__section-header">
        <h2 class="course-view__subtitle">Задания курса</h2>

        <span class="course-view__count">
          {{ assignments.length }}
        </span>
      </div>

      <button
        v-if="authStore.currentUser?.role === 'teacher'"
        type="button"
        class="course-view__button"
        @click="handleOpenCreateAssignmentModal"
      >
        Добавить задание
      </button>

      <p v-if="!assignments.length" class="course-view__empty">Заданий пока нет</p>

      <div v-else class="course-view__materials-list">
        <article
          v-for="assignment in assignments"
          :key="assignment.id"
          class="course-view__material-item"
        >
          <div class="course-view__material-content">
            <h3 class="course-view__material-title">
              {{ assignment.title }}
            </h3>

            <p class="course-view__material-text">
              {{ assignment.description }}
            </p>

            <p class="course-view__material-text">Дедлайн: {{ assignment.deadline }}</p>

            <p class="course-view__material-text">
              Максимальная оценка: {{ assignment.max_grade }}
            </p>
            <div v-if="authStore.currentUser?.role === 'teacher'" class="course-view__submissions">
              <h4 class="course-view__submissions-title">Решения студентов</h4>

              <p
                v-if="!getSubmissionsByAssignment(assignment).length"
                class="course-view__material-text"
              >
                Пока никто не отправил решение
              </p>

              <button
                v-for="submission in getSubmissionsByAssignment(assignment)"
                :key="submission.id"
                type="button"
                class="course-view__submission-button"
                @click="handleOpenSubmission(submission, assignment)"
              >
                Решение студента #{{ submission.student }}
              </button>
            </div>
          </div>
          <div
            v-if="authStore.currentUser?.role === 'student' && getCurrentUserSubmission(assignment)"
          >
            <!--текущ студент отправил рещение по конкретному заданию-->
            <p class="course-view__material-text">Решение отправлено</p>
            <p
              v-if="getCurrentUserSubmission(assignment)?.grade !== null"
              class="course-view__material-text"
            >
              Оценка: {{ getCurrentUserSubmission(assignment)?.grade }} / {{ assignment.max_grade }}
            </p>
            <p v-else class="course-view__material-text">Оценка пока не выставлена</p>

            <p
              v-if="getCurrentUserSubmission(assignment)?.teacher_comment"
              class="course-view__material-text"
            >
              Комментарий преподавателя: {{ getCurrentUserSubmission(assignment)?.teacher_comment }}
            </p>
            <!--от-->

            <p v-else class="course-view__material-text">Комментарий пока не оставлен</p>
          </div>
          <button type="button" class="course-view__button" @click="loadComments(assignment)">
            Показать комментарии
          </button>

          <div class="course-view__comments">
            <h4 class="course-view__submissions-title">Комментарии к моему решению</h4>

            <p v-if="!comments.length" class="course-view__material-text">Пока нет комментариев</p>

            <ul v-else class="course-view__comments-list">
              <li v-for="comment in comments" :key="comment.id" class="course-view__comment-item">
                <p class="course-view__material-text">
                  {{ comment.author_name ?? `Пользователь #${comment.author}` }}
                </p>
                <!--имя при наличии или id-->

                <p class="course-view__material-text">
                  {{ comment.text }}
                </p>
              </li>
            </ul>
            <textarea
              v-model="newComment"
              class="course-view__comment-textarea"
              placeholder="Новый комментарий"
            />
            <button
              type="button"
              class="course-view__button"
              :disabled="!newComment.trim()"
              @click="createCommentByAssignment(assignment)"
            >
              Отправить комментарий
            </button>
          </div>

          <button
            v-if="authStore.currentUser?.role === 'student' && !getCurrentUserSubmission(assignment)"
            type="button"
            class="course-view__button"
            @click="handleOpenCreateSubmissionModal(assignment)"
          >
            Отправить решение
          </button>
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
import {
  fetchMaterials,
  fetchTopicById,
  Material,
  Topic,
  Assignment,
  fetchAssignments,
} from '@/services/api'
import CreateAssignmentModal from '@/components/CreateAssignmentModal.vue'
import CreateSubmissionModal from '@/components/CreateSubmissionModal.vue'
import {
  fetchSubmissions,
  Submission,
  getSubmissionComments,
  createSubmissionComment,
  SubmissionComment,
} from '@/services/api'
import SubmissionModal from '@/components/SubmissionModal.vue'
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// route.params хранит параметры из URL.
// Для маршрута /course/:courseId/topic/:topicId первым идёт courseId,
// вторым — topicId. Значения приходят строками, поэтому переводим их в числа.
const [courseId, topicId] = Object.keys(route.params).map((key) => Number(route.params[key]))
const topicById = ref<Topic | null>(null)
const errorMessage = ref('')
const materials = ref<Material[]>([])
const assignments = ref<Assignment[]>([])
const submissions = ref<Submission[]>([])
const comments = ref<SubmissionComment[]>([])
const newComment = ref('')

async function loadTopicById() {
  try {
    errorMessage.value = '' // очищаем ошибку

    topicById.value = await fetchTopicById(topicId)
  } catch {
    errorMessage.value = 'Не удалось загрузить тему'
  }
}
async function loadMaterials() {
  try {
    errorMessage.value = '' // очищаем ошибку

    materials.value = await fetchMaterials(courseId)
  } catch {
    errorMessage.value = 'Не удалось загрузить материал'
  }
}
async function handleOpenCreateMaterialModal() {
  await openModal(CreateMaterialModal, { courseId, topicId, onCreated: loadMaterials })
}

async function loadAssignments() {
  try {
    errorMessage.value = '' // очищаем ошибку
    assignments.value = await fetchAssignments(courseId)
  } catch {
    errorMessage.value = 'Не удалось загрузить задания'
  }
}

async function handleOpenCreateAssignmentModal() {
  await openModal(CreateAssignmentModal, {
    courseId,
    onCreated: loadAssignments,
  })
}

async function loadSubmissions() {
  try {
    errorMessage.value = ''
    submissions.value = await fetchSubmissions()
  } catch {
    errorMessage.value = 'Не удалось загрузить решения'
  }
}

async function handleOpenCreateSubmissionModal(assignment: Assignment) {
  if (!authStore.currentUser) {
    errorMessage.value = 'Пользователь не найден'
    return
  }
  await openModal(CreateSubmissionModal, {
    assignment, // объект
    studentId: authStore.currentUser.id,
    //Когда решение создано ,то заново загружаем список решений
    onCreated: loadSubmissions,
  })
}
function getCurrentUserSubmission(assignment: Assignment) {
  return (
    submissions.value.find(
      (submission) =>
        submission.assignment === assignment.id && //id задания в решении совпадает с id нужного задания.Возвр бъект
        submission.student === authStore.currentUser?.id,
    ) ?? null
  )
}
function getSubmissionsByAssignment(assignment: Assignment) {
  return submissions.value.filter(
    (submission) => submission.assignment === assignment.id, //для концретного задания решения студентов фильтруем
  )
}
async function handleOpenSubmission(submission: Submission, assignment: Assignment) {
  await openModal(SubmissionModal, {
    submission,
    assignment,
    onUpdated: loadSubmissions,
  })
}
async function loadCommentsBySubmission(submissionId: number) {
  try {
    errorMessage.value = ''

    comments.value = await getSubmissionComments(submissionId)
  } catch {
    errorMessage.value = 'Не удалось загрузить комментарии'
  }
}

async function createComment(submission: Submission) {
  if (!authStore.currentUser) {
    errorMessage.value = 'Пользователь не найден'
    return
  }
  try {
    errorMessage.value = ''

    const createdComment = await createSubmissionComment({
      submission: submission.id,
      author: authStore.currentUser.id,
      text: newComment.value.trim(),
    })

    comments.value.push(createdComment)
    newComment.value = ''


  } catch {
    errorMessage.value = 'Не удалось отправить комментарий'
  }
}

async function loadComments(assignment: Assignment) {
  const submission = getCurrentUserSubmission(assignment)

  if (!submission) {
    errorMessage.value = 'Решение не найдено'
    return
  }

  await loadCommentsBySubmission(submission.id)
}

async function createCommentByAssignment(assignment: Assignment) {
  const submission = getCurrentUserSubmission(assignment)

  if (!submission) {
    errorMessage.value = 'Решение не найдено'
    return
  }

  await createComment(submission)
}

function handleLogout() {
  authStore.logout()

  router.push({
    name: RouteName.Login,
  })
}
loadTopicById()
loadMaterials()
loadAssignments()
loadSubmissions()
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
.course-view__comments {
  margin-top: 16px;
}

.course-view__comments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 12px 0;
  padding: 0;
  list-style: none;
}

.course-view__comment-item {
  padding: 12px;
  border-radius: 12px;
  background-color: #f3f4f6;
}

.course-view__comment-textarea {
  display: block;
  width: 100%;
  min-height: 88px;
  box-sizing: border-box;
  margin: 12px 0;
  resize: vertical;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 16px;
  font-family: inherit;
}
</style>
