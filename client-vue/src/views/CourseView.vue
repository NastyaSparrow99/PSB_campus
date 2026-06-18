<template>
  <topBar />
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

          <div
            v-if="authStore.currentUser?.role === 'student' && getCurrentUserSubmission(assignment)"
            class="course-view__comments"
          >
            <button type="button" class="course-view__button" @click="loadComments(assignment)">
              Показать комментарии
            </button>

            <h4 class="course-view__submissions-title">Комментарии к моему решению</h4>

            <p v-if="!comments.length" class="course-view__material-text">Пока нет комментариев</p>

            <ul v-else class="course-view__comments-list">
              <li v-for="comment in comments" :key="comment.id" class="course-view__comment-item">
                <p class="course-view__material-text">
                  {{ comment.author_name ?? `Пользователь #${comment.author}` }}
                </p>

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
            v-if="
              authStore.currentUser?.role === 'student' && !getCurrentUserSubmission(assignment)
            "
            type="button"
            class="course-view__button"
            @click="handleOpenCreateSubmissionModal(assignment)"
          >
            Отправить решение
          </button>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
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

loadTopicById()
loadMaterials()
loadAssignments()
loadSubmissions()
</script>

<style scoped>
.course-view {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 48px;
  background:
    radial-gradient(circle at 14% 16%, rgba(108, 92, 231, 0.18) 0%, transparent 34%),
    radial-gradient(circle at 86% 18%, rgba(79, 192, 232, 0.12) 0%, transparent 32%),
    linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.course-view__back-link {
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

.course-view__text {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 12px 18px 0;
  padding: 9px 14px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.72);
  color: #b2bec3;
  font-size: 14px;
}

.course-view__value {
  color: #ffffff;
  font-weight: 700;
}

.course-view__error {
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

.course-view__topic-card {
  margin-bottom: 32px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 22px;
  background: rgba(25, 25, 35, 0.9);
  box-shadow:
    0 18px 34px rgba(0, 0, 0, 0.32),
    0 0 0 1px rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(12px);
}

.course-view__label {
  margin: 0 0 8px;
  color: #a29bfe;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.course-view__title {
  margin: 0 0 12px;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, #ffffff, #a29bfe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.course-view__topic-description {
  max-width: 760px;
  margin: 0;
  color: #b2bec3;
  font-size: 16px;
  line-height: 1.6;
}

.course-view__materials,
.course-view__assignments {
  margin-top: 28px;
}

.course-view__section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.course-view__subtitle {
  margin: 0 0 16px;
  color: #ffffff;
  font-size: 24px;
  font-weight: 800;
}

.course-view__section-header .course-view__subtitle {
  margin-bottom: 0;
}

.course-view__count {
  display: inline-flex;
  min-width: 28px;
  justify-content: center;
  border-radius: 999px;
  padding: 4px 10px;
  background: rgba(108, 92, 231, 0.22);
  color: #d8d3ff;
  font-weight: 800;
  text-align: center;
}

.course-view__empty {
  margin: 0;
  padding: 22px 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(25, 25, 35, 0.8);
  color: #b2bec3;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.22);
}

.course-view__materials-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.course-view__material-item {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
  padding: 22px 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  background: rgba(30, 30, 45, 0.9);
  box-shadow:
    0 16px 30px rgba(0, 0, 0, 0.28),
    0 0 0 1px rgba(255, 255, 255, 0.03);
}

.course-view__material-content {
  min-width: 0;
  flex: 1;
}

.course-view__material-title {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 21px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.course-view__material-text {
  margin: 0 0 8px;
  color: #b2bec3;
  line-height: 1.5;
}

.course-view__material-actions {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 8px;
}

.course-view__material-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(162, 155, 254, 0.35);
  border-radius: 10px;
  padding: 9px 12px;
  background: rgba(108, 92, 231, 0.12);
  color: #d8d3ff;
  font-weight: 700;
  text-decoration: none;
}

.course-view__submissions {
  margin-top: 18px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.course-view__submissions-title {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 16px;
  font-weight: 800;
}

.course-view__submission-button {
  display: inline-flex;
  margin: 0 8px 8px 0;
  border: 1px solid rgba(162, 155, 254, 0.35);
  border-radius: 10px;
  padding: 9px 12px;
  background: rgba(108, 92, 231, 0.14);
  color: #ffffff;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.course-view__button {
  display: inline-flex;
  width: fit-content;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  margin: 8px 8px 8px 0;
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #6c5ce7 0%, #5d4fd6 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.24);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.course-view__button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
  box-shadow: none;
}

.course-view__comments {
  width: 100%;
  margin-top: 8px;
  padding: 18px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background: rgba(15, 23, 42, 0.45);
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
  background: rgba(255, 255, 255, 0.07);
}

.course-view__comment-textarea {
  display: block;
  width: 100%;
  min-height: 88px;
  box-sizing: border-box;
  margin: 12px 0;
  resize: vertical;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 12px 14px;
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
}

.course-view__comment-textarea::placeholder {
  color: #9ca3af;
}

.course-view__comment-textarea:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.18);
}

.course-view__actions {
  margin-top: 24px;
}

@media (max-width: 768px) {
  .course-view {
    padding: 32px 20px;
  }

  .course-view__title {
    font-size: 30px;
  }

  .course-view__material-item {
    flex-direction: column;
  }

  .course-view__material-actions {
    width: 100%;
  }
}
</style>
