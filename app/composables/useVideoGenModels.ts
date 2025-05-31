export function useVideoGenModels() {
  const models = [
    {
      label: 'Veo 2',
      value: 'Veo 2',
      icon: 'hugeicons:ai-chip',
      options: [
        'style',
        'videoDimensions'
      ]
    },
    {
      label: 'RunwayML Gen-3',
      value: 'RunwayML Gen-3',
      icon: 'hugeicons:ai-chip',
      options: [
        'style',
        'duration'
      ]
    }
  ]
  const model = useCookie<any>('video-gen-model', { default: () => models[0] })

  return {
    models,
    model
  }
}
