export function useMusicGenModels() {
  const models = [
    {
      label: 'Suno AI',
      value: 'Suno AI',
      icon: 'hugeicons:ai-chip',
      options: [
        'style',
        'duration'
      ]
    },
    {
      label: 'Udio',
      value: 'Udio',
      icon: 'hugeicons:ai-chip',
      options: [
        'genre',
        'tempo'
      ]
    }
  ]
  const model = useCookie<any>('music-gen-model', { default: () => models[0] })

  return {
    models,
    model
  }
}