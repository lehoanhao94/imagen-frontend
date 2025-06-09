// Define a store to manage logo state
import { defineStore } from 'pinia'

export const useTextToVideoStore = defineStore('textToVideoStore', {
  state: () => ({
    textToVideoResult: null as any,
    aiToolImageCardRef: null as any,

    selectedImages: [] as any[],

    loadings: {
      textToVideo: false,
      textToVideo: false
    } as Record<string, boolean>,

    errors: {
      textToVideo: false,
      textToVideo: false
    } as Record<string, any>,
    prompt: ''
  }),

  actions: {
    async textToVideo(payload: {
      prompt: string
      model: string
      aspect_ratio: string
      person_generation?: string
      enhance_prompt?: boolean
      duration?: number
      files: File[]
    }) {
      const appStore = useAppStore()
      this.textToVideoResult = null
      appStore.loading = true
      const toast = useToast()

      try {
        this.loadings.textToVideo = true
        this.errors.textToVideo = null

        // Create FormData for multipart/form-data
        const formData = new FormData()

        // Add text fields
        formData.append('prompt', payload.prompt)
        formData.append('model', payload.model)
        formData.append('aspect_ratio', payload.aspect_ratio)

        if (payload.person_generation) {
          formData.append('person_generation', payload.person_generation)
        }

        if (payload.enhance_prompt !== undefined) {
          formData.append('enhance_prompt', payload.enhance_prompt.toString())
        }

        if (payload.duration) {
          formData.append('duration', payload.duration.toString())
        }

        // Add files
        payload.files.forEach((file) => {
          formData.append('files', file)
        })

        // Make the API call
        const { apiService } = useAPI()
        const response = await apiService.post('/video-gen/veo', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        this.textToVideoResult = response
        return response
      } catch (error: any) {
        console.log('🚀 ~ textToVideo error:', error)

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
