// Define a store to manage available AI models state
import { defineStore } from 'pinia'

interface Model {
  id: string
  name: string
  description: string
  type: string
  max_resolution: string
  avg_generation_time: string
  strengths: string[]
  pricing: {
    cost_per_image: number
  }
}

interface ModelsResponse {
  models: Model[]
}

export const useModelsStore = defineStore('modelsStore', {
  state: () => ({
    models: [] as Model[],
    selectedModel: null as Model | null,
    
    loadings: {
      fetchModels: false
    } as Record<string, boolean>,

    lastFetched: null as Date | null
  }),

  getters: {
    hasModels: (state) => state.models.length > 0,
    isLoading: (state) => state.loadings.fetchModels,
    
    // Get models by type
    textToImageModels: (state) => state.models.filter(model => model.type === 'text-to-image'),
    imageToImageModels: (state) => state.models.filter(model => model.type === 'image-to-image'),
    
    // Get models by performance characteristics
    fastModels: (state) => state.models.filter(model => model.id.includes('fast')),
    highQualityModels: (state) => state.models.filter(model => model.id.includes('v3')),
    
    // Get recommended model for different use cases
    recommendedForPrototyping: (state) => state.models.find(model => model.id === 'imagen-fast'),
    recommendedForProduction: (state) => state.models.find(model => model.id === 'imagen-v2'),
    recommendedForHighEnd: (state) => state.models.find(model => model.id === 'imagen-v3'),
    
    // Get models sorted by cost
    modelsByCost: (state) => [...state.models].sort((a, b) => a.pricing.cost_per_image - b.pricing.cost_per_image)
  },

  actions: {
    async fetchModels(force: boolean = false) {
      // If we have models and it's been less than 5 minutes, don't refetch unless forced
      if (!force && this.models.length > 0 && this.lastFetched) {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
        if (this.lastFetched > fiveMinutesAgo) {
          return this.models
        }
      }

      this.loadings.fetchModels = true
      const toast = useToast()

      try {
        // Make the actual API call to the models endpoint
        const { apiService } = useAPI()
        // Call the models API endpoint
        const response = await apiService.get('/models')

        this.models = response.data.models || []
        this.lastFetched = new Date()
        return this.models
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
        this.loadings.fetchModels = false
      }
    },

    async getModelDetails(modelId: string) {
      this.loadings.fetchModels = true
      const toast = useToast()

      try {
        // Make the actual API call to get model details
        const { apiService } = useAPI()
        const response = await apiService.get(`/models/${modelId}`)

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
        this.loadings.fetchModels = false
      }
    },

    selectModel(model: Model) {
      this.selectedModel = model
    },

    clearSelection() {
      this.selectedModel = null
    },

    getModelById(modelId: string): Model | undefined {
      return this.models.find(model => model.id === modelId)
    },

    getModelsByPriceRange(minPrice: number, maxPrice: number): Model[] {
      return this.models.filter(model => 
        model.pricing.cost_per_image >= minPrice && 
        model.pricing.cost_per_image <= maxPrice
      )
    },

    getModelsByStrength(strength: string): Model[] {
      return this.models.filter(model => 
        model.strengths.includes(strength)
      )
    }
  }
})