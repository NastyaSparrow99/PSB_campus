import { createRouter, createWebHistory } from 'vue-router'



import { RouteName } from '../constants/route-names'
import { useAuthStore } from '../stores/auth-store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.Login,
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/student',
      name: RouteName.StudentDashboard,
      component: () => import('../views/StudentDashboardView.vue'),
      meta: {
        requiresAuth: true,
        role: 'student',
      },
    },
    {
      path: '/teacher',
      name: RouteName.TeacherDashboard,
      component: () => import('../views/TeacherDashboardView.vue'),
      meta: {
        requiresAuth: true,
        role: 'teacher',
      },
    },
    {
      path: '/course/:courseId/topics',
      name: RouteName.CourseTopics,
      component: () => import('../views/CourseTopicsView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/course/:courseId/topic/:topicId',
      name: RouteName.CourseTopic,
      component: () => import('../views/CourseView.vue'),
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/course/:courseId',
      name: RouteName.Course,
      component: () => import('../views/CourseView.vue'),
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
