<template>
  <header class="topbar">
    <div class="topbar__left">
      <button type="button" class="topbar__logo-button" @click="goToHome">
        <span class="topbar__logo">PSB Campus</span>
      </button>

      <p class="topbar__subtitle">
        Единая среда для обучения и контроля прогресса
      </p>
    </div>

    <div v-if="authStore.currentUser" class="topbar__right">
      <button type="button" class="topbar__courses-link" @click="goToDashboard">
        Курсы
      </button>

      <button type="button" class="topbar__bell">
        <span class="topbar__bell-circle">
          <span class="topbar__bell-emoji">!</span>
        </span>

        <span v-if="notificationsCount > 0" class="topbar__badge">
          {{ notificationsCount }}
        </span>
      </button>

      <div class="topbar__user-pill">
        <span class="topbar__user-name">
          {{ authStore.currentUser.name }}
        </span>

        <span class="topbar__role-chip">
          {{ getRoleLabel ()}}
        </span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { RouteName } from '@/constants/route-names'
import { useAuthStore } from '@/stores/auth-store'
import { UserRole } from '@/types/user'
const router = useRouter()
const authStore = useAuthStore()


const notificationsCount = 1

function getRoleLabel() {
  if (authStore.currentUser?.role === UserRole.Teacher) {
    return 'Преподаватель'
  }

  if (authStore.currentUser?.role === UserRole.Student) {
    return 'Студент'
  }

}
function goToHome() {
  router.push({
    name: RouteName.Login,
  })
}

function goToDashboard() {
  if (!authStore.currentUser) {
    router.push({
      name: RouteName.Login,
    })
    return
  }

  if (authStore.currentUser.role === UserRole.Teacher) {
    router.push({
      name: RouteName.TeacherDashboard,
    })
    return
  }

  router.push({
    name: RouteName.StudentDashboard,
  })
}
</script>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  box-sizing: border-box;
  padding: 0 48px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.4);
  background: rgba(10, 10, 20, 0.98);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(24px);
  font-family: Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
}

.topbar__left {
  display: flex;
  flex-direction: column;
}

.topbar__logo-button {
  border: none;
  padding: 0;
  background: none;
  text-align: left;
  cursor: pointer;
}

.topbar__logo {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.03em;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.topbar__subtitle {
  margin: 2px 0 0;
  color: #9ca3af;
  font-size: 13px;
}

.topbar__right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.topbar__courses-link {
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #e5e7eb;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
}

.topbar__courses-link:hover {
  border-color: rgba(148, 163, 184, 0.5);
  background: rgba(148, 163, 184, 0.1);
}

.topbar__bell {
  position: relative;
  border: none;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.topbar__bell-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 10%, #fbbf24, #92400e);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.8);
}

.topbar__bell-emoji {
  font-size: 22px;
}

.topbar__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  box-sizing: border-box;
  padding: 0 6px;
  border-radius: 999px;
  background: #f97316;
  color: #111827;
  font-size: 12px;
  font-weight: 700;
}

.topbar__user-pill {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 18px;
  border: 1px solid rgba(148, 163, 184, 0.7);
  border-radius: 999px;
  background: radial-gradient(
    circle at top left,
    rgba(148, 163, 248, 0.22),
    rgba(15, 23, 42, 0.98)
  );
  box-shadow: 0 16px 40px rgba(15, 23, 42, 0.75);
}

.topbar__user-name {
  color: #e5e7eb;
  font-size: 14px;
}

.topbar__role-chip {
  padding: 4px 12px;
  border-radius: 999px;
  background: linear-gradient(120deg, #4f46e5, #7c3aed);
  color: #e5e7eb;
  font-size: 12px;
}

@media (max-width: 768px) {
  .topbar {
    height: auto;
    min-height: 72px;
    padding: 16px 24px;
    gap: 16px;
  }

  .topbar__subtitle {
    display: none;
  }

  .topbar__right {
    gap: 10px;
  }

  .topbar__user-pill {
    padding: 8px 12px;
  }

  .topbar__role-chip {
    display: none;
  }
}
</style>