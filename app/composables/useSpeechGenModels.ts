export function useSpeechGenModels() {
  const models = [
    {
      label: 'ElevenLabs Turbo',
      value: 'ElevenLabs Turbo',
      icon: 'hugeicons:ai-chip',
      options: [
        'voice',
        'speed'
      ]
    },
    {
      label: 'OpenAI TTS-1',
      value: 'OpenAI TTS-1',
      icon: 'hugeicons:ai-chip',
      options: [
        'voice',
        'quality'
      ]
    }
  ]
  const model = useCookie<any>('speech-gen-model', { default: () => models[0] })

  return {
    models,
    model
  }
}