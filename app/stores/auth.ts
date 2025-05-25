import { defineStore } from 'pinia'

interface User {
  id: string
  email: string
  full_name: string
}

interface AuthState {
  user: User | null
  access_token: string | null
  refresh_token: string | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    user: null,
    access_token: null,
    refresh_token: null,
    loading: false,
    error: null
  }),

  persist: [
    {
      pick: ['user', 'access_token', 'refresh_token'],
      storage: localStorage
    }
  ],

  getters: {
    isAuthenticated: state => !!state.access_token && !!state.user,
    getUser: state => state.user
  },

  actions: {
    async signup(payload: {
      email: string
      full_name: string
      password: string
    }) {
      this.loading = true
      this.error = null

      try {
        // Make the actual API call to the signup endpoint
        const { apiService } = useAPI()
        // Call the signup API endpoint
        const response = await apiService.post('/signup', {
          ...payload,
          ps_xid: null,
          gsxid: null,
          ps_partner_key: null,
          gspk: null
        })

        // Get the response data and extract user and tokens
        const responseData = response.data

        // Set user and tokens in state
        // Assuming the API returns a structure with user, token, and refresh_token
        this.access_token = responseData.access_token
        this.refresh_token = responseData.refresh_token

        // Navigate to home page after successful signup
        navigateTo('/')

        return responseData
      } catch (error: any) {
        // Handle API error response
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          const errorData = error.response.data
          this.error
            = errorData.message || errorData.error || 'Failed to sign up'
          console.error('Signup API error:', errorData)
        } else if (error.request) {
          // The request was made but no response was received
          this.error = 'No response from server. Please check your connection.'
          console.error('Signup request error:', error.request)
        } else {
          // Something happened in setting up the request that triggered an Error
          this.error = error.message || 'Failed to sign up'
          console.error('Signup error:', error)
        }
        return null
      } finally {
        this.loading = false
      }
    },

    async login(payload: {
      email: string
      password: string
      remember?: boolean
    }) {
      // Login implementation would go here
      console.log('Login payload:', payload)
    },

    async logout() {
      // Logout implementation would go here
      this.user = null
      this.token = null
      this.refresh_token = null
      navigateTo('/auth/login')
    }
  }
})
