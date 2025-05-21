import { defineStore } from 'pinia'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    loadings: {} as Record<string, boolean>
  }),
  persist: [
    {
      pick: [''],
      storage: localStorage
    }
  ],
  getters: {

  },
  actions: {
    async login() {
      this.loadings.login = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.loadings.login = false
    }
  }
})
