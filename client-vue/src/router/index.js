import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'
import StudentDashboardView from '@/views/StudentDashboardView.vue'
import TeacherDashboardView from '@/views/TeacherDashboardView.vue'
import CourseView from '@/views/CourseView.vue'
import CourseTopicsView from '@/views/CourseTopicsView.vue'


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
    },
     {
    path: '/teacher',
    name:'teacher-dashboard',
    component: TeacherDashboardView,
    },
     {
    path: '/course/:courseId/topics', //в самом файле CourseView прописываю RouterLink
    name:'course-tipics',
    component: CourseTopicsView,
    },
     {
    path: '/course/:courseId',
    name:'course',
    component: CourseView,
    },
    {
      //<Route path="*" element={<Navigate to="/" replace />} />
      //перенаправление на главную
      path: '/:pathMatch(.*)*',
      redirect: '/',

    },


  ],
})

export default router
