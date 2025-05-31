import { defineStore } from 'pinia'

export const useCreditsStore = defineStore('creditsStore', {
  state: () => ({
    locale: 'en',
    creditUnitPrice: 8,
    showDrawer: false,
    numberOfCreditsWanted: 0
  }),
  getters: {
    buyCreditProduct: (state: any) => {
      return {
        base_credit: 1000
      }
    },
    quickTopUpList(): any {
      return [1, 2, 5, 7, 10, 12, 15, 17, 20].map((num) => {
        return {
          credits: num * this.buyCreditProduct.base_credit,
          price: num * this.creditUnitPrice,
          quantity: num
        }
      })
    }
  },

  actions: {
    processBuyCredits(numOfCredits: number) {
      this.numberOfCreditsWanted = numOfCredits
      this.showDrawer = true
    }
  }
})
