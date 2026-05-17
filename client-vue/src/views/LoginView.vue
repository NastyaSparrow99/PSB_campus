<template>
  <section class="page">
    <div class="card">
      <h1>PSB Campus</h1>



      <div class="actions">
        <button type="button" @click="loginAsStudent">
          Войти как студент
        </button>

        <button type="button" @click="loginAsTeacher">
          Войти как преподаватель
        </button>
      </div>

      <p v-if="authStore.currentUser" class="current-user">
        Текущий пользователь:
        <b>{{ authStore.currentUser.name }}</b>
        —
        {{ authStore.currentUser.role }}
      </p>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore() //подключаем хранилище

function loginAsStudent() {
  authStore.login({ // функция  присваивания currentUser
    id: 1,
    name: 'Настя',
    role: 'student',
  })

  router.push('/student') // как navigate('/student')
}

function loginAsTeacher() {
  authStore.login({
    id: 2,
    name: 'Алексей Иванович',
    role: 'teacher',
  })

  router.push('/teacher')
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px;
}

.card {
  width: 100%;
  max-width: 480px;
  padding: 32px;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.08);
}

h1 {
  margin: 0 0 12px;
  font-size: 40px;
}

p {
  margin: 0 0 24px;
  color: #4b5563;
}

.actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

button {
  border: none;
  border-radius: 12px;
  padding: 12px 18px;
  background-color: #2563eb;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

button:hover {
  background-color: #1d4ed8;
}

.current-user {
  margin-top: 24px;
  margin-bottom: 0;
  color: #111827;
}
</style>