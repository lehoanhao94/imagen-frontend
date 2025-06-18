// Define a store to manage logo state
import { defineStore } from 'pinia'

export const useTextToImageStore = defineStore('textToImageStore', {
  state: () => ({
    textToImageResult: null as any,
    aiToolImageCardRef: null as any,

    selectedImages: [] as any[],

    loadings: {
      textToImage: false
    } as Record<string, boolean>,

    errors: {
      textToImage: false
    } as Record<string, any>,
    prompt: ''
  }),

  actions: {
    async textToImage(payload: {
      prompt: string
      model: string
      style?: string
      aspect_ratio?: string
      person_generation?: string
      safety_filter_level?: string
      files?: File[]
    }) {
      const appStore = useAppStore()
      this.textToImageResult = null
      const toast = useToast()

      try {
        this.loadings.textToImage = true
        this.errors.textToImage = null
        this.textToImageResult = {
          title: payload.prompt,
          prompt: payload.prompt,
          preset: payload.model,
          style: payload.style || '',
          resolution: payload.aspect_ratio || ''
        }
        // Create FormData for multipart/form-data
        const formData = new FormData()

        // Add required fields
        formData.append('prompt', payload.prompt)
        formData.append('model', payload.model)

        // Add optional fields
        if (payload.aspect_ratio) {
          formData.append('aspect_ratio', payload.aspect_ratio)
        }

        if (payload.style) {
          formData.append('style', payload.style)
        }

        if (payload.person_generation) {
          formData.append('person_generation', payload.person_generation)
        }

        if (payload.safety_filter_level) {
          formData.append('safety_filter_level', payload.safety_filter_level)
        }

        // Add files if provided
        if (payload.files && payload.files.length > 0) {
          payload.files.forEach((file) => {
            formData.append('files', file)
          })
        }

        // Make the actual API call to the generate_image endpoint
        const { apiService } = useAPI()
        // Call the generate_image API endpoint
        const response = await apiService.post('/generate_image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        // Handle the new response format
        const responseData = response.data
        let imageUrl = ''
        let firstImage
        // Check if response has generated_image array with image data
        if (
          responseData.generated_image
          && responseData.generated_image.length > 0
        ) {
          firstImage = responseData.generated_image[0]
          if (firstImage.image_url) {
            imageUrl = firstImage.image_url
          }
        }

        const prompt
          = responseData.input_text
            || responseData?.result?.find((item: any) => item.text)?.text
            || payload.prompt

        this.textToImageResult = {
          imageUrl,
          title: payload.prompt,
          prompt: prompt,
          preset: payload.model,
          used_credit: responseData.used_credit || '',
          ...firstImage
        }

        // scroll to image card
        nextTick(() => {
          // scroll to image card after 0.5s
          setTimeout(() => {
            // scroll to image card center
            this.aiToolImageCardRef?.$el.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
              inline: 'center'
            })
          }, 300)
        })
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
        this.errors.textToImage = error
        return null
      } finally {
        appStore.loading = false
        this.loadings.textToImage = false
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
