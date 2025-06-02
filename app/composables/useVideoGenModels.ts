export function useVideoGenModels() {
  const models = [
    {
      label: 'Veo 2',
      value: 'veo-2.0-generate-001',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'videoDimensions']
    }
  ]
  const model = useCookie<any>('video-gen-model', { default: () => models[0] })

  return {
    models,
    model
  }
}
