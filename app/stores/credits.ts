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
    },

    async processStripePayment() {
      try {
        const { apiService } = useAPI()
        const toast = useToast()

        // Calculate quantity based on the credits wanted and base credit product
        const quantity = Math.ceil(this.numberOfCreditsWanted / this.buyCreditProduct.base_credit)

        const requestPayload = {
          product_id: 'credit_package', // Default product ID for credits
          quantity: quantity
        }

        const response = await apiService.post('/order/stripe/create', requestPayload)

        if (response.data.success && response.data.approval_url) {
          // Open approval URL in new window
          window.open(response.data.approval_url, '_blank')

          // Close the drawer
          this.showDrawer = false

          // Show success message
          toast.add({
            id: 'stripe-success',
            title: 'Payment Initiated',
            description: 'Stripe payment window opened. Please complete your payment.',
            color: 'success'
          })
        } else {
          // Handle API error response
          toast.add({
            id: 'stripe-error',
            title: 'Payment Error',
            description: response.data.message || 'Failed to initiate Stripe payment',
            color: 'error'
          })
        }
      } catch (error: any) {
        const toast = useToast()
        toast.add({
          id: 'stripe-error',
          title: 'Payment Error',
          description: error.response?.data?.message || 'Failed to process Stripe payment',
          color: 'error'
        })
      }
    }
  }
})
