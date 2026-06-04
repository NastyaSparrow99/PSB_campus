<template>
  <div class="create-material-modal">
    <h2 class="create-material-modal__title">Добавление материала</h2>

    <form class="create-material-modal__form" @submit.prevent="handleCreateMaterial">
      <input
        v-model="materialTitle"
        class="create-material-modal__input"
        type="text"
        placeholder="Название материала"
      />

      <select v-model="materialType" class="create-material-modal__input">
        <option value="text">Текст</option>

        <option value="url">Ссылка</option>
      </select>

      <textarea
        v-model="materialText"
        class="create-material-modal__input"
        placeholder="Текст материала"
      />

      <input
        v-model="materialUrl"
        class="create-material-modal__input"
        type="url"
        placeholder="Ссылка"
      />

      <p v-if="errorMessage" class="create-material-modal__error">
        {{ errorMessage }}
      </p>

      <div class="create-material-modal__actions">
        <button type="submit" class="create-material-modal__button">Создать</button>

        <button
          type="button"
          class="create-material-modal__button create-material-modal__button--secondary"
          @click="closeModal()"
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

import { fetchDownloadMaterials } from '@/services/api'

const props = defineProps<{
  courseId: number
  topicId: number
}>()
const emit = defineEmits<{
  //назначаем что у модалки есть событие
  (event: 'created'): void
}>()

const materialTitle = ref('')
const materialType = ref('text')
const materialText = ref('')
const materialUrl = ref('')

const errorMessage = ref('')

async function handleCreateMaterial() {
  if (!materialTitle.value) {
    errorMessage.value = 'Введите название материала'
    return
  }
  try {
    errorMessage.value = ''

    await fetchDownloadMaterials({
      title: materialTitle.value,
      material_type: materialType.value,
      text: materialText.value,
      url: materialUrl.value,
      course: props.courseId,
      topic: props.topicId,
    })
    emit('created') // обновляет список курсов
    closeModal()
  } catch {
    errorMessage.value = 'Не удалось создать материал'
  }
}
</script>

<style scoped>
.create-material-modal {
  width: 480px;
  padding: 32px;
  border-radius: 20px;
  background-color: #ffffff;
}

.create-material-modal__title {
  margin: 0 0 20px;
  font-size: 24px;
}

.create-material-modal__form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.create-material-modal__input {
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 16px;
}

.create-material-modal__error {
  margin: 0;
  color: #dc2626;
  font-weight: 700;
}

.create-material-modal__actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.create-material-modal__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: #ffffff;
  font-weight: 700;
  cursor: pointer;
}

.create-material-modal__button--secondary {
  background-color: #e5e7eb;
  color: #111827;
}
</style>
