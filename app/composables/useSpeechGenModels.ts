export function useSpeechGenModels() {
  const models = [
    {
      label: 'Gemini 2.5 Flash',
      value: 'tts-flash',
      icon: 'hugeicons:ai-chip',
      options: [
        'voice',
        'speed',
        'outputFormat',
        'outputChannel',
        'emotion'
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
