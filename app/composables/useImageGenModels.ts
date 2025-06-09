export function useImageGenModels() {
  const models = [
    {
      label: 'Gemini 2.0 Flash',
      value: 'gemini-2.0-flash-exp-image-generation',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'yourImage', 'imageDimensions']
    },
    {
      label: 'Imagen 4',
      value: 'imagen-4.0-generate-preview-05-20',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'imageDimensions']
    }
  ]
  const model = useCookie<any>('image-gen-model', { default: () => models[0] })

  return {
    models,
    model
  }
}
