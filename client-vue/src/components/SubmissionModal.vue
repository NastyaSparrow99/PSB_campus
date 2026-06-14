<template>
  <section class="submission-details-modal">
    <h2 class="submission-details-modal__title">Решение студента</h2>

    <p v-if="errorMessage" class="submission-details-modal__error">
      {{ errorMessage }}
    </p>
    <div class="submission-details-modal__info">
      <p class="submission-details-modal__text">
        Студент:
        <span class="submission-details-modal__value">
          {{ submission.student }}
        </span>
      </p>
      <p class="submission-details-modal__text">
        Задание:
        <span class="submission-details-modal__value">
          {{ submission.assignment }}
        </span>
      </p>
    </div>
    <div class="submission-details-modal__answer">
      <p class="submission-details-modal__label">Текст решения</p>

      <p class="submission-details-modal__answer-text">
        {{ submission.answer_text }}
      </p>
    </div>
    <label class="submission-details-modal__field">
      <span class="submission-details-modal__label"> Оценка </span>
      <input
        v-model.number="grade"
        type="number"
        class="submission-details-modal__input"
        :min="0"
        :max="assignment.max_grade"
        placeholder="Введите оценку"
      /><!--атрибуты min max для input-->
    </label>
    <p class="submission-modal__hint">Максимальная оценка: {{ assignment.max_grade }}</p>
    <div class="submission-details-modal__actions">
      <button type="button" class="submission-details-modal__button" @click="handleSaveGrade">
        Сохранить оценку
      </button>

      <button
        type="button"
        class="submission-details-modal__button submission-details-modal__button--secondary"
        @click="() => closeModal()"
      >
        Закрыть
      </button>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { closeModal } from 'jenesius-vue-modal'
import { Assignment, gradeSubmission, type Submission } from '@/services/api'

const props = defineProps<{
  submission: Submission
  assignment: Assignment
}>()
const emit = defineEmits<{
  updated: []
}>()

const grade = ref(props.submission.grade ?? 0)
const errorMessage = ref('')

async function handleSaveGrade() {
  if (grade.value < 0) {
    errorMessage.value = 'Оценка не может быть меньше 0'
    return
  }

  if (grade.value > props.assignment.max_grade) {
    errorMessage.value = `Оценка не может быть больше ${props.assignment.max_grade}`
    return
  }

  try {
    errorMessage.value = ''
    // Отправляем PATCH-запрос на бэке и обновляем оценку конкретного решения.
    await gradeSubmission(props.submission.id, {
      grade: grade.value,
    })
   emit('updated')
  } catch {
    errorMessage.value = 'Не удалось сохранить оценку'
  }
}

closeModal()
</script>

<style scoped>
.submission-details-modal {
  width: 420px;
  padding: 28px;
  border-radius: 20px;
  background-color: #ffffff;
}

.submission-details-modal__title {
  margin: 0 0 20px;
  font-size: 24px;
  color: #111827;
}

.submission-details-modal__error {
  margin: 0 0 16px;
  color: #dc2626;
  font-weight: 700;
}

.submission-details-modal__info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}

.submission-details-modal__text {
  margin: 0;
  color: #4b5563;
}

.submission-details-modal__value {
  color: #111827;
  font-weight: 700;
}

.submission-details-modal__answer {
  margin-bottom: 20px;
}

.submission-details-modal__label {
  display: block;
  margin-bottom: 8px;
  color: #374151;
  font-weight: 700;
}

.submission-details-modal__answer-text {
  min-height: 80px;
  margin: 0;
  padding: 12px;
  border-radius: 12px;
  background-color: #f3f4f6;
  color: #111827;
  line-height: 1.5;
}

.submission-details-modal__field {
  display: block;
  margin-bottom: 20px;
}

.submission-details-modal__input {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 16px;
}

.submission-details-modal__actions {
  display: flex;
  gap: 12px;
}

.submission-details-modal__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.submission-details-modal__button--secondary {
  background-color: #e5e7eb;
  color: #111827;
}
</style>
