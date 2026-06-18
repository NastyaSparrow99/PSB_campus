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
      <button type="button" class="login-view__button" :disabled="!selectedUser" @click="handleLogin">Войти</button>
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
const selectedUser = ref<User | null>(null) //selectedUserId -id какого выбрали пользователя
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
onMounted(loadPersons)
</script>

<style scoped>

.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 16px;
  box-sizing: border-box;
  background:
    radial-gradient(circle at 20% 80%, rgba(74, 107, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(108, 92, 231, 0.12) 0%, transparent 50%),
    linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.login-view__card {
  width: 420px;
  max-width: 90vw;
  padding: 48px 40px 36px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background: rgba(25, 25, 35, 0.82);
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.35),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
}

.login-view__title {
  margin: 0 0 12px;
  text-align: center;
  color: #ffffff;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.04em;
}

.login-view__subtitle {
  margin: 0 0 32px;
  text-align: center;
  color: #b2bec3;
  font-size: 15px;
  line-height: 1.5;
}

.login-view__error {
  margin: 0 0 20px;
  padding: 14px 16px;
  border: 1px solid rgba(248, 113, 113, 0.4);
  border-radius: 12px;
  background: rgba(127, 29, 29, 0.35);
  color: #fecaca;
  font-size: 14px;
}

.login-view__field {
  display: block;
  margin-bottom: 24px;
}

.login-view__label {
  display: block;
  margin-bottom: 12px;
  color: #e5e7eb;
  font-size: 15px;
  font-weight: 600;
}

.login-view__select {
  width: 100%;
  box-sizing: border-box;
  padding: 16px 44px 16px 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  outline: none;
  background-color: rgba(40, 40, 50, 0.75);
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  font-family: inherit;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236c5ce7' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-position: calc(100% - 18px) center;
  background-repeat: no-repeat;
  background-size: 16px;
}

.login-view__select:focus {
  border-color: #6c5ce7;
  background-color: rgba(50, 50, 60, 0.9);
  box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.18);
}

.login-view__select option {
  background: #1a1a2e;
  color: #ffffff;
}

.login-view__button {
  width: 100%;
  margin-top: 8px;
  padding: 18px 0;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #6c5ce7 0%, #5d4fd6 100%);
  color: #ffffff;
  box-shadow: 0 8px 25px rgba(108, 92, 231, 0.35);
  font-size: 16px;
  font-weight: 700;
  font-family: inherit;
  letter-spacing: 0.02em;
  cursor: pointer;
}

.login-view__button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.login-view__text {
  margin: 0 0 16px;
  color: #b2bec3;
}

.login-view__actions {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-top: 24px;
}

.login-view__current-user {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #b2bec3;
  text-align: center;
  font-size: 14px;
}

.login-view__user-value {
  color: #ffffff;
  font-weight: 700;
}

@media (max-width: 480px) {
  .login-view__card {
    padding: 32px 24px 24px;
  }

  .login-view__title {
    font-size: 26px;
  }

  .login-view__select {
    padding: 14px 40px 14px 16px;
  }

  .login-view__button {
    padding: 16px 0;
  }
}
</style>
