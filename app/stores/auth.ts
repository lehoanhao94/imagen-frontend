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
  getters: {},
  actions: {
    async login() {
      this.loadings.login = true
      await new Promise(resolve => setTimeout(resolve, 2000))
      this.loadings.login = false
    },
    async signup(payload: any) {
      try {
        this.loadings.signup = true
        useAPI().apiService.post('/signup', payload)
      } catch (error) {
        console.log('🚀 ~ signup ~ error:', error)
        this.loadings.signup = false
        throw error
      } finally {
        this.loadings.signup = false
      }
    }
  }
})
