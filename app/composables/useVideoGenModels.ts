export function useVideoGenModels() {
  const models = [
    {
      label: 'Veo 2',
      value: 'veo-2',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'videoDimensions', 'yourImage']
    },
    {
      label: 'Veo 3',
      value: 'veo-3',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'videoDimensions', 'yourImage']
    }
  ]
  const model = useCookie<any>('video-gen-model', { default: () => models[0] })

  return {
    models,
    model
  }
}
