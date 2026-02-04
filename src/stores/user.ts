import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  username: string
  email: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isLogin = ref(false)
  const showLoginDialog = ref(false)

  function setUser(newUser: User) {
    user.value = newUser
    isLogin.value = true
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  function logout() {
    user.value = null
    isLogin.value = false
    localStorage.removeItem('user')
  }

  function initUser() {
    const stored = localStorage.getItem('user')
    if (stored) {
      user.value = JSON.parse(stored)
      isLogin.value = true
    }
  }

  return { user, isLogin, showLoginDialog, setUser, logout, initUser }
})
