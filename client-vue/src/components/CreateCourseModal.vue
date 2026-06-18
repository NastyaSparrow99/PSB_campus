<template>
  <div class="create-course-modal">
    <h2 class="create-course-modal__title">Создание курса</h2>
    <form class="create-course-modal__form" @submit.prevent="handleCreateCourse">
      <!--без перезагрузки страницы-->
      <input
        v-model="title"
        class="create-course-modal__input"
        type="text"
        placeholder="Название курса"
      />
      <input
        v-model="description"
        class="create-course-modal__input"
        type="text"
        placeholder="Описание курса"
      />
      <label class="create-course-modal__field">
        <span class="create-course-modal__label"> Назначить студента </span>

        <select v-model="selectedStudentId" class="create-course-modal__input">
          <option v-for="student in students" :key="student.id" :value="student.id">
            {{ student.name }}
          </option>
        </select>
      </label>
      <p v-if="errorMessage" class="create-course-modal__error">
        {{ errorMessage }}
      </p>
      <div class="create-course-modal__actions">
        <button type="submit" class="create-course-modal__button">Создать</button>
        <button
          type="button"
          class="create-course-modal__button create-course-modal__button--secondary"
          @click="() => closeModal()"
        >
          Закрыть
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { closeModal } from 'jenesius-vue-modal'

import { fetchCreateCourse, fetchAddStudentToCourse, fetchPersons } from '@/services/api'
import type { User } from '@/types/user'
const props = defineProps<{
  teacherId: number // понимание того какой именно преподаватель создал курс
}>()
const emit = defineEmits<{
  // назначаем что у модалки есть событие
  (event: 'created'): void
}>()
const title = ref('')
const description = ref('')
const errorMessage = ref('')
const students = ref<User[]>([])
const selectedStudentId = ref<number | null>(null)

async function handleCreateCourse() {
  if (!title.value) {
    errorMessage.value = 'Введите название курса'
    return
  }
  if (!selectedStudentId.value) {
    errorMessage.value = 'Выберите студента'
    return
  }
  try {
    errorMessage.value = ''

    const createdCourse = await fetchCreateCourse({
      title: title.value,
      description: description.value,
      teacher: props.teacherId,
    })
    await fetchAddStudentToCourse(createdCourse.id, {
      // на конкретный курс назначаем конкретного студента из списка
      student_id: selectedStudentId.value, //студент из списка :value="student_id"
    })

    emit('created') // обновляет список курсов
    closeModal()
  } catch {
    errorMessage.value = 'Не удалось создать курс'
  }
}

async function loadStudents() {
  try {
    students.value = (await fetchPersons()).filter((person) => person.role === 'student')
  } catch {
    errorMessage.value = 'Не удалось загрузить студентов'
  }
}

loadStudents()
</script>

<style scoped>
.create-course-modal {
  width: 480px;
  max-width: 92vw;
  box-sizing: border-box;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(25, 25, 35, 0.96);
  color: #ffffff;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.create-course-modal__title {
  margin: 0 0 24px;
  color: #ffffff;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.create-course-modal__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.create-course-modal__field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.create-course-modal__label {
  color: #b2bec3;
  font-size: 14px;
  font-weight: 600;
}

.create-course-modal__input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 13px 15px;
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
}

.create-course-modal__input::placeholder {
  color: #9ca3af;
}

.create-course-modal__input:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.18);
}

.create-course-modal__input option {
  color: #111827;
}

.create-course-modal__error {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-size: 14px;
  font-weight: 700;
}

.create-course-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.create-course-modal__button {
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #6c5ce7 0%, #5d4fd6 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(108, 92, 231, 0.28);
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
}

.create-course-modal__button--secondary {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: #b2bec3;
  box-shadow: none;
}
</style>