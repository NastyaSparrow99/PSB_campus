//stores = место, где хранятся данные, которые нужны не одной странице,
//а всему приложению. Будем хранить currentUser

import { computed,ref } from 'vue'
import { defineStore } from 'pinia'

//экспорнитуем функцию которая будет возвращать содержимое 
//хранилища auth которое содержит инф о том кто залогинен
export const useAuthStore = defineStore('auth' , () =>{
// переменная храниет состояние текущего пользователя 

    const currentUser= ref(null) // внутри есть value = нулю. Меняем не через присваивание а через образение к .value
    // в шаблоне не нежен .value 

    const isAuth = computed(() => Boolean(currentUser.value))
    //computed - это вычисляемая функция , которая кэшируется и выполняется 1 раз
    // если currentUser.value есть то польз авторизован 
    const isStudent =computed(() => currentUser.value?.role === 'student')
    const isTeacher =computed(() => currentUser.value?.role === 'teacher')

    function login(user) {  //setCurrentUser(user)
    currentUser.value = user

  }
    function logout() {
    currentUser.value = null
  }
  return {
    currentUser,
    isAuth,
    isStudent,
    isTeacher,
    login,
    logout,
  }
})

