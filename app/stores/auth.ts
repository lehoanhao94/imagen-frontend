import { defineStore } from 'pinia'
import type { AuthCodeFlowErrorResponse } from 'vue3-google-signin'

interface User {
  id: string
  email: string
  full_name: string
  is_active: boolean
  is_superuser: boolean
  user_credit: any
}

interface AuthState {
  user: User | null
  access_token: string | null
  refresh_token: string | null
  loading: boolean
  error: any
  canResendActivationEmailAfter: number
}

export const useAuthStore = defineStore('authStore', {
  state: (): AuthState => ({
    user: null,
    access_token: null,
    refresh_token: null,
    loading: false,
    error: null as any,

    canResendActivationEmailAfter: 0
  }),

  persist: [
    {
      pick: [
        'user',
        'access_token',
        'refresh_token',
        'canResendActivationEmailAfter'
      ],
      storage: localStorage
    }
  ],

  getters: {
    isAuthenticated: state => !!state.access_token && !!state.user,
    getUser: state => state.user,
    isNotVerifyAccount: state => state.user && state.user?.is_active !== true,
    user_credit: state => state.user?.user_credit,
    isSuperUser: state => state.user && state.user?.is_superuser === true
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
        this.userMe()
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
      username: string
      password: string
      remember_me?: boolean
    }) {
      try {
        this.loading = true
        this.error = null
        // Make the actual API call to the signup endpoint
        const { apiService } = useAPI()
        // Call the signup API endpoint
        const response = await apiService.post('/login-v2', payload)

        this.access_token = response.data.access_token
        this.refresh_token = response.data.refresh_token
        // Navigate to home page after successful signup
        navigateTo('/')
        this.userMe()
        return response.data
      } catch (error: any) {
        console.log('🚀 ~ error:', error)
        this.error = error.response.data.detail
        return null
      } finally {
        this.loading = false
      }
    },

    async logout() {
      // Logout implementation would go here
      this.user = null
      this.access_token = null
      this.refresh_token = null
      navigateTo('/auth/login')
    },

    async userMe() {
      this.loading = true
      this.error = null

      try {
        if (!this.access_token) return null
        // Make the actual API call to the signup endpoint
        const { apiService } = useAPI()
        // Call the signup API endpoint
        const response = await apiService.get('/me')

        this.user = response.data

        return response.data
      } catch (error: any) {
        return null
      } finally {
        this.loading = false
      }
    },

    async refreshToken() {
      const { apiService } = useAPI()
      const response = await apiService.post('/refresh-token', {
        refresh_token: this.refresh_token
      })
      this.access_token = response.data.access_token
      this.refresh_token = response.data.refresh_token
      return response.data
    },

    async resendVerificationEmail() {
      const { apiService } = useAPI()
      const response = await apiService.post('/resend-activation', {
        email: this.user?.email
      })
      return response.data
    },

    async signInWithGoogle(payload: any) {
      try {
        this.loading = true
        const { apiService } = useAPI()
        const _response = await apiService.post('/google-login-v2', {
          google_access_token: payload.access_token,
          user: { uid: 'fake', phoneNumber: 'fake', photoURL: 'fake' },
          google_id_token: payload.id_token
        })
        this.access_token = _response.data.access_token
        this.refresh_token = _response.data.refresh_token
        navigateTo('/')
        this.userMe()
        this.loading = false
        return _response.data
      } catch (error: any) {
        this.loading = false
        return null
      }
    },

    signInError(error: AuthCodeFlowErrorResponse) {
      console.log('Error: ', error)
    },

    async passwordRecovery(payload: { email: string }) {
      this.loading = true
      this.error = null

      try {
        const { apiService } = useAPI()
        const response = await apiService.post('/password-recovery', payload)
        return response.data
      } catch (error: any) {
        console.log('🚀 ~ passwordRecovery error:', error)
        this.error = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loading = false
      }
    },

    async passwordReset(payload: { token: string, new_password: string }) {
      this.loading = true
      this.error = null

      try {
        const { apiService } = useAPI()
        const response = await apiService.put('/password-reset', payload)
        return response.data
      } catch (error: any) {
        console.log('🚀 ~ passwordReset error:', error)
        this.error = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loading = false
      }
    },

    async activateAccount(payload: { token: string }) {
      this.loading = true
      this.error = null

      try {
        const { apiService } = useAPI()
        const response = await apiService.put('/activate-account', payload)
        return response.data
      } catch (error: any) {
        console.log('🚀 ~ activateAccount error:', error)
        this.error = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loading = false
      }
    },

    async changePassword(payload: { current_password: string, new_password: string }) {
      this.loading = true
      this.error = null

      try {
        const { apiService } = useAPI()
        const response = await apiService.put('/change-password', payload)
        return response.data
      } catch (error: any) {
        console.log('🚀 ~ changePassword error:', error)
        this.error = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loading = false
      }
    },

    async updateProfile(payload: { full_name: string }) {
      this.loading = true
      this.error = null

      try {
        const { apiService } = useAPI()
        const response = await apiService.put('/update-profile', payload)

        // Update user information in store
        if (response.data && this.user) {
          this.user.full_name = payload.full_name
        }

        return response.data
      } catch (error: any) {
        console.log('🚀 ~ updateProfile error:', error)
        this.error = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loading = false
      }
    }
  }
})
