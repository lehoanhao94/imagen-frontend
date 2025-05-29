// Define a store to manage user profile and account data
import { defineStore } from 'pinia'

interface UserStats {
  images_generated: number
  total_credits_used: number
  account_created_at: string
  last_activity: string
}

interface UserPreferences {
  default_model: string
  preferred_style: string
  default_dimensions: string
  auto_save_images: boolean
  notification_settings: {
    email_notifications: boolean
    webhook_notifications: boolean
  }
}

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  plan: string
  credits_remaining: number
  stats: UserStats
  preferences: UserPreferences
  is_active: boolean
}

export const useUserStore = defineStore('userStore', {
  state: () => ({
    profile: null as UserProfile | null,
    stats: null as UserStats | null,
    preferences: null as UserPreferences | null,
    
    loadings: {
      fetchProfile: false,
      updateProfile: false,
      updatePreferences: false
    } as Record<string, boolean>
  }),

  getters: {
    hasProfile: (state) => !!state.profile,
    isLoading: (state) => Object.values(state.loadings).some(loading => loading),
    isPremiumUser: (state) => state.profile?.plan === 'premium' || state.profile?.plan === 'pro',
    creditsRemaining: (state) => state.profile?.credits_remaining || 0,
    hasCredits: (state) => (state.profile?.credits_remaining || 0) > 0,
    defaultModel: (state) => state.preferences?.default_model || 'imagen-v2',
    autoSaveEnabled: (state) => state.preferences?.auto_save_images || false
  },

  actions: {
    async fetchUserProfile() {
      this.loadings.fetchProfile = true
      const toast = useToast()

      try {
        const { apiService } = useAPI()
        const response = await apiService.get('/user/profile')

        this.profile = response.data
        this.stats = response.data.stats
        this.preferences = response.data.preferences
        
        return response.data
      } catch (error: any) {
        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'error',
          title: t('Error') || 'Error',
          description: error.response?.data?.detail || error.message,
          color: 'error'
        })
        return null
      } finally {
        this.loadings.fetchProfile = false
      }
    },

    async updateUserProfile(updates: Partial<UserProfile>) {
      this.loadings.updateProfile = true
      const toast = useToast()

      try {
        const { apiService } = useAPI()
        const response = await apiService.put('/user/profile', updates)

        // Update local state
        if (this.profile) {
          this.profile = { ...this.profile, ...response.data }
        }

        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'success',
          title: t('Success') || 'Success',
          description: t('ProfileUpdated') || 'Profile updated successfully',
          color: 'success'
        })

        return response.data
      } catch (error: any) {
        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'error',
          title: t('Error') || 'Error',
          description: error.response?.data?.detail || error.message,
          color: 'error'
        })
        return null
      } finally {
        this.loadings.updateProfile = false
      }
    },

    async updateUserPreferences(updates: Partial<UserPreferences>) {
      this.loadings.updatePreferences = true
      const toast = useToast()

      try {
        const { apiService } = useAPI()
        const response = await apiService.put('/user/preferences', updates)

        // Update local state
        if (this.preferences) {
          this.preferences = { ...this.preferences, ...response.data }
        } else {
          this.preferences = response.data
        }

        return response.data
      } catch (error: any) {
        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'error',
          title: t('Error') || 'Error',
          description: error.response?.data?.detail || error.message,
          color: 'error'
        })
        return null
      } finally {
        this.loadings.updatePreferences = false
      }
    },

    async fetchUserStats() {
      this.loadings.fetchProfile = true

      try {
        const { apiService } = useAPI()
        const response = await apiService.get('/user/stats')

        this.stats = response.data
        return response.data
      } catch (error: any) {
        console.error('Failed to fetch user stats:', error)
        return null
      } finally {
        this.loadings.fetchProfile = false
      }
    },

    // Helper actions for credits
    deductCredits(amount: number) {
      if (this.profile) {
        this.profile.credits_remaining = Math.max(0, this.profile.credits_remaining - amount)
      }
    },

    addCredits(amount: number) {
      if (this.profile) {
        this.profile.credits_remaining += amount
      }
    },

    // Helper actions for preferences
    setDefaultModel(model: string) {
      if (this.preferences) {
        this.preferences.default_model = model
      }
    },

    setPreferredStyle(style: string) {
      if (this.preferences) {
        this.preferences.preferred_style = style
      }
    },

    toggleAutoSave() {
      if (this.preferences) {
        this.preferences.auto_save_images = !this.preferences.auto_save_images
      }
    },

    clearUserData() {
      this.profile = null
      this.stats = null
      this.preferences = null
    }
  }
})