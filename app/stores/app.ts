import { defineStore } from 'pinia'

export const useAppStore = defineStore('appStore', {
  state: () => ({
    locale: 'en',
    loading: false,
    isNotificationsSlideoverOpen: false
  }),
  persist: [
    {
      pick: ['locale'],
      storage: localStorage
    }
  ],
  getters: {
    localeForI18n: (state: any) => {
      return state.locale.replace('-', '_').toLowerCase()
    }
  }
})
