export const useAppStore = defineStore('appStore', {
  state: () => ({
    locale: 'en'
  }),
  persist: true
})
