import { defineStore } from 'pinia'

export const useTextToSpeechStore = defineStore('textToSpeechStore', {
  state: () => ({
    textToSpeechResult: null as any,

    loadings: {
      textToSpeech: false
    } as Record<string, boolean>,

    errors: {
      textToSpeech: null
    } as Record<string, any>,

    prompt: ''
  }),

  actions: {
    async textToSpeech(payload: {
      prompt: string
      model: string
      voice_id?: string
      emotion?: string
      speed?: number
      output_format?: string
      output_channel?: string
    }) {
      const appStore = useAppStore()
      this.textToSpeechResult = null
      appStore.loading = true
      const toast = useToast()

      try {
        this.loadings.textToSpeech = true
        this.errors.textToSpeech = null

        // Create request payload
        const requestData = {
          prompt: payload.prompt,
          model: payload.model,
          voice_id: payload.voice_id,
          emotion: payload.emotion,
          speed: payload.speed || 1,
          output_format: payload.output_format || 'mp3',
          output_channel: payload.output_channel || 'mono'
        }

        // Make the API call
        const { apiService } = useAPI()
        const response = await apiService.post('/speech/generate', requestData)

        this.textToSpeechResult = response

        // Show success notification
        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'speech-success',
          title: t('Speech Generation Complete') || 'Speech Generation Complete',
          description: t('Your speech has been generated successfully') || 'Your speech has been generated successfully',
          color: 'success'
        })

        return response
      } catch (error: any) {
        console.log('🚀 ~ textToSpeech error:', error)

        const { $i18n } = useNuxtApp()
        const t = $i18n.t
        toast.add({
          id: 'speech-error',
          title: t('Error') || 'Error',
          description: error.response?.data?.detail || error.message || 'Speech generation failed. Please try again.',
          color: 'error'
        })

        this.errors.textToSpeech = error
        return null
      } finally {
        appStore.loading = false
        this.loadings.textToSpeech = false
      }
    },

    clearResult() {
      this.textToSpeechResult = null
    },

    setPrompt(prompt: string) {
      this.prompt = prompt
    }
  }
})
