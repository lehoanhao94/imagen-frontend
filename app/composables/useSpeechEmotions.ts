export interface SpeechEmotion {
  emotion: string
  emotion_key: string
  sample_audio: string
  emotion_long: string
  is_enabled: boolean
}

export function useSpeechEmotions() {
  const emotions = ref<SpeechEmotion[]>([])
  const selectedEmotion = useCookie<SpeechEmotion | null>('speech-selected-emotion', { default: () => null })
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadEmotions = async () => {
    loading.value = true
    error.value = null

    try {
      const { apiService } = useAPI()
      const response = await apiService.get('/emotions')
      emotions.value = response?.data || response || []

      // Set default emotion if none selected
      if (!selectedEmotion.value && emotions.value.length > 0) {
        const defaultEmotion = emotions.value.find(e => e.emotion_key === 'casual') || emotions.value[0]
        if (defaultEmotion) {
          selectedEmotion.value = defaultEmotion
        }
      }
    } catch (err: any) {
      console.error('Failed to load speech emotions:', err)
      error.value = err?.message || 'Failed to load emotions'
    } finally {
      loading.value = false
    }
  }

  const selectEmotion = (emotion: SpeechEmotion) => {
    selectedEmotion.value = emotion
  }

  // Filter functions
  const enabledEmotions = computed(() =>
    emotions.value?.filter(emotion => emotion.is_enabled)
  )

  const getEmotionByKey = (key: string) => {
    return emotions.value.find(emotion => emotion.emotion_key === key)
  }

  return {
    emotions: readonly(emotions),
    selectedEmotion,
    loading: readonly(loading),
    error: readonly(error),
    loadEmotions,
    selectEmotion,
    enabledEmotions,
    getEmotionByKey
  }
}
