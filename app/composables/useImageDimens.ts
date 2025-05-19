export function useImageDimensions() {
  const imageDimension = useCookie<string>('llm-image-dimens', { default: () => '1:1' })

  const imageDimensions = [
    {
      label: '1:1',
      value: '1:1',
      icon: 'ion:square-outline'
    },
    {
      label: '3:4',
      value: '3:4',
      icon: 'bx:rectangle'
    },
    {
      label: '4:3',
      value: '4:3',
      icon: 'icon-park-outline:rectangle'
    },
    {
      label: '16:9',
      value: '16:9',
      icon: 'material-symbols-light:crop-16-9-outline'
    },
    {
      label: '9:16',
      value: '9:16',
      icon: 'material-symbols:crop-9-16-outline'
    }
  ]
  return {
    imageDimension,
    imageDimensions
  }
}
