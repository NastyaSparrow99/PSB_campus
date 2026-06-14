<template>
  <div class="create-topic-modal">
    <h2 class="create-topic-modal__title">Создание темы</h2>

    <form class="create-topic-modal__form" @submit.prevent="handleCreateTopic">
      <input
        v-model="title"
        class="create-topic-modal__input"
        type="text"
        placeholder="Название темы"
      />

      <input
        v-model="description"
        class="create-topic-modal__input"
        type="text"
        placeholder="Описание темы"
      />

      <p v-if="errorMessage" class="create-topic-modal__error">
        {{ errorMessage }}
      </p>

      <div class="create-topic-modal__actions">
        <button type="submit" class="create-topic-modal__button">Создать</button>

        <button
          type="button"
          class="create-topic-modal__button create-topic-modal__button--secondary"
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
import { fetchCreateTopic } from '@/services/api'
const props = defineProps<{
  // courseId приходит из CourseTopicsView и нужен, чтобы новая тема привязалась к текущему курсу.
  courseId: number
}>()
const emit = defineEmits<{
    //модалка делает POST после чего родителю нужно дать знак на перезагрузку данных уже с добавлением новых записей 
  //назначаем что у модалки есть событие
  (event: 'created'): void
}>()
const title = ref('')
const description = ref('')
const errorMessage = ref('')

async function handleCreateTopic() {
  if (!title.value.trim()) {
    errorMessage.value = 'Введите название темы'
    return
  }
  try {
    errorMessage.value = ''

    await fetchCreateTopic({
      title: title.value,
      description: description.value,
      course: props.courseId,
    })

    // Сообщаем родителю, что тема создана
    emit('created')

    closeModal()
  } catch {
    errorMessage.value = 'Не удалось создать тему'
  }
}
</script>

<style scoped>
.create-topic-modal {
  width: 480px;
  padding: 32px;
  border-radius: 20px;
  background-color: #ffffff;
}

.create-topic-modal__title {
  margin: 0 0 20px;
  font-size: 24px;
}

.create-topic-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-topic-modal__input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 16px;
}

.create-topic-modal__error {
  margin: 0;
  color: #dc2626;
  font-weight: 700;
}

.create-topic-modal__actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.create-topic-modal__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.create-topic-modal__button--secondary {
  background-color: #e5e7eb;
  color: #111827;
}
</style>
