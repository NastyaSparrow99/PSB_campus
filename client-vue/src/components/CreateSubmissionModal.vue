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

.create-submission-modal__title {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.create-submission-modal__text {
  margin: 0 0 20px;
  color: #b2bec3;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.5;
}

.create-submission-modal__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.create-submission-modal__input {
  width: 100%;
  min-height: 140px;
  box-sizing: border-box;
  resize: vertical;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 12px;
  padding: 13px 15px;
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
  line-height: 1.5;
}

.create-submission-modal__input::placeholder {
  color: #9ca3af;
}

.create-submission-modal__input:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.18);
}

.create-submission-modal__error {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-size: 14px;
  font-weight: 700;
}

.create-submission-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.create-submission-modal__button {
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

.create-submission-modal__button--secondary {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: #b2bec3;
  box-shadow: none;
}
</style>