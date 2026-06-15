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
        <span class="create-course-modal__label">Назначить студента</span>

        <select v-model="selectedStudentId" class="create-course-modal__input">
          <option :value="null">Выберите студента</option>

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
    await fetchAddStudentToCourse(createdCourse.id, {  // на конкретный курс назначаем конкретного студента из списка
      student_id: selectedStudentId.value,//студент из списка :value="student_id"
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
  padding: 32px;
  border-radius: 20px;
  background-color: #ffffff;
}

.create-course-modal__title {
  margin: 0 0 20px;
  font-size: 24px;
}

.create-course-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-course-modal__input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 16px;
}

.create-course-modal__error {
  margin: 0;
  color: #dc2626;
  font-weight: 700;
}

.create-course-modal__actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.create-course-modal__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.create-course-modal__button--secondary {
  background-color: #e5e7eb;
  color: #111827;
}
</style>
