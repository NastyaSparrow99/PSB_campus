import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import StudentDashboardView from '@/views/StudentDashboardView.vue'
import TeacherDashboardView from '@/views/TeacherDashboardView.vue'
import CourseView from '@/views/CourseView.vue'
import CourseTopicsView from '@/views/CourseTopicsView.vue'
import { useAuthStore } from '@/stores/authStore'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
    path: '/',
    name:'login',
    component: LoginView,
    },
     {
    path: '/student',
    name:'student-dashboard',
    component: StudentDashboardView,
    meta: {
      requirestAuth: true,// требует авторизации
      role: 'student'// требует роль
    },
    },
     {
    path: '/teacher',
    name:'teacher-dashboard',
    component: TeacherDashboardView,
    meta: {
    requirestAuth: true,
      role: 'teacher'
    },
    },
     {
    path: '/course/:courseId/topics', //в самом файле CourseView прописываю RouterLink
    name:'course-tipics',
    component: CourseTopicsView,
     meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/course/:courseId/topic/:topicId',
      name: 'course-topic',
      component: CourseView,
      meta: {
        requiresAuth: true,
      },
    },
     {
    path: '/course/:courseId',
    name:'course',
    component: CourseView,
    meta: {
        requiresAuth: true,
      },
    },
    {
      //<Route path="*" element={<Navigate to="/" replace />} />
      //перенаправление на главную
      path: '/:pathMatch(.*)*',
      redirect: '/',

    },


  ],
  

})
//проверка запускается перед каждым переходрм на страницу
router.beforeEach((to) => { // to это маршрут 
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/'
  }

  if (to.meta.role && authStore.currentUser?.role !== to.meta.role) {
    return '/'
  }

  return true
})

export default router
