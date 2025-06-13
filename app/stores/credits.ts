import { defineStore } from 'pinia'

interface CryptomusOrderResponse {
  success: boolean
  order_id: string
  order_uuid: string
  approval_url: string
  message: string
  error_code: string
}

export const useCreditsStore = defineStore('creditsStore', {
  state: () => ({
    locale: 'en',
    creditUnitPrice: 8,
    showDrawer: false,
    numberOfCreditsWanted: 0,
    isLoading: false
  }),
  getters: {
    buyCreditProduct: () => {
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

    async createCryptoOrder() {
      this.isLoading = true
      const toast = useToast()

      try {
        const { apiService } = useAPI()

        // Calculate quantity based on the number of credit packages being purchased
        const quantity = Math.ceil(this.numberOfCreditsWanted / this.buyCreditProduct.base_credit)

        // For now, using a default product_id - this might need to be configured based on requirements
        const payload = {
          product_id: 'credit_package_1000', // This should be the actual product ID from your system
          quantity: quantity
        }

        const response = await apiService.post('/order/cryptomus/create', payload)
        const responseData: CryptomusOrderResponse = response.data

        // Check if the response indicates success
        if (responseData.success) {
          // Open the approval URL in a new window
          window.open(responseData.approval_url, '_blank', 'noopener,noreferrer')

          // Close the checkout drawer on successful order creation
          this.showDrawer = false

          toast.add({
            id: 'crypto-order-success',
            title: 'Success',
            description: 'Crypto payment order created successfully. Please complete the payment in the new window.',
            color: 'success',
            timeout: 5000
          })
        } else {
          // Handle API response indicating failure
          toast.add({
            id: 'crypto-order-error',
            title: 'Payment Error',
            description: responseData.message || 'Failed to create crypto payment order. Please try again.',
            color: 'error',
            timeout: 5000
          })
        }

        return responseData
      } catch (error: any) {
        console.error('🚀 ~ createCryptoOrder error:', error)

        toast.add({
          id: 'crypto-order-error',
          title: 'Payment Error',
          description: error.response?.data?.message || error.message || 'Failed to create crypto payment order. Please try again.',
          color: 'error',
          timeout: 5000
        })

        return null
      } finally {
        this.isLoading = false
      }
    }
  }
})
