import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import StudentDashboardView from '../views/StudentDashboardView.vue'
import TeacherDashboardView from '../views/TeacherDashboardView.vue'
import CourseTopicsView from '../views/CourseTopicsView.vue'
import CourseView from '../views/CourseView.vue'

import { RouteName } from '../constants/route-names'
import { useAuthStore } from '../stores/auth-store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.Login,
      component: LoginView,
    },
    {
      path: '/student',
      name: RouteName.StudentDashboard,
      component: StudentDashboardView,
      meta: {
        requiresAuth: true, // флаг - пстраница требует авторизации
        role: 'student',
      },
    },
    {
      path: '/teacher',
      name: RouteName.TeacherDashboard,
      component: TeacherDashboardView,
      meta: {
        requiresAuth: true,
        role: 'teacher',
      },
    },
    {
      path: '/course/:courseId/topics',
      name: RouteName.CourseTopics,
      component: CourseTopicsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/course/:courseId/topic/:topicId',
      name: RouteName.CourseTopic,
      component: CourseView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/course/:courseId',
      name: RouteName.Course,
      component: CourseView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: {
        name: RouteName.Login,
      },
    },
  ],
})
//это функция, которая запускается перед каждым переходом на страницу
router.beforeEach((to) => {
  //to это маршрут куда пользователь хочет перейти.
  // Если /student , to - содержит path: /student
  //                               meta.requiresAuth: true
  //                               meta.role: student
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuth) {
    return {
      name: RouteName.Login,
    }
  }
  return true
})

export default router
