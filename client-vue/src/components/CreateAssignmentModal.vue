<template>
  <div class="create-assignment-modal">
    <h2 class="create-assignment-modal__title">Создание задания</h2>

    <form class="create-assignment-modal__form" @submit.prevent="handleCreateAssignment">
      <input
        v-model="title"
        class="create-assignment-modal__input"
        type="text"
        placeholder="Название задания"
      />
      <textarea
        v-model="description"
        class="create-assignment-modal__input"
        placeholder="Описание задания"
      />
      <input v-model="deadline" class="create-assignment-modal__input" type="datetime-local" />
      <input
        v-model.number="maxGrade"
        class="create-assignment-modal__input"
        type="number"
        placeholder="Максимальная оценка"
      />
      <p v-if="errorMessage" class="create-assignment-modal__error">
        {{ errorMessage }}
      </p>

      <div class="create-assignment-modal__actions">
        <button type="submit" class="create-assignment-modal__button">Создать</button>

        <button
          type="button"
          class="create-assignment-modal__button create-assignment-modal__button--secondary"
          @click="handleCloseModal"
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

import { fetchCreateAssignment } from '@/services/api'
const props = defineProps<{
  //courseId приходит из CourseView ,чтобы новое задание привязалось к текущему курсу
  courseId: number
}>()
const emit = defineEmits<{
  //Событие created отправляется после успешного создания задания.
  created: []
}>()
const title = ref('')
const description = ref('')
const deadline = ref('')
const maxGrade = ref(100)
const errorMessage = ref('')

function handleCloseModal() {
  closeModal()
}
async function handleCreateAssignment() {
  if (!deadline.value) {
    errorMessage.value = 'Выберите время окончания дедлайна'
    return
  }

  try {
    errorMessage.value = ''
    await fetchCreateAssignment({
      course: props.courseId, // к текущ курсу
      title: title.value,
      description: description.value,
      deadline: deadline.value,
      max_grade: maxGrade.value,
    })
    emit('created')
    handleCloseModal()
  } catch {
    errorMessage.value = 'Не удалось создать задание'
  }
}
</script>
<style scoped>
.create-assignment-modal {
  width: 480px;
  padding: 32px;
  border-radius: 20px;
  background-color: #ffffff;
}

.create-assignment-modal__title {
  margin: 0 0 20px;
  font-size: 24px;
  color: #111827;
}

.create-assignment-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-assignment-modal__input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 16px;
  font-family: inherit;
}

textarea.create-assignment-modal__input {
  min-height: 100px;
  resize: vertical;
}

.create-assignment-modal__error {
  margin: 0;
  color: #dc2626;
  font-weight: 700;
}

.create-assignment-modal__actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.create-assignment-modal__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.create-assignment-modal__button--secondary {
  background-color: #e5e7eb;
  color: #111827;
}
</style>
