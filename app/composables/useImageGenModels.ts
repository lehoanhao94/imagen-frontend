export function useImageGenModels() {
  const models = [
    {
      label: 'Imagen 3',
      value: 'Imagen 3',
      icon: 'hugeicons:ai-chip',
      options: [
        'style',
        'imageDimensions'
      ]
    },
    {
      label: 'Gemini 2.0 Flash',
      value: 'Gemini 2.0 Flash',
      icon: 'hugeicons:ai-chip',
      options: [
        'style',
        'yourImage'
      ]
    }
  ]
  const model = useCookie<any>('image-gen-model', { default: () => models[0] })

  return {
    models,
    model
  }
}