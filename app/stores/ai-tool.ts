// Define a store to manage logo state
import { defineStore } from 'pinia'

export const useAIToolStore = defineStore('aiToolStore', {
  state: () => ({
    textToImageResult: null as any,
    aiToolImageCardRef: null as any,

    selectedImages: [] as any[]
  }),

  actions: {
    textToImage() {
      console.log('🚀 ~ textToImage ~ textToImage:')
      const appStore = useAppStore()
      this.textToImageResult = null
      appStore.loading = true
      setTimeout(() => {
        appStore.loading = false
        this.textToImageResult = {
          imageUrl:
            'https://cdn.leonardo.ai/users/07195385-0f39-42ad-876f-1b86c2b71b55/generations/3a3be14d-d7a8-495c-9550-c40ae490f3fe/Leonardo_Phoenix_10_a_warm_and_vibrant_image_of_a_happy_woman_1.jpg?w=512',
          title:
            'A warm and vibrant image of a happy woman with a bright and radiant smile',
          prompt:
            'a warm and vibrant image of a happy woman with a bright and radiant smile, her eyes sparkling with joy, her skin a healthy and luminous olive tone, her dark brown hair cascading down her back in loose, effortless waves, wearing a flowy and colorful sundress that complements her sunny disposition, set against a soft, creamy background that echoes the warmth of her emotions, with a shallow depth of field that draws attention to her face and emphasizes her infectious happiness.',
          preset: 'Imagen 3',
          style: 'Dynamic',
          resolution: '1024x1024'
        }

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
      }, 3000)
      return true
    },

    addImage(image: any) {
      // Check if image already exists in selectedImages
      const exists = this.selectedImages.some(img => img.src === image.src)
      if (!exists) {
        this.selectedImages.push(image)
      }
    },

    removeImage(imageSrc: string) {
      const index = this.selectedImages.findIndex(img => img.src === imageSrc)
      if (index !== -1) {
        this.selectedImages.splice(index, 1)
      }
    }
  }
})
