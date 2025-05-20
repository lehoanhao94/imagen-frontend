import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
  state: () => ({
    locale: 'en',
    loading: false
  }),
  persist: [
    {
      pick: ['locale'],
      storage: localStorage
    }
  ]
})
