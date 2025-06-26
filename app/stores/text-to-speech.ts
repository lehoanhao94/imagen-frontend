import axios from 'axios'
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

    prompt: '',
    selectedFiles: [] as File[],
    supportFiles: [
      'docx',
      'xlsx',
      'pptx',
      'pdf',
      'epub',
      'mobi',
      'txt',
      'html',
      'odt',
      'ods',
      'odp',
      'azw',
      'azw3',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'application/epub+zip',
      'application/x-mobipocket-ebook',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    uploadProgress: 0
  }),

  getters: {
    hasSelectedFiles: state => state.selectedFiles.length > 0
  },

  actions: {
    async textToSpeech(payload: {
      input: string
      model: string
      emotion?: string
      speed?: number
      output_format?: string
      output_channel?: string
      voices?: any[]
      custom_prompt?: string
      vibe_id?: number
      accent?: string
      model_name?: string
      name?: string
    }) {
      console.log('🚀 ~ file: text-to-speech.ts ~ line 112 ~ payload', payload)

      const appStore = useAppStore()
      this.textToSpeechResult = null
      appStore.loading = true
      const toast = useToast()

      try {
        this.loadings.textToSpeech = true
        this.errors.textToSpeech = null

        // Create request payload
        const requestData = {
          model: payload.model,
          voices: payload.voices || [],
          speed: payload.speed || 1,
          input: payload.input,
          output_format: payload.output_format || 'mp3',
          emotion: payload.emotion,
          custom_prompt: payload.custom_prompt,
          vibe_id: payload.vibe_id,
          output_channel: payload.output_channel || 'mono',
          accent: payload.accent,
          model_name: payload.model_name,
          name: payload.name
        }

        // Make the API call
        const { apiService } = useAPI()
        const response = await apiService.post('/text-to-speech', requestData)

        this.textToSpeechResult = response

        // Show success notification
        const nuxtApp = useNuxtApp()
        const t = nuxtApp.$i18n.t
        toast.add({
          id: 'speech-success',
          title:
            t('Speech Generation Complete') || 'Speech Generation Complete',
          description:
            t(
              'Your request has been submitted. Results will be notified later'
            )
            || 'Your request has been submitted. Results will be notified later',
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
          description:
            error.response?.data?.detail
            || error.message
            || 'Speech generation failed. Please try again.',
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
    },

    async getUploadFileUrl(file: File) {
      const { apiService } = useAPI()
      const response = await apiService.get('/get-upload-file-url', {
        params: {
          file_name: file.name,
          file_size: file.size
        }
      })
      return response.data
    },

    async uploadFile(file: File, uploadUrl: string) {
      try {
        this.loadings['uploadFile'] = true
        this.errors['uploadFile'] = null

        const { apiService } = useAPI()
        // const response = await apiService.put(uploadUrl, file, {
        //   headers: {
        //     'Content-Type': file.type
        //   }
        // })
        const response = await axios.put(uploadUrl, file, {
          headers: {
            'Content-Type': file?.type || 'application/octet-stream'
          },
          onUploadProgress: (progressEvent: any) => {
            this.uploadProgress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            console.log('🚀 ~ uploadFile ~ this.uploadProgress:', this.uploadProgress)
          }
        })
        return response
      } catch (error) {
        console.log('🚀 ~ uploadFile error:', error)
        this.errors['uploadFile'] = error
        return null
      } finally {
        this.loadings['uploadFile'] = false
      }
    },

    async documentToSpeech(
      file: File,
      payload: {
        input: string
        model: string
        emotion?: string
        speed?: number
        output_format?: string
        output_channel?: string
        voices?: any[]
        custom_prompt?: string
        model_name?: string
        file_password?: string
      }
    ) {
      try {
        this.loadings['textToSpeech'] = true
        this.errors['textToSpeech'] = null

        const uploadUrlRes = await this.getUploadFileUrl(file)
        await this.uploadFile(file, uploadUrlRes.url)

        const requestData = {
          ...payload,
          s3_file_path: uploadUrlRes.s3_file_path,
          file_name_origin: uploadUrlRes.file_name_origin
        }

        const { apiService } = useAPI()
        const response = await apiService.post('/tts-document-s3', requestData)

        this.textToSpeechResult = response
        return response
      } catch (error) {
        console.log('🚀 ~ textToSpeech error:', error)
        this.errors['textToSpeech'] = error
        return null
      } finally {
        this.loadings['textToSpeech'] = false
      }
    }
  }
})
