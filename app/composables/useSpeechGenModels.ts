export function useSpeechGenModels() {
  const models = [
    {
      label: 'ElevenLabs Turbo',
      value: 'ElevenLabs Turbo',
      icon: 'hugeicons:ai-chip',
      options: [
        'voice',
        'speed',
        'emotion',
        'outputFormat',
        'outputChannel'
      ]
    },
    {
      label: 'OpenAI TTS-1',
      value: 'OpenAI TTS-1',
      icon: 'hugeicons:ai-chip',
      options: [
        'voice',
        'speed',
        'outputFormat',
        'outputChannel'
      ]
    }
  ]
  const model = useCookie<any>('speech-gen-model', { default: () => models[0] })

  // Speed configuration (0.25 ~ 4, step: 0.01)
  const speedConfig = {
    min: 0.25,
    max: 4,
    step: 0.01,
    default: 1
  }

  const speed = useCookie<number>('speech-gen-speed', { default: () => speedConfig.default })

  // Output format options
  const outputFormats = [
    { label: 'MP3', value: 'mp3' },
    { label: 'WAV', value: 'wav' }
  ]
  const outputFormat = useCookie<string>('speech-gen-format', { default: () => 'mp3' })

  // Output channel options
  const outputChannels = [
    { label: 'Mono', value: 'mono' },
    { label: 'Stereo', value: 'stereo' }
  ]
  const outputChannel = useCookie<string>('speech-gen-channel', { default: () => 'mono' })

  return {
    models,
    model,
    speedConfig,
    speed,
    outputFormats,
    outputFormat,
    outputChannels,
    outputChannel
  }
}
