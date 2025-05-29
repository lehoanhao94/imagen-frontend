// Define a store to manage image variations state
import { defineStore } from 'pinia'

interface VariationRequest {
  image: string
  prompt?: string
  model?: string
  variations?: number
  strength?: number
  steps?: number
  guidance_scale?: number
  negative_prompt?: string
  seed?: number
  style?: string
  webhook_url?: string
}

interface VariationResult {
  id: string
  status: string
  original_image: {
    url: string
    width: number
    height: number
  }
  images: {
    url: string
    width: number
    height: number
  }[]
  created_at: string
  completed_at?: string
}

export const useImageVariationsStore = defineStore('imageVariationsStore', {
  state: () => ({
    variationsResult: null as VariationResult | null,
    selectedVariations: [] as any[],
    baseImage: null as any,
    variations: [] as any[],

    loadings: {
      createVariations: false
    } as Record<string, boolean>,
    
    prompt: '',
    variationCount: 4
  }),

  getters: {
    hasBaseImage: (state) => !!state.baseImage,
    hasVariations: (state) => state.variations.length > 0,
    hasResults: (state) => !!state.variationsResult,
    isLoading: (state) => state.loadings.createVariations,
    totalVariations: (state) => state.variations.length
  },

  actions: {
    async createVariations(payload: VariationRequest) {
      const appStore = useAppStore()
      this.variationsResult = null
      this.loadings.createVariations = true
      appStore.loading = true
      const toast = useToast()

      try {
        // Make the actual API call to the variations endpoint
        const { apiService } = useAPI()
        // Call the variations API endpoint
        const response = await apiService.post('/variations', payload)

        this.variationsResult = response.data
        if (response.data.images) {
          this.variations = response.data.images
        }
        return response
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
        this.loadings.createVariations = false
        appStore.loading = false
      }
    },

    async generateImageVariations(basePrompt: string, variationPrompts: string[]) {
      const results = {
        base: null as any,
        variations: [] as any[]
      }

      try {
        this.loadings.createVariations = true

        // First generate base image if needed
        if (basePrompt) {
          const textToImageStore = useTextToImageStore()
          const baseResult = await textToImageStore.textToImage({
            prompt: basePrompt,
            model: 'imagen-v2',
            style: '',
            dimensions: '1024x1024'
          })
          results.base = baseResult
        }

        // Generate variations
        const variationPromises = variationPrompts.map(variation => 
          this.createVariations({
            image: this.baseImage?.url || '',
            prompt: `${basePrompt}, ${variation}`,
            variations: 1,
            seed: Math.floor(Math.random() * 1000000) // Different seed for each variation
          })
        )

        const variationResults = await Promise.all(variationPromises)
        results.variations = variationResults.filter(result => result !== null)

        return results
      } catch (error: any) {
        const toast = useToast()
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
        this.loadings.createVariations = false
      }
    },

    setBaseImage(image: any) {
      this.baseImage = image
    },

    clearBaseImage() {
      this.baseImage = null
    },

    addVariation(variation: any) {
      // Check if variation already exists
      const exists = this.selectedVariations.some(v => v.url === variation.url)
      if (!exists) {
        this.selectedVariations.push(variation)
      }
    },

    removeVariation(variationUrl: string) {
      const index = this.selectedVariations.findIndex(
        v => v.url === variationUrl
      )
      if (index !== -1) {
        this.selectedVariations.splice(index, 1)
      }
    },

    clearVariations() {
      this.variations = []
      this.selectedVariations = []
      this.variationsResult = null
    },

    setPrompt(prompt: string) {
      this.prompt = prompt
    },

    setVariationCount(count: number) {
      this.variationCount = Math.max(1, Math.min(4, count)) // Limit between 1-4
    },

    selectAllVariations() {
      this.selectedVariations = [...this.variations]
    },

    clearSelection() {
      this.selectedVariations = []
    }
  }
})