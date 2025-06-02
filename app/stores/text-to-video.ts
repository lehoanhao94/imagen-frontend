// Define a store to manage logo state
import { defineStore } from 'pinia'

export const useTextToVideoStore = defineStore('textToVideoStore', {
  state: () => ({
    textToVideoResult: null as any,
    aiToolImageCardRef: null as any,

    selectedImages: [] as any[],

    loadings: {
      textToVideo: false
    } as Record<string, boolean>,

    errors: {
      textToVideo: false
    } as Record<string, any>,
    prompt: ''
  }),

  actions: {
    async textToVideo(payload: {
      prompt: string
      model: string
      style: string
      dimensions: string
    }) {
      const appStore = useAppStore()
      this.textToVideoResult = null
      appStore.loading = true
      const toast = useToast()

      try {
        this.loadings.textToVideo = true
        this.errors.textToVideo = null
        // Make the actual API call to the signup endpoint
        const { apiService } = useAPI()
        // Call the signup API endpoint
        const response = await apiService.post('/create_image', payload)

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
        this.errors.textToVideo = error
        return null
      } finally {
        appStore.loading = false
        this.loadings.textToVideo = false
      }
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
    }
  }
})
