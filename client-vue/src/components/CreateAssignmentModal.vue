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

import { fetchCreateAssignment } from '@/services/api'
const props = defineProps<{
  //courseId приходит из CourseView ,чтобы новое задание привязалось к текущему курсу
  courseId: number
}>()
const emit = defineEmits<{
  //назначаем что у модалки есть событие
  (event: 'created'): void
}>()
const title = ref('')
const description = ref('')
const deadline = ref('')
const maxGrade = ref(100)
const errorMessage = ref('')

async function handleCreateAssignment() {
  if (!deadline.value) {
    errorMessage.value = 'Выберите время окончания дедлайна'
    return
  }
  if (!title.value) {
    errorMessage.value = 'Введите название задания'
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
    closeModal()
  } catch {
    errorMessage.value = 'Не удалось создать задание'
  }
}
</script>
<style scoped>
.create-assignment-modal {
  width: 500px;
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

.create-assignment-modal__title {
  margin: 0 0 24px;
  color: #ffffff;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.create-assignment-modal__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.create-assignment-modal__input {
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

.create-assignment-modal__input::placeholder {
  color: #9ca3af;
}

.create-assignment-modal__input:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.18);
}

textarea.create-assignment-modal__input {
  min-height: 110px;
  resize: vertical;
  line-height: 1.5;
}

.create-assignment-modal__error {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-size: 14px;
  font-weight: 700;
}

.create-assignment-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.create-assignment-modal__button {
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

.create-assignment-modal__button--secondary {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: #b2bec3;
  box-shadow: none;
}
</style>