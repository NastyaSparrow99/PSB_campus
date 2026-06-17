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
      <span class="create-topic-modal__label">Цвет темы</span>
      <div class="create-topic-modal__colors">
        <button
          v-for="color in COLOR_PRESETS"
          :key="color.id"
          type="button"
          class="create-topic-modal__color-button"
          :class="{ 'create-topic-modal__color-button--active': selectedColor === color.value }"
          @click="selectColor(color.value)"
        >
          <span class="create-topic-modal__color-dot" :style="{ backgroundColor: color.value }" />
          <!--background-color равен color.value-->
          {{ color.label }}
        </button>
      </div>
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

const COLOR_PRESETS = [
  { id: 'coral', label: 'Коралловый', value: '#FF6B6B' },
  { id: 'gold', label: 'Золотой', value: '#FFD93D' },
  { id: 'mint', label: 'Мятный', value: '#6BCF7F' },
  { id: 'lavender', label: 'Лавандовый', value: '#9B7EDE' },
  { id: 'sky', label: 'Небесный', value: '#4FC0E8' },
  { id: 'pink', label: 'Розовый', value: '#FF9FF3' },
]

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
const selectedColor = ref(COLOR_PRESETS[0].value) // по умолчанию первый цвет,имя поля
const errorMessage = ref('')

function selectColor(colorId: string) {
  selectedColor.value = colorId
}
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
      color: selectedColor.value,
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
  font-family:
    Inter,
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.create-topic-modal__title {
  margin: 0 0 24px;
  color: #ffffff;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
}

.create-topic-modal__form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.create-topic-modal__field {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.create-topic-modal__label {
  color: #b2bec3;
  font-size: 14px;
  font-weight: 600;
}

.create-topic-modal__input {
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

.create-topic-modal__input::placeholder {
  color: #9ca3af;
}

.create-topic-modal__input:focus {
  border-color: #6c5ce7;
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.18);
}

.create-topic-modal__colors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.create-topic-modal__color-button {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.08);
  color: #e5e7eb;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
}

.create-topic-modal__color-button--active {
  border-color: #a29bfe;
  background: rgba(108, 92, 231, 0.24);
}

.create-topic-modal__color-dot {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 999px;
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.2);
}

.create-topic-modal__error {
  margin: 0;
  padding: 12px 14px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-size: 14px;
  font-weight: 700;
}

.create-topic-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 10px;
}

.create-topic-modal__button {
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

.create-topic-modal__button--secondary {
  border: 1px solid rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.08);
  color: #b2bec3;
  box-shadow: none;
}
</style>
