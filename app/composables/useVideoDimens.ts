export function useVideoDimensions() {
  const videoDimension = useCookie<string>('llm-video-dimens', { default: () => '16:9' })

  const videoDimensions = [
    {
      label: '16:9',
      value: '16:9',
      icon: 'material-symbols-light:crop-16-9-outline',
      classExample: 'aspect-[16/9] h-[70px] w-[126.67px]'
    },
    {
      label: '9:16',
      value: '9:16',
      icon: 'material-symbols:crop-9-16-outline',
      classExample: 'aspect-[9/16] h-[70px] w-[39.38px]'
    }
  ]
  return {
    videoDimension,
    videoDimensions
  }
}
