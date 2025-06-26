import { defineStore } from 'pinia'

interface ApiKey {
  id: string
  api_key: string
  name: string
  created_at: string
  updated_at: string
}

interface ApiKeyResponse {
  success: boolean
  result: ApiKey[]
}

interface CreateApiKeyRequest {
  name: string
}

interface DeleteApiKeyRequest {
  id: string
}

interface IntegrationState {
  apiKeys: ApiKey[]
  webhookUrl: string
  loadings: {
    fetchApiKeys: boolean
    createApiKey: boolean
    deleteApiKey: boolean
    saveWebhook: boolean
  }
  errors: {
    fetchApiKeys: any
    createApiKey: any
    deleteApiKey: any
    saveWebhook: any
  }
}

export const useIntegrationStore = defineStore('integrationStore', {
  state: (): IntegrationState => ({
    apiKeys: [],
    webhookUrl: '',
    loadings: {
      fetchApiKeys: false,
      createApiKey: false,
      deleteApiKey: false,
      saveWebhook: false
    },
    errors: {
      fetchApiKeys: null,
      createApiKey: null,
      deleteApiKey: null,
      saveWebhook: null
    }
  }),

  getters: {
    hasApiKeys: state => state.apiKeys.length > 0
  },

  actions: {
    async fetchApiKeys() {
      try {
        this.loadings.fetchApiKeys = true
        this.errors.fetchApiKeys = null

        const { apiService } = useAPI()
        const response = await apiService.get('/user/api-key')
        const data: ApiKeyResponse = (response as any).data || (response as any).body

        this.apiKeys = data.result || []

        return data
      } catch (error: any) {
        console.log('🚀 ~ fetchApiKeys error:', error)
        this.errors.fetchApiKeys = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loadings.fetchApiKeys = false
      }
    },

    async createApiKey(payload: CreateApiKeyRequest) {
      try {
        this.loadings.createApiKey = true
        this.errors.createApiKey = null

        const { apiService } = useAPI()
        const response = await apiService.post('/user/api-key', payload)
        const data = (response as any).data || (response as any).body

        // Refresh the API keys list after creation
        await this.fetchApiKeys()

        return data
      } catch (error: any) {
        console.log('🚀 ~ createApiKey error:', error)
        this.errors.createApiKey = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loadings.createApiKey = false
      }
    },

    async deleteApiKey(payload: DeleteApiKeyRequest) {
      try {
        this.loadings.deleteApiKey = true
        this.errors.deleteApiKey = null

        const { apiService } = useAPI()
        const response = await apiService.delete('/user/api-key', { data: payload })
        const data = (response as any).data || (response as any).body

        // Remove the API key from local state
        this.apiKeys = this.apiKeys.filter(key => key.id !== payload.id)

        return data
      } catch (error: any) {
        console.log('🚀 ~ deleteApiKey error:', error)
        this.errors.deleteApiKey = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loadings.deleteApiKey = false
      }
    },

    async saveWebhookUrl(url: string) {
      try {
        this.loadings.saveWebhook = true
        this.errors.saveWebhook = null

        // For now, just save locally. This would typically make an API call
        this.webhookUrl = url

        // TODO: Implement actual API call when endpoint is available
        // const { apiService } = useAPI()
        // const response = await apiService.post('/user/webhook', { url })

        return true
      } catch (error: any) {
        console.log('🚀 ~ saveWebhookUrl error:', error)
        this.errors.saveWebhook = error.response?.data?.detail || error.message
        return null
      } finally {
        this.loadings.saveWebhook = false
      }
    }
  }
})
