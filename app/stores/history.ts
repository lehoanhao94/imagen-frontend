import { defineStore } from 'pinia'

interface HistoryDetail {
  id: number
  uuid: string
  user_id: number
  voice: string
  voice_id: string
  speed: number
  model: string
  model_name: string
  input_text: string
  generate_result: any
  input_file_path: string | null
  type: string
  used_credit: number
  status: number
  status_desc: string
  status_percentage: number
  error_message: string
  rating: string
  rating_content: string
  custom_prompt: string
  created_at: string
  updated_at: string
  file_size: number
  file_password: string
  expired_at: string | null
  media_url: string
  inference_type: string | null
  name: string | null
  speaker_name: string | null
  created_by: string
  is_premium_credit: boolean
  is_emotion_failed: boolean
  emotion: string | null
  output_transcript: string
  note: string | null
  estimated_credit: number
  ai_credit: number
  output_format: string
  output_channel: string
  accent: string
}

export const useHistoryStore = defineStore('historyStore', {
  state: () => ({
    historyDetail: null as HistoryDetail | null,

    loadings: {
      fetchHistoryDetail: false
    } as Record<string, boolean>,

    errors: {
      fetchHistoryDetail: null
    } as Record<string, any>
  }),

  actions: {
    async fetchHistoryDetail(uuid: string) {
      try {
        this.loadings.fetchHistoryDetail = true
        this.errors.fetchHistoryDetail = null

        const { apiService } = useAPI()
        const response = await apiService.get(`/api/v1/history/${uuid}`)

        this.historyDetail = response.body
        return response.body
      } catch (error: any) {
        console.error('🚀 ~ fetchHistoryDetail error:', error)
        this.errors.fetchHistoryDetail = error
        return null
      } finally {
        this.loadings.fetchHistoryDetail = false
      }
    }
  }
})
