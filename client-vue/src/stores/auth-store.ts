//Если данные нужны только в одном компоненте/одной странице ref внутри этой страницы.
//Если данные нужны нескольким страницам, роутеру, хедеру, компонентам store.

import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import {  User } from '@/constants/route-names'



//экспорнитуем функцию которая будет возвращать содержимое
//хранилища auth которое содержит инф о том кто залогинен
export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  // переменная храниет состояние текущего пользователя
  // currentUser может быть либо User, либо null

 const isAuth = computed(() => !!currentUser.value)//состояние
  //computed - это вычисляемая функция , которая кэшируется и выполняется 1 раз
  // если currentUser.value =true то польз авторизован

  function login(user: User) {
    currentUser.value = user
  }
  function logout() {
    currentUser.value = null // и isAuth = false
  }
  return {
    currentUser,
    isAuth,
    login,
    logout,
  }
})
