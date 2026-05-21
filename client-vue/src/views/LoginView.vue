<template>
  <section class="login-view">
    <div class="login-view__card">
      <h1 class="login-view__title">Вход в PSB Campus</h1>
      <p class="login-view__subtitle">Выберите пользователя, чтобы войти в систему</p>
      <p v-if="errorMessage" class="login-view__error">
        {{ errorMessage }}
      </p>
      <label class="login-view__field">
        <span class="login-view__label"> Пользователь </span>
        <select v-model="selectedUser" class="login-view__select">
          <!-- v-model позволяет  связать переменную в компоненте и значение в поле ввода так, чтобы любые изменения в одном сразу отражались в другом  -->
          <option :value="null">
            <!--: говорят о значении  -->
            выберите пользователя
          </option>
          <option v-for="person in persons" :key="person.id" :value="person">
            {{ person.name }} — {{ person.role }}
          </option>
        </select>
      </label>
      <button type="button" class="login-view__button" @click="handleLogin">Войти</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { RouteName } from '../constants/route-names'
import { fetchPersons } from '../services/api'
import { useAuthStore } from '../stores/auth-store'
import { UserRole, type User } from '../types/user'
const router = useRouter()
const authStore = useAuthStore()
const persons = ref<User[]>([]) //массив пользователей с сервера
const selectedUser = ref<User | null>(null) //selectedUserId -id выбранного пользователя
const errorMessage = ref('')

async function loadPersons() {
  try {
    errorMessage.value = '' // очищаем ошибку

    persons.value = await fetchPersons() //загружаем польз.
  } catch {
    errorMessage.value = 'Не удалось загрузить пользователей'
  }
}
function handleLogin() {
  if (!selectedUser.value) {
    return
  }
  authStore.login(selectedUser.value) // в currentUser
  if (selectedUser.value.role === UserRole.Student) {
    router.push({
      name: RouteName.StudentDashboard,
    })
    return
  }
  router.push({
    name: RouteName.TeacherDashboard,
  })
}
onMounted(() => {
  loadPersons()
})
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  padding: 48px;
}

.login-view__title {
  margin: 0 0 12px;
  font-size: 36px;
}

.login-view__text {
  margin: 0 0 16px;
  color: #4b5563;
}

.login-view__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
}

.login-view__button {
  border: none;
  border-radius: 10px;
  padding: 10px 16px;
  background-color: #111827;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.login-view__current-user {
  margin-top: 24px;
  color: #4b5563;
}

.login-view__user-value {
  font-weight: 700;
  color: #111827;
}
</style>
