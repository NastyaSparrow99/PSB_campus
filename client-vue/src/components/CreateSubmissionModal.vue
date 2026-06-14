<template>
  <div class="create-submission-modal">
    <h2 class="create-submission-modal__title">Отправка решения</h2>
    <p class="create-submission-modal__text">{{ assignment.title }}</p>
    <form class="create-submission-modal__form" @submit.prevent="handleCreateSubmission">
      <textarea
        v-model="answerText"
        class="create-submission-modal__input"
        placeholder="Введите решение задания"
      />
      <p v-if="errorMessage" class="create-submission-modal__error">
        {{ errorMessage }}
      </p>

      <div class="create-submission-modal__actions">
        <button type="submit" class="create-submission-modal__button">Отправить</button>

        <button
          type="button"
          class="create-submission-modal__button create-submission-modal__button--secondary"
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
import { Assignment, fetchCreateSubmission } from '@/services/api'
const props = defineProps<{
  assignment: Assignment,
  studentId: number
}>()
const emit = defineEmits<{
  (event: 'created'): void // у модалки есть событие 
}>()
const answerText = ref('')
const errorMessage = ref('')

async function handleCreateSubmission() {
  if (!answerText.value) {
    errorMessage.value = 'Введите текст решения'
    return
  }

  try {
    errorMessage.value = ''
    await fetchCreateSubmission({
      // пост запрос
      assignment: props.assignment.id,
      student: props.studentId,
      answer_text: answerText.value,
    })
    emit('created')
    closeModal()
  } catch {
    errorMessage.value = 'Не удалось отправить решение'
  }
}
</script>

<style scoped>
.create-submission-modal {
  width: 480px;
  padding: 32px;
  border-radius: 20px;
  background-color: #ffffff;
}

.create-submission-modal__title {
  margin: 0 0 20px;
  font-size: 24px;
  color: #111827;
}

.create-submission-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.create-submission-modal__text {
  margin: 0 0 16px;
  color: #4b5563;
  font-weight: 700;
}
.create-submission-modal__input {
  width: 100%;
  box-sizing: border-box;
  min-height: 120px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 16px;
  font-family: inherit;
  resize: vertical;
}

.create-submission-modal__error {
  margin: 0;
  color: #dc2626;
  font-weight: 700;
}

.create-submission-modal__actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.create-submission-modal__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.create-submission-modal__button--secondary {
  background-color: #e5e7eb;
  color: #111827;
}
</style>
