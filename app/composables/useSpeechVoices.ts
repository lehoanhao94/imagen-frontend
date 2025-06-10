export interface SpeechVoice {
  id: string
  type: string
  used_credit: number
  speaker_name: string
  premium: boolean
  created_at: string
  gender: string
  training_type: string
  updated_at: string
  age: string
  user_id: string | null
  accent: string
  user_model_path: string | null
  description: string
  embedding_path: string | null
  audio_path: string | null
  status: number
  speaker_id: number
  sample_audio_path: string
  training_status: string | null
  is_favorite: boolean
}

export function useSpeechVoices() {
  const voices = ref<SpeechVoice[]>([])
  const selectedVoice = useCookie<SpeechVoice | null>('speech-selected-voice', {
    default: () => null
  })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadVoices = async () => {
    loading.value = true
    error.value = null

    try {
      const { apiService } = useAPI()
      const response = await apiService.get('/voice-library/all')
      voices.value = response.data?.result || []

      // Set default voice if none selected
      if (!selectedVoice.value && voices.value.length > 0) {
        selectedVoice.value = voices.value[0]
      }
    } catch (err: any) {
      console.error('Failed to load speech voices:', err)
      error.value = err?.message || 'Failed to load voices'
    } finally {
      loading.value = false
    }
  }

  const selectVoice = (voice: SpeechVoice) => {
    selectedVoice.value = voice
  }

  const toggleFavorite = async (voiceId: string) => {
    const voice = voices.value.find(v => v.id === voiceId)
    if (!voice) return

    try {
      const { apiService } = useAPI()
      await apiService.post(`/speech/voices/${voiceId}/favorite`, {
        is_favorite: !voice.is_favorite
      })

      voice.is_favorite = !voice.is_favorite
    } catch (err: any) {
      console.error('Failed to toggle favorite:', err)
    }
  }

  // Filter functions
  const favoriteVoices = computed(() =>
    voices.value.filter(voice => voice.is_favorite)
  )

  const voicesByGender = computed(() => {
    const grouped: Record<string, SpeechVoice[]> = {}
    voices.value.forEach((voice) => {
      if (!grouped[voice.gender]) {
        grouped[voice.gender] = []
      }
      grouped[voice.gender].push(voice)
    })
    return grouped
  })

  const premiumVoices = computed(() =>
    voices.value.filter(voice => voice.premium)
  )

  const freeVoices = computed(() =>
    voices.value.filter(voice => !voice.premium)
  )

  return {
    voices: readonly(voices),
    selectedVoice,
    loading: readonly(loading),
    error: readonly(error),
    loadVoices,
    selectVoice,
    toggleFavorite,
    favoriteVoices,
    voicesByGender,
    premiumVoices,
    freeVoices
  }
}
