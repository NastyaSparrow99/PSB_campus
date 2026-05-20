<template>
  <section class="login-view">
    <h1 class="login-view__title">PSB Campus</h1>

    <div class="login-view__actions">
      <button type="button" class="login-view__button" @click="loginAsStudent">
        Войти как студент
      </button>

      <button type="button" class="login-view__button" @click="loginAsTeacher">
        Войти как преподаватель
      </button>
    </div>

    <p v-if="authStore.currentUser" class="login-view__current-user">
      Текущий пользователь:
      <span class="login-view__user-value">
        {{ authStore.currentUser.name }}
      </span>
      —
      <span class="login-view__user-value">
        {{ authStore.currentUser.role }}
      </span>
    </p>
  </section>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { RouteName } from '../constants/route-names'
import { UserRole } from '../constants/route-names'
import { useAuthStore } from '../stores/auth-store'

const router = useRouter()
const authStore = useAuthStore()

function loginAsStudent() {
  authStore.login({
    id: 1,
    name: 'Демо студент',
    role: UserRole.Student,
  })

  router.push({
    name: RouteName.StudentDashboard,
  })
}

function loginAsTeacher() {
  authStore.login({
    id: 2,
    name: 'Демо преподаватель',
    role: UserRole.Teacher,
  })

  router.push({
    name: RouteName.TeacherDashboard,
  })
}
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
