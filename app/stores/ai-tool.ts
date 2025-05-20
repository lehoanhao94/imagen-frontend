// Define a store to manage logo state
import { defineStore } from 'pinia'

export const useAIToolStore = defineStore('aiToolStore', {
  state: () => ({}),

  actions: {
    textToImage() {
      console.log('🚀 ~ textToImage ~ textToImage:')
      const appStore = useAppStore()
      appStore.loading = true
      setTimeout(() => {
        appStore.loading = false
      }, 10000)
      return true
    }
  }
})
