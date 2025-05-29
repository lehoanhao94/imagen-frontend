// Define a store to manage image-to-image transformation state
import { defineStore } from 'pinia'

export const useImageToImageStore = defineStore('imageToImageStore', {
  state: () => ({
    imageToImageResult: null as any,
    selectedImages: [] as any[],
    originalImage: null as any,

    loadings: {
      imageToImage: false
    } as Record<string, boolean>,
    
    prompt: '',
    strength: 0.7
  }),

  getters: {
    hasOriginalImage: (state) => !!state.originalImage,
    hasResults: (state) => !!state.imageToImageResult,
    isLoading: (state) => state.loadings.imageToImage
  },

  actions: {
    async imageToImage(payload: {
      image: string
      prompt: string
      model?: string
      strength?: number
      steps?: number
      guidance_scale?: number
      negative_prompt?: string
      seed?: number
      num_images?: number
      style?: string
      webhook_url?: string
    }) {
      const appStore = useAppStore()
      this.imageToImageResult = null
      this.loadings.imageToImage = true
      appStore.loading = true
      const toast = useToast()

      try {
        // Make the actual API call to the image-to-image endpoint
        const { apiService } = useAPI()
        // Call the image-to-image API endpoint
        const response = await apiService.post('/image-to-image', payload)

        this.imageToImageResult = response.data
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
        this.loadings.imageToImage = false
        appStore.loading = false
      }
    },

    setOriginalImage(image: any) {
      this.originalImage = image
    },

    clearOriginalImage() {
      this.originalImage = null
    },

    addImage(image: any) {
      // Check if image already exists in selectedImages
      const exists = this.selectedImages.some(img => img.src === image.src)
      if (!exists) {
        this.selectedImages.push(image)
      }
    },

    removeImage(imageSrc: string) {
      const index = this.selectedImages.findIndex(
        img => img.src === imageSrc
      )
      if (index !== -1) {
        this.selectedImages.splice(index, 1)
      }
    },

    clearResults() {
      this.imageToImageResult = null
      this.selectedImages = []
    },

    setPrompt(prompt: string) {
      this.prompt = prompt
    },

    setStrength(strength: number) {
      this.strength = strength
    }
  }
})