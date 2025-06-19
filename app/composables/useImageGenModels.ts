export function useImageGenModels() {
  const models = [
    {
      label: 'Gemini 2.0 Flash',
      value: 'imagen-flash',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'yourImage', 'imageDimensions']
    },
    {
      label: 'Imagen 4 Fast',
      value: 'imagen-4-fast',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'imageDimensions']
    },
    {
      label: 'Imagen 4',
      value: 'imagen-4',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'imageDimensions']
    },
    {
      label: 'Imagen 4 Ultra',
      value: 'imagen-4-ultra',
      icon: 'hugeicons:ai-chip',
      options: ['style', 'imageDimensions']
    }
  ]
  const model = useCookie<any>('image-gen-model', { default: () => models[0] })

  const getImageModelLabel = (value: string): string | undefined => {
    return models.find(option => option.value === value)?.label
  }
  return {
    models,
    model,
    getImageModelLabel
  }
}
